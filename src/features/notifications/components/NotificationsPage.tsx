import { PageContainer } from '../../../shared/components/PageContainer';
import { PageHeader } from '../../../shared/components/PageHeader';

/**
 * Commute notifications placeholder.
 *
 * TODO: Configure alerts for delays, disruptions, or departure reminders.
 * TODO: Load and persist notification preferences.
 * TODO: Display recent notification history.
 */
export function NotificationsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Notifications"
        description="Manage commute alerts and departure reminders."
      />
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600">
        <p>
          Notification preferences and alert history will be implemented here.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          <li>TODO: Enable or disable commute alerts</li>
          <li>TODO: Set departure reminder lead time</li>
          <li>TODO: Show recent disruption or delay notifications</li>
        </ul>
      </section>
    </PageContainer>
  );
}
