import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransactionByDatePage } from './transaction-by-date.page';
import { ComponentsUsersModule } from '../../../components/components-user.module';

const routes: Routes = [
  {
    path: '',
    component: TransactionByDatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsUsersModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TransactionByDatePage]
})
export class TransactionByDatePageModule {}
