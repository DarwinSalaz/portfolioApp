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
  { path: 'new-user', loadChildren: './pages/user/new-user/new-user.module#NewUserPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
