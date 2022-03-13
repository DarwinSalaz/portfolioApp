import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.page.html',
  styleUrls: ['./log-out.page.scss'],
})
export class LogOutPage implements OnInit {

  constructor(private storage: Storage, private navCtrl: NavController) { }

  ngOnInit() {
    this.logout();
  }

  logout() {
    this.storage.clear();
    this.navCtrl.navigateRoot('/', { animated: true });
  }

}
