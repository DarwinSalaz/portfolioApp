import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InventoryManagementPageRoutingModule } from './inventory-management-routing.module';
import { InventoryManagementPage } from './inventory-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InventoryManagementPageRoutingModule
  ],
  declarations: [InventoryManagementPage]
})
export class InventoryManagementPageModule {} 