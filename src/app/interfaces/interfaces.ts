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
}

export interface WalletRequest {
    wallet_ids: number[];
    date?: string;
}

export interface Company {
    companyId: number;
    name: string;
    nit: string;
    active: boolean;
}

export interface User {
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
}

export interface ItemUserCustom {
    main_text?: string;
    second_text?: string;
    icon?: string;
    username?: string;
    customer_id?: number;
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
}

export interface ServiceProduct {
    product_id?: number;
    value?: number;
    quantity?: number;
}

export interface ResponseProducts {
    status: string;
    products: Product[];
}

export interface Product {
    product_id?: number;
    company_id?: number;
    name?: string;
    description?: string;
    value?: number;
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
    wallet_id: number;
    customer_id: number;
    state: string;
    created_at: string;
}

export interface Expense {
    expense_id?: number;
    expense_type: string;
    value: number;
    expense_date: string;
    justification?: string;
    wallet_id?: number;
}

export interface Wallet {
    wallet_id: number;
    name: string;
    active: boolean;
}