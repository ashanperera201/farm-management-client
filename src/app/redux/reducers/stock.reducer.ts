import { StockActions } from '../action-types';

const initialState = {
    stockDetails: [],
}

export function stockReducer(state = initialState, action: any): any {
    switch (action.type) {
        case StockActions.SET_STOCK_DETAILS:
            debugger
            return {
                ...state,
                stockDetails: action.payload,
            }

        case StockActions.ADD_STOCK:
            return {
                ...state,
                stockDetails: [...state.stockDetails, action.payload]
            }

        case StockActions.UPDATE_STOCK:
            return {
                ...state,
                stockDetails: state.stockDetails.map((sd: any) => sd._id === action.payload._id ?
                    {
                        ...sd,
                        owner: sd.owner,
                        farmer: sd.farmer,
                        pond: sd.pond,
                        plCount: sd.plCount,
                        plAge: sd.plAge,
                        dateOfStocking: sd.dateOfStocking,
                        fullStocked: sd.fullStocked,
                        plPrice: sd.plPrice,
                        actualPlRemains: sd.actualPlRemains,
                    } : sd)
            }
        case StockActions.STOCK_BULK_REMOVE:
            action.payload.forEach((id: any) => {
                const index: number = state.stockDetails.findIndex((sd: any) => sd.stockingUniqueId === id);
                state.stockDetails.splice(index, 1)
            });
            return {
                ...state,
                user: [...state.stockDetails]
            }
        default:
            return {
                ...state
            }
    }
}