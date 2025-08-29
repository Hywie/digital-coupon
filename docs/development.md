# Development Documentation

## Project Structure

```
digital-coupons/
├── infrastructure/           # Infrastructure configuration
│   └── docker/              # Docker-related files
│       ├── Dockerfile       # Multi-stage build configuration
│       └── docker-compose.yml
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx        # Home page
│   │   ├── layout.tsx      # Root layout
│   │   ├── coupons/        # Coupons list page
│   │   └── scan/           # Coupon scanning page
│   ├── components/         # Reusable components
│   │   ├── Navigation.tsx
│   │   └── camera/
│   │       └── Camera.tsx
│   └── lib/               # Shared libraries
│       └── db/           # Database configuration
│           ├── connection.ts
│           └── models/
│               └── Coupon.ts
├── docs/                  # Project documentation
│   └── features/         # Feature specifications
└── public/              # Static assets
```

## Setup Instructions

### Development Environment

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Environment

1. Start the application with MongoDB:
   ```bash
   cd infrastructure/docker
   docker compose up --build
   ```

The application will be available at http://localhost:3000

## Database Schema

### Coupon Collection

- `imageUrl`: String (required) - URL to the stored coupon image
- `barcode`: String (required, unique) - Scanned barcode value
- `value`: String (required) - Coupon value/description
- `expiryDate`: Date (required) - Coupon expiration date
- `status`: String (enum: ['active', 'used', 'expired']) - Current coupon status
- `createdAt`: Date - Timestamp of creation
- `updatedAt`: Date - Timestamp of last update

## Features

### Camera Integration

The camera integration uses the Web Camera API to capture coupon images. Key features:

- Environment-facing camera preference
- Image preview before saving
- File upload fallback
- Mobile-responsive design

### Database Integration

MongoDB is used for data persistence with the following features:

- Mongoose ODM for type-safe database operations
- Connection pooling and caching
- Schema validation using Zod
- Automatic timestamps for auditing
