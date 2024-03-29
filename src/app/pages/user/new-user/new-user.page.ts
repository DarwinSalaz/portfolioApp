import { Component, OnInit } from '@angular/core';
import { User, Wallet } from 'src/app/interfaces/interfaces';
import { UserService } from 'src/app/services/user.service';
import { NavController } from '@ionic/angular';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { NgForm } from '@angular/forms';
import { WalletService } from 'src/app/services/wallet.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.page.html',
  styleUrls: ['./new-user.page.scss'],
})
export class NewUserPage implements OnInit {

  wallets: Wallet[] = [];

  selectedWallets: Wallet[] = [];

  loading: boolean = true;

  isUpdate: boolean = false;

  username: string;

  avatars = [
    {
      img: 'av-1.png',
      seleccionado: true
    },
    {
      img: 'av-2.png',
      seleccionado: false
    },
    {
      img: 'av-3.png',
      seleccionado: false
    },
    {
      img: 'av-4.png',
      seleccionado: false
    },
    {
      img: 'av-5.png',
      seleccionado: false
    },
    {
      img: 'av-6.png',
      seleccionado: false
    },
    {
      img: 'av-7.png',
      seleccionado: false
    },
    {
      img: 'av-8.png',
      seleccionado: false
    },
  ];

  avatarSlide = {
    slidesPerView: 3.5
  };

  registerUser: User = {
    company_id: 1,
    username: '',
    name: '',
    email: '',
    password: '',
    user_profile_id: null,
    wallet_ids: null,
    application_user_id: null,
  };

  password_confirm: string = "";

  constructor(private userService: UserService,
              private navCtrl: NavController,
              private uiService: UiServiceService,
              private walletService: WalletService,
              public activatedRoute: ActivatedRoute) {

                this.walletService.getWallets()
                  .subscribe( resp => {
                    console.log( resp );
                    this.wallets.push( ...resp );

                    this.activatedRoute.queryParams.subscribe((res) => {
                      console.log(res);
                      
                      if (res.username) {
                        this.username = res.username;
                        this.isUpdate = true;
                        
                        this.getApplicationUser()
                      } else {
                        this.isUpdate = false;
                        
                      }

                      this.loading =false;
                    });
                  });
              }

  async getApplicationUser() {

    this.userService.getApplicationUserByUsername(this.username)
      .subscribe(resp => {
        this.registerUser = resp
        this.registerUser.password = 'no_change'
        this.password_confirm = 'no_change'
        this.selectedWallets = this.wallets.filter(wallet => resp.wallet_ids.includes(wallet.wallet_id));
        this.loading = false;
        console.log('Esta es la info del usuario: ' + JSON.stringify(resp))
        console.log('Esto es el selectedWallets: ' + JSON.stringify(this.selectedWallets))
      })
  }

  ngOnInit() {
  }

  async registro( fRegistro: NgForm ) {

    if (this.registerUser.password !== this.password_confirm) {
      this.uiService.InfoAlert('Contraseña no coincide');
      return;
    }

    if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    this.loading = true;
    var valido;

    if(!this.isUpdate) {
      valido = await this.userService.registerUser(this.registerUser);
    } else {
      valido = await this.userService.updateApplicationUser(this.registerUser);
    }


    this.loading = false;
    if ( valido ) {
      // navegar al tabs
      this.uiService.InfoAlert('Registro completo!');
      this.navCtrl.navigateRoot( '/menu', { animated: true } );
    } else {
      // mostrar alerta de usuario y contraseña no correctas
      this.uiService.InfoAlert('Error al registrar el usuario');
    }
  }

  selectAvatar( avatar ) {
    this.avatars.forEach( av => av.seleccionado = false );

    avatar.seleccionado = true;
  }

  walletChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('product:', event.value);
    const walletsSelected: Wallet[] = event.value;
    this.registerUser.wallet_ids = walletsSelected.map( function(wallet) {
      return wallet.wallet_id;
    })
    console.log( this.registerUser.wallet_ids );
    //this.registerService.service_products = productsSelected;
  }

}
