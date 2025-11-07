# Cart System Documentation

## Overview

This cart system provides a complete shopping cart functionality for the e-commerce application with persistent storage, state management, and a modern UI.

## Architecture

### Components Structure

```
Cart/
├── CartItem.tsx          # Individual cart item component
├── CartSummary.tsx       # Order summary and checkout section
├── CartEmpty.tsx         # Empty cart state component
├── index.ts              # Component exports
└── README.md             # This documentation
```

### State Management

```
hooks/
├── useCart.ts            # Core cart logic and state management
└── contexts/
    └── CartContext.tsx   # React context provider for global cart access
```

### Types

```
types/
└── cartTypes.ts          # TypeScript interfaces and types
```

## Features

### Core Functionality

- ✅ Add items to cart with different license types
- ✅ Remove items from cart
- ✅ Update item quantities
- ✅ Clear entire cart
- ✅ Persistent storage (localStorage)
- ✅ Real-time cart count in header
- ✅ Price calculations with tax (18% GST)
- ✅ Cart summary with totals

### UI Components

#### CartItem

- Product image and details
- License type badge with color coding
- Quantity controls with +/- buttons
- Remove item functionality
- Price display (individual and total)

#### CartSummary

- Subtotal calculation
- Tax calculation (18% GST)
- Discount support (for future use)
- Total price
- Checkout button
- Trust indicators (Secure, Instant, Genuine)

#### CartEmpty

- Empty state illustration
- Call-to-action buttons
- Additional navigation links

### State Management Features

#### useCart Hook

- **State**: items, summary, isLoading, error
- **Actions**: addItem, removeItem, updateQuantity, clearCart
- **Utilities**: getItemCount, getTotalPrice, isItemInCart, getItemQuantity

#### Cart Context

- Global cart state access
- Provider component for app-wide cart functionality
- Type-safe context usage

## Usage Examples

### Adding Items to Cart

```tsx
import { useCartContext } from "../contexts/CartContext";

const ProductComponent = () => {
  const { addItem } = useCartContext();

  const handleAddToCart = (
    product: Product,
    licenseType: "1year" | "3year" | "lifetime",
  ) => {
    addItem(product, licenseType, 1);
  };

  return (
    <button onClick={() => handleAddToCart(product, "1year")}>
      Add to Cart
    </button>
  );
};
```

### Displaying Cart Count

```tsx
import { useCartContext } from "../contexts/CartContext";

const Header = () => {
  const { getItemCount } = useCartContext();

  return <div>Cart ({getItemCount()})</div>;
};
```

### Cart Page Implementation

```tsx
import { useCartContext } from "../contexts/CartContext";
import { CartItem, CartSummary, CartEmpty } from "../components/Cart";

const CartPage = () => {
  const { items, summary, removeItem, updateQuantity, clearCart } =
    useCartContext();

  if (items.length === 0) {
    return <CartEmpty onContinueShopping={() => navigate("/")} />;
  }

  return (
    <div>
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />
      ))}
      <CartSummary
        summary={summary}
        onCheckout={handleCheckout}
        onContinueShopping={() => navigate("/")}
      />
    </div>
  );
};
```

## Data Structure

### CartItem Interface

```typescript
interface CartItem {
  id: string; // Unique cart item ID
  product: Product; // Product details
  licenseType: "1year" | "3year" | "lifetime";
  quantity: number; // Item quantity
  price: number; // Unit price
  totalPrice: number; // Total price (price * quantity)
}
```

### CartSummary Interface

```typescript
interface CartSummary {
  subtotal: number; // Sum of all item prices
  tax: number; // 18% GST
  discount: number; // Future discount support
  total: number; // Final total
  itemCount: number; // Total number of items
}
```

## Integration Points

### Header Integration

- Cart icon with real-time count badge
- Click to navigate to cart page
- Automatic updates when cart changes

### Product Detail Integration

- "Add to Cart" button with state awareness
- Shows "In Cart (quantity)" when item is already added
- License type selection integration

### Routing

- `/cart` route for cart page
- Protected by AuthGuard
- Integrated with React Router

## Storage

### LocalStorage Persistence

- Cart items are automatically saved to localStorage
- Cart state is restored on page reload
- Error handling for storage failures

### Storage Format

```json
{
  "items": [
    {
      "id": "cart_item_1234567890_abc123",
      "product": {
        /* Product object */
      },
      "licenseType": "1year",
      "quantity": 2,
      "price": 1000,
      "totalPrice": 2000
    }
  ],
  "summary": {
    "subtotal": 2000,
    "tax": 360,
    "discount": 0,
    "total": 2360,
    "itemCount": 2
  }
}
```

## Future Enhancements

### Planned Features

- [ ] Coupon code support
- [ ] Wishlist integration
- [ ] Save for later functionality
- [ ] Recently viewed items
- [ ] Cart abandonment recovery
- [ ] Bulk operations
- [ ] Cart sharing
- [ ] Price alerts

### Technical Improvements

- [ ] Server-side cart synchronization
- [ ] Cart analytics
- [ ] Performance optimization for large carts
- [ ] Offline support
- [ ] Cart backup/restore

## Error Handling

### Common Scenarios

- Invalid product data
- Storage quota exceeded
- Network errors (for future server sync)
- Invalid license types
- Price calculation errors

### Error Recovery

- Graceful degradation
- User-friendly error messages
- Automatic retry mechanisms
- Fallback to in-memory storage

## Testing

### Unit Tests

- Cart state management
- Price calculations
- Storage operations
- Component rendering

### Integration Tests

- Cart workflow
- Header integration
- Product detail integration
- Routing

### E2E Tests

- Complete shopping flow
- Cart persistence
- Cross-browser compatibility

## Performance Considerations

### Optimization Strategies

- Memoized calculations
- Efficient re-renders
- Lazy loading for large carts
- Debounced storage operations
- Virtual scrolling for large item lists

### Monitoring

- Cart performance metrics
- Storage usage tracking
- User interaction analytics
- Error rate monitoring
