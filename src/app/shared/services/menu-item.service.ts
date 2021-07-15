import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {

  constructor() { }

  getMenuItems = () => {
    return [
      {
        id: 1,
        displayName: 'Dashboard',
        route: '/dashboard/home',
        svgIconPath: './assets/media/svg/icons/Design/Layers.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 2,
        displayName: 'MANAGEMENT LEVEL SECTION',
        route: '',
        svgIconPath: '',
        classes: 'menu-section',
        activeClass: '',
        selected: false,
        isMenuHeading: true,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 3,
        displayName: 'Club Management',
        route: '/dashboard/club-member/view-all',
        svgIconPath: './assets/media/svg/icons/Tools/Angle Grinder.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 3,
        displayName: 'Farm Management',
        route: '/dashboard/farm-management/view-farms',
        svgIconPath: './assets/media/svg/icons/Tools/Pantone.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 4,
        displayName: 'Pond Management',
        route: '/dashboard/pond-management/view-all',
        svgIconPath: './assets/media/svg/icons/General/Thunder-move.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 5,
        displayName: 'Application Management',
        route: '/dashboard/applications/view-all',
        svgIconPath: './assets/media/svg/icons/General/Expand-arrows.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 6,
        displayName: 'Feedbrands Management',
        route: '/dashboard/feed-brand/view-all',
        svgIconPath: './assets/media/svg/icons/Layout/Layout-arrange.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 7,
        displayName: 'User Management',
        route: '#',
        svgIconPath: './assets/media/svg/icons/General/User.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: [
          {
            id: 1,
            displayName: 'User List',
            route: '/dashboard/user-management/view-users',
            svgIconPath: './assets/media/svg/icons/General/User.svg',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          },
          {
            id: 2,
            displayName: 'Role Permission',
            route: '/dashboard/user-management/view-roles',
            svgIconPath: './assets/media/svg/icons/General/User.svg',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          }
        ]
      }
    ]
  }
}