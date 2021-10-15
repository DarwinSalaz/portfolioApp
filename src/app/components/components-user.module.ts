import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './user/user.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    UsersComponent,
    UserComponent
  ],
  exports: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsUsersModule { }
