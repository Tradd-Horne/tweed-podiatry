import Link from "next/link";
import { FEE_COMPARISON } from "@/lib/site";

/**
 * Every funding route in one table, so someone can see at a glance which one is worth
 * chasing before they open any of the detail below.
 *
 * The figures are what the READER pays, not what the funder pays. Mixing those two in one
 * grid is how a comparison table ends up meaning nothing: a big number in the DVA column
 * would look like a cost when it is the opposite.
 *
 * Six funder columns will not fit a phone, so the table scrolls inside its own container.
 * The page body must not scroll sideways, and the service column stays put while it does.
 */
export function FeesComparison() {
  return (
    <section className="mt-8" aria-labelledby="compare-heading">
      <h2 id="compare-heading" className="text-xl font-semibold text-slate-900">
        Every option, side by side
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        What you pay under each route. Open the matching section below for the item
        numbers and the conditions.
      </p>

      {/* Seven columns do not fit the 3xl prose measure, so on a wide screen the table
          alone breaks out of it. Below lg it stays inside and scrolls, with the service
          column pinned so a figure never loses its row label. */}
      <div className="mt-4 overflow-x-auto lg:-mx-24 xl:-mx-40">
        <table className="w-full min-w-[54rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-300">
              <th
                scope="col"
                className="sticky left-0 w-56 min-w-[14rem] bg-white py-2 pr-4 font-semibold text-slate-900"
              >
                Service
              </th>
              {FEE_COMPARISON.columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className="py-2 pr-4 font-semibold whitespace-nowrap"
                >
                  <Link
                    href={c.href}
                    className="text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900"
                  >
                    {c.label}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {FEE_COMPARISON.rows.map((row) => (
              <tr key={row.service}>
                <th
                  scope="row"
                  className="sticky left-0 w-56 min-w-[14rem] bg-white py-2.5 pr-4 font-normal text-slate-700 align-top"
                >
                  {row.service}
                </th>
                {FEE_COMPARISON.columns.map((c) => {
                  const value = row[c.key as keyof typeof row] as string;
                  const free = value === "$0";
                  return (
                    <td
                      key={c.key}
                      className={`py-2.5 pr-4 align-top tabular-nums whitespace-nowrap ${
                        free
                          ? "font-semibold text-emerald-700"
                          : "font-medium text-slate-900"
                      }`}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
        {FEE_COMPARISON.notes.map((n) => (
          <li key={n} className="flex gap-2">
            <span aria-hidden="true" className="text-slate-400">
              —
            </span>
            <span>{n}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
