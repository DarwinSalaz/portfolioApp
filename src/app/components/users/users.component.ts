import { Component, OnInit, Input } from '@angular/core';
import { ItemUserCustom } from '../../interfaces/interfaces';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  @Input() items: ItemUserCustom[] = [];
  @Input() redirectTo = '';
  allItems: ItemUserCustom[] = [];

  constructor() { }

  ngOnInit() {
    this.allItems = this.items;
    console.log(this.items);
  }

  getItems(event?) {
    const serVal = event.target.value;
    console.log(`este es el texto: ${serVal}`);
    if ( serVal && serVal.trim() !== '' ) {

      this.items = this.allItems.filter((item) => {
        return (item.main_text.toLowerCase().indexOf(serVal.toLowerCase()) > -1);
      });

      console.log(this.items);
    } else {
      this.items = this.allItems;
    }
  }

}
