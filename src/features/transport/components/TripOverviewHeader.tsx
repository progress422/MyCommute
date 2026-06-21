interface TripOverviewHeaderProps {
  from: string;
  to: string;
  departureLabel: string;
}

export function TripOverviewHeader({
  from,
  to,
  departureLabel,
}: TripOverviewHeaderProps) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-white">
      <h2 className="text-center text-sm font-medium text-slate-300">
        Trip overview
      </h2>

      <div className="mt-4 flex gap-3">
        <div className="flex flex-col items-center pt-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-500 text-xs">
            H
          </span>
          <span className="my-1 w-px flex-1 bg-slate-600" />
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-500 text-xs">
            H
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <div>
            <p className="text-base font-medium">{from}</p>
          </div>
          <div>
            <p className="text-base font-medium">{to}</p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-400">{departureLabel}</p>
    </section>
  );
}
