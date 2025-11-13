import { Component, OnInit, Input } from '@angular/core';
import { ItemUserCustom } from '../../interfaces/interfaces';
import { NavController, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  @Input() item: ItemUserCustom = {};
  @Input() redirectTo = '';

  constructor(
    private navCtrl: NavController, 
    public router: Router,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
    console.log(this.item.username);
  }

  async openOptionsMenu(event: Event) {
    event.stopPropagation();

    const actionSheet = await this.actionSheetCtrl.create({
      header: this.item.main_text,
      subHeader: this.item.second_text,
      buttons: [
        {
          text: 'Ver Control de Caja',
          icon: 'wallet',
          handler: () => {
            this.goToCashControl();
          }
        },
        {
          text: 'Reporte de Movimientos',
          icon: 'document-text',
          handler: () => {
            this.openReport();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  goToCashControl() {
    console.log('Navegando a control de caja: ' + this.item.customer_id);
    this.router.navigate([this.redirectTo], {
      queryParams: { username: this.item.username, customer_id: this.item.customer_id }
    });
  }

  openReport() {
    this.router.navigate(['/user-movements-report'], {
      queryParams: { 
        username: this.item.username, 
        application_user_id: this.item.application_user_id,
        user_full_name: this.item.main_text
      }
    });
  }

}
