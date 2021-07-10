import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import(`./auth/auth.module`).then(m => m.AuthModule) },
  { path: 'dashboard', canActivate: [], loadChildren: () => import(`./dashboard/dashboard.module`).then(m => m.DashboardModule) },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
