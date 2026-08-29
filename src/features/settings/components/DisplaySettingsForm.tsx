import type { ChangeEvent } from 'react';
import { useUiStore } from '../../../stores/useUiStore';

export function DisplaySettingsForm() {
  const showTripSummaryTile = useUiStore((state) => state.showTripSummaryTile);
  const setShowTripSummaryTile = useUiStore((state) => state.setShowTripSummaryTile);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShowTripSummaryTile(event.currentTarget.checked);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Display</h2>
        <p className="mt-1 text-sm text-slate-600">
          Control what shows up on the Transport page.
        </p>
      </div>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={showTripSummaryTile}
          onChange={handleChange}
          className="mt-0.5 h-4 w-4 rounded border-slate-300"
        />
        <span>
          <span className="block text-sm font-medium text-slate-700">
            Show next-departure summary tile
          </span>
          <span className="block text-sm text-slate-500">
            Displays the highlighted departure tile at the top of the
            Transport page.
          </span>
        </span>
      </label>
    </div>
  );
}
