// ============================================================
// REDUX CONCEPT: bookingSlice.js
//
// createSlice() auto-generates:
//   - Action creators (addBooking, removeBooking, etc.)
//   - A reducer function (handles state transitions)
//
// A "slice" = one section of the global Redux state.
// This slice manages the BOOKING / CART state.
//
// Global State Shape:
// {
//   bookings: {
//     items: [
//       { id, title, tickets, price, poster, genre }
//     ],
//     totalSaved: 0    <- total amount from confirmed bookings
//   }
// }
//
// IMMER (built into Redux Toolkit):
// You can write "mutating" code like item.tickets += 1
// Redux Toolkit uses Immer under the hood to make it immutable safely.
// ============================================================

import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "bookings",       // slice name — appears in Redux DevTools
  initialState: {
    items: [],            // array of booked movies with ticket counts
    totalSaved: 0,        // running total from confirmed bookings (State Lifting alternative)
  },
  reducers: {

    // ---- ACTION 1: addBooking ----
    // Event Handling (via dispatch): User clicks "Book Now" on a MovieCard
    // If movie already in cart → increment tickets by 1
    // If new movie → add with tickets: 1
    addBooking: (state, action) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        // Immer lets us "mutate" directly — it creates a new state behind the scenes
        existing.tickets += 1;
      } else {
        // Add new movie to cart with 1 ticket
        state.items.push({ ...action.payload, tickets: 1 });
      }
    },

    // ---- ACTION 2: removeBooking ----
    // Event Handling (via dispatch): User clicks 🗑️ to remove a movie from cart
    removeBooking: (state, action) => {
      // action.payload = movie id to remove
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // ---- ACTION 3: updateTickets ----
    // Event Handling (via dispatch): User clicks [+] or [-] ticket counter buttons
    // Prevents negative values and limits max to 10
    updateTickets: (state, action) => {
      const { id, tickets } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item && tickets >= 1 && tickets <= 10) {
        item.tickets = tickets;
      }
    },

    // ---- ACTION 4: incrementTicket ----
    // Increments ticket count by 1 for a movie (used by + button in MovieCard)
    incrementTicket: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.tickets < 10) {
        item.tickets += 1;
      }
    },

    // ---- ACTION 5: decrementTicket ----
    // Decrements ticket count by 1 for a movie (used by - button in MovieCard)
    // If count reaches 0, removes the movie from cart entirely
    decrementTicket: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        if (item.tickets > 1) {
          item.tickets -= 1;
        } else {
          // Remove from cart when tickets go to 0
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
      }
    },

    // ---- ACTION 6: clearCart ----
    // Resets cart to empty and totalSaved to 0 (used after booking confirmation or logout)
    clearCart: (state) => {
      state.items = [];
      state.totalSaved = 0;
    },

    // ---- ACTION 7: setCart ----
    // Loads a specific user's cart from localStorage
    setCart: (state, action) => {
      state.items = action.payload;
    },

    // ---- ACTION 8: saveTotalAmount ----
    // State Lifting alternative: store confirmed booking total in Redux
    saveTotalAmount: (state, action) => {
      state.totalSaved += action.payload;
    },
  },
});

// Export all action creators so components can dispatch them
export const {
  addBooking,
  removeBooking,
  updateTickets,
  incrementTicket,
  decrementTicket,
  clearCart,
  setCart,
  saveTotalAmount,
} = bookingSlice.actions;

// Export the reducer to be used in store.js
export default bookingSlice.reducer;
