import { PageContainer } from '../../../shared/components/PageContainer';
import { PageHeader } from '../../../shared/components/PageHeader';

/**
 * Main commute view — route search and connection results.
 *
 * TODO: Show a quick summary of saved default locations from settings.
 * TODO: Build a search form (from, to, departure time).
 * TODO: Call `searchConnections` via a TanStack Query hook.
 * TODO: Render a list of suggested public transport routes.
 */
export function TransportPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Transport"
        description="Search and compare public transport connections for your commute."
      />
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600">
        <p>
          Commute search UI and results will be implemented here. No transport
          data is fetched in this scaffold.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          <li>TODO: Display default departure and destination from settings</li>
          <li>TODO: Connection search form</li>
          <li>TODO: Loading and error states via TanStack Query</li>
          <li>TODO: Route suggestion cards with duration and transfers</li>
        </ul>
      </section>
    </PageContainer>
  );
}
