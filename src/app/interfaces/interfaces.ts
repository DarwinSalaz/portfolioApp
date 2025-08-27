export interface RespuestaCustomers {
    status: string;
    customers: Customer[];
}

export interface CustomerServiceSchedule {
    customer_id?: number;
    name?: string;
    last_name?: string;
    icon?: string;
    fee_value?: string;
    next_payment_date?: string;
}

export interface WalletReport {
    wallet_name?: string;
    services_count?: number;
    cash?: string;
    down_payments?: string;
    commissions?: string;
    expenses?: string;
}

export interface ServicesReportResp {
    total_product_values?: string,
    total_discount?: string,
    total_service_value?: string,
    total_debt?: string,
    services_data?: ServiceReport[],
    products_sold: ProductSoldReport[]
}

export interface ProductSoldReport {
  product_name: string;
  total_quantity: number;
}

export interface ServiceReport {
    id?: number;
    username?: string;
    products?: string;
    discount?: string;
    wallet?: string;
    debt?: string;
    product_values?: string;
    client?: string;
    created_at?: string;
    service_value?: string;
}

export interface PaymentsReportResp {
    total_value?: string,
    total_debt?: string,
    payments_data?: PaymentsReport[]
}

export interface PaymentsReport {
    id?: number;
    client?: string;
    service_id?: number;
    value?: string;
    debt?: string;
    wallet?: string;
    username?: string;
    created_at?: string;
}

export interface Customer {
    customer_id?: number;
    company_id?: number;
    name?: string;
    last_name?: string;
    cellphone?: string;
    email?: string;
    address?: string;
    identification_number?: string;
    active?: boolean;
    created_at?: string;
    fullname?: string;
    image?: string;
    gender?: string;
    icon?: string;
    observation?: string;
    wallet_id?: number;
    blocked?: boolean;
}

export interface CustomerResponse {
  customer_id?: number | null;
  isNew?: boolean;
  status?: number;
  body?: any;
  error?: boolean;
}

export interface WalletRequest {
    wallet_ids: number[];
    date?: string;
    expired_services?: boolean;
}

export interface Company {
    companyId: number;
    name: string;
    nit: string;
    active: boolean;
}

export interface User {
    application_user_id?: number;
    company_id?: number;
    username?: string;
    name?: string;
    last_name?: string;
    cellphone?: string;
    email?: string;
    password?: string;
    user_profile_id?: number;
    wallet_ids?: number[];
    icon?: string;
    active?: boolean;
}

export interface ItemUserCustom {
    main_text?: string;
    second_text?: string;
    icon?: string;
    username?: string;
    customer_id?: number;
}

export interface CancelServiceReq {
    service_id?: number;
    product_ids?: number[];
    discount?: number;
}

export interface UpdateServiceReq {
    service_id?: number;
    quantity_of_fees?: number;
    fee_value?: number;
}

export interface Service {
    service_id?: number;
    application_user_id?: number;
    service_value: number;
    down_payment: number;
    discount: number;
    total_value: number;
    debt: number;
    days_per_fee: number;
    quantity_of_fees: number;
    fee_value: number;
    wallet_id: number;
    has_products: boolean;
    customer_id: number;
    state: string;
    service_products: Product[];
    observations: string;
    next_payment_date: string;
    initial_payment?: number;
    direct_purchase?: boolean;
    pending_fees?: number;
    pay_down_in_installments?: boolean;
}

export interface ServiceProduct {
    product_id?: number;
    value?: number;
    quantity?: number;
    name?: string;
}

export interface ResponseProducts {
    status: string;
    products: Product[];
}

export interface InventoryDetail {
    product_id?: number;
    product_name?: string;
    quantity_sold?: number;
    left_quantity?: number;
    wallet_name?: string;
}

export interface InventoryMovement {
    id?: number;
    product_id?: number;
    product_name?: string;
    movement_type?: 'ENTRADA' | 'SALIDA';
    quantity?: number;
    previous_quantity?: number;
    new_quantity?: number;
    user_id?: number;
    username?: string;
    movement_date?: string;
    description?: string;
    wallet_id?: number;
    wallet_name?: string;
}

export interface InventoryMovementRequest {
    product_id: number;
    movement_type: 'ENTRADA' | 'SALIDA';
    quantity: number;
    description?: string;
    wallet_id: number;
}

export interface ExpiredServiceResp {
    total_value?: string,
    expired_services?: ExpiredServiceDetail[]
}

export interface ExpiredServiceDetail {
    client?: string;
    cellphone?: string;
    address?: string;
    debt?: string;
    total_value?: string;
    pending_fees?: number;
    next_payment_date?: string;
    created_at?: string;
    last_payment_date?: string;
    expired_fees?: number;
}

export interface Product {
    product_id?: number;
    company_id?: number;
    name?: string;
    description?: string;
    value?: number;
    cost?: number;
    left_quantity?: number;
    value_str?: string;
    wallet_id?: number;
    quantity?: number;
}

export interface CashControl {
    cash_control_id?: number;
    full_name?: string;
    cash?: string;
    revenues?: string;
    expenses?: string;
    active?: boolean;
    period?: string;
    services_count?: number;
    cash_number?: number;
    commission?: string;
    commission_number?: number;
    down_payments?: string;
    down_payments_number?: number;
    movements?: CashMovement[];
    username?: string;
}

export interface CashMovement {
    cash_movement_typ?: string;
    movement_type?: string;
    payment_id?: number;
    value?: string;
    commission?: string;
    down_payments?: string;
    created_at?: string;
    service_id?: number;
    description?: string;
}

export interface AccountClosureInfo {
    cash_control_id?: number;
    commission_str?: string;
    commission?: number;
    closure_value_received?: number;
    closure_notes?: string;
    expected_value?: string;
}

export interface Payment {
    service_id?: number;
    value?: number;
    next_payment_date?: string;
    deposit_payment?: number;
}

export interface ServicesByCustomerResponse {
    service_id?: number;
    application_user_id?: number;
    service_value: string;
    down_payment: string;
    discount: string;
    total_value: string;
    debt: string;
    debt_in_number: number;
    days_per_fee: number;
    quantity_of_fees: number;
    fee_value: string;
    fee_value_in_number: number;
    total_value_number: number;
    down_payment_number: number;
    wallet_id: number;
    customer_id: number;
    state: string;
    observations?: string;
    created_at: string;
    service_products: ServiceProduct[];
    payments?: PaymentResumeDto[];
    pending_value?: string;
    pending_fees?: number;
    next_payment_date?: string;
    marked_for_withdrawal?: boolean;
    marked_as_lost?: boolean;
    pay_down_in_installments?: boolean;
    down_payment_total?: number;
}

export interface PaymentResumeDto {
    payment_id: number;
    value: string;
    username?: string;
    created_at?: string;
}

export interface Expense {
    expense_id?: number;
    expense_type: string;
    value: number;
    expense_date: string;
    justification?: string;
    wallet_id?: number;
    username?: string;
}

export interface Revenue {
    revenue_id?: number;
    revenue_type: string;
    value: number;
    revenue_date: string;
    justification?: string;
    wallet_id?: number;
    username?: string;
}

export interface ExpenseResume {
    expense_type: string;
    value: string;
    expense_date: string;
    justification?: string;
}

export interface Wallet {
    wallet_id: number;
    name: string;
    active: boolean;
}

export interface WalletReportResponse {
  walletName: string;
  income: any[];
  expense: any[];
  summary: {
    totalIncome: number;
    totalExpense: number;
    finalBalance: number;
  };
}
