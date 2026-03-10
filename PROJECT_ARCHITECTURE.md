# Project Architecture Notes

This document summarizes the Redux architecture, backend API endpoints, frontend flow, and where API calls are made.

## Redux Architecture (Frontend)

**Store entry**
- `frontend/src/store/index.js` combines slices into a single Redux store.

**Slices**
- `authSlice` (`frontend/src/store/slices/authSlice.js`)
  - Handles sign up, sign in, token verification, and auth state.
  - Key thunks: `signupUser`, `signinUser`, `verifyAuth`.
  - State: `token`, `user`, `status`, `error`.

- `productsSlice` (`frontend/src/store/slices/productsSlice.js`)
  - Loads products and manages pagination metadata.
  - Key thunk: `fetchProducts`.
  - Selectors: `selectProducts`, `selectPaginatedProducts`, `selectProductsStatus`, etc.

- `cartSlice` (`frontend/src/store/slices/cartSlice.js`)
  - Manages cart items and totals.
  - Key thunks: `fetchCart`, `addItemToCart`, `updateCartQuantity`, `removeItemFromCart`, `clearCartItems`.

- `ordersSlice` (`frontend/src/store/slices/ordersSlice.js`)
  - Loads and creates orders.
  - Key thunks: `fetchOrders`, `placeOrder`.

- `profileSlice` (`frontend/src/store/slices/profileSlice.js`)
  - Manages profile data and edit state.
  - Key thunks: `fetchProfile`, `updateProfile`.
  - State: `user`, `isEditing`, `updateStatus`, `updateError`.

## Backend API Endpoints

Base: `/api/v1`

**Auth**
- `POST /auth/signup` → create account
- `POST /auth/signin` → login
- `GET /auth/verify` → verify token (auth required)

**Users**
- `GET /users/me` → get current user profile (auth required)
- `PATCH /users/me` → update profile (auth required)

**Products**
- `GET /products/getAllProducts` → list products (auth required)

**Cart**
- `GET /cart` → fetch current cart (auth required)
- `POST /cart/items` → add item to cart (auth required)
- `PATCH /cart/items/:productId` → update quantity (auth required)
- `DELETE /cart/items/:productId` → remove item (auth required)
- `DELETE /cart/clear` → clear cart (auth required)

**Orders**
- `POST /orders` → place order (auth required)
- `GET /orders` → get order list (auth required)
- `GET /orders/:orderId` → get order detail (auth required)

## Frontend Flow (Pages)

**Auth**
- `SignUpPage` → uses `signupUser` and navigates to auth-protected routes.
- `SignInPage` → uses `signinUser` and redirects to home.

**Home**
- `HomePage` → `fetchProducts` on mount.
- Filters and pagination are local state, then mapped to product cards.

**Cart**
- `CartPage` → `fetchCart`, update quantity, remove, clear.

**Orders**
- `OrdersPage` → `fetchOrders`.

**Profile**
- `ProfilePage` → `fetchProfile` on mount.
- Local edit state + validation, submit triggers `updateProfile`.
- Navbar is locked while editing.

## API Calls (Frontend)

All API calls live in `frontend/src/services/api.js`:
- `signup(payload)`
- `signin(payload)`
- `verifyAuthToken(token)`
- `getAllProducts(token)`
- `getMyCart(token)`
- `addToCart(token, payload)`
- `updateCartItem(token, productId, payload)`
- `removeCartItem(token, productId)`
- `clearMyCart(token)`
- `placeOrder(token)`
- `getMyOrders(token)`
- `getMyProfile(token)`
- `updateMyProfile(token, payload)`

## Notes
- Auth-protected routes include products, cart, orders, and profile.
- Backend auth is enforced globally for non-auth routes in `backend/src/routes/index.js`.

## Data Models (Backend)

**User** (`backend/src/models/user.model.js`)
- `firstName` (string, required, 2–60 chars)
- `lastName` (string, required, 1–60 chars)
- `email` (string, required, unique, lowercased)
- `password` (string, required, min 8, select:false)
- `role` (enum: `customer`, `admin`)
- `phone` (string, optional)
- `timestamps`, `versionKey: false`

**Product** (`backend/src/models/product.model.js`)
- `imageURL` (string, required)
- `name` (string, required, 2–180 chars)
- `category` (string, required, lowercase)
- `price` (number, required, >= 0)
- `timestamps`, `versionKey: false`

**Cart** (`backend/src/models/cart.model.js`)
- `user` (ObjectId ref `User`, unique)
- `items[]`
  - `product` (ObjectId ref `Product`)
  - `quantity` (number, min 1)
- `timestamps`, `versionKey: false`

**Order** (`backend/src/models/order.model.js`)
- `user` (ObjectId ref `User`)
- `items[]`
  - `product` (ObjectId ref `Product`)
  - `name` (string)
  - `imageURL` (string)
  - `price` (number, >= 0)
  - `quantity` (number, min 1)
- `totalAmount` (number, >= 0)
- `status` (enum: `placed`, `processing`, `shipped`, `delivered`, `cancelled`)
- `timestamps`, `versionKey: false`
