import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent,
        children: [
            { path: 'home', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'club-member', loadChildren: () => import(`./club-member/club-member.module`).then(m => m.ClubMemberModule) },
            { path: 'farm-management', loadChildren: () => import(`./farm-management/farm-management.module`).then(m => m.FarmManagementModule) },
            { path: 'user-management', loadChildren: () => import(`./user-management/user-management.module`).then(m => m.UserManagementModule) },
            { path: 'pond-management', loadChildren: () => import(`./pond-management/pond-management.module`).then(m => m.PondManagementModule) },
            { path: 'feed-brand', loadChildren: () => import(`./feed-brand/feed-brand.module`).then(m => m.FeedBrandModule) },
            { path: '**', redirectTo: 'home' }
        ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
