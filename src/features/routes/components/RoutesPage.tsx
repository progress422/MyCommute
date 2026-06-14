import { PageContainer } from '../../../shared/components/PageContainer';
import { PageHeader } from '../../../shared/components/PageHeader';

/**
 * Route search results placeholder.
 *
 * TODO: Build a search form (from, to, departure time).
 * TODO: Call `searchConnections` via a TanStack Query hook.
 * TODO: Render a list of suggested public transport routes.
 */
export function RoutesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Routes"
        description="Search and compare public transport connections."
      />
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600">
        <p>
          Route search UI and results will be implemented here. No transport
          data is fetched in this scaffold.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          <li>TODO: Connection search form</li>
          <li>TODO: Loading and error states via TanStack Query</li>
          <li>TODO: Route suggestion cards with duration and transfers</li>
          <li>TODO: Action to save a route to favorites</li>
        </ul>
      </section>
    </PageContainer>
  );
}
