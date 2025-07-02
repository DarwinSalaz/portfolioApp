import { Component, OnInit } from '@angular/core';
import { ServicesByCustomerResponse } from '../../../interfaces/interfaces';
import { TransactionService } from '../../../services/transaction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavServiceService } from '../../../services/nav-service.service';

@Component({
  selector: 'app-transaction-by-user',
  templateUrl: './transaction-by-user.page.html',
  styleUrls: ['./transaction-by-user.page.scss'],
})
export class TransactionByUserPage implements OnInit {

  services: ServicesByCustomerResponse[] = [];

  customerId: number;

  loading: boolean = true;

  selectedFilter: 'all' | 'in_progress' | 'fully_paid' = 'all';
  filteredServices: ServicesByCustomerResponse[] = [];

  constructor(private transactionService: TransactionService,
              public activatedRoute: ActivatedRoute,
              public router: Router,
              public navService: NavServiceService) {
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res);
      this.customerId = res.customer_id;
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getServicesByCustomer();
  }

  getServicesByCustomer() {
    this.transactionService.getServicesByCustomer(this.customerId.toString())
      .subscribe(resp => {
        this.services = resp
        console.log( resp );
        //this.services.push( ...resp);
        this.loading = false;
      });
  }

  click(service: ServicesByCustomerResponse) {
    this.navService.myParam = service;
    this.router.navigate(['/register-payment'], {
      queryParams: { service_id: service.service_id }
    });
  }

  applyFilter() {
    if (this.selectedFilter === 'all') {
      this.filteredServices = this.services;
    } else if (this.selectedFilter === 'in_progress') {
      this.filteredServices = this.services.filter(service => service.state !== 'fully_paid');
    } else if (this.selectedFilter === 'fully_paid') {
      this.filteredServices = this.services.filter(service => service.state === 'fully_paid');
    }
  }

  onFilterChange(event: CustomEvent) {
    this.selectedFilter = event.detail.value;
    this.applyFilter();
  }

}
