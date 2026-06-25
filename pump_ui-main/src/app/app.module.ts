import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatTableModule } from '@angular/material/table';
import { NgChartsModule } from 'ng2-charts';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AboutUsComponent } from './modules/about-us/about-us.component';
import { AddUserComponent } from './modules/add-user/add-user.component';
import { AtmTransactionComponent } from './modules/atm-transaction/atm-transaction.component';
import { BackPageComponent } from './modules/back-page/back-page.component';
import { CustomerComponent } from './modules/jama-baki/customer/customer.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { DieselSellReportComponent } from './modules/icons/diesel-sell-report/diesel-sell-report.component';
import { DipStockReportComponent } from './modules/dip-stock/dip-stock-report/dip-stock-report.component';
import { EditDieselSellComponent } from './modules/icons/edit-diesel-sell/edit-diesel-sell.component';
import { EditPetrolsellComponent } from './modules/typography/edit-petrolsell/edit-petrolsell.component';
import { EditjamabakiComponent } from './modules/jama-baki/editjamabaki/editjamabaki.component';
import { EmployeeDetailsComponent } from './modules/employee-details/employee-details.component';
import { EmployeeComponent } from './modules/employee/employee.component';
import { ItReturnComponent } from './modules/it-return/it-return.component';
import { JamaBakiReportComponent } from './modules/jama-baki/jama-baki-report/jama-baki-report.component';
import { KharchReportComponent } from './modules/kharch/kharch-report/kharch-report.component';
import { MapComponent } from './modules/map/map.component';
import { MonthlyJamaBakiTotalComponent } from './modules/monthly-jama-baki-total/monthly-jama-baki-total.component';
import { OilReportComponent } from './modules/maps/oil-report/oil-report.component';
import { PetrolSellReportComponent } from './modules/typography/petrol-sell-report/petrol-sell-report.component';
import { PumpDetailComponent } from './modules/pump-detail/pump-detail.component';
import { TransactionReportComponent } from './modules/atm-transaction/transaction-report/transaction-report.component';
import { UserMasterComponent } from './modules/user-master/user-master.component';
import { CompanyMasterComponent } from './modules/company-master/company-master.component';
import { DatabaseManagementComponent } from './modules/database-management/database-management.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { MyHeaderInterceptor } from './services/my-header.interceptor';
import { UserServiceService } from './services/user-service.service';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ChangePasswordDialogComponent } from './login/change-password-dialog/change-password-dialog.component';
import { AccountLockedDialogComponent } from './login/account-locked-dialog/account-locked-dialog.component';
import { EditPurchaseComponent } from './modules/table-list/edit-purchase/edit-purchase.component';
import { PurchaseReportComponent } from './modules/table-list/purchase-report/purchase-report.component';
import { MainPanelComponent } from './modules/main-panel/main-panel.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ExpensesListComponent } from './modules/kharch/expenses-list/expenses-list.component';
import { ExpensesExcelComponent } from './user-profile/expenses-excel/expenses-excel.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { XpPetrolListComponent } from './modules/xp-petrol-list/xp-petrol-list.component';
import { XpPetrolPdfExcelComponent } from './modules/xp-petrol-list/xp-petrol-pdf-excel/xp-petrol-pdf-excel.component';
import { EditXpPetrolComponent } from './modules/xp-petrol-list/edit-xp-petrol/edit-xp-petrol.component';
import { AddXpPetrolComponent } from './modules/xp-petrol-list/add-xp-petrol/add-xp-petrol.component';
import { PowerDiesellistComponent } from './modules/power-diesellist/power-diesellist.component';
import { AddpowerDieselComponent } from './modules/power-diesellist/addpower-diesel/addpower-diesel.component';
import { EditpowerDieselComponent } from './modules/power-diesellist/editpower-diesel/editpower-diesel.component';
import { PowerDieselPdfExcelComponent } from './modules/power-diesellist/power-diesel-pdf-excel/power-diesel-pdf-excel.component';
import { ExtraDipComponent } from './modules/extra-dip/extra-dip.component';
import { ExtraDipAddEditComponent } from './modules/extra-dip/extra-dip-add-edit/extra-dip-add-edit.component';
import { ExtraDipTableComponent } from './modules/extra-dip/extra-dip-table/extra-dip-table.component';
import { ExtraPurchaseListComponent } from './modules/extra-purchase-list/extra-purchase-list.component';
import { EditExtraPurchaseComponent } from './modules/extra-purchase-list/edit-extra-purchase/edit-extra-purchase.component';
import { ExtraPurchasePdfExcelComponent } from './modules/extra-purchase-list/extra-purchase-pdf-excel/extra-purchase-pdf-excel.component';
import { AddExtraPurchaseComponent } from './modules/extra-purchase-list/add-extra-purchase/add-extra-purchase.component';
import { AddPetrolStockComponent } from './modules/add-petrol-stock/add-petrol-stock.component';
import { AddDieselStockComponent } from './modules/add-diesel-stock/add-diesel-stock.component';
import { AddPowerDieselStockComponent } from './modules/add-power-diesel-stock/add-power-diesel-stock.component';
import { AddXpPetrolStockComponent } from './modules/add-xp-petrol-stock/add-xp-petrol-stock.component';
import { AddGattComponent } from './modules/add-gatt/add-gatt.component';
import { AddDieselgattComponent } from './modules/add-dieselgatt/add-dieselgatt.component';
import { AddPowerDieselgattComponent } from './modules/add-power-dieselgatt/add-power-dieselgatt.component';
import { AddXpPetrolgattComponent } from './modules/add-xp-petrolgatt/add-xp-petrolgatt.component';
import { OilListComponent } from './modules/maps/oil-list/oil-list.component';
import { JamabakiPdfExcelComponent } from './modules/jama-baki/jamabaki-pdf-excel/jamabaki-pdf-excel.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CustomerListComponent } from './modules/customer-list/customer-list.component';
import { CustomerExcelPdfComponent } from './modules/customer-list/customer-excel-pdf/customer-excel-pdf.component';
import { BillingComponent } from './modules/billing/billing.component';
import { BillComponent } from './modules/billing/dailog/bill/bill.component';
import { OillBillComponent } from './modules/billing/dailog/oill-bill/oill-bill.component';
import { CommonService } from './services/common.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BakiDetailsComponent } from './user-profile/baki-details/baki-details.component';
import { AddloclDetailsComponent } from './modules/addlocl-details/addlocl-details.component';
import { CreditTypeComponent } from './modules/addlocl-details/credit-type/credit-type.component';
import { PumpTotalBakiDetailsComponent } from './user-profile/pump-total-baki-details/pump-total-baki-details.component';
import { LoclDetailsComponent } from './user-profile/locl-details/locl-details.component';
import { OilPurchaseTableComponent } from './modules/oil-purchase-table/oil-purchase-table.component';
import { OilpurchaseComponent } from './modules/oil-purchase-table/oilpurchase/oilpurchase.component';
import { OilPuchasePdfExcelComponent } from './modules/oil-purchase-table/oil-puchase-pdf-excel/oil-puchase-pdf-excel.component';
import { FuelTankComponent } from './modules/dashboard/components/fuel-tank/fuel-tank.component';
import { NozzleCardComponent } from './modules/dashboard/components/nozzle-card/nozzle-card.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatInputModule,
    PdfViewerModule,
    NgxPaginationModule,
    MatButtonModule,
    NgxSpinnerModule,
    MatTableModule,
    MatStepperModule,
    NgChartsModule,
    MatStepperModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxGaugeModule,
    CanvasJSAngularChartsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatSnackBarModule,
    MatCheckboxModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ChangePasswordDialogComponent,
    AccountLockedDialogComponent,
    AdminLayoutComponent,
    // SingUPComponent,
    PurchaseReportComponent,
    PetrolSellReportComponent,
    DieselSellReportComponent,
    OilReportComponent,
    MapComponent,
    // DipStockComponent,
    DipStockReportComponent,
    AboutUsComponent,
    JamaBakiReportComponent,
    KharchReportComponent,
    CustomerComponent,
    TransactionReportComponent,
    MonthlyJamaBakiTotalComponent,
    EditDieselSellComponent,
    EditPetrolsellComponent,
    EditPurchaseComponent,
    EmployeeComponent,
    EmployeeDetailsComponent,
    PumpDetailComponent,
    AtmTransactionComponent,
    EditjamabakiComponent,
    BackPageComponent,
    UserMasterComponent,
    CompanyMasterComponent,
    DatabaseManagementComponent,
    SettingsComponent,
    ItReturnComponent,
    AddUserComponent,
    MainPanelComponent,
    ExpensesListComponent,
    ExpensesExcelComponent,
    XpPetrolListComponent,
    XpPetrolPdfExcelComponent,
    EditXpPetrolComponent,
    AddXpPetrolComponent,
    PowerDiesellistComponent,
    AddpowerDieselComponent,
    EditpowerDieselComponent,
    PowerDieselPdfExcelComponent,
    ExtraDipComponent,
    ExtraDipAddEditComponent,
    ExtraDipTableComponent,
    ExtraPurchaseListComponent,
    EditExtraPurchaseComponent,
    ExtraPurchasePdfExcelComponent,
    AddExtraPurchaseComponent,
    AddPetrolStockComponent,
    AddDieselStockComponent,
    AddPowerDieselStockComponent,
    AddXpPetrolStockComponent,
    AddGattComponent,
    AddDieselgattComponent,
    AddPowerDieselgattComponent,
    AddXpPetrolgattComponent,
    OilListComponent,
    JamabakiPdfExcelComponent,
    CustomerListComponent,
    CustomerExcelPdfComponent,
    BillingComponent,
    BillComponent,
    OillBillComponent,
    BakiDetailsComponent,
    AddloclDetailsComponent,
    CreditTypeComponent,
    PumpTotalBakiDetailsComponent,
    LoclDetailsComponent,
    OilpurchaseComponent,
    OilPurchaseTableComponent,
    OilPuchasePdfExcelComponent,
    FuelTankComponent,
    NozzleCardComponent
    // KharchComponent,
    // JamaBakiComponent,
    // CustomPdfViewerComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHeaderInterceptor,
      multi: true
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        autoFocus: true,
        restoreFocus: true,
        maxWidth: '96vw',
        width: 'min(96vw, 1040px)',
        maxHeight: '92vh',
        panelClass: 'mat-dialog-custom-panel'
      }
    },
    UserServiceService,
    CommonService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
