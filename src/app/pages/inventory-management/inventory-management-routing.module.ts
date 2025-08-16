import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryManagementPage } from './inventory-management.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryManagementPageRoutingModule {} 