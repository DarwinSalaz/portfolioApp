import { Component, OnInit } from '@angular/core';
import { User, Wallet } from 'src/app/interfaces/interfaces';
import { UserService } from 'src/app/services/user.service';
import { NavController } from '@ionic/angular';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { NgForm } from '@angular/forms';
import { WalletService } from 'src/app/services/wallet.service';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.page.html',
  styleUrls: ['./new-user.page.scss'],
})
export class NewUserPage implements OnInit {

  wallets: Wallet[] = [];

  selectedWallet: Wallet = null;

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
    wallet_ids: null
  };

  password_confirm: string = "";

  constructor(private userService: UserService,
              private navCtrl: NavController,
              private uiService: UiServiceService,
              private walletService: WalletService) {
                this.walletService.getWallets()
                  .subscribe( resp => {
                    console.log( resp );
                    this.wallets.push( ...resp );
                  });
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

    const valido = await this.userService.registerUser(this.registerUser);

    if ( valido ) {
      // navegar al tabs
      this.uiService.InfoAlert('Registro completo!');
      this.navCtrl.navigateRoot( '/menu', { animated: true } );
    } else {
      // mostrar alerta de usuario y contraseña no correctas
      this.uiService.InfoAlert('Usuario o correo ya existe');
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
