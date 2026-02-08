import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@soybelumont/ui/components/table';
import { getTranslations } from 'next-intl/server';
import { AlertTriangle } from 'lucide-react';
import formatDatetime from '@core/utils/formatters/formatDate';

interface ResendEmail {
  id: string;
  to: string[];
  from: string;
  subject: string;
  created_at: string;
  last_event: string;
}

async function getEmails(): Promise<ResendEmail[]> {
  const resendApiUrl = process.env.RESEND_API_URL;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiUrl || !resendApiKey) {
    return [];
  }

  try {
    const response = await fetch(resendApiUrl, {
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    return result?.data ?? [];
  } catch {
    return [];
  }
}

function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    delivered: 'Entregado',
    sent: 'Enviado',
    bounced: 'Rebotado',
    complained: 'Spam',
    opened: 'Abierto',
    clicked: 'Clickeado',
  };
  return statusMap[status] || status;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'delivered':
      return 'text-green-600 bg-green-50';
    case 'sent':
      return 'text-blue-600 bg-blue-50';
    case 'bounced':
      return 'text-red-600 bg-red-50';
    case 'complained':
      return 'text-orange-600 bg-orange-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export default async function EmailsPage() {
  const t = await getTranslations();
  const emails = await getEmails();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t('EMAILS.TITLE')}</h1>
        <p className="text-muted-foreground mt-1">{t('EMAILS.DESCRIPTION')}</p>
      </div>

      {/* Free Tier Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              {t('EMAILS.FREE_TIER_INFO_TITLE')}
            </p>
            <p className="text-xs text-amber-700 mt-1">
              {t('EMAILS.FREE_TIER_INFO_DESCRIPTION')}
            </p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('EMAILS.TO')}</TableHead>
              <TableHead>{t('EMAILS.SUBJECT')}</TableHead>
              <TableHead>{t('EMAILS.STATUS')}</TableHead>
              <TableHead>{t('EMAILS.CREATED_AT')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emails.length > 0 ? (
              emails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell className="font-medium">
                    {email.to?.join(', ') || 'N/A'}
                  </TableCell>
                  <TableCell>{email.subject || 'N/A'}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(email.last_event)}`}
                    >
                      {getStatusLabel(email.last_event)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatDatetime(new Date(email.created_at))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {t('EMAILS.NO_EMAILS')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
