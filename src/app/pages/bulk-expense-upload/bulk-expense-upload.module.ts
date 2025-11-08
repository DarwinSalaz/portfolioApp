import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { BulkExpenseUploadPage } from './bulk-expense-upload.page';

const routes: Routes = [
  {
    path: '',
    component: BulkExpenseUploadPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BulkExpenseUploadPage]
})
export class BulkExpenseUploadPageModule {}

