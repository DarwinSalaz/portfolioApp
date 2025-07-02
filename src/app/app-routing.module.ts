import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'main', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'customers/:origin', loadChildren: './pages/customer/customers/customers.module#CustomersPageModule' },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  { path: 'newcustomer', loadChildren: './pages/customer/newcustomer/newcustomer.module#NewcustomerPageModule' },
  { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule' },
  { path: 'notfound', loadChildren: './pages/notfound/notfound.module#NotfoundPageModule' },
  { path: 'transaction', loadChildren: './pages/transaction/transaction.module#TransactionPageModule' },
  { path: 'cashcontrol', loadChildren: './pages/cashcontrol/cashcontrol.module#CashcontrolPageModule' },
  {
    path: 'transaction-by-user',
    loadChildren: './pages/transactions/transaction-by-user/transaction-by-user.module#TransactionByUserPageModule'
  },
  { path: 'register-payment', loadChildren: './pages/transactions/register-payment/register-payment.module#RegisterPaymentPageModule' },
  { path: 'new-expense', loadChildren: './pages/expense/new-expense/new-expense.module#NewExpensePageModule' },
  { path: 'new-user', loadChildren: './pages/user/new-user/new-user.module#NewUserPageModule' },
  { path: 'users', loadChildren: './pages/user/users/users.module#UsersPageModule' },
  { path: 'account-closure', loadChildren: './pages/account-closure/account-closure.module#AccountClosurePageModule' },
  { path: 'log-out', loadChildren: './pages/user/log-out/log-out.module#LogOutPageModule' },
  { path: 'cashcontrol-daily', loadChildren: './pages/cashcontrol-daily/cashcontrol-daily.module#CashcontrolDailyPageModule' },
  { path: 'transaction-by-date-form', loadChildren: './pages/transactions/transaction-by-date-form/transaction-by-date-form.module#TransactionByDateFormPageModule' },
  { path: 'transaction-by-date', loadChildren: './pages/transactions/transaction-by-date/transaction-by-date.module#TransactionByDatePageModule' },
  { path: 'list-wallets', loadChildren: './pages/products/list-wallets/list-wallets.module#ListWalletsPageModule' },
  { path: 'list-products', loadChildren: './pages/products/list-products/list-products.module#ListProductsPageModule' },
  { path: 'product-detail', loadChildren: './pages/products/product-detail/product-detail.module#ProductDetailPageModule' },
  { path: 'payments-service', loadChildren: './pages/transactions/payments-service/payments-service.module#PaymentsServicePageModule' },
  { path: 'show-expenses', loadChildren: './pages/cashcontrols/show-expenses/show-expenses.module#ShowExpensesPageModule' },
  { path: 'cancel-service', loadChildren: './pages/transactions/cancel-service/cancel-service.module#CancelServicePageModule' },
  { path: 'cash-movements', loadChildren: './pages/cashcontrols/cash-movements/cash-movements.module#CashMovementsPageModule' },
  { path: 'cash-control-history', loadChildren: './pages/cashcontrols/cash-control-history/cash-control-history.module#CashControlHistoryPageModule' },
  { path: 'portfolio-report', loadChildren: './pages/reports/portfolio-report/portfolio-report.module#PortfolioReportPageModule' },
  { path: 'portfolio-report-wallet', loadChildren: './pages/reports/portfolio-report-wallet/portfolio-report-wallet.module#PortfolioReportWalletPageModule' },
  { path: 'select-products', loadChildren: './pages/transactions/select-products/select-products.module#SelectProductsPageModule' },
  { path: 'payment-details', loadChildren: './pages/transactions/payment-details/payment-details.module#PaymentDetailsPageModule' },
  { path: 'new-revenue', loadChildren: './pages/new-revenue/new-revenue.module#NewRevenuePageModule' },
  { path: 'list-expenses', loadChildren: './pages/expenses/list-expenses/list-expenses.module#ListExpensesPageModule' },
  { path: 'list-revenues', loadChildren: './pages/revenues/list-revenues/list-revenues.module#ListRevenuesPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
