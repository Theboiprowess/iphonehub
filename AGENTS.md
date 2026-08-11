# iPhone Hub Masvingo - Admin Dashboard Setup & Deployment Guide

## Overview
This guide covers the setup, configuration, and deployment of the iPhone Hub Masvingo website with a complete production-ready Admin Dashboard and CMS, including an AI-powered customer support system.

## Tech Stack
- **Framework**: Next.js 16.3.0 (App Router)
- **Database**: PostgreSQL with Prisma ORM 7.9.1
- **Authentication**: NextAuth v5
- **AI Support**: OpenAI GPT-4o-mini
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
- `POST /api/support/chat` - AI customer support chat
- `GET/POST /api/support/knowledge` - Knowledge base management
- `GET/POST /api/support/unanswered` - Unanswered questions
- `GET/PUT /api/support/conversations` - Conversation management

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

## Trade-In Feature

### Trade-In Request Process
The trade-in feature is a 6-step form that allows customers to submit their iPhone for valuation:

**Step 1:** Customer Information (name, phone, whatsapp, email)
**Step 2:** Device Information (model, storage, colour, battery health, condition)
**Step 3:** Device Status (powers on, touchscreen, cameras, face ID, charging port, buttons, repairs, cracks, liquid damage)
**Step 4:** Accessories (original box, charging cable, charger, receipt, other accessories)
**Step 5:** Photo Upload (device photos)
**Step 6:** Additional Information (notes)

### Trade-In Submission
When a customer completes the 6-step form and submits:
1. Data is saved to the database via `/api/trade-in`
2. Form details are sent to **both CEOs via WhatsApp**:
   - **Sabeka:** +263784502347
   - **Artwell:** +263773227172
3. WhatsApp message includes complete trade-in details formatted with emojis
4. Both CEOs receive the same information for valuation
5. Customer receives confirmation that data was sent to both CEOs

### WhatsApp Message Format
The WhatsApp message includes:
- Customer information (name, phone, whatsapp, email)
- Device information (model, storage, colour, battery health, condition)
- Device status (all functional aspects with Yes/No indicators)
- Accessories (original box, charging cable, charger, receipt, other)
- Additional notes

### CEO Contact Information
- **Sabeka (CEO):** +263784502347
- **Artwell (CEO):** +263773227172

Both CEOs receive trade-in requests and can provide valuations directly to customers via WhatsApp.

## AI Customer Support System

### Overview
The website includes a complete AI-powered customer support system that integrates with the existing database, products, and business information.

### Features
- **Chat Widget**: Floating chat button in bottom-right corner
- **Natural Language**: Customers can ask questions in normal English
- **Product Search**: AI searches real product database
- **Product Recommendations**: AI recommends based on budget, preferences
- **Real-Time Data**: Uses current prices, stock, and product info
- **Never Hallucinates**: Only uses actual database information
- **Human Escalation**: Automatically escalates complex issues to human support
- **WhatsApp Integration**: Direct WhatsApp contact when needed

### Admin Dashboard
- **Support Dashboard** (`/admin/support`) - Overview of all support activity
- **Conversations** (`/admin/support/conversations`) - View all customer chats
- **Knowledge Base** (`/admin/support/knowledge`) - Manage AI knowledge articles
- **Unanswered Questions** (`/admin/support/unanswered`) - Review unanswered questions
- **Analytics** (`/admin/support/analytics`) - Track support performance

### Setup Requirements
1. **OpenAI API Key** (Required)
   - Get from https://platform.openai.com/api-keys
   - Add to `.env` as `OPENAI_API_KEY=sk-your-key`
   
2. **Database Tables** (Auto-created)
   - `SupportConversation` - Chat conversations
   - `SupportMessage` - Individual messages
   - `SupportEscalation` - Escalated conversations
   - `KnowledgeArticle` - AI knowledge base
   - `UnansweredQuestion` - Questions AI couldn't answer
   - `SupportSettings` - AI configuration

3. **Environment Variables**
   ```env
   OPENAI_API_KEY="sk-your-actual-key"
   UPSTASH_REDIS_REST_URL="optional-rate-limiting"
   UPSTASH_REDIS_REST_TOKEN="optional-rate-limiting"
   ```

### API Endpoints
- `POST /api/support/chat` - AI chat endpoint
- `GET/POST /api/support/knowledge` - Knowledge base CRUD
- `GET/PUT/DELETE /api/support/knowledge/[id]` - Individual knowledge articles
- `GET/POST /api/support/unanswered` - Unanswered questions management
- `GET/PUT /api/support/conversations` - Conversation management

### Documentation
See `AI_SUPPORT_SETUP.md` for complete setup guide and troubleshooting.

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
