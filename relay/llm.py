"""One streaming interface, three providers.

The model is a config line, not an architecture decision. Tradd's instruction was to
build on Grok but keep it swappable, and the reason is measurable: on 22 August 2026,
time-to-first-token for the same phone-style question was 0.96s on
grok-4-fast-non-reasoning, 2.61s on grok-4-fast and 3.44s on grok-3-mini. On a phone the
first of those is a conversation and the last is a dead line. That gap will move as models
change, so the right response is to make swapping cheap rather than to pick a winner.

Everything here streams. On a call, time to the FIRST word is the number that matters —
total generation time is almost irrelevant, because speech is slower than tokens.

Set with environment variables:

    LLM_PROVIDER   xai (default) | anthropic | openai
    LLM_MODEL      defaults per provider
    XAI_API_KEY / ANTHROPIC_API_KEY / OPENAI_API_KEY
"""
from __future__ import annotations

import json
import os
from typing import AsyncIterator

import httpx

DEFAULTS = {
    # Non-reasoning on purpose. The reasoning variants think for two to three seconds
    # before the first syllable, which on a phone call is silence the caller fills with
    # "hello? are you there?".
    "xai": ("https://api.x.ai/v1/chat/completions", "grok-4-fast-non-reasoning", "XAI_API_KEY"),
    "openai": ("https://api.openai.com/v1/chat/completions", "gpt-4o-mini", "OPENAI_API_KEY"),
    "anthropic": ("https://api.anthropic.com/v1/messages", "claude-haiku-4-5-20251001", "ANTHROPIC_API_KEY"),
}


class LLM:
    def __init__(self) -> None:
        self.provider = os.environ.get("LLM_PROVIDER", "xai").lower()
        if self.provider not in DEFAULTS:
            raise ValueError(f"unknown LLM_PROVIDER {self.provider!r}")
        url, model, key_env = DEFAULTS[self.provider]
        self.url = url
        self.model = os.environ.get("LLM_MODEL") or model
        self.key = os.environ.get(key_env, "")
        self.key_env = key_env

    @property
    def configured(self) -> bool:
        return bool(self.key)

    async def stream(self, system: str, messages: list[dict]) -> AsyncIterator[str]:
        """Yield text as it is generated. Never raises into the call — a provider
        failure yields nothing, and the caller says something human instead."""
        if not self.configured:
            return
        if self.provider == "anthropic":
            async for chunk in self._anthropic(system, messages):
                yield chunk
        else:
            async for chunk in self._openai_compatible(system, messages):
                yield chunk

    async def _openai_compatible(self, system: str, messages: list[dict]) -> AsyncIterator[str]:
        body = {
            "model": self.model,
            "stream": True,
            "max_tokens": 160,
            "temperature": 0.6,
            "messages": [{"role": "system", "content": system}] + messages,
        }
        headers = {"Authorization": f"Bearer {self.key}", "Content-Type": "application/json"}
        async with httpx.AsyncClient(timeout=30) as client:
            async with client.stream("POST", self.url, json=body, headers=headers) as r:
                async for line in r.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    payload = line[6:]
                    if payload == "[DONE]":
                        return
                    try:
                        d = json.loads(payload)
                    except json.JSONDecodeError:
                        continue
                    delta = (d.get("choices") or [{}])[0].get("delta", {}).get("content")
                    if delta:
                        yield delta

    async def _anthropic(self, system: str, messages: list[dict]) -> AsyncIterator[str]:
        body = {
            "model": self.model,
            "stream": True,
            "max_tokens": 160,
            "system": system,
            "messages": messages,
        }
        headers = {
            "x-api-key": self.key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        }
        async with httpx.AsyncClient(timeout=30) as client:
            async with client.stream("POST", self.url, json=body, headers=headers) as r:
                async for line in r.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    try:
                        d = json.loads(line[6:])
                    except json.JSONDecodeError:
                        continue
                    if d.get("type") == "content_block_delta":
                        text = (d.get("delta") or {}).get("text")
                        if text:
                            yield text
