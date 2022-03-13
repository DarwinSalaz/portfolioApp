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
    //this.navCtrl.navigateForward('/menu', )
    //this.navCtrl.navigateRoot( '/menu', { animated: true } );
    console.log('como fueee' + this.item.customer_id);
    this.router.navigate([this.redirectTo], {
      queryParams: { username : this.item.username, customer_id : this.item.customer_id }
    });
  }

}
