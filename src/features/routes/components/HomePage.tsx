import { PageContainer } from '../../../shared/components/PageContainer';
import { PageHeader } from '../../../shared/components/PageHeader';

/**
 * Landing page placeholder.
 *
 * TODO: Show a quick summary of saved default locations.
 * TODO: Link to route search and recent history.
 */
export function HomePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Home"
        description="Welcome to Commute Planner — a React learning project."
      />
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600">
        <p>
          This page will eventually provide an overview of your commute setup
          and shortcuts to search routes.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          <li>TODO: Display default departure and destination</li>
          <li>TODO: Quick action to search connections</li>
          <li>TODO: Show recent searches from history</li>
        </ul>
      </section>
    </PageContainer>
  );
}
