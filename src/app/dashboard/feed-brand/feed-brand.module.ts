import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedBrandComponent } from './feed-brand.component';
import { FeedBrandListComponent } from './feed-brand-list/feed-brand-list.component';
import { FeedBrandCardComponent } from './feed-brand-card/feed-brand-card.component';
import { FeedBrandAddComponent } from './feed-brand-add/feed-brand-add.component';
import { FeedBrandRoutingModule } from './feed-brand.routing';

@NgModule({
  declarations: [
    FeedBrandComponent,
    FeedBrandListComponent,
    FeedBrandCardComponent,
    FeedBrandAddComponent
  ],
  imports: [
    CommonModule,
    FeedBrandRoutingModule
  ]
})
export class FeedBrandModule { }
