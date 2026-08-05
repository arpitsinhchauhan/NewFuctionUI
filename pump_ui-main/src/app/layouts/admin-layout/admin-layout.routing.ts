import { Routes } from '@angular/router';
import { AuthGuard } from 'app/authGuard';
import { LoginComponent } from 'app/login/login.component';
import { AboutUsComponent } from 'app/modules/about-us/about-us.component';
import { AtmTransactionComponent } from 'app/modules/atm-transaction/atm-transaction.component';
import { BillingComponent } from 'app/modules/billing/billing.component';
import { CustomerListComponent } from 'app/modules/customer-list/customer-list.component';
import { DashboardComponent } from 'app/modules/dashboard/dashboard.component';
import { DipStockReportComponent } from 'app/modules/dip-stock/dip-stock-report/dip-stock-report.component';
import { DipStockComponent } from 'app/modules/dip-stock/dip-stock.component';
import { ExtraDipComponent } from 'app/modules/extra-dip/extra-dip.component';
import { ExtraPurchaseListComponent } from 'app/modules/extra-purchase-list/extra-purchase-list.component';
import { IconsComponent } from 'app/modules/icons/icons.component';
import { JamaBakiComponent } from 'app/modules/jama-baki/jama-baki.component';
import { KharchComponent } from 'app/modules/kharch/kharch.component';
import { MainPanelComponent } from 'app/modules/main-panel/main-panel.component';
import { MapsComponent } from 'app/modules/maps/maps.component';
import { NotificationsComponent } from 'app/modules/notifications/notifications.component';
import { OilPurchaseTableComponent } from 'app/modules/oil-purchase-table/oil-purchase-table.component';
import { PowerDiesellistComponent } from 'app/modules/power-diesellist/power-diesellist.component';
import { TableListComponent } from 'app/modules/table-list/table-list.component';
import { TypographyComponent } from 'app/modules/typography/typography.component';
import { UpgradeComponent } from 'app/modules/upgrade/upgrade.component';
import { UserMasterComponent } from 'app/modules/user-master/user-master.component';
import { CompanyMasterComponent } from 'app/modules/company-master/company-master.component';
import { DatabaseManagementComponent } from 'app/modules/database-management/database-management.component';
import { SettingsComponent } from 'app/modules/settings/settings.component';
import { XpPetrolListComponent } from 'app/modules/xp-petrol-list/xp-petrol-list.component';
import { UserProfileComponent } from 'app/user-profile/user-profile.component';
import { LoaderPreviewComponent } from 'app/modules/loader-preview/loader-preview.component';
import { DayClosingComponent } from 'app/modules/day-closing/day-closing.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'manager/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'employee/daily-report', component: MainPanelComponent, canActivate: [AuthGuard] },
    { path: 'User', component: UserMasterComponent, canActivate: [AuthGuard] },
    { path: 'company-master', component: CompanyMasterComponent, canActivate: [AuthGuard] },
    { path: 'database-management', component: DatabaseManagementComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'Report', component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'bill', component: BillingComponent, canActivate: [AuthGuard] },
    { path: 'purchasedetails', component: TableListComponent, canActivate: [AuthGuard] },
    { path: 'oilPurchasedetails', component: OilPurchaseTableComponent, canActivate: [AuthGuard] },
    { path: 'extraPurchasedetails', component: ExtraPurchaseListComponent, canActivate: [AuthGuard] },
    { path: 'petroldetails', component: TypographyComponent, canActivate: [AuthGuard] },
    { path: 'dieseldetails', component: IconsComponent, canActivate: [AuthGuard] },
    { path: 'XPpetrol', component: XpPetrolListComponent, canActivate: [AuthGuard] },
    { path: 'powerDiesel', component: PowerDiesellistComponent, canActivate: [AuthGuard] },
    { path: 'oilsell', component: MapsComponent, canActivate: [AuthGuard] },
    { path: 'Dipp', component: DipStockComponent, canActivate: [AuthGuard] },
    { path: 'extraDipp', component: ExtraDipComponent, canActivate: [AuthGuard] },
    { path: 'Kharch', component: KharchComponent, canActivate: [AuthGuard] },
    { path: 'atm', component: AtmTransactionComponent, canActivate: [AuthGuard] },
    { path: 'Jama&Baki', component: JamaBakiComponent, canActivate: [AuthGuard] },
    { path: 'DipTable', component: DipStockReportComponent, canActivate: [AuthGuard] },
    { path: 'image', component: NotificationsComponent, canActivate: [AuthGuard] },
    { path: 'feedback', component: UpgradeComponent, canActivate: [AuthGuard] },
    { path: 'aboutus', component: AboutUsComponent, canActivate: [AuthGuard] },
    { path: 'dailyReport', component: MainPanelComponent, canActivate: [AuthGuard] },
    { path: 'customer', component: CustomerListComponent, canActivate: [AuthGuard] },
    { path: 'loader-preview', component: LoaderPreviewComponent, canActivate: [AuthGuard] },
    { path: 'day-closing', component: DayClosingComponent, canActivate: [AuthGuard] },
];    // { path: 'map', component: MapComponent , canActivate: [AuthGuard]},
// {
//   path: '',
//   children: [ {
//     path: 'dashboard',
//     component: DashboardComponent
// }]}, {
// path: '',
// children: [ {
//   path: 'userprofile',
//   component: UserProfileComponent
// }]
// }, {
//   path: '',
//   children: [ {
//     path: 'icons',
//     component: IconsComponent
//     }]
// }, {
//     path: '',
//     children: [ {
//         path: 'notifications',
//         component: NotificationsComponent
//     }]
// }, {
//     path: '',
//     children: [ {
//         path: 'maps',
//         component: MapsComponent
//     }]
// }, {
//     path: '',
//     children: [ {
//         path: 'typography',
//         component: TypographyComponent
//     }]
// }, {
//     path: '',
//     children: [ {
//         path: 'upgrade',
//         component: UpgradeComponent
//     }]
// }
// , canActivate: [AuthGuard]