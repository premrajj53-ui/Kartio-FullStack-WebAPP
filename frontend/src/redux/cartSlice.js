import { createSlice } from '@reduxjs/toolkit';

// 1. Check if there is already a saved cart in Local Storage when the app loads
const savedCart = localStorage.getItem('kartioCart');
const initialState = {
    // If a saved cart exists, parse it from a string back into an array. Otherwise, start empty.
    cartItems: savedCart ? JSON.parse(savedCart) : [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload; 
            const existingItem = state.cartItems.find((item) => item.productId === newItem.productId);

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.cartItems.push(newItem);
            }
            
            // 2. Save the updated cart array to Local Storage
            localStorage.setItem('kartioCart', JSON.stringify(state.cartItems));
        },
        
        removeFromCart: (state, action) => {
            const idToRemove = action.payload;
            const index = state.cartItems.findIndex((item) => item.productId === idToRemove);

            if (index !== -1) {
                state.cartItems.splice(index, 1);
                
                // 2. Save the updated cart array to Local Storage
                localStorage.setItem('kartioCart', JSON.stringify(state.cartItems));
            }
        },
        
        clearCart: (state) => {
            state.cartItems = [];
            // 2. Wipe the cart from Local Storage too
            localStorage.removeItem('kartioCart');
        },
    },    
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;