import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  menuGroups: MenuGroup[] = [];
  expandedGroups: Set<string> = new Set();
  
  appVersion: string = environment.version;

  allMenuGroups: MenuGroup[] = [
    {
      id: 'usuarios',
      name: 'Usuarios',
      icon: 'people',
      allowProfile: [1],
      items: [
        {
          icon: 'list',
          name: 'Listar Usuarios',
          redirectTo: '/users',
          allowProfile: [1]
        },
        {
          icon: 'person-add',
          name: 'Crear Usuario',
          redirectTo: '/new-user',
          allowProfile: [1]
        }
      ]
    },
    {
      id: 'control-caja',
      name: 'Control de Caja',
      icon: 'wallet',
      allowProfile: [1, 2, 3],
      items: [
        {
          icon: 'calendar',
          name: 'Control Diario',
          redirectTo: '/cashcontrol-daily',
          allowProfile: [1, 2, 3]
        },
        {
          icon: 'analytics',
          name: 'Control de Caja',
          redirectTo: '/cashcontrol',
          allowProfile: [1, 2, 3]
        },
        {
          icon: 'time',
          name: 'Cobros Por Fecha',
          redirectTo: '/transaction-by-date-form',
          allowProfile: [1, 3]
        }
      ]
    },
    {
      id: 'transacciones',
      name: 'Ventas Y Abonos',
      icon: 'card',
      allowProfile: [1, 2, 3],
      items: [
        {
          icon: 'add-circle',
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
          icon: 'cloud-upload',
          name: 'Cargue Masivo',
          redirectTo: '/bulk-upload',
          allowProfile: [1, 2, 3]
        }
      ]
    },
    {
      id: 'finanzas',
      name: 'Finanzas',
      icon: 'trending-up',
      allowProfile: [1, 2, 3],
      items: [
        {
          icon: 'remove-circle',
          name: 'Registrar Gasto',
          redirectTo: '/new-expense',
          allowProfile: [1, 2, 3]
        },
        {
          icon: 'list',
          name: 'Listar Gastos',
          redirectTo: '/list-expenses',
          allowProfile: [1, 2, 3]
        },
        {
          icon: 'cloud-upload',
          name: 'Cargue Masivo Gastos',
          redirectTo: '/bulk-expense-upload',
          allowProfile: [1]
        },
        {
          icon: 'add-circle',
          name: 'Registrar Ingreso',
          redirectTo: '/new-revenue',
          allowProfile: [1]
        },
        {
          icon: 'list',
          name: 'Listar Ingresos',
          redirectTo: '/list-revenues',
          allowProfile: [1]
        },
        {
          icon: 'cloud-upload',
          name: 'Cargue Masivo Ingresos',
          redirectTo: '/bulk-revenue-upload',
          allowProfile: [1]
        }
      ]
    },
    {
      id: 'clientes',
      name: 'Clientes',
      icon: 'people',
      allowProfile: [1, 2, 3],
      items: [
        {
          icon: 'list',
          name: 'Listar Clientes',
          redirectTo: '/customers/detail',
          allowProfile: [1, 2, 3]
        },
        {
          icon: 'person-add',
          name: 'Crear Cliente',
          redirectTo: '/newcustomer',
          allowProfile: [1, 2, 3]
        }
      ]
    },
    {
      id: 'inventario',
      name: 'Inventario',
      icon: 'cube',
      allowProfile: [1, 2, 3],
      items: [
        {
          icon: 'list-box',
          name: 'Gestión de Productos',
          redirectTo: '/list-wallets',
          allowProfile: [1, 2, 3]
        },
        {
          icon: 'swap',
          name: 'Gestión de Inventario',
          redirectTo: '/inventory-management',
          allowProfile: [1, 2, 3]
        }
      ]
    },
    {
      id: 'reportes',
      name: 'Reportes',
      icon: 'document',
      allowProfile: [1],
      items: [
        {
          icon: 'analytics',
          name: 'Informe de Carteras',
          redirectTo: '/portfolio-report',
          allowProfile: [1]
        }
      ]
    },
    {
      id: 'sesion',
      name: 'Sesión',
      icon: 'settings',
      allowProfile: [1, 2, 3],
      items: [
        {
          icon: 'log-out',
          name: 'Cerrar Sesión',
          redirectTo: '/log-out',
          allowProfile: [1, 2, 3]
        }
      ]
    }
  ];

  userProfileId: number = null;
  username: string = null;
  userProfile: string = null;

  constructor(public activatedRoute: ActivatedRoute, private storage: Storage, public router: Router ) {
    this.activatedRoute.queryParams.subscribe((res) => {
      this.start(parseInt(res.user_profile_id));
      console.log(res);
    });
  }

  ngOnInit() {
  }

  async start(userProfileId: number) {
    const token = await this.storage.get('token');

    if (!token) {
      this.router.navigate(['/login'], {});
    }

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

    // Filtrar grupos y elementos según el perfil del usuario
    this.menuGroups = this.allMenuGroups
      .filter(group => group.allowProfile.includes(this.userProfileId))
      .map(group => ({
        ...group,
        items: group.items.filter(item => item.allowProfile.includes(this.userProfileId))
      }))
      .filter(group => group.items.length > 0); // Solo mostrar grupos que tengan elementos visibles
  }

  toggleGroup(groupId: string) {
    if (this.expandedGroups.has(groupId)) {
      this.expandedGroups.delete(groupId);
    } else {
      this.expandedGroups.add(groupId);
    }
  }

  isGroupExpanded(groupId: string): boolean {
    return this.expandedGroups.has(groupId);
  }

  navigateTo(redirectTo: string) {
    this.router.navigate([redirectTo]);
  }

}

interface MenuItem {
  icon: string;
  name: string;
  redirectTo: string;
  allowProfile: number[];
}

interface MenuGroup {
  id: string;
  name: string;
  icon: string;
  allowProfile: number[];
  items: MenuItem[];
}
