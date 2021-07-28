import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../application-state';
import { applicationReducer } from './application.reducer';
import { clubMemberReducer } from './club-member.reducer';
import { dailyFeedReducer } from './daily-feed.reducer';
import { farmManagmentReducer } from './farm-management.reducer';
import { salesPriceReducer } from './sales-price.reducer';
import { stockReducer } from './stock.reducer';
import { UserReducer } from './user.reducer';
import { weeklySamplingReducer } from './weekly-samplig.reducer';

export const reducers: ActionReducerMap<AppState> = {
  loggedInData: UserReducer,
  stockManagement: stockReducer,
  weeklySampling: weeklySamplingReducer,
  weeklyApplication: weeklySamplingReducer,
  salesPrice: salesPriceReducer,
  application: applicationReducer,
  clubMember: clubMemberReducer,
  dailyFeed: dailyFeedReducer,
  farmManagement: farmManagmentReducer

}
