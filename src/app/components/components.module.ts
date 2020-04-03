import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers/customers.component';
import { CustomerComponent } from './customer/customer.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    CustomersComponent,
    CustomerComponent
  ],
  exports: [
    CustomersComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }
