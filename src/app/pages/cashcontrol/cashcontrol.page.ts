import { Component, OnInit } from '@angular/core';
import { CashControl } from '../../interfaces/interfaces';
import { CashcontrolService } from '../../services/cashcontrol.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavServiceService } from 'src/app/services/nav-service.service';
import { Storage } from '@ionic/storage';
import { UserService } from 'src/app/services/user.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cashcontrol',
  templateUrl: './cashcontrol.page.html',
  styleUrls: ['./cashcontrol.page.scss'],
})
export class CashcontrolPage implements OnInit {

  loading: boolean = true;
  username: string;
  applicationUserId: number;
  userFullName: string;
  isControl: boolean = false;

  cashControl: CashControl = {
    full_name: '',
    cash: '',
    revenues: '',
    expenses: '',
    active: false,
    period: '',
    services_count: 0,
    commission: '',
    down_payments: '',
    down_payments_number: 0
  };

  constructor(
    private cashcontrolService: CashcontrolService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public navService: NavServiceService,
    private storage: Storage,
    private userService: UserService,
    private uiService: UiServiceService,
    private alertController: AlertController
  ) {
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res);
      
      if (res.username) {
        console.log('aqui paaa');
        this.username = res.username;
        this.applicationUserId = parseInt(res.application_user_id);
        this.userFullName = res.user_full_name;
        this.isControl = true;
      } else {
        this.isControl = false;
      }

      this.init();
    });    
  }

  async ngOnInit() {
  }

  async init() {
    console.log('usernameeee:' + this.username);
    const response = await this.cashcontrolService.getActiveCashControl(this.username);
    response.subscribe(
      resp => {
        console.log( resp );
        this.cashControl = resp;
        this.loading = false;
      }
    );
  }

  async click() {
    this.cashControl.username = this.username
    this.navService.cashControlToClose = this.cashControl;
    this.router.navigate(['/account-closure'], {
      queryParams: { cash_control_id: this.cashControl.cash_control_id, username: this.username}
    });
  }

  async showExpenses() {
    this.router.navigate(['/show-expenses'], {
      queryParams: { cash_control_id: this.cashControl.cash_control_id }
    });
  }

  async showMovements() {
    this.router.navigate(['/cash-movements'], {
      queryParams: { cash_control_id: this.cashControl.cash_control_id }
    });
  }

  async showHistory() {
    console.log('usernameeee 1:' + this.username);

    if (!this.username) {
      this.username = await this.storage.get('username');
    }

    console.log('usernameeee 2:' + this.username);

    this.router.navigate(['/cash-control-history'], {
      queryParams: { username: this.username }
    });
  }

  async update() {
    this.router.navigate(['/new-user'], {
      queryParams: { username : this.username }
    });
  }

  async inactivate() {
    this.presentAlertConfirm()    
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Inactivar Usuario',
      message: '¿Desea inactivar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            const valido = this.userService.inactivate(this.username);

            if ( valido ) {
              this.uiService.InfoAlert('Proceso finalizado');
              this.router.navigate(['/users']);
            } else {
              this.uiService.InfoAlert('Error al inactivar el usuario');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async showUserReport() {
    if (!this.applicationUserId) {
      this.uiService.InfoAlert('Error: No se pudo obtener el ID del usuario');
      return;
    }

    this.router.navigate(['/user-movements-report'], {
      queryParams: { 
        username: this.username, 
        application_user_id: this.applicationUserId,
        user_full_name: this.userFullName || this.cashControl.full_name
      }
    });
  }

}
