import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransactionByDateFormPage } from './transaction-by-date-form.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionByDateFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TransactionByDateFormPage]
})
export class TransactionByDateFormPageModule {}
