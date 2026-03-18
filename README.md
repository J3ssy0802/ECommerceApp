# ECommerce App

A React + TypeScript ecommerce demo that uses FakeStoreAPI for catalog data, React Query for server-state fetching/caching, and Redux Toolkit for cart state management.

## Features

- Product catalog loaded from FakeStoreAPI
- Dynamic category dropdown loaded from API (not hardcoded)
- Category-based filtering with dedicated API requests
- Product cards with title, price, category, description, rating, and image
- Add-to-cart from the catalog
- Shopping cart with quantity updates and item removal
- Checkout simulation with confirmation modal and success state
- Cart persistence in `sessionStorage` (stored as an array of product objects)

## Tech Stack

- React 19
- TypeScript
- Vite 8
- React Router
- React Query (@tanstack/react-query)
- Redux Toolkit + React Redux
- Axios
- Bootstrap 5

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Then open the local URL printed in the terminal (usually `http://localhost:5173`, or another port if already in use).

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

### 5. Lint the project

```bash
npm run lint
```

## Application Flow

1. Home page requests categories and products from FakeStoreAPI.
2. Selecting a category triggers a category-specific product request.
3. Clicking Add to Cart dispatches Redux Toolkit actions.
4. Cart page allows users to:
   - review items,
   - change quantity,
   - remove items,
   - complete simulated checkout.
5. Checkout clears both Redux cart state and `sessionStorage` cart data and shows a success message.

## FakeStoreAPI Endpoints Used

- `GET https://fakestoreapi.com/products`
- `GET https://fakestoreapi.com/products/categories`
- `GET https://fakestoreapi.com/products/category/{category}`

## Notes

- Cart data persistence is session-based. Data survives page refreshes and route changes within the same browser session.
- If the API is temporarily unavailable, the UI shows loading and error feedback states.
