export type PaymentStatus =
  | 'pending'
  | 'approved'
  | 'authorized'
  | 'in_process'
  | 'in_mediation'
  | 'rejected'
  | 'cancelled'
  | 'refunded'
  | 'charged_back';

export interface MercadoPagoPayment {
  accounts_info: null;
  acquirer_reconciliation: unknown[];
  additional_info: AdditionalInfo;
  authorization_code: null;
  binary_mode: boolean;
  brand_id: null;
  build_version: string;
  call_for_authorize_id: null;
  captured: boolean;
  card: unknown;
  charges_details: ChargesDetail[];
  charges_execution_info: ChargesExecutionInfo;
  collector_id: number;
  corporation_id: null;
  counter_currency: null;
  coupon_amount: number;
  currency_id: string;
  date_approved: Date;
  date_created: Date;
  date_last_updated: Date;
  date_of_expiration: null;
  deduction_schema: null;
  description: string;
  differential_pricing_id: null;
  external_reference: null;
  fee_details: FeeDetail[];
  financing_group: null;
  id: number;
  installments: number;
  integrator_id: null;
  issuer_id: string;
  live_mode: boolean;
  marketplace_owner: number;
  merchant_account_id: null;
  merchant_number: null;
  metadata: Metadata;
  money_release_date: Date;
  money_release_schema: null;
  money_release_status: string;
  notification_url: null;
  operation_type: string;
  order: Order;
  payer: PaymentPayer;
  payment_method: PaymentMethod;
  payment_method_id: string;
  payment_type_id: string;
  platform_id: null;
  point_of_interaction: PointOfInteraction;
  pos_id: null;
  processing_mode: string;
  refunds: unknown[];
  release_info: null;
  shipping_amount: number;
  sponsor_id: null;
  statement_descriptor: null;
  status: PaymentStatus;
  status_detail: string;
  store_id: null;
  tags: null;
  taxes_amount: number;
  transaction_amount: number;
  transaction_amount_refunded: number;
  transaction_details: TransactionDetails;
}

export interface AdditionalInfo {
  authentication_code: null;
  available_balance: null;
  ip_address: string;
  items: unknown[];
  nsu_processadora: null;
  payer: AdditionalInfoPayer;
}

export interface AdditionalInfoPayer {
  first_name: string;
}

export interface ChargesDetail {
  accounts: unknown;
  amounts: unknown;
  client_id: number;
  date_created: Date;
  id: string;
  last_updated: Date;
  metadata: unknown;
  name: string;
  refund_charges: unknown[];
  reserve_id: null;
  type: string;
}

export interface ChargesExecutionInfo {
  internal_execution: InternalExecution;
}

export interface InternalExecution {
  date: Date;
  execution_id: string;
}

export interface FeeDetail {
  amount: number;
  fee_payer: string;
  type: string;
}

export interface Metadata {
  user_id: string;
  product_id: string;
  order_id: string;
}

export interface Order {
  id: string;
  type: string;
}

export interface PaymentPayer {
  identification: Identification;
  entity_type: null;
  phone: Phone;
  last_name: null;
  id: string;
  type: null;
  first_name: null;
  email: string;
}

export interface Identification {
  number: string;
  type: string;
}

export interface Phone {
  number: null;
  extension: null;
  area_code: null;
}

export interface PaymentMethod {
  id: string;
  issuer_id: string;
  type: string;
}

export interface PointOfInteraction {
  business_info: BusinessInfo;
  location: Location;
  transaction_data: TransactionData;
  type: string;
}

export interface BusinessInfo {
  branch: string;
  sub_unit: string;
  unit: string;
}

export interface Location {
  source: string;
  state_id: string;
}

export interface TransactionData {
  e2e_id: null;
}

export interface TransactionDetails {
  acquirer_reference: null;
  external_resource_url: null;
  financial_institution: null;
  installment_amount: number;
  net_received_amount: number;
  overpaid_amount: number;
  payable_deferral_period: null;
  payment_method_reference_id: null;
  total_paid_amount: number;
}
