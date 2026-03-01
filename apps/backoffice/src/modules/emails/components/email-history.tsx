'use client';

import { useState, useMemo, useTransition } from 'react';
import {
  Card,
  CardContent,
} from '@soybelumont/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@soybelumont/ui/components/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@soybelumont/ui/components/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@soybelumont/ui/components/sheet';
import { Input } from '@soybelumont/ui/components/input';
import { Button } from '@soybelumont/ui/components/button';
import { useTranslations } from 'next-intl';
import { Loader2, Search } from 'lucide-react';
import type { ResendEmail, EmailStatus } from '@modules/emails/types';
import { EMAIL_STATUS_LIST } from '@modules/emails/types';
import { EmailStatusBadge } from './email-status-badge';
import formatDatetime from '@core/utils/formatters/formatDate';
import { loadMoreEmails } from '@modules/emails/actions/get-email-history';

interface EmailHistoryProps {
  emails: ResendEmail[];
  initialHasMore: boolean;
}

export function EmailHistory({ emails, initialHasMore }: EmailHistoryProps) {
  const t = useTranslations('EMAILS');
  const [isPending, startTransition] = useTransition();

  // Paginated state
  const [loadedEmails, setLoadedEmails] = useState<ResendEmail[]>(emails);
  const [hasMore, setHasMore] = useState(initialHasMore);

  // Filters
  const [statusFilter, setStatusFilter] = useState<EmailStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Detail sheet
  const [selectedEmail, setSelectedEmail] = useState<ResendEmail | null>(null);

  const lastEmailId = loadedEmails[loadedEmails.length - 1]?.id;

  function handleLoadMore() {
    if (!lastEmailId || isPending) return;
    startTransition(async () => {
      const result = await loadMoreEmails(lastEmailId);
      setLoadedEmails((prev) => [...prev, ...result.data]);
      setHasMore(result.has_more);
    });
  }

  const filteredEmails = useMemo(() => {
    let result = loadedEmails;

    if (statusFilter !== 'all') {
      result = result.filter((e) => e.last_event === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.to.some((addr) => addr.toLowerCase().includes(q)) ||
          e.subject.toLowerCase().includes(q)
      );
    }

    return result;
  }, [loadedEmails, statusFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('SEARCH_PLACEHOLDER')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as EmailStatus | 'all')}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t('FILTER_BY_STATUS')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('FILTER_ALL')}</SelectItem>
            {EMAIL_STATUS_LIST.map((status) => (
              <SelectItem key={status} value={status}>
                {t(`STATUS_${status.toUpperCase()}` as any)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {t('SHOWING_RESULTS', {
          count: filteredEmails.length,
          total: loadedEmails.length,
        })}
        {hasMore && (
          <span className="ml-1">{t('HISTORY_HAS_MORE')}</span>
        )}
      </p>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filteredEmails.length === 0 ? (
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
                {filteredEmails.map((email) => (
                  <TableRow
                    key={email.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedEmail(email)}
                  >
                    <TableCell className="font-medium">
                      {email.to.join(', ')}
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate">
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

      {/* Load more */}
      {hasMore ? (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isPending}
            className="gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? t('HISTORY_LOADING_MORE') : t('HISTORY_LOAD_MORE')}
          </Button>
        </div>
      ) : loadedEmails.length > 0 ? (
        <p className="text-center text-xs text-muted-foreground">
          {t('HISTORY_NO_MORE')}
        </p>
      ) : null}

      {/* Email Detail Sheet */}
      <Sheet
        open={!!selectedEmail}
        onOpenChange={(open) => !open && setSelectedEmail(null)}
      >
        <SheetContent className="sm:max-w-lg">
          {selectedEmail && (
            <>
              <SheetHeader>
                <SheetTitle>{t('EMAIL_DETAIL')}</SheetTitle>
                <SheetDescription>{selectedEmail.subject}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <DetailRow label={t('ID')} value={selectedEmail.id} mono />
                <DetailRow
                  label={t('FROM')}
                  value={selectedEmail.from}
                />
                <DetailRow
                  label={t('TO')}
                  value={selectedEmail.to.join(', ')}
                />
                <DetailRow
                  label={t('SUBJECT')}
                  value={selectedEmail.subject}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t('STATUS')}
                  </span>
                  <EmailStatusBadge status={selectedEmail.last_event} />
                </div>
                <DetailRow
                  label={t('CREATED_AT')}
                  value={formatDatetime(new Date(selectedEmail.created_at))}
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>
      <span
        className={`text-sm ${mono ? 'font-mono text-xs break-all' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}
