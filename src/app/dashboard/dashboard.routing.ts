import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent,
        children: [
            { path: 'club-member', loadChildren: () => import(`./club-member/club-member.module`).then(m => m.ClubMemberModule) }
        ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
