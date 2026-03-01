import { getTranslations } from 'next-intl/server';
import getEmailHistory from '@modules/emails/actions/get-email-history';
import type { EmailStats } from '@modules/emails/types';
import { EmailsClient } from '@modules/emails/components/emails-client';

function computeStats(emails: { last_event: string; created_at: string }[]): EmailStats {
  const now = new Date();
  // Use UTC date strings for comparison (Resend stores in UTC)
  const todayStr = now.toISOString().slice(0, 10);     // "2025-03-01"
  const thisMonthStr = now.toISOString().slice(0, 7);   // "2025-03"

  const total = emails.length;
  const delivered = emails.filter((e) => e.last_event === 'delivered').length;
  const opened = emails.filter((e) => e.last_event === 'opened').length;
  const bounced = emails.filter((e) => e.last_event === 'bounced').length;
  const complained = emails.filter((e) => e.last_event === 'complained').length;
  const sentToday = emails.filter((e) => e.created_at.slice(0, 10) === todayStr).length;
  const sentThisMonth = emails.filter((e) => e.created_at.slice(0, 7) === thisMonthStr).length;

  return {
    total,
    delivered,
    opened,
    bounced,
    complained,
    deliveryRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
    openRate: total > 0 ? Math.round((opened / total) * 100) : 0,
    sentToday,
    sentThisMonth,
  };
}

export default async function EmailsPage() {
  const t = await getTranslations('EMAILS');
  const { data: emails, has_more } = await getEmailHistory(100);
  const stats = computeStats(emails);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('TITLE')}</h1>
        <p className="text-sm text-muted-foreground">{t('DESCRIPTION')}</p>
      </div>

      <EmailsClient emails={emails} stats={stats} initialHasMore={has_more} />
    </div>
  );
}
