import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CashControlHistoryPage } from './cash-control-history.page';

const routes: Routes = [
  {
    path: '',
    component: CashControlHistoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CashControlHistoryPage]
})
export class CashControlHistoryPageModule {}
