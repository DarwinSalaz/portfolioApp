import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers/customers.component';
import { CustomerComponent } from './customer/customer.component';
import { ServiceActionsModalComponent } from './service-actions-modal/service-actions-modal.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    CustomersComponent,
    CustomerComponent,
    ServiceActionsModalComponent
  ],
  exports: [
    CustomersComponent,
    ServiceActionsModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  entryComponents: [ServiceActionsModalComponent]
})
export class ComponentsModule { }
