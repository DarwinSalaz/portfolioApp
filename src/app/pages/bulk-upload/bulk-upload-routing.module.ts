import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulkUploadPage } from './bulk-upload.page';

const routes: Routes = [
  {
    path: '',
    component: BulkUploadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkUploadPageRoutingModule {}