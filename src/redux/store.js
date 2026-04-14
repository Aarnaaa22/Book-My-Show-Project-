// ============================================================
// REDUX CONCEPT: store.js
// The Redux Store is the SINGLE SOURCE OF TRUTH for the entire app.
// All global state lives here. No more prop drilling!
//
// configureStore() from Redux Toolkit:
//   - Combines all "slices" (reducers) into one root reducer
//   - Automatically sets up Redux DevTools (open browser extension to inspect!)
//   - Adds middleware like redux-thunk for async actions
//
// Think of the store as a big JavaScript object:
// {
//   bookings: {
//     items: [],       <- our cart items
//     totalSaved: 0    <- total confirmed amount
//   }
// }
// ============================================================

import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./bookingSlice";

// Redux store: central state management
// Named export { store } — App.js imports it as: import { store } from './redux/store'
export const store = configureStore({
  reducer: {
    // "bookings" is the key to access this slice in useSelector
    // e.g., state.bookings.items
    bookings: bookingReducer,
  },
});

// Also export as default for flexibility
export default store;
