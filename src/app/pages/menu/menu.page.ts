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
      name: 'Liquidación Usuarios',
      redirectTo: '/users',
      allowProfile: [1]
    },
    {
      icon: 'wallet',
      name: 'Control de caja diario',
      redirectTo: '/cashcontrol-daily',
      allowProfile: [1, 2, 3]
    },
    {
      icon: 'wallet',
      name: 'Control de caja',
      redirectTo: '/cashcontrol',
      allowProfile: [1, 2, 3]
    },
    {
      icon: 'clock',
      name: 'Cobros por Fecha',
      redirectTo: '/transaction-by-date-form',
      allowProfile: [1, 2, 3]
    },
    {
      icon: 'card',
      name: 'Nueva venta',
      redirectTo: '/transaction',
      allowProfile: [1, 2, 3]
    },
    {
      icon: 'cash',
      name: 'Registrar abono',
      redirectTo: '/customers/payments',
      allowProfile: [1, 2, 3]
    },
    {
      icon: 'grid',
      name: 'Registrar gasto',
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
      name: 'Crear cliente',
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
      icon: 'log-out',
      name: 'Cerrar sesión',
      redirectTo: '/log-out',
      allowProfile: [1, 2, 3]
    }
  ];

  userProfileId: number = null;

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
      this.userProfileId = await this.storage.get('user_profile_id');
    }
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
