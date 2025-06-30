# Add to Cart Implementation Guide

## Overview

This document explains how the Add to Cart functionality is implemented in your React + Vite + Bootstrap project.

## Architecture

### 1. Cart Context (`src/contexts/cart.context.tsx`)

The cart functionality is managed globally using React Context:

**Features:**

- Global cart state management
- localStorage persistence
- Add, remove, update quantity operations
- Cart count and total calculations
- Toast notifications for user feedback

**Key Functions:**

- `addToCart(orchid, quantity)` - Adds item to cart or updates quantity
- `removeFromCart(id)` - Removes item from cart
- `updateQuantity(id, quantity)` - Updates item quantity
- `clearCart()` - Empties the cart
- `isInCart(id)` - Checks if item exists in cart

### 2. Cart Provider Setup (`src/App.jsx`)

The CartProvider wraps the entire application:

```jsx
<AuthProvider>
  <CartProvider>
    <NavBar />
    <Routes>{/* All routes */}</Routes>
  </CartProvider>
</AuthProvider>
```

### 3. Cart Integration Points

#### A. Home Page (`src/pages/Home/Home.jsx`)

- Add to Cart button on each orchid card
- Visual feedback showing if item is already in cart
- Bootstrap icons for better UX

#### B. Detail Page (`src/pages/DetailOrchid/DetailOrchid.jsx`)

- Quantity selector with +/- buttons
- Dynamic price calculation
- Add to Cart button with quantity support
- Link to view cart
- Visual status indication (already in cart vs available)

#### C. Navigation Bar (`src/components/NavBar.jsx`)

- Real-time cart count display
- Cart icon with item count badge

#### D. Cart Page (`src/pages/Cart/Cart.jsx`)

- Full cart management interface
- Remove items, update quantities
- Total price calculation
- Checkout functionality

## How to Use Add to Cart

### 1. From Product List (Home Page)

```jsx
const { addToCart, isInCart } = useCart();

// Add single item to cart
<Button
  variant={isInCart(item.id) ? "outline-success" : "success"}
  onClick={() => addToCart(item)}
  disabled={isInCart(item.id)}
>
  {isInCart(item.id) ? "Added" : "Add to Cart"}
</Button>;
```

### 2. From Product Detail Page

```jsx
const { addToCart, isInCart } = useCart();
const [quantity, setQuantity] = useState(1);

// Add multiple items to cart
const handleAddToCart = () => {
  addToCart(orchid, quantity);
};

<Button onClick={handleAddToCart}>Add {quantity} to Cart</Button>;
```

### 3. Cart State Access

```jsx
const {
  cartItems, // Array of cart items
  cartCount, // Total number of items
  cartTotal, // Total price
  addToCart, // Add item function
  removeFromCart, // Remove item function
  updateQuantity, // Update quantity function
  clearCart, // Clear cart function
  isInCart, // Check if item exists function
} = useCart();
```

## Key Features

### 1. Persistent Storage

- Cart data is automatically saved to localStorage
- Cart persists across browser sessions
- Automatic loading on app initialization

### 2. Toast Notifications

- Success messages for add/remove operations
- Uses `react-hot-toast` library
- Positioned at top-right of screen

### 3. Price Generation

Since your API doesn't include prices, the system generates consistent prices based on:

- Base price of $25
- 50% markup for natural orchids
- Deterministic variation based on orchid ID (ensures same orchid always has same price)

### 4. Responsive UI

- Bootstrap components for consistent styling
- Mobile-friendly design
- Icon-based interactions

### 5. Authentication Integration

- Cart page is protected (requires login)
- **User-specific cart storage** - Each user has their own cart stored separately
- **Cart cleared on logout** - Prevents cart data from persisting between user sessions
- **Automatic cart loading** - User's cart is automatically loaded when they log in
- Cart data is stored with user ID prefix in localStorage (`cart_userId`)

### 6. Security Features

- **Cart isolation**: Each user's cart is stored separately to prevent data leakage
- **Logout cart clearing**: Cart is automatically cleared when user logs out
- **User session protection**: Different users cannot see each other's cart items
- **Automatic cleanup**: Old cart data is removed from localStorage on logout

## Cart Security Fix - User Session Isolation

### Problem

Previously, when a user logged out, their cart items remained in localStorage. This caused a security issue where:

- The next user would see the previous user's cart items
- Cart data leaked between user sessions
- No proper user isolation for cart data

### Solution

Implemented user-specific cart storage and automatic cleanup:

1. **User-specific storage keys**: Cart data is now stored with user ID prefix (`cart_userId`)
2. **Logout cleanup**: Cart is automatically cleared when user logs out
3. **Login restoration**: User's personal cart is loaded when they log in
4. **Session isolation**: Different users cannot access each other's cart data

### Technical Implementation

```tsx
// Cart storage key includes user ID
const cartKey = user?.id ? `cart_${user.id}` : "cart";

// Clear cart on logout
useEffect(() => {
  if (!isAuthenticated) {
    setCartItems([]);
    Object.keys(localStorage)
      .filter((key) => key.startsWith("cart"))
      .forEach((key) => localStorage.removeItem(key));
  }
}, [isAuthenticated]);
```

### Testing the Fix

1. **Login as User A** and add items to cart
2. **Logout** - cart should be cleared
3. **Login as User B** - should see empty cart, not User A's items
4. **Login back as User A** - should see their original cart items restored

## Testing the Implementation

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Test scenarios:**
   - Add items from home page
   - Add items with custom quantity from detail page
   - Navigate to cart and modify items
   - Check cart count in navbar
   - Test cart persistence (refresh page)
   - Test authentication protection

## File Structure

```
src/
├── contexts/
│   ├── cart.context.tsx     # Global cart state management
│   └── auth.context.tsx     # Authentication state
├── pages/
│   ├── Home/Home.jsx        # Product list with add to cart
│   ├── DetailOrchid/        # Product detail with quantity selector
│   └── Cart/Cart.jsx        # Cart management page
├── components/
│   └── NavBar.jsx           # Cart count display
└── App.jsx                  # Provider setup
```

## Dependencies

- `react-hot-toast` - Toast notifications
- `react-bootstrap` - UI components
- `bootstrap-icons` - Icons
- `react-router-dom` - Navigation

The implementation provides a complete, production-ready cart system with modern UX patterns and persistent storage.
