import { Routes } from '@angular/router';
import { authenticatedAppGuard, collectorAccountGuard, collectorHomeGuard, commonHomeGuard, commonUserGuard } from './guards/role-home.guard';
import { AboutPageComponent } from './pages/about/about.component';
import { AccountTypeChoicePageComponent } from './pages/account-type-choice/account-type-choice.component';
import { AdminAccountComponent } from './pages/admin/admin-account.component';
import { AdminCollectorsComponent } from './pages/admin/admin-collectors.component';
import { AdminCollectionPointsComponent } from './pages/admin/admin-collection-points.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AdminLoginComponent } from './pages/admin/admin-login.component';
import { AdminMaterialsComponent } from './pages/admin/admin-materials.component';
import { AdminRankingComponent } from './pages/admin/admin-ranking.component';
import { AdminSchedulesComponent } from './pages/admin/admin-schedules.component';
import { AdminShellComponent } from './pages/admin/admin-shell.component';
import { AdminTreePlantingsComponent } from './pages/admin/admin-tree-plantings.component';
import { AdminUsersComponent } from './pages/admin/admin-users.component';
import { BatteryPageComponent } from './pages/battery/battery.component';
import { CollectorHomeComponent } from './pages/collector-home/collector-home.component';
import { CollectorDropOffsComponent } from './pages/collector-drop-offs/collector-drop-offs.component';
import { CollectorLoginPageComponent } from './pages/collector-login/collector-login.component';
import { CollectorPendingComponent } from './pages/collector-pending/collector-pending.component';
import { CollectorRegisterPageComponent } from './pages/collector-register/collector-register.component';
import { CollectorRequestsComponent } from './pages/collector-requests/collector-requests.component';
import { CollectorScheduleComponent } from './pages/collector-schedule/collector-schedule.component';
import { CollectionPointDeliveryComponent } from './pages/collection-point-delivery/collection-point-delivery.component';
import { CollectionPointsComponent } from './pages/collection-points/collection-points.component';
import { CollectorsPageComponent } from './pages/collectors/collectors.component';
import { CommonUserLoginPageComponent } from './pages/common-user-login/common-user-login.component';
import { CommonUserRegisterPageComponent } from './pages/common-user-register/common-user-register.component';
import { GlassPageComponent } from './pages/glass/glass.component';
import { HomeComponent } from './pages/home/home.component';
import { HowToSeparatePageComponent } from './pages/how-to-separate/how-to-separate.component';
import { HelpContactPageComponent } from './pages/help-contact/help-contact.component';
import { InfoBannerPageComponent } from './pages/info-banner/info-banner.component';
import { ImpactDashboardComponent } from './pages/impact-dashboard/impact-dashboard.component';
import { PrivacyPageComponent } from './pages/legal/privacy-page.component';
import { TermsPageComponent } from './pages/legal/terms-page.component';
import { MetalPageComponent } from './pages/metal/metal.component';
import { MyAppointmentsPageComponent } from './pages/my-appointments/my-appointments.component';
import { MyRequestsComponent } from './pages/my-requests/my-requests.component';
import { OrganicPageComponent } from './pages/organic/organic.component';
import { PaperPageComponent } from './pages/paper/paper.component';
import { PlantATreePageComponent } from './pages/plant-a-tree/plant-a-tree.component';
import { PlantATreeRegisterComponent } from './pages/plant-a-tree-register/plant-a-tree-register.component';
import { PlasticPageComponent } from './pages/plastic/plastic.component';
import { RankingPageComponent } from './pages/ranking/ranking.component';
import { RegisterChoicePageComponent } from './pages/register-choice/register-choice.component';
import { SettingsPageComponent } from './pages/settings/settings.component';
import { ScheduleDetailComponent } from './pages/schedule-detail/schedule-detail.component';
import { ScheduleOptionsComponent } from './pages/schedule-options/schedule-options.component';
import { UserDataPageComponent } from './pages/user-data/user-data.component';
import { UserImpactComponent } from './pages/user-impact/user-impact.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'loginselectionpage', component: AccountTypeChoicePageComponent },
  { path: 'terms', component: TermsPageComponent },
  { path: 'privacy', component: PrivacyPageComponent },
  { path: 'account-typechoice', component: RegisterChoicePageComponent },
  { path: 'commonuserloginpage', component: CommonUserLoginPageComponent },
  { path: 'collectorloginpage', component: CollectorLoginPageComponent },
  { path: 'commonuser-register', component: CommonUserRegisterPageComponent },
  { path: 'collector-register', component: CollectorRegisterPageComponent },
  { path: 'collector-pending', component: CollectorPendingComponent, canActivate: [collectorAccountGuard] },
  { path: 'collector-home', component: CollectorHomeComponent, canActivate: [collectorHomeGuard] },
  { path: 'collector-drop-offs', component: CollectorDropOffsComponent, canActivate: [collectorHomeGuard] },
  { path: 'collector-requests', component: CollectorRequestsComponent, canActivate: [collectorHomeGuard] },
  { path: 'collector-schedule', component: CollectorScheduleComponent, canActivate: [collectorHomeGuard] },
  { path: 'impact', component: ImpactDashboardComponent, canActivate: [collectorHomeGuard] },
  { path: 'home', component: HomeComponent, canActivate: [commonHomeGuard] },
  { path: 'admin/login', component: AdminLoginComponent },
  {
    path: 'admin',
    component: AdminShellComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'collectors', component: AdminCollectorsComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'schedules', component: AdminSchedulesComponent },
      { path: 'ranking', component: AdminRankingComponent },
      { path: 'materials', component: AdminMaterialsComponent },
      { path: 'collection-points', component: AdminCollectionPointsComponent },
      { path: 'tree-plantings', component: AdminTreePlantingsComponent },
      { path: 'account', component: AdminAccountComponent },
    ],
  },
  { path: 'howtoseparate', component: HowToSeparatePageComponent },
  { path: 'collection-points', component: CollectionPointsComponent, canActivate: [commonUserGuard] },
  { path: 'collection-points/:pointId/delivery', component: CollectionPointDeliveryComponent, canActivate: [commonUserGuard] },
  { path: 'collectors', component: CollectorsPageComponent, canActivate: [commonUserGuard] },
  { path: 'collector', redirectTo: 'collector-home', pathMatch: 'full' },
  { path: 'plantatree', component: PlantATreePageComponent, canActivate: [commonUserGuard] },
  { path: 'plantatree/register', component: PlantATreeRegisterComponent, canActivate: [commonUserGuard] },
  { path: 'ranking', component: RankingPageComponent, canActivate: [commonUserGuard] },
  { path: 'schedule-options', component: ScheduleOptionsComponent, canActivate: [commonUserGuard] },
  { path: 'my-appointments', component: MyAppointmentsPageComponent, canActivate: [commonUserGuard] },
  { path: 'my-requests', component: MyRequestsComponent, canActivate: [commonUserGuard] },
  { path: 'user-impact', component: UserImpactComponent, canActivate: [commonUserGuard] },
  { path: 'schedules/:scheduleId', component: ScheduleDetailComponent, canActivate: [authenticatedAppGuard] },
  { path: 'help-contact', component: HelpContactPageComponent },
  { path: 'settings', component: SettingsPageComponent, canActivate: [authenticatedAppGuard] },
  { path: 'infobanner', component: InfoBannerPageComponent },
  { path: 'paper', component: PaperPageComponent },
  { path: 'plastic', component: PlasticPageComponent },
  { path: 'organic', component: OrganicPageComponent },
  { path: 'battery', component: BatteryPageComponent },
  { path: 'glass', component: GlassPageComponent },
  { path: 'metal', component: MetalPageComponent },
  { path: 'userdata', component: UserDataPageComponent, canActivate: [authenticatedAppGuard] },
  { path: 'about', component: AboutPageComponent },
  { path: '**', redirectTo: '' },
];
