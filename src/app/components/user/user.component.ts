import { Component, OnInit, Input } from '@angular/core';
import { ItemUserCustom } from '../../interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  @Input() item: ItemUserCustom = {};
  @Input() redirectTo = '';

  constructor(private navCtrl: NavController, public router: Router) { }

  ngOnInit() {
    console.log(this.item.username);
  }

  click() {
    console.log('Navegando con application_user_id: ' + this.item.application_user_id);
    this.router.navigate([this.redirectTo], {
      queryParams: { 
        username: this.item.username, 
        customer_id: this.item.customer_id,
        application_user_id: this.item.application_user_id,
        user_full_name: this.item.main_text
      }
    });
  }

}
