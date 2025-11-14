import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../../services/ui-service.service';
import { UserService } from '../../../services/user.service';
import { ExcelExportService } from '../../../services/excel-export.service';

@Component({
  selector: 'app-user-movements-report',
  templateUrl: './user-movements-report.page.html',
  styleUrls: ['./user-movements-report.page.scss'],
})
export class UserMovementsReportPage implements OnInit {

  applicationUserId: number;
  username: string;
  userFullName: string;
  initDate: string;
  endDate: string;
  loading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private uiService: UiServiceService,
    private userService: UserService,
    private excelExportService: ExcelExportService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.applicationUserId = parseInt(params.application_user_id);
      this.username = params.username;
      this.userFullName = params.user_full_name;
    });
  }

  ngOnInit() {
    // Set default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    this.endDate = today.toISOString();
    this.initDate = thirtyDaysAgo.toISOString();
  }

  async generateReport(fRegistro: NgForm) {
    if (fRegistro.invalid) {
      this.uiService.InfoAlert('Por favor complete todos los campos');
      return;
    }

    if (!this.applicationUserId) {
      this.uiService.InfoAlert('Error: No se pudo obtener el ID del usuario');
      return;
    }

    this.loading = true;

    // Format dates
    const startDate = this.initDate.split('.')[0].split('T')[0] + "T00:00:00";
    const endDate = this.endDate.split('.')[0].split('T')[0] + "T23:59:59";

    try {
      const response = await this.userService.getUserMovementsReport(
        this.applicationUserId,
        startDate,
        endDate
      );

      console.log('Reporte obtenido:', response);

      // Generate Excel
      this.excelExportService.exportUserMovementsReport(
        response,
        this.userFullName,
        startDate.split('T')[0],
        endDate.split('T')[0]
      );

      this.loading = false;
      this.uiService.InfoAlert('Reporte generado exitosamente');
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      this.loading = false;
      this.uiService.InfoAlert('Error al generar el reporte: ' + error.message);
    }
  }

}

