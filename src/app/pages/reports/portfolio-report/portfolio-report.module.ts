import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicSelectableModule } from 'ionic-selectable';

import { IonicModule } from '@ionic/angular';

import { PortfolioReportPage } from './portfolio-report.page';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

const routes: Routes = [
  {
    path: '',
    component: PortfolioReportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PortfolioReportPage]
})
export class PortfolioReportPageModule {}
