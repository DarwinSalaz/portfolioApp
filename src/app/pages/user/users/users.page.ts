import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-userspage',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  title = 'SELECCIONAR USUARIO';

  users: User[] = [];

  redirectTo = '/cashcontrol';

  enableInfiniteScroll = true;

  loading: boolean = true;

  constructor(private userService: UserService, public activatedRoute: ActivatedRoute, private storage: Storage) {
    /*this.activatedRoute.params.subscribe((res) => {
      console.log(res);
      const origin = res.origin;
      this.title = origin === 'payments' ? 'SELECCIONAR CLIENTE' : 'CLIENTES';
      this.redirectTo = origin === 'payments' ? '/transaction-by-user' : '/newcustomer';
    });*/
  }

  ngOnInit() {
    this.siguientes(null);
  }

  refresh( event ) {
    this.siguientes( event );
    this.enableInfiniteScroll = true;
    this.users = [];
  }

  async siguientes( event? ) {

    this.userService.getApplicationUsers()
      .subscribe( resp => {
        //console.log( resp );
        this.users.push( ...resp );
        this.loading = false;

        if ( event ) {
          event.target.complete();

          if (resp.length === 0) {
            //event.target.disabled = true;
            //console.log( "vamos aqui" + this.enableInfiniteScroll );
            this.enableInfiniteScroll = false;
          }
        }
      });
      
  }

}
