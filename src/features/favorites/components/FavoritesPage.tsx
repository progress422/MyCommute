import { PageContainer } from '../../../shared/components/PageContainer';
import { PageHeader } from '../../../shared/components/PageHeader';

/**
 * Saved favorite routes placeholder.
 *
 * TODO: Load favorites from store or API.
 * TODO: Allow removing and reordering favorites.
 * TODO: Quick search using a favorite's from/to values.
 */
export function FavoritesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Favorites"
        description="Quick access to routes you use often."
      />
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600">
        <p>Favorite routes will be listed here once implemented.</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          <li>TODO: Fetch and display saved favorite routes</li>
          <li>TODO: Add favorite from route search results</li>
          <li>TODO: Delete favorite with confirmation</li>
        </ul>
      </section>
    </PageContainer>
  );
}
