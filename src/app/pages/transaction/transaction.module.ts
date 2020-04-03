import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransactionPage } from './transaction.page';

import { IonicSelectableModule } from 'ionic-selectable';

import { BrMaskerModule, BrMaskModel } from 'br-mask';

const routes: Routes = [
  {
    path: '',
    component: TransactionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule,
    BrMaskerModule,
    ReactiveFormsModule
  ],
  declarations: [TransactionPage]
})
export class TransactionPageModule {}
