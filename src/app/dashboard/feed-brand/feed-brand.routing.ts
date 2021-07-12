import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FeedBrandComponent } from './feed-brand.component';
import { FeedBrandListComponent } from './feed-brand-list/feed-brand-list.component';

const routes: Routes = [
    {
        path: '', component: FeedBrandComponent,
        children: [
            { path: '', redirectTo: 'view-all', pathMatch: 'full' },
            { path: 'view-all', component: FeedBrandListComponent },
            { path: '**', redirectTo: 'view-all' },
        ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class FeedBrandRoutingModule { }
