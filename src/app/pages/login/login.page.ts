import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { UiServiceService } from '../../services/ui-service.service';
import { User } from '../../interfaces/interfaces';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('slideMain', null) slides: IonSlides;

  token: string = null;

  public loading: boolean = false;

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

  loginUser = {
    username: '',
    password: ''
  };

  registerUser: User = {
    company_id: 1,
    username: '',
    name: '',
    email: '',
    password: '',
    user_profile_id: 2,
    wallet_ids: null,
    active: false
  };

  constructor(private userService: UserService,
              private navCtrl: NavController,
              private uiService: UiServiceService,
              private storage: Storage,
              public router: Router) {

                this.init();
              }

  async init() {
    const token = await this.storage.get('token');

    if (token) {
      const userProfileId = await this.storage.get('user_profile_id');
      this.router.navigate(['/menu'], {
        queryParams: { user_profile_id: userProfileId }
      });
      this.loading = false;
      this.loginUser.username = '';
      this.loginUser.password = '';
    }
  }

  ngOnInit() {
    this.slides.lockSwipes( true );
  }

  async login( fLogin: NgForm ) {

    if ( fLogin.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    this.loading = true;

    this.userService.login(this.loginUser.username, this.loginUser.password )
      .subscribe( resp => {
        console.log(resp);

        if ( resp['ok'] === true ) {
          this.saveToken( resp['token'] );
          this.saveUserProfileId( resp['user_profile_id'] );
          this.saveWalletIds( resp['wallet_ids'] )
          this.saveUsername( this.loginUser.username )
          this.router.navigate(['/menu'], {
            queryParams: { user_profile_id: resp['user_profile_id'] }
          });
          this.loading = false;
          this.loginUser.username = '';
          this.loginUser.password = '';
        } else {
          this.token = null;
          this.storage.clear();
          this.loading = false;
          this.uiService.InfoAlert('Usuario o contraseña no son correctos.')
        }

        this.clearStoragePeriodically();

      }, error => {
        
        this.uiService.InfoAlert('Error: ' + JSON.stringify(error))
      });

    /*if ( valido ) {
      //navegar al tabs
      this.navCtrl.navigateRoot( '/menu', { animated: true } );
    } else {
      this.uiService.InfoAlert('Usuario o contraseña no son correctos.')
    }*/
    console.log( this.loginUser );

  }

  async registro( fRegistro: NgForm ) {

    // Esta parte es temporal
    this.uiService.InfoAlert('Bloqueado temporalmente');
    return;

    /*if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }

    const valido = await this.userService.register(this.registerUser);

    if ( valido ) {
      // navegar al tabs
      this.uiService.InfoAlert('Registro completo!');
      this.navCtrl.navigateRoot( '/menu', { animated: true } );
    } else {
      // mostrar alerta de usuario y contraseña no correctas
      this.uiService.InfoAlert('Usuario o correo ya existe');
    }*/
  }

  selectAvatar( avatar ) {
    this.avatars.forEach( av => av.seleccionado = false );

    avatar.seleccionado = true;
  }

  showRegister() {
    this.slides.lockSwipes( false );
    this.slides.slideTo(0);
    this.slides.lockSwipes( true );
  }

  showLogin() {
    this.slides.lockSwipes( false );
    this.slides.slideTo(1);
    this.slides.lockSwipes( true );
  }

  async saveToken( token: string ) {
    this.token = token;
    await this.storage.set('token', token);
  }

  async saveUserProfileId( userProfileId: string ) {
    await this.storage.set('user_profile_id', userProfileId);
  }

  async saveWalletIds( walletIds: number[] ) {
    console.log( 'guardamos estas carteras: ' + walletIds );
    await this.storage.set('wallet_ids', walletIds);
  }

  async saveUsername( username: string ) {
    await this.storage.set('username', username);
  }

  clearStoragePeriodically() {
    setInterval(() => {
      // Limpia el almacenamiento aquí
      this.storage.clear().then(() => {
        console.log('Almacenamiento borrado.');
      }).catch((error) => {
        console.error('Error al borrar el almacenamiento:', error);
      });
    }, 86400 * 1000); // 86400 segundos = 24 horas
  }
}
