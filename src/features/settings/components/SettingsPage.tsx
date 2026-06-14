import { ExampleSettingsForm } from '../../../shared/components/ExampleSettingsForm';
import { PageContainer } from '../../../shared/components/PageContainer';
import { PageHeader } from '../../../shared/components/PageHeader';

/**
 * User settings placeholder.
 *
 * TODO: Move form into `features/settings/components/`.
 * TODO: Load and save settings (localStorage, API, or Zustand + persist).
 * TODO: Integrate station autocomplete via `features/stations/`.
 */
export function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Configure default departure location and destination."
      />
      <div className="space-y-6">
        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600">
          <p>
            User preferences will be managed here. The example form below
            demonstrates React Hook Form and Zod only.
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
            <li>TODO: Persist departure and destination defaults</li>
            <li>TODO: Validate station names against search API</li>
            <li>TODO: Reset to defaults action</li>
          </ul>
        </section>
        <ExampleSettingsForm />
      </div>
    </PageContainer>
  );
}
