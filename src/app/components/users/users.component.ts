import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../interfaces/interfaces';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  @Input() users: User[] = [];
  @Input() redirectTo = '';
  allUsers: User[] = [];

  constructor() { }

  ngOnInit() {
    this.allUsers = this.users;
    console.log(this.users);
  }

  getUsers(event?) {
    const serVal = event.target.value;
    if ( serVal && serVal.trim() !== '' ) {

      this.users = this.allUsers.filter((user) => {
        return (user.name.toLowerCase().indexOf(serVal.toLowerCase()) > -1) ||
                (user.last_name.toLowerCase().indexOf(serVal.toLowerCase()) > -1);
      });

      console.log(this.users);
    } else {
      this.users = this.allUsers;
    }
  }

}
