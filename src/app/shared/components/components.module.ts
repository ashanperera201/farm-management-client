import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { NavigationContentComponent } from './navigation-content/navigation-content.component';
import { NavigationMenuItemComponent } from './navigation-menu-item/navigation-menu-item.component';
import { NavigationHeaderComponent } from './navigation-header/navigation-header.component';
import { CustomAlertComponent } from './custom-alert/custom-alert.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    ToolbarComponent,
    SideNavigationComponent,
    NavigationContentComponent,
    NavigationMenuItemComponent,
    NavigationHeaderComponent,
    CustomAlertComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    InlineSVGModule,
    PerfectScrollbarModule,
    NgxPermissionsModule.forChild(),
  ],
  exports: [
    ToolbarComponent,
    SideNavigationComponent,
    NavigationContentComponent,
    NavigationMenuItemComponent,
    NavigationHeaderComponent,
    CustomAlertComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ComponentsModule { }
