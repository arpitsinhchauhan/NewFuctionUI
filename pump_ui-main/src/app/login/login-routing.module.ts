import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: 'login', component: LoginComponent},
  // { path: 'dashboard', component: DashboardComponent},
  // { path: 'user-profile', component: UserProfileComponent},
  // { path: 'purchaseDetails', component: TableListComponent },
  // { path: 'typography', component: TypographyComponent },
  // { path: 'icons', component: IconsComponent },
  // { path: 'maps', component: MapsComponent},
  // { path: 'notifications', component: NotificationsComponent },
  // { path: 'upgrade', component: UpgradeComponent},
  // { path: 'Bil', component: UpgradeComponent },
  // { path: 'map', component: MapComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
