import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../../services/ui-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction-by-date-form',
  templateUrl: './transaction-by-date-form.page.html',
  styleUrls: ['./transaction-by-date-form.page.scss'],
})
export class TransactionByDateFormPage implements OnInit {

  date: string

  constructor(
    private uiService: UiServiceService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  async sendDate(fRegistro: NgForm) {

    if ( fRegistro.invalid ) {
      this.uiService.InfoAlert('Formulario incompleto');
      return;
    }
    this.date = this.date.split('.')[0].split('T')[0] + "T00:00:00"

    console.log(this.date);

    this.router.navigate(['/transaction-by-date'], {
      queryParams: { date : this.date }
    });
  }

  async showAll() {
    this.router.navigate(['/transaction-by-date']);
  }

  async showExpiredServices() {
    if ( this.date ) {
      //this.date = this.now
      this.date = this.date.split('.')[0].split('T')[0] + "T00:00:00"
    }
    

    this.router.navigate(['/transaction-by-date'], {
      queryParams: { date : this.date, expired_services : true }
    });
  }

}
