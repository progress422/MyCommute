import { PageContainer } from '../../../shared/components/PageContainer';
import { PageHeader } from '../../../shared/components/PageHeader';
import { CommuteDestinationsForm } from './CommuteDestinationsForm';
import { DisplaySettingsForm } from './DisplaySettingsForm';
import { UserSelector } from './UserSelector';

export function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Configure default departure location and destination."
      />
      <div className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <UserSelector />
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <CommuteDestinationsForm />
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <DisplaySettingsForm />
        </section>
      </div>
    </PageContainer>
  );
}
