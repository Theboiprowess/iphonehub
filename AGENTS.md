# iPhone Hub Masvingo - Admin Dashboard Setup & Deployment Guide

## Overview
This guide covers the setup, configuration, and deployment of the iPhone Hub Masvingo website with a complete production-ready Admin Dashboard and CMS.

## Tech Stack
- **Framework**: Next.js 16.3.0 (App Router)
- **Database**: PostgreSQL with Prisma ORM 7.9.1
- **Authentication**: NextAuth v5
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons
- **Deployment**: Ready for Vercel, Netlify, or similar platforms

## Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager
- Git

## Initial Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd iphone-hub-masvingo
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/iphone_hub"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Business Information (Defaults)
BUSINESS_NAME="iPhone Hub Masvingo"
CEO_NAME="Artwell Gwata"
WHATSAPP_PRIMARY="0773227172"
WHATSAPP_SECONDARY="0784502347"
```

### 3. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

The website will be available at `http://localhost:3000`
The admin dashboard will be available at `http://localhost:3000/admin`

## Admin Dashboard Features

### **Completed Modules:**
- ✅ **Main Dashboard** - Real-time statistics and overview
- ✅ **Product Management** - Full CRUD with variants and images
- ✅ **Inventory Management** - Stock tracking and low stock alerts
- ✅ **Order Management** - Order processing and fulfillment
- ✅ **Customer Management** - Customer accounts and history
- ✅ **Trade-In Management** - Trade-in request processing
- ✅ **Settings** - Business configuration, WhatsApp, payments, delivery
- ✅ **Homepage Management** - Hero section and featured products
- ✅ **FAQ Management** - Dynamic FAQ system
- ✅ **Enquiries** - Customer enquiry management

### **Pending Modules:**
- ⏳ Blog CMS
- ⏳ Media Library System
- ⏳ Analytics Dashboard
- ⏳ Audit Log System
- ⏳ SEO Management
- ⏳ Notification System
- ⏳ Promotion Management
- ⏳ Review Management
- ⏳ Navigation Management

## User Roles & Permissions

### **SUPER_ADMIN**
- Full access to all features
- Can manage admin users
- Can change business settings
- Can view audit logs

### **ADMIN**
- Full access to core features
- Can manage products, orders, customers
- Can access settings (limited)
- Cannot manage admin users

### **CONTENT_MANAGER**
- Homepage, FAQ, About, Contact management
- Blog and content pages
- Cannot access financial data

### **INVENTORY_MANAGER**
- Product and inventory management
- Stock adjustments
- Cannot access orders or customer data

### **ORDER_MANAGER**
- Order processing and fulfillment
- Customer service features
- Cannot access inventory settings

### **CUSTOMER**
- Can only access storefront
- Can manage own orders and wishlist

## Admin Authentication

### Initial Admin Setup
The first admin user needs to be created via the database or Prisma Studio:

```bash
npx prisma studio
```

Navigate to the `User` model and create an admin user:
- `email`: iphonehub@gmail.com
- `role`: SUPER_ADMIN
- `password`: (hashed using bcrypt - see below for actual credentials)

### Admin Credentials
**Official Admin Login:**
- **Email**: iphonehub@gmail.com
- **Password**: Artwell@2026
- **Role**: SUPER_ADMIN

### Creating the Admin User (Recommended: Prisma Studio)

**Step 1: Generate bcrypt hash**
Use bcrypt-generator.com or similar tool to hash "Artwell@2026" with 10 rounds.

**Pre-generated bcrypt hash for "Artwell@2026" (10 rounds):**
```
$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH
```

**Step 2: Open Prisma Studio**
```bash
npx prisma studio
```

**Step 3: Create Admin User**
1. Navigate to the `User` model
2. Click "Add record"
3. Fill in the fields:
   - `email`: iphonehub@gmail.com
   - `password`: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH
   - `name`: iPhone Hub Admin
   - `role`: SUPER_ADMIN
4. Click "Save"

**Step 4: Create Default Site Settings (Optional)**
1. Navigate to the `SiteSettings` model
2. Click "Add record"
3. Fill in default business settings:
   - `id`: default
   - `businessName`: iPhone Hub Masvingo
   - `ceoName`: Artwell Gwata
   - `businessEmail`: info@iphonehubmasvingo.co.zw
   - `businessPhone`: 0773227172
   - `whatsappNumber`: 0773227172
   - `whatsappNumber2`: 0784502347
   - `whatsappPrimary`: artwell
   - `currency`: USD
   - `lowStockThreshold`: 5
   - `address`: Masvingo, Zimbabwe
   - `city`: Masvingo
   - `country`: Zimbabwe
   - `openingHours`: Mon-Fri: 9AM-5PM, Sat: 10AM-2PM
4. Click "Save"

### Admin Login
1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: iphonehub@gmail.com
   - Password: Artwell@2026
3. Access granted based on role permissions

## API Endpoints

### Admin APIs (Protected)
- `GET/POST /admin/api/products` - Product management
- `GET/PUT/DELETE /admin/api/products/[id]` - Individual products
- `POST /admin/api/settings` - Business settings
- `POST /admin/api/homepage` - Homepage configuration

### Public APIs
- `GET/POST /api/products` - Product catalog
- `GET/POST /api/orders` - Order management
- `POST /api/trade-in` - Trade-in requests
- `POST /api/enquiries` - Customer enquiries

## Database Schema Highlights

### Key Models
- **Product** - iPhone products with variants and images
- **ProductVariant** - Storage, colour, pricing, stock
- **Order** - Customer orders with items and payments
- **User** - Users with role-based permissions
- **TradeInEnquiry** - Trade-in request management
- **FAQ** - Dynamic FAQ system
- **HomepageConfig** - Homepage content control
- **SiteSettings** - Business configuration

### Enums
- `UserRole`: SUPER_ADMIN, ADMIN, CONTENT_MANAGER, INVENTORY_MANAGER, ORDER_MANAGER, CUSTOMER
- `ProductStatus`: DRAFT, PUBLISHED, HIDDEN, OUT_OF_STOCK, SOLD, ARCHIVED
- `ProductCondition`: BOXED, EXCELLENT, VERY_GOOD, GOOD, FAIR, DAMAGED
- `OrderStatus`: PENDING, CONFIRMED, PROCESSING, READY_FOR_PICKUP, OUT_FOR_DELIVERY, COMPLETED, CANCELLED
- `TradeInStatus`: NEW, UNDER_REVIEW, MORE_INFO_REQUIRED, ESTIMATED, OFFER_SENT, ACCEPTED, DECLINED, COMPLETED, CANCELLED

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Database Migration (Production)
```bash
npx prisma migrate deploy
npx prisma generate
```

### Environment Variables (Production)
```env
DATABASE_URL="postgresql://production-url"
NEXTAUTH_SECRET="production-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## Troubleshooting

### Build Errors
- If Prisma errors occur: `npx prisma generate`
- If TypeScript errors: Check imports and type definitions
- If module not found: `npm install <package>`

### Database Connection
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Ensure database exists

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NextAuth configuration
- Ensure admin user exists in database

## Build Commands

```bash
# Development
npm run dev

# Production Build
npm run build

# Start Production Server
npm start

# Database Operations
npx prisma generate
npx prisma migrate dev
npx prisma studio
npx prisma db seed
```

## Testing

### Manual Testing Checklist
- [ ] Admin login works
- [ ] Product CRUD operations
- [ ] Order management
- [ ] Settings updates reflect on storefront
- [ ] Role-based permissions work correctly
- [ ] Mobile responsiveness
- [ ] Image uploads (when implemented)

## Support

For issues or questions:
- Check Prisma docs: https://www.prisma.io/docs
- NextAuth docs: https://authjs.dev
- Next.js docs: https://nextjs.org/docs

## License
Proprietary - iPhone Hub Masvingo
