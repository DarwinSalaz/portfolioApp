import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { BulkRevenueUploadPage } from './bulk-revenue-upload.page';

const routes: Routes = [
  {
    path: '',
    component: BulkRevenueUploadPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BulkRevenueUploadPage]
})
export class BulkRevenueUploadPageModule {}

