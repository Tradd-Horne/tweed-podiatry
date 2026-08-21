import Image from "next/image";
import type { SuburbPhoto as Photo } from "@/lib/site";

/**
 * A real photograph of the suburb, with its credit in the corner.
 *
 * The credit sits *on* the image rather than under it because that is where Tradd wanted
 * it, and because CC BY and CC BY-SA both require the attribution to travel with the work
 * — a caption that scrolls away from the picture is easy to lose in a redesign. It is
 * small, low-contrast and pinned bottom-right, over a soft gradient so it stays legible
 * whether the corner of the photo is sand or shadow.
 *
 * Both the photographer and the licence link out: BY-SA needs the licence identified, and
 * the source link is what lets anyone check the photo is what the page says it is.
 */
export function SuburbPhoto({ photo }: { photo: Photo }) {
  return (
    <figure className="relative mt-8 overflow-hidden rounded-xl">
      <Image
        src={photo.src}
        alt={photo.alt}
        width={1000}
        height={563}
        sizes="(max-width: 768px) 100vw, 768px"
        className="h-auto w-full"
        priority
      />
      {/* The gradient exists only so white text survives a pale corner. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent"
      />
      <figcaption className="absolute bottom-1.5 right-2.5 text-[11px] leading-tight text-white/85">
        <a
          href={photo.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white hover:underline"
        >
          {photo.credit}
        </a>
        {" · "}
        <a
          href={photo.licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white hover:underline"
        >
          {photo.license}
        </a>
      </figcaption>
    </figure>
  );
}
