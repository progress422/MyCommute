import { PageContainer } from '../../../shared/components/PageContainer';
import { PageHeader } from '../../../shared/components/PageHeader';

/**
 * Route search history placeholder.
 *
 * TODO: Store recent searches locally or via API.
 * TODO: Re-run a search from a history entry.
 * TODO: Clear history action.
 */
export function HistoryPage() {
  return (
    <PageContainer>
      <PageHeader
        title="History"
        description="Review your recent route searches."
      />
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600">
        <p>Recent searches will appear here once history tracking is built.</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          <li>TODO: Persist search history entries</li>
          <li>TODO: Display timestamp, from, and to for each entry</li>
          <li>TODO: Repeat search from history item</li>
        </ul>
      </section>
    </PageContainer>
  );
}
