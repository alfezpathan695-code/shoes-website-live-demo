# Mela Marketplace

A responsive, multi-category Indian shopping marketplace frontend with 122 sample products and distinct item photos across women's, men's, girls', boys', kids', shoes, home, beauty, accessories, electronics and kitchen categories.

## Project Structure

```
shoes-website/
├── frontend/        - React marketplace storefront
├── backend/         - Express MVC API with MongoDB
└── README.md
```

## Setup Instructions

### Run the storefront
```bash
cd frontend
npm install
npm start
```

### Run the API
```bash
cd backend
npm install
npm run seed
npm start
```

Use Node.js 22.7 or newer. Before starting the API, copy `backend/.env.example` to `backend/.env`, set a private `JWT_SECRET` (at least 32 characters), and point `MONGODB_URI` to a running MongoDB instance or Atlas database. Run `npm run seed` again after changing the sample catalog.

## Storefront features
- Browse products by category, search, and sort by price or rating.
- Explore 122 sample items split across 11 product categories.
- Open product details before adding to the bag; apparel and footwear require a size selection.
- Keep separate bag items for different sizes, adjust quantities, remove items, and see the subtotal.
- Save products to a wishlist and keep the bag between visits.
- Use the footer category links and responsive layouts on mobile and desktop.

The storefront loads its catalog from the API when available and keeps the bundled sample catalog as a visible fallback. Account registration/sign-in and order placement use the API. Payment processing is not configured, so new orders are saved with payment marked as pending.

## Backend MVC API

The Express API is organized into `models`, `controllers`, `routes`, and `middleware`. It provides product listing/details and admin-only product management, account registration/login with hashed passwords and JWTs, and authenticated order creation/history. New users are customers; admin access must be granted out-of-band by the database owner. Orders recalculate prices from MongoDB and remain unpaid until a payment provider is integrated.

Run backend tests with `npm test`. Set `REACT_APP_API_URL` in the frontend environment to override the default API URL (`http://localhost:5000/api`).

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js / Express / MongoDB
- **Persistence**: Browser local storage for the shopping bag

---

**Status**: Marketplace storefront prototype
