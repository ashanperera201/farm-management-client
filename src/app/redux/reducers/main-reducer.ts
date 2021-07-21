import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../application-state';
import { UserReducer } from './user.reducer';
import { stockReducer } from './stock.reducer';
import { weeklySamplingReducer } from './weekly-samplig.reducer';

export const reducers: ActionReducerMap<AppState> = {
    loggedInData: UserReducer,
    stockManagement: stockReducer,
    weeklySampling: weeklySamplingReducer
}


