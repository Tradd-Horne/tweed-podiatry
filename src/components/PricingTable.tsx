import type { PricingBlock } from "@/lib/site";

/**
 * The price table on a funding page.
 *
 * Three rules this markup exists to enforce:
 *
 * 1. A price is never shown without its conditions. `notes` renders directly under the
 *    table, not in a collapsed panel, because an advertised fee with the conditions
 *    hidden is misleading under both consumer law and the AHPRA advertising guidelines.
 * 2. Every figure is sourced. `sources` links the MBS item, the DVA schedule or the NDIS
 *    price limit, so a reader — or Tradd — can check the number rather than trust it.
 * 3. The "you pay" column is the one people came for, so it is the emphasised one.
 *
 * The table scrolls inside its own container on a narrow screen. The page body must not
 * scroll sideways.
 */
export function PricingTable({
  pricing,
  /** Unique per table. The Fees page stacks six of these on one document. */
  id = "pricing",
  /** Tighter rows and smaller type, for the all-in-one Fees page. */
  compact = false,
  /**
   * Overrides the block's own heading. Stacked on the Fees page, headings like "What your
   * plan pays" stop saying which plan — so that page titles each table by its funder.
   */
  heading,
  /**
   * Drops the block's own <h2>. The Fees page puts the heading in the accordion's
   * <summary> instead, and two headings for one table is one heading too many.
   */
  hideHeading = false,
}: {
  pricing: PricingBlock;
  id?: string;
  compact?: boolean;
  heading?: string;
  hideHeading?: boolean;
}) {
  const showItem = pricing.rows.some((r) => r.item);
  const showFunder = Boolean(pricing.funderLabel);
  const cell = compact ? "py-2" : "py-3";

  return (
    <section
      className={hideHeading ? "" : compact ? "mt-8" : "mt-10"}
      aria-labelledby={hideHeading ? undefined : `${id}-heading`}
    >
      {!hideHeading && (
        <h2 id={`${id}-heading`} className="text-xl font-semibold text-slate-900">
          {heading ?? pricing.heading}
        </h2>
      )}
      <p
        className={`leading-relaxed text-slate-700 ${compact ? "text-sm" : ""} ${
          hideHeading ? "" : "mt-2"
        }`}
      >
        {pricing.intro}
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-300">
              <th scope="col" className="py-2 pr-4 font-semibold text-slate-900">
                Service
              </th>
              {showItem && (
                <th
                  scope="col"
                  className="py-2 pr-4 font-semibold text-slate-900 whitespace-nowrap"
                >
                  Item
                </th>
              )}
              <th
                scope="col"
                className="py-2 pr-4 font-semibold text-slate-900 whitespace-nowrap"
              >
                Fee
              </th>
              {showFunder && (
                <th
                  scope="col"
                  className="py-2 pr-4 font-semibold text-slate-900 whitespace-nowrap"
                >
                  {pricing.funderLabel}
                </th>
              )}
              <th
                scope="col"
                className="py-2 font-semibold text-slate-900 whitespace-nowrap"
              >
                You pay
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pricing.rows.map((row) => (
              <tr key={row.service}>
                <th
                  scope="row"
                  className={`${cell} pr-4 font-normal text-slate-700 align-top`}
                >
                  {row.service}
                </th>
                {showItem && (
                  <td className={`${cell} pr-4 align-top tabular-nums text-slate-500 whitespace-nowrap`}>
                    {row.item ?? "—"}
                  </td>
                )}
                <td className={`${cell} pr-4 align-top tabular-nums text-slate-700 whitespace-nowrap`}>
                  {row.fee}
                </td>
                {showFunder && (
                  <td className={`${cell} pr-4 align-top tabular-nums text-slate-700 whitespace-nowrap`}>
                    {row.funder ?? "—"}
                  </td>
                )}
                <td className={`${cell} align-top tabular-nums font-semibold text-slate-900 whitespace-nowrap`}>
                  {row.youPay}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pricing.notes.length > 0 && (
        <ul className={`space-y-2 text-sm leading-relaxed text-slate-600 ${compact ? "mt-3" : "mt-5"}`}>
          {pricing.notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span aria-hidden="true" className="text-slate-400">
                —
              </span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      )}

      {pricing.sources.length > 0 && (
        <p className="mt-5 text-xs leading-relaxed text-slate-500">
          Figures from{" "}
          {pricing.sources.map((src, i) => (
            <span key={src.href}>
              {i > 0 && " and "}
              <a
                href={src.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-slate-700"
              >
                {src.label}
              </a>
            </span>
          ))}
          . Checked 21 August 2026. Government fees change — if you find a figure here that
          is out of date, tell me and I will correct it.
        </p>
      )}
    </section>
  );
}
