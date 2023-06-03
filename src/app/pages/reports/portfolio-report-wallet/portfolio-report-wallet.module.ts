import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PortfolioReportWalletPage } from './portfolio-report-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: PortfolioReportWalletPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PortfolioReportWalletPage]
})
export class PortfolioReportWalletPageModule {}
