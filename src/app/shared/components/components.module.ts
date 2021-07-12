import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { NavigationContentComponent } from './navigation-content/navigation-content.component';
import { NavigationMenuItemComponent } from './navigation-menu-item/navigation-menu-item.component';
import { NavigationHeaderComponent } from './navigation-header/navigation-header.component';


@NgModule({
  declarations: [
    ToolbarComponent,
    SideNavigationComponent,
    NavigationContentComponent,
    NavigationMenuItemComponent,
    NavigationHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    InlineSVGModule,
    
  ],
  exports: [
    ToolbarComponent,
    SideNavigationComponent,
    NavigationContentComponent,
    NavigationMenuItemComponent,
    NavigationHeaderComponent
  ]
})
export class ComponentsModule { }
