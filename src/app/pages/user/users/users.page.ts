import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User, ItemUserCustom } from '../../../interfaces/interfaces';
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
  items: ItemUserCustom[] = [];
  redirectTo = '/cashcontrol';
  enableInfiniteScroll = true;
  loading: boolean = true;

  avatars = ['av-1.png', 'av-2.png', 'av-3.png', 'av-4.png', 'av-5.png', 'av-6.png', 'av-7.png', 'av-8.png'];

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
    this.items = [];
  }

  get_random_avatar() {
    return this.avatars[Math.floor((Math.random()*this.avatars.length))];
  }

  async siguientes( event? ) {

    this.userService.getApplicationUsers()
      .subscribe( resp => {
        //console.log( resp );
        this.users.push( ...resp );
        this.loading = false;
        this.users.forEach(u => u.icon = this.get_random_avatar());
        this.items = this.users.map(
          it => {
            var itemPr: ItemUserCustom = {
              main_text: it.name + (it.last_name != null ? ' ' + it.last_name : ''),
              second_text: it.email, 
              icon: it.icon,
              username: it.username,
              customer_id: null
            }

            return itemPr;
          }
        )

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
