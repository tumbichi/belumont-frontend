'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@soybelumont/ui/components/tabs';
import { useTranslations } from 'next-intl';
import { BarChart3, Clock, Send } from 'lucide-react';
import type { ResendEmail, EmailStats } from '@modules/emails/types';
import { EmailDashboard } from './email-dashboard';
import { EmailHistory } from './email-history';
import { SendEmailWizard } from './send-email-wizard';

interface EmailsClientProps {
  emails: ResendEmail[];
  stats: EmailStats;
  initialHasMore: boolean;
}

export function EmailsClient({ emails, stats, initialHasMore }: EmailsClientProps) {
  const t = useTranslations('EMAILS');

  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
        <TabsTrigger value="dashboard" className="gap-1.5">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">{t('TAB_DASHBOARD')}</span>
        </TabsTrigger>
        <TabsTrigger value="history" className="gap-1.5">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">{t('TAB_HISTORY')}</span>
        </TabsTrigger>
        <TabsTrigger value="send" className="gap-1.5">
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">{t('TAB_SEND')}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <EmailDashboard emails={emails} stats={stats} />
      </TabsContent>

      <TabsContent value="history">
        <EmailHistory emails={emails} initialHasMore={initialHasMore} />
      </TabsContent>

      <TabsContent value="send">
        <SendEmailWizard />
      </TabsContent>
    </Tabs>
  );
}
