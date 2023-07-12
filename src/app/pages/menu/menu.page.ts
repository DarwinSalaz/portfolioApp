import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  componentes: Componente[] = [];

  allComponentes: Componente[] = [
    {
      icon: 'cash',
      name: 'Usuarios',
      redirectTo: '/users',
      allowProfile: [1]
    },
    {
      icon: 'wallet',
      name: 'Control Diario',
      redirectTo: '/cashcontrol-daily',
      allowProfile: [1, 2, 3]
    },
    {
      icon: 'wallet',
      name: 'Control De Caja',
      redirectTo: '/cashcontrol',
      allowProfile: [1, 2, 3]
    },
    {
      icon: 'clock',
      name: 'Cobros Por Fecha',
      redirectTo: '/transaction-by-date-form',
      allowProfile: [1, 3]
    },
    /*{
      icon: 'card',
      name: 'Nueva Venta',
      redirectTo: '/transaction',
      allowProfile: [1, 2, 3]
    },*/
    {
      icon: 'card',
      name: 'Registrar Venta',
      redirectTo: '/customers/new-service',
      allowProfile: [1, 2, 3]
    },
    {
      icon: 'cash',
      name: 'Registrar Abono',
      redirectTo: '/customers/payments',
      allowProfile: [1, 3]
    },
    {
      icon: 'grid',
      name: 'Registrar Gasto',
      redirectTo: '/new-expense',
      allowProfile: [1, 2, 3]
    },
    {
      icon: 'people',
      name: 'Clientes',
      redirectTo: '/customers/detail',
      allowProfile: [1, 2, 3]
    },
    {
      icon: 'person-add',
      name: 'Crear Cliente',
      redirectTo: '/newcustomer',
      allowProfile: [1, 2, 3]
    },
    {
      icon: 'person-add',
      name: 'Crear Usuario',
      redirectTo: '/new-user',
      allowProfile: [1]
    },
    {
      icon: 'list-box',
      name: 'Inventario',
      redirectTo: '/list-wallets',
      allowProfile: [1, 2, 3]
    },
    {
      icon: 'list-box',
      name: 'Informe De Carteras',
      redirectTo: '/portfolio-report',
      allowProfile: [1]
    },
    {
      icon: 'log-out',
      name: 'Cerrar Sesión',
      redirectTo: '/log-out',
      allowProfile: [1, 2, 3]
    }
  ];

  userProfileId: number = null;
  username: string = null;
  userProfile: string = null;

  constructor(public activatedRoute: ActivatedRoute, private storage: Storage ) {


    this.activatedRoute.queryParams.subscribe((res) => {
      this.start(parseInt(res.user_profile_id));
      console.log(res);
    });
  }

  ngOnInit() {
  }

  async start(userProfileId: number) {
    //const userProfileId = await this.storage.get('user_profile_id');
    if(userProfileId) { 
      this.userProfileId = userProfileId;
    } else {
      this.storage.get('user_profile_id').then((val) => {
        this.userProfileId = val;
      })
    }
    this.storage.get('username').then((val) => {
      this.username = val.toUpperCase();
    })
    console.log("aquiiiii pai " + this.username)

    switch(this.userProfileId) {
      case 1: this.userProfile = "ADMINISTRADOR"; break;
      case 2: this.userProfile = "VENDEDOR"; break;
      case 3: this.userProfile = "COBRADOR"; break;
      default: this.userProfile = "UNDEFINED";
    }
    console.log("aquiiiii pai " + this.userProfileId)
    console.log("aquiiiii pai " + this.userProfile)

    this.componentes = this.allComponentes.filter((component) => {
      
      var result = component.allowProfile.includes(this.userProfileId);
      console.log("estee es el profilee " + this.userProfileId + " permitidoosss " + component.allowProfile + " resultado: " + result);
      return result;
    });
  }

}

interface Componente {
  icon: string;
  name: string;
  redirectTo: string;
  allowProfile: number[];
}
