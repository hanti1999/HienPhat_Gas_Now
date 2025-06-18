import { createSlice } from '@reduxjs/toolkit';
import { CartType } from '@/types/type';

const initialState: CartType = {
  cartItems: [],
  totalAmount: 0,
  totalDiscount: 0,
  totalQuantity: 0,
};

const recalculateTotals = (state: CartType) => {
  state.totalAmount = state.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  state.totalDiscount = state.cartItems.reduce(
    (total, item) => total + (item.oldPrice - item.price) * item.quantity,
    0
  );
  state.totalQuantity = state.cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
};

export const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );

      if (!existingItem) {
        state.cartItems.push({
          ...newItem,
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        existingItem.quantity++;
      }
      recalculateTotals(state);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);
      recalculateTotals(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.totalDiscount = 0;
    },
    increaseQuantity: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity++;
      }
      recalculateTotals(state);
    },
    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
        }
      }
      recalculateTotals(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} = CartSlice.actions;
export default CartSlice.reducer;
