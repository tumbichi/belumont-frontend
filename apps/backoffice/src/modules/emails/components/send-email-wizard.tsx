'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@soybelumont/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@soybelumont/ui/components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@soybelumont/ui/components/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@soybelumont/ui/components/dialog';
import { Input } from '@soybelumont/ui/components/input';
import { Label } from '@soybelumont/ui/components/label';
import { RadioGroup, RadioGroupItem } from '@soybelumont/ui/components/radio-group';
import { Separator } from '@soybelumont/ui/components/separator';
import { Badge } from '@soybelumont/ui/components/badge';
import { Skeleton } from '@soybelumont/ui/components/skeleton';
import { Checkbox } from '@soybelumont/ui/components/checkbox';
import { ScrollArea } from '@soybelumont/ui/components/scroll-area';
import { useTranslations } from 'next-intl';
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Loader2,
  Plus,
  X,
  CheckCircle2,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { sonner } from '@soybelumont/ui/components/sonner';
import type {
  EmailTemplateName,
  EmailRecipient,
} from '@modules/emails/types';
import { EMAIL_TEMPLATES } from '@modules/emails/types';
import sendTemplateEmail from '@modules/emails/actions/send-template-email';
import {
  getAllUsers,
  getProductBuyersForEmail,
  getProducts,
  getBundleItems,
} from '@modules/emails/actions/get-recipients';
import type { ProductForEmail } from '@modules/emails/actions/get-recipients';

type RecipientMode = 'product' | 'users' | 'manual';

const STEPS = ['STEP_TEMPLATE', 'STEP_RECIPIENTS', 'STEP_VARIABLES', 'STEP_PREVIEW'] as const;

interface UserRecipientWithId extends EmailRecipient {
  id: string;
}

export function SendEmailWizard() {
  const t = useTranslations('EMAILS');
  const [step, setStep] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Step 1: Template
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateName | ''>('');

  // Step 2: Recipients
  const [recipientMode, setRecipientMode] = useState<RecipientMode>('product');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [manualEmails, setManualEmails] = useState('');
  const [products, setProducts] = useState<ProductForEmail[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Available recipients (loaded from API)
  const [availableBuyers, setAvailableBuyers] = useState<UserRecipientWithId[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserRecipientWithId[]>([]);
  const [loadingBuyers, setLoadingBuyers] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Selected recipient IDs (checkboxes)
  const [selectedBuyerIds, setSelectedBuyerIds] = useState<Set<string>>(new Set());
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  // Product picker for users/manual modes
  const [emailProductId, setEmailProductId] = useState('');

  // Search filter
  const [recipientSearch, setRecipientSearch] = useState('');

  // Step 3: Variables
  const [productName, setProductName] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [packName, setPackName] = useState('');
  const [packItems, setPackItems] = useState<{ name: string; downloadUrl: string }[]>([
    { name: '', downloadUrl: '' },
  ]);

  // Derived: final recipients based on mode and selection
  const recipients: EmailRecipient[] = useMemo(() => {
    switch (recipientMode) {
      case 'product':
        return availableBuyers
          .filter((b) => selectedBuyerIds.has(b.id))
          .map(({ name, email }) => ({ name, email }));
      case 'users':
        return availableUsers
          .filter((u) => selectedUserIds.has(u.id))
          .map(({ name, email }) => ({ name, email }));
      case 'manual': {
        const emails = manualEmails
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean);
        return emails.map((e) => ({ name: e.split('@')[0] ?? e, email: e }));
      }
      default:
        return [];
    }
  }, [recipientMode, availableBuyers, selectedBuyerIds, availableUsers, selectedUserIds, manualEmails]);

  // The active product for the email (depends on mode)
  const activeProductId = recipientMode === 'product' ? selectedProductId : emailProductId;
  const activeProduct = products.find((p) => p.id === activeProductId);

  // Reset product selections when template changes (product type may no longer match)
  useEffect(() => {
    if (!selectedTemplate) return;

    const isBundleTemplate = selectedTemplate === 'pack-delivery';

    // Check if selected product in "product buyers" mode is compatible
    if (selectedProductId) {
      const prod = products.find((p) => p.id === selectedProductId);
      if (prod) {
        const isBundle = prod.product_type === 'bundle';
        if (isBundleTemplate !== isBundle) {
          setSelectedProductId('');
          setAvailableBuyers([]);
          setSelectedBuyerIds(new Set());
        }
      }
    }

    // Check if email product (for users/manual modes) is compatible
    if (emailProductId) {
      const prod = products.find((p) => p.id === emailProductId);
      if (prod) {
        const isBundle = prod.product_type === 'bundle';
        if (isBundleTemplate !== isBundle) {
          setEmailProductId('');
        }
      }
    }

    // Reset variables when switching template type
    if (isBundleTemplate) {
      setProductName('');
      setDownloadLink('');
    } else {
      setPackName('');
      setPackItems([{ name: '', downloadUrl: '' }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  // Load products on mount
  useEffect(() => {
    setLoadingProducts(true);
    getProducts()
      .then(setProducts)
      .catch(() => {/* handled silently */})
      .finally(() => setLoadingProducts(false));
  }, []);

  // Load buyers when product changes in product mode
  const loadBuyers = useCallback(async (productId: string) => {
    if (!productId) return;
    setLoadingBuyers(true);
    try {
      const buyers = await getProductBuyersForEmail(productId);
      setAvailableBuyers(buyers as UserRecipientWithId[]);
      // Start with all selected
      setSelectedBuyerIds(new Set(buyers.map((b) => b.id)));
    } catch {
      setAvailableBuyers([]);
      setSelectedBuyerIds(new Set());
    } finally {
      setLoadingBuyers(false);
    }
  }, []);

  useEffect(() => {
    if (recipientMode === 'product' && selectedProductId) {
      loadBuyers(selectedProductId);
    }
  }, [recipientMode, selectedProductId, loadBuyers]);

  // Load all users for users mode
  const loadAllUsers = useCallback(async () => {
    if (availableUsers.length > 0) return; // already loaded
    setLoadingUsers(true);
    try {
      const users = await getAllUsers();
      setAvailableUsers(users as UserRecipientWithId[]);
      setSelectedUserIds(new Set(users.map((u) => u.id)));
    } catch {
      setAvailableUsers([]);
      setSelectedUserIds(new Set());
    } finally {
      setLoadingUsers(false);
    }
  }, [availableUsers.length]);

  useEffect(() => {
    if (recipientMode === 'users') {
      loadAllUsers();
    }
  }, [recipientMode, loadAllUsers]);

  // Auto-fill variables when product changes
  useEffect(() => {
    if (!activeProduct) return;

    if (activeProduct.product_type === 'bundle') {
      setPackName(activeProduct.name);
      // Load bundle items
      getBundleItems(activeProduct.id)
        .then((items) => {
          if (items.length > 0) {
            setPackItems(
              items.map((i) => ({
                name: i.name,
                downloadUrl: i.download_url ?? '',
              }))
            );
          }
        })
        .catch(() => {/* silently fail */});
    } else {
      setProductName(activeProduct.name);
      setDownloadLink(activeProduct.download_url ?? '');
    }
  }, [activeProduct]);

  const templateInfo = EMAIL_TEMPLATES.find((tpl) => tpl.id === selectedTemplate);

  function buildVariables(): Record<string, unknown> {
    switch (selectedTemplate) {
      case 'product-delivery':
        return { productName, downloadLink };
      case 'pack-delivery':
        return { packName, items: packItems.filter((i) => i.name && i.downloadUrl) };
      case 'product-update-delivery':
        return { productName, downloadLink };
      default:
        return {};
    }
  }

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return !!selectedTemplate;
      case 1:
        return recipients.length > 0;
      case 2:
        return isVariablesValid();
      case 3:
        return true;
      default:
        return false;
    }
  }

  function isVariablesValid(): boolean {
    switch (selectedTemplate) {
      case 'product-delivery':
      case 'product-update-delivery':
        return !!productName.trim() && !!downloadLink.trim();
      case 'pack-delivery':
        return (
          !!packName.trim() &&
          packItems.some((i) => i.name.trim() && i.downloadUrl.trim())
        );
      default:
        return false;
    }
  }

  async function handleSend() {
    if (!selectedTemplate) return;
    setIsSending(true);
    setConfirmOpen(false);
    try {
      const result = await sendTemplateEmail({
        templateId: selectedTemplate,
        recipients,
        variables: buildVariables(),
      });
      if (result.success) {
        sonner.toast.success(
          t('SEND_SUCCESS', { count: result.totalSent })
        );
        // Reset wizard
        setStep(0);
        setSelectedTemplate('');
        setManualEmails('');
        setProductName('');
        setDownloadLink('');
        setPackName('');
        setPackItems([{ name: '', downloadUrl: '' }]);
        setSelectedProductId('');
        setEmailProductId('');
        setSelectedBuyerIds(new Set());
        setSelectedUserIds(new Set());
        setRecipientSearch('');
      } else if (result.totalSent > 0) {
        sonner.toast.warning(
          t('SEND_PARTIAL', {
            sent: result.totalSent,
            failed: result.totalFailed,
          })
        );
      } else {
        sonner.toast.error(t('SEND_ERROR', { error: result.error ?? 'Unknown' }));
      }
    } catch (err) {
      sonner.toast.error(
        t('SEND_ERROR', {
          error: err instanceof Error ? err.message : 'Unknown',
        })
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Indicators */}
      <div className="flex items-center gap-2">
        {STEPS.map((stepKey, i) => (
          <div key={stepKey} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i < step
                  ? 'bg-primary text-primary-foreground'
                  : i === step
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`hidden text-sm sm:inline ${
                i === step ? 'font-medium' : 'text-muted-foreground'
              }`}
            >
              {t(stepKey)}
            </span>
            {i < STEPS.length - 1 && (
              <Separator className="w-8" orientation="horizontal" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 0 && (
        <StepTemplate
          t={t}
          selectedTemplate={selectedTemplate}
          onSelect={setSelectedTemplate}
        />
      )}

      {step === 1 && (
        <StepRecipients
          t={t}
          recipientMode={recipientMode}
          onModeChange={(mode) => {
            setRecipientMode(mode);
            setRecipientSearch('');
          }}
          products={products}
          selectedProductId={selectedProductId}
          onProductChange={(id) => {
            setSelectedProductId(id);
            setSelectedBuyerIds(new Set());
            setAvailableBuyers([]);
          }}
          emailProductId={emailProductId}
          onEmailProductChange={setEmailProductId}
          availableBuyers={availableBuyers}
          availableUsers={availableUsers}
          selectedBuyerIds={selectedBuyerIds}
          onSelectedBuyerIdsChange={setSelectedBuyerIds}
          selectedUserIds={selectedUserIds}
          onSelectedUserIdsChange={setSelectedUserIds}
          recipients={recipients}
          manualEmails={manualEmails}
          onManualEmailsChange={setManualEmails}
          loadingBuyers={loadingBuyers}
          loadingProducts={loadingProducts}
          loadingUsers={loadingUsers}
          recipientSearch={recipientSearch}
          onRecipientSearchChange={setRecipientSearch}
          selectedTemplate={selectedTemplate}
        />
      )}

      {step === 2 && (
        <StepVariables
          t={t}
          templateId={selectedTemplate as EmailTemplateName}
          productName={productName}
          onProductNameChange={setProductName}
          downloadLink={downloadLink}
          onDownloadLinkChange={setDownloadLink}
          packName={packName}
          onPackNameChange={setPackName}
          packItems={packItems}
          onPackItemsChange={setPackItems}
        />
      )}

      {step === 3 && (
        <StepPreview
          t={t}
          templateInfo={templateInfo}
          recipients={recipients}
          variables={buildVariables()}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('BACK')}
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="gap-1"
          >
            {t('NEXT')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={!canProceed() || isSending}
            className="gap-1"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {isSending ? t('SENDING') : t('SEND')}
          </Button>
        )}
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {t('CONFIRM_SEND_TITLE')}
            </DialogTitle>
            <DialogDescription>
              {t('CONFIRM_SEND_DESCRIPTION', {
                count: recipients.length,
                template: templateInfo?.name ?? '',
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t('BACK')}
            </Button>
            <Button onClick={handleSend} className="gap-1">
              <Mail className="h-4 w-4" />
              {t('SEND')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ────────────────── Sub-components ────────────────── */

function StepTemplate({
  t,
  selectedTemplate,
  onSelect,
}: {
  t: ReturnType<typeof useTranslations>;
  selectedTemplate: string;
  onSelect: (id: EmailTemplateName) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold">{t('SELECT_TEMPLATE')}</h3>
        <p className="text-sm text-muted-foreground">{t('SELECT_TEMPLATE_DESC')}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {EMAIL_TEMPLATES.map((tpl) => (
          <Card
            key={tpl.id}
            className={`cursor-pointer transition-colors hover:border-primary/50 ${
              selectedTemplate === tpl.id
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                : ''
            }`}
            onClick={() => onSelect(tpl.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="text-xl">{tpl.emoji}</span>
                {tpl.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{tpl.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Recipient Checkbox List ── */

function RecipientCheckboxList({
  t,
  items,
  selectedIds,
  onSelectedIdsChange,
  search,
  onSearchChange,
  loading,
  emptyMessage,
}: {
  t: ReturnType<typeof useTranslations>;
  items: { id: string; name: string; email: string }[];
  selectedIds: Set<string>;
  onSelectedIdsChange: (ids: Set<string>) => void;
  search: string;
  onSearchChange: (v: string) => void;
  loading: boolean;
  emptyMessage: string;
}) {
  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (i) => i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q)
    );
  }, [items, search]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((i) => selectedIds.has(i.id));

  function toggleAll() {
    const next = new Set(selectedIds);
    if (allFilteredSelected) {
      for (const item of filtered) next.delete(item.id);
    } else {
      for (const item of filtered) next.add(item.id);
    }
    onSelectedIdsChange(next);
  }

  function toggleOne(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectedIdsChange(next);
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-32" />
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('SEARCH_RECIPIENTS')}
          className="pl-9"
        />
      </div>

      {/* Select all / Deselect all */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {t('RECIPIENTS_SELECTED', { count: selectedIds.size })}
        </span>
        <Button variant="ghost" size="sm" onClick={toggleAll} className="h-auto py-1 text-xs">
          {allFilteredSelected ? t('DESELECT_ALL') : t('SELECT_ALL')}
        </Button>
      </div>

      {/* List */}
      <ScrollArea className="h-[240px] rounded-md border p-2">
        <div className="space-y-1">
          {filtered.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted/50"
            >
              <Checkbox
                checked={selectedIds.has(item.id)}
                onCheckedChange={() => toggleOne(item.id)}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="truncate text-xs text-muted-foreground">{item.email}</p>
              </div>
            </label>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

/* ── Product Selector ── */

function ProductSelector({
  t,
  products,
  selectedProductId,
  onProductChange,
  loading,
  templateId,
}: {
  t: ReturnType<typeof useTranslations>;
  products: ProductForEmail[];
  selectedProductId: string;
  onProductChange: (id: string) => void;
  loading: boolean;
  templateId: EmailTemplateName | '';
}) {
  if (loading) return <Skeleton className="h-10 w-full" />;

  // Filter products based on template type:
  // - pack-delivery → only bundles
  // - product-delivery / product-update-delivery → only individual
  const showBundles = templateId === 'pack-delivery';
  const showIndividual = templateId !== 'pack-delivery';

  const individualProducts = showIndividual
    ? products.filter((p) => p.product_type !== 'bundle')
    : [];
  const bundleProducts = showBundles
    ? products.filter((p) => p.product_type === 'bundle')
    : [];

  return (
    <Select value={selectedProductId} onValueChange={onProductChange}>
      <SelectTrigger>
        <SelectValue placeholder={t('SELECT_PRODUCT')} />
      </SelectTrigger>
      <SelectContent>
        {individualProducts.length > 0 && (
          <>
            {bundleProducts.length > 0 && (
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                {t('PRODUCT_INDIVIDUAL')}
              </div>
            )}
            {individualProducts.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </>
        )}
        {bundleProducts.length > 0 && (
          <>
            {individualProducts.length > 0 && (
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                {t('PRODUCT_BUNDLE')}
              </div>
            )}
            {bundleProducts.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                📦 {p.name}
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
}

/* ── Step: Recipients ── */

function StepRecipients({
  t,
  recipientMode,
  onModeChange,
  products,
  selectedProductId,
  onProductChange,
  emailProductId,
  onEmailProductChange,
  availableBuyers,
  availableUsers,
  selectedBuyerIds,
  onSelectedBuyerIdsChange,
  selectedUserIds,
  onSelectedUserIdsChange,
  recipients,
  manualEmails,
  onManualEmailsChange,
  loadingBuyers,
  loadingProducts,
  loadingUsers,
  recipientSearch,
  onRecipientSearchChange,
  selectedTemplate,
}: {
  t: ReturnType<typeof useTranslations>;
  recipientMode: RecipientMode;
  onModeChange: (mode: RecipientMode) => void;
  products: ProductForEmail[];
  selectedProductId: string;
  onProductChange: (id: string) => void;
  emailProductId: string;
  onEmailProductChange: (id: string) => void;
  availableBuyers: { id: string; name: string; email: string }[];
  availableUsers: { id: string; name: string; email: string }[];
  selectedBuyerIds: Set<string>;
  onSelectedBuyerIdsChange: (ids: Set<string>) => void;
  selectedUserIds: Set<string>;
  onSelectedUserIdsChange: (ids: Set<string>) => void;
  recipients: EmailRecipient[];
  manualEmails: string;
  onManualEmailsChange: (value: string) => void;
  loadingBuyers: boolean;
  loadingProducts: boolean;
  loadingUsers: boolean;
  recipientSearch: string;
  onRecipientSearchChange: (v: string) => void;
  selectedTemplate: EmailTemplateName | '';
}) {
  return (
    <div className="space-y-4">
      <RadioGroup
        value={recipientMode}
        onValueChange={(v) => onModeChange(v as RecipientMode)}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="product" id="mode-product" />
          <Label htmlFor="mode-product">{t('RECIPIENTS_MODE_PRODUCT')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="users" id="mode-users" />
          <Label htmlFor="mode-users">{t('RECIPIENTS_MODE_USERS')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="manual" id="mode-manual" />
          <Label htmlFor="mode-manual">{t('RECIPIENTS_MODE_MANUAL')}</Label>
        </div>
      </RadioGroup>

      <Separator />

      {/* ── Product Buyers Mode ── */}
      {recipientMode === 'product' && (
        <div className="space-y-4">
          <ProductSelector
            t={t}
            products={products}
            selectedProductId={selectedProductId}
            onProductChange={onProductChange}
            loading={loadingProducts}
            templateId={selectedTemplate}
          />

          {selectedProductId && (
            <RecipientCheckboxList
              t={t}
              items={availableBuyers}
              selectedIds={selectedBuyerIds}
              onSelectedIdsChange={onSelectedBuyerIdsChange}
              search={recipientSearch}
              onSearchChange={onRecipientSearchChange}
              loading={loadingBuyers}
              emptyMessage={t('NO_BUYERS')}
            />
          )}
        </div>
      )}

      {/* ── Registered Users Mode ── */}
      {recipientMode === 'users' && (
        <div className="space-y-4">
          <RecipientCheckboxList
            t={t}
            items={availableUsers}
            selectedIds={selectedUserIds}
            onSelectedIdsChange={onSelectedUserIdsChange}
            search={recipientSearch}
            onSearchChange={onRecipientSearchChange}
            loading={loadingUsers}
            emptyMessage={t('NO_USERS')}
          />

          <Separator />

          <div className="space-y-2">
            <Label>{t('SELECT_PRODUCT_FOR_EMAIL')}</Label>
            <p className="text-xs text-muted-foreground">
              {t('SELECT_PRODUCT_FOR_EMAIL_HINT')}
            </p>
            <ProductSelector
              t={t}
              products={products}
              selectedProductId={emailProductId}
              onProductChange={onEmailProductChange}
              loading={loadingProducts}
              templateId={selectedTemplate}
            />
          </div>
        </div>
      )}

      {/* ── Manual Mode ── */}
      {recipientMode === 'manual' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              value={manualEmails}
              onChange={(e) => onManualEmailsChange(e.target.value)}
              placeholder={t('MANUAL_EMAILS_PLACEHOLDER')}
            />
            <p className="text-xs text-muted-foreground">
              {t('MANUAL_EMAILS_HINT')}
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>{t('SELECT_PRODUCT_FOR_EMAIL')}</Label>
            <p className="text-xs text-muted-foreground">
              {t('SELECT_PRODUCT_FOR_EMAIL_HINT')}
            </p>
            <ProductSelector
              t={t}
              products={products}
              selectedProductId={emailProductId}
              onProductChange={onEmailProductChange}
              loading={loadingProducts}
              templateId={selectedTemplate}
            />
          </div>
        </div>
      )}

      {/* Recipients summary */}
      {recipients.length > 0 && (
        <div className="space-y-2 rounded-md border bg-muted/30 p-3">
          <p className="text-sm font-medium">
            {t('RECIPIENTS_SELECTED', { count: recipients.length })}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {recipients.slice(0, 20).map((r) => (
              <Badge key={r.email} variant="secondary" className="text-xs">
                {r.email}
              </Badge>
            ))}
            {recipients.length > 20 && (
              <Badge variant="outline" className="text-xs">
                +{recipients.length - 20}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StepVariables({
  t,
  templateId,
  productName,
  onProductNameChange,
  downloadLink,
  onDownloadLinkChange,
  packName,
  onPackNameChange,
  packItems,
  onPackItemsChange,
}: {
  t: ReturnType<typeof useTranslations>;
  templateId: EmailTemplateName;
  productName: string;
  onProductNameChange: (v: string) => void;
  downloadLink: string;
  onDownloadLinkChange: (v: string) => void;
  packName: string;
  onPackNameChange: (v: string) => void;
  packItems: { name: string; downloadUrl: string }[];
  onPackItemsChange: (items: { name: string; downloadUrl: string }[]) => void;
}) {
  if (templateId === 'product-delivery' || templateId === 'product-update-delivery') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t('VAR_PRODUCT_NAME')}</Label>
          <Input
            value={productName}
            onChange={(e) => onProductNameChange(e.target.value)}
            placeholder={t('VAR_PRODUCT_NAME_PLACEHOLDER')}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('VAR_DOWNLOAD_LINK')}</Label>
          <Input
            value={downloadLink}
            onChange={(e) => onDownloadLinkChange(e.target.value)}
            placeholder={t('VAR_DOWNLOAD_LINK_PLACEHOLDER')}
          />
        </div>
      </div>
    );
  }

  if (templateId === 'pack-delivery') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t('VAR_PACK_NAME')}</Label>
          <Input
            value={packName}
            onChange={(e) => onPackNameChange(e.target.value)}
            placeholder={t('VAR_PACK_NAME_PLACEHOLDER')}
          />
        </div>
        <Separator />
        <div className="space-y-3">
          <Label>{t('VAR_ITEMS')}</Label>
          {packItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <Input
                  value={item.name}
                  onChange={(e) => {
                    const updated = [...packItems];
                    updated[idx] = { ...item, name: e.target.value };
                    onPackItemsChange(updated);
                  }}
                  placeholder={t('VAR_ITEM_NAME')}
                />
                <Input
                  value={item.downloadUrl}
                  onChange={(e) => {
                    const updated = [...packItems];
                    updated[idx] = { ...item, downloadUrl: e.target.value };
                    onPackItemsChange(updated);
                  }}
                  placeholder={t('VAR_ITEM_URL')}
                />
              </div>
              {packItems.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-1 shrink-0"
                  onClick={() =>
                    onPackItemsChange(packItems.filter((_, i) => i !== idx))
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() =>
              onPackItemsChange([...packItems, { name: '', downloadUrl: '' }])
            }
          >
            <Plus className="h-3.5 w-3.5" />
            {t('VAR_ADD_ITEM')}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

function StepPreview({
  t,
  templateInfo,
  recipients,
  variables,
}: {
  t: ReturnType<typeof useTranslations>;
  templateInfo?: { id: string; name: string; emoji: string; description: string };
  recipients: EmailRecipient[];
  variables: Record<string, unknown>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('PREVIEW_TITLE')}</h3>

      <Card>
        <CardContent className="pt-6 space-y-3">
          {templateInfo && (
            <div className="flex items-center gap-2">
              <span className="text-xl">{templateInfo.emoji}</span>
              <span className="font-medium">{templateInfo.name}</span>
            </div>
          )}
          <Separator />
          <p className="text-sm text-muted-foreground">
            {t('PREVIEW_RECIPIENTS_LABEL', { count: recipients.length })}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {recipients.slice(0, 10).map((r) => (
              <Badge key={r.email} variant="secondary" className="text-xs">
                {r.email}
              </Badge>
            ))}
            {recipients.length > 10 && (
              <Badge variant="outline" className="text-xs">
                +{recipients.length - 10}
              </Badge>
            )}
          </div>
          <Separator />
          <div className="space-y-1 text-sm">
            {Object.entries(variables).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="font-medium text-muted-foreground">{key}:</span>
                <span className="break-all">
                  {typeof value === 'string'
                    ? value
                    : JSON.stringify(value, null, 2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
