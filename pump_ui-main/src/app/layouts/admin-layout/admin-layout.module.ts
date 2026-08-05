import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomPdfViewerComponent } from 'app/user-profile/custom-pdf-viewer/custom-pdf-viewer.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UserProfileComponent } from 'app/user-profile/user-profile.component';
import { AtmTransactionPdfExcelComponent } from 'app/modules/atm-transaction/atm-transaction-pdf-excel/atm-transaction-pdf-excel.component';
import { DieselSellPdfExcelComponent } from 'app/modules/icons/diesel-sell-pdf-excel/diesel-sell-pdf-excel.component';
import { DipStockComponent } from 'app/modules/dip-stock/dip-stock.component';
import { DipTableComponent } from 'app/modules/dip-stock/dip-table/dip-table.component';
import { IconsComponent } from 'app/modules/icons/icons.component';
import { JamaBakiComponent } from 'app/modules/jama-baki/jama-baki.component';
import { KharchSellPdfExcelComponent } from 'app/modules/kharch/kharch-sell-pdf-excel/kharch-sell-pdf-excel.component';
import { KharchComponent } from 'app/modules/kharch/kharch.component';
import { MapsComponent } from 'app/modules/maps/maps.component';
import { NotificationsComponent } from 'app/modules/notifications/notifications.component';
import { OilSellPdfExcelComponent } from 'app/modules/maps/oil-sell-pdf-excel/oil-sell-pdf-excel.component';
import { PetrolSellPdfExcelComponent } from 'app/modules/typography/petrol-sell-pdf-excel/petrol-sell-pdf-excel.component';
import { TypographyComponent } from 'app/modules/typography/typography.component';
import { UpgradeComponent } from 'app/modules/upgrade/upgrade.component';
import { PuchasePdfExcelComponent } from 'app/modules/table-list/puchase-pdf-excel/puchase-pdf-excel.component';
import { TableListComponent } from 'app/modules/table-list/table-list.component';
import { AddUserComponent } from 'app/modules/add-user/add-user.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CustomTableComponent } from 'app/modules/custom-table/custom-table.component';
import { MatDatepicker, matDatepickerAnimations, MatDatepickerModule } from '@angular/material/datepicker';
import { LoaderPreviewComponent } from 'app/modules/loader-preview/loader-preview.component';
import { DayClosingComponent } from 'app/modules/day-closing/day-closing.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
    PdfViewerModule,
    NgxPaginationModule,
    MatStepperModule,
    MatCardModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
  ],
  declarations: [
    // DashboardComponent,
    // UserProfileComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    DipStockComponent,
    CustomPdfViewerComponent,
    KharchComponent,
    JamaBakiComponent,
    DipTableComponent,
    PuchasePdfExcelComponent,
    PetrolSellPdfExcelComponent,
    DieselSellPdfExcelComponent,
    OilSellPdfExcelComponent,
    KharchSellPdfExcelComponent,
    AtmTransactionPdfExcelComponent,
    CustomTableComponent,
    LoaderPreviewComponent,
    DayClosingComponent
  ]
})

export class AdminLayoutModule { }
