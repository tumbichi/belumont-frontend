'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@soybelumont/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@soybelumont/ui/components/table';
import { Progress } from '@soybelumont/ui/components/progress';
import { useTranslations } from 'next-intl';
import {
  Mail,
  CheckCircle2,
  Eye,
  AlertTriangle,
  CalendarDays,
  Calendar,
} from 'lucide-react';
import type { ResendEmail, EmailStats } from '@modules/emails/types';
import { EmailStatusBadge } from './email-status-badge';
import formatDatetime from '@core/utils/formatters/formatDate';

// Resend free plan limits
const DAILY_LIMIT = 100;
const MONTHLY_LIMIT = 3000;

interface EmailDashboardProps {
  emails: ResendEmail[];
  stats: EmailStats;
}

export function EmailDashboard({ emails, stats }: EmailDashboardProps) {
  const t = useTranslations('EMAILS');

  const statCards = [
    {
      label: t('STATS_TOTAL_SENT'),
      value: stats.total,
      icon: Mail,
      accent: true,
    },
    {
      label: t('STATS_DELIVERY_RATE'),
      value: `${stats.deliveryRate}%`,
      icon: CheckCircle2,
      accent: false,
    },
    {
      label: t('STATS_OPEN_RATE'),
      value: `${stats.openRate}%`,
      icon: Eye,
      accent: false,
    },
    {
      label: t('STATS_BOUNCED'),
      value: stats.bounced,
      icon: AlertTriangle,
      accent: false,
    },
  ];

  const recentEmails = emails.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className={
              stat.accent ? 'border-primary/30 bg-primary/5' : ''
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon
                className={`h-4 w-4 ${
                  stat.accent ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-3">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <CardTitle className="text-sm font-medium">
            {t('QUOTA_TITLE')}
          </CardTitle>
          <span className="ml-auto text-xs text-muted-foreground">
            {t('QUOTA_FREE_PLAN')}
          </span>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Daily */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                {t('QUOTA_DAILY')}
              </span>
              <span className={`font-mono text-xs font-semibold ${
                stats.sentToday >= DAILY_LIMIT
                  ? 'text-destructive'
                  : stats.sentToday >= DAILY_LIMIT * 0.8
                  ? 'text-amber-600'
                  : 'text-muted-foreground'
              }`}>
                {stats.sentToday} / {DAILY_LIMIT}
              </span>
            </div>
            <Progress
              value={Math.min((stats.sentToday / DAILY_LIMIT) * 100, 100)}
              className={`h-2 ${
                stats.sentToday >= DAILY_LIMIT
                  ? '[&>div]:bg-destructive'
                  : stats.sentToday >= DAILY_LIMIT * 0.8
                  ? '[&>div]:bg-amber-500'
                  : ''
              }`}
            />
          </div>

          {/* Monthly */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {t('QUOTA_MONTHLY')}
              </span>
              <span className={`font-mono text-xs font-semibold ${
                stats.sentThisMonth >= MONTHLY_LIMIT
                  ? 'text-destructive'
                  : stats.sentThisMonth >= MONTHLY_LIMIT * 0.8
                  ? 'text-amber-600'
                  : 'text-muted-foreground'
              }`}>
                {stats.sentThisMonth} / {MONTHLY_LIMIT}
              </span>
            </div>
            <Progress
              value={Math.min((stats.sentThisMonth / MONTHLY_LIMIT) * 100, 100)}
              className={`h-2 ${
                stats.sentThisMonth >= MONTHLY_LIMIT
                  ? '[&>div]:bg-destructive'
                  : stats.sentThisMonth >= MONTHLY_LIMIT * 0.8
                  ? '[&>div]:bg-amber-500'
                  : ''
              }`}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {t('QUOTA_NOTE')}
          </p>
        </CardContent>
      </Card>

      {/* Recent Emails */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('STATS_RECENT_EMAILS')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentEmails.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              {t('NO_EMAILS')}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('TO')}</TableHead>
                  <TableHead>{t('SUBJECT')}</TableHead>
                  <TableHead>{t('STATUS')}</TableHead>
                  <TableHead>{t('CREATED_AT')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEmails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell className="font-medium">
                      {email.to.join(', ')}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {email.subject}
                    </TableCell>
                    <TableCell>
                      <EmailStatusBadge status={email.last_event} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDatetime(new Date(email.created_at))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
