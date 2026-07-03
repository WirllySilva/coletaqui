import { Routes } from '@angular/router';
import { collectorHomeGuard, commonHomeGuard } from './guards/role-home.guard';
import { AboutPageComponent } from './pages/about/about.component';
import { AccountTypeChoicePageComponent } from './pages/account-type-choice/account-type-choice.component';
import { BatteryPageComponent } from './pages/battery/battery.component';
import { CollectorHomeComponent } from './pages/collector-home/collector-home.component';
import { CollectorLoginPageComponent } from './pages/collector-login/collector-login.component';
import { CollectorRegisterPageComponent } from './pages/collector-register/collector-register.component';
import { CollectorRequestsComponent } from './pages/collector-requests/collector-requests.component';
import { CollectorScheduleComponent } from './pages/collector-schedule/collector-schedule.component';
import { CollectorsPageComponent } from './pages/collectors/collectors.component';
import { CommonUserLoginPageComponent } from './pages/common-user-login/common-user-login.component';
import { CommonUserRegisterPageComponent } from './pages/common-user-register/common-user-register.component';
import { GlassPageComponent } from './pages/glass/glass.component';
import { HomeComponent } from './pages/home/home.component';
import { HowToSeparatePageComponent } from './pages/how-to-separate/how-to-separate.component';
import { HelpContactPageComponent } from './pages/help-contact/help-contact.component';
import { InfoBannerPageComponent } from './pages/info-banner/info-banner.component';
import { MetalPageComponent } from './pages/metal/metal.component';
import { MyAppointmentsPageComponent } from './pages/my-appointments/my-appointments.component';
import { OrganicPageComponent } from './pages/organic/organic.component';
import { PaperPageComponent } from './pages/paper/paper.component';
import { PlantATreePageComponent } from './pages/plant-a-tree/plant-a-tree.component';
import { PlasticPageComponent } from './pages/plastic/plastic.component';
import { RankingPageComponent } from './pages/ranking/ranking.component';
import { RegisterChoicePageComponent } from './pages/register-choice/register-choice.component';
import { SettingsPageComponent } from './pages/settings/settings.component';
import { UserDataPageComponent } from './pages/user-data/user-data.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';

export const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'loginselectionpage', component: AccountTypeChoicePageComponent },
  { path: 'account-typechoice', component: RegisterChoicePageComponent },
  { path: 'commonuserloginpage', component: CommonUserLoginPageComponent },
  { path: 'collectorloginpage', component: CollectorLoginPageComponent },
  { path: 'commonuser-register', component: CommonUserRegisterPageComponent },
  { path: 'collector-register', component: CollectorRegisterPageComponent },
  { path: 'collector-home', component: CollectorHomeComponent, canActivate: [collectorHomeGuard] },
  { path: 'collector-requests', component: CollectorRequestsComponent, canActivate: [collectorHomeGuard] },
  { path: 'collector-schedule', component: CollectorScheduleComponent, canActivate: [collectorHomeGuard] },
  { path: 'home', component: HomeComponent, canActivate: [commonHomeGuard] },
  { path: 'howtoseparate', component: HowToSeparatePageComponent },
  { path: 'collectors', component: CollectorsPageComponent },
  { path: 'collector', redirectTo: 'collector-home', pathMatch: 'full' },
  { path: 'plantatree', component: PlantATreePageComponent },
  { path: 'ranking', component: RankingPageComponent },
  { path: 'my-appointments', component: MyAppointmentsPageComponent },
  { path: 'help-contact', component: HelpContactPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: 'infobanner', component: InfoBannerPageComponent },
  { path: 'paper', component: PaperPageComponent },
  { path: 'plastic', component: PlasticPageComponent },
  { path: 'organic', component: OrganicPageComponent },
  { path: 'battery', component: BatteryPageComponent },
  { path: 'glass', component: GlassPageComponent },
  { path: 'metal', component: MetalPageComponent },
  { path: 'userdata', component: UserDataPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: '**', redirectTo: '' },
];
