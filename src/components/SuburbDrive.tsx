import Link from "next/link";
import { SITE, SUBURBS, type SuburbDef } from "@/lib/site";

/**
 * The part of a suburb page that could not be written for any other suburb.
 *
 * Twenty-two pages sharing one body of copy is thin content, and Google treats a set of
 * near-identical local pages as doorway pages. So the drive figures are real (OSRM road
 * routing from the base in Tweed Heads, not estimated), the grouping is computed from
 * actual distances between suburbs, and the landmarks are named features pulled from
 * OpenStreetMap. Every page ends up with different numbers, different place names and a
 * different argument for why the visit is worth making.
 *
 * The far suburbs also get the honest ask: tell us if a neighbour needs a visit too. An
 * hour and a half of driving only works if there is more than one person at the end of it.
 */
export function SuburbDrive({ suburb }: { suburb: SuburbDef }) {
  const { km, minutes } = suburb.drive;
  const roundTrip = minutes * 2;
  const partners = suburb.run
    .map((slug) => SUBURBS.find((s) => s.slug === slug))
    .filter((s): s is SuburbDef => Boolean(s));

  const isBase = minutes === 0;
  const near = minutes > 0 && minutes <= 15;
  const mid = minutes > 15 && minutes <= 30;
  const far = minutes > 30;

  return (
    <>
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">
          {isBase
            ? `Visiting ${suburb.name}`
            : `The drive to ${suburb.name}`}
        </h2>

        <p className="mt-3 leading-relaxed text-slate-700">{suburb.local}</p>

        {!isBase && (
          <p className="mt-3 leading-relaxed text-slate-700">
            {suburb.name} is {km} km from our base in {SITE.baseSuburb}, about{" "}
            {minutes} minutes each way — roughly {roundTrip} minutes in the car
            before we have seen anybody.{" "}
            {near &&
              "That is close enough that we can usually fit a visit in at short notice, often in the same week."}
            {mid &&
              "That is a manageable run, so we do it on set days rather than one visit at a time."}
            {far &&
              "That is most of an hour and a half of driving, so this is a planned trip rather than a same-week booking."}
          </p>
        )}

        {suburb.landmarks.length > 0 && (
          <p className="mt-3 leading-relaxed text-slate-700">
            If you are near {joinNames(suburb.landmarks)}, you are inside the area
            we visit.
          </p>
        )}
      </section>

      {!isBase && partners.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">
            {far ? `Booking a day out to ${suburb.name}` : "On the same run"}
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            {suburb.name} is grouped with{" "}
            {partners.map((p, i) => (
              <span key={p.slug}>
                {i > 0 && (i === partners.length - 1 ? " and " : ", ")}
                <Link
                  href={`/areas/${p.slug}`}
                  className="underline underline-offset-4 hover:text-slate-900"
                >
                  {p.name}
                </Link>
              </span>
            ))}
            , so those visits sit on the same day.{" "}
            {far ? (
              <>
                Tell us the days that suit you and we will tell you when we are next
                heading out that way. And if a neighbour, a partner or someone else
                in your street also needs their feet done, say so when you ring —
                two visits in the one trip is what makes the drive work, and it
                usually means we can come sooner.
              </>
            ) : (
              <>
                If someone else near you needs a visit as well, mention it when you
                ring and we will put you together on the one run.
              </>
            )}
          </p>
        </section>
      )}
    </>
  );
}

function joinNames(list: string[]) {
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join(", ")} or ${list[list.length - 1]}`;
}
