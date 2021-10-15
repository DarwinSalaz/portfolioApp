import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  @Input() user: User = {};
  @Input() redirectTo = '';
  icon = 'av-1.png';

  constructor(private navCtrl: NavController, public router: Router) { }

  ngOnInit() {
    console.log(this.user.username);
  }

  click() {
    //this.navCtrl.navigateForward('/menu', )
    //this.navCtrl.navigateRoot( '/menu', { animated: true } );
    this.router.navigate([this.redirectTo], {
      queryParams: { username : this.user.username }
    });
  }

}
