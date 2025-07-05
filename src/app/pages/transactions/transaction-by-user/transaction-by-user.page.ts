import { Component, OnInit } from '@angular/core';
import { ServicesByCustomerResponse } from '../../../interfaces/interfaces';
import { TransactionService } from '../../../services/transaction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavServiceService } from '../../../services/nav-service.service';
import { ModalController } from '@ionic/angular';
import { ServiceActionsModalComponent } from '../../../components/service-actions-modal/service-actions-modal.component';

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
              public navService: NavServiceService,
              private modalCtrl: ModalController) {
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
    this.loading = true;
    this.transactionService.getServicesByCustomer(this.customerId.toString())
      .subscribe(resp => {
        this.services = resp;
        console.log('Servicios cargados:', resp);
        this.applyFilter(); // Aplicar filtro después de cargar los datos
        this.loading = false;
      }, error => {
        console.error('Error cargando servicios:', error);
        this.loading = false;
      });
  }

  async click(service: ServicesByCustomerResponse) {
    console.log('Click en servicio:', service.service_id);
    
    const modal = await this.modalCtrl.create({
      component: ServiceActionsModalComponent,
      componentProps: {
        service: service
      }
    });
    
    await modal.present();

    // Escuchar cuando se cierra el modal para refrescar la lista
    const { data } = await modal.onWillDismiss();
    if (data && data.refresh) {
      console.log('Refrescando lista después de acción del modal');
      this.getServicesByCustomer();
    }
  }

  applyFilter() {
    if (this.selectedFilter === 'all') {
      this.filteredServices = this.services;
    } else if (this.selectedFilter === 'in_progress') {
      this.filteredServices = this.services.filter(service => service.state !== 'fully_paid');
    } else if (this.selectedFilter === 'fully_paid') {
      this.filteredServices = this.services.filter(service => service.state === 'fully_paid');
    }
    console.log('Filtro aplicado:', this.selectedFilter, 'Servicios filtrados:', this.filteredServices.length);
  }

  onFilterChange(event: CustomEvent) {
    this.selectedFilter = event.detail.value;
    this.applyFilter();
  }

}
