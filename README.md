# iPhone Hub Masvingo - E-Commerce Website

A complete, production-ready e-commerce website for iPhone Hub Masvingo, a premium Apple/iPhone-focused phone business based in Masvingo, Zimbabwe.

## 🚀 Features

- **Product Catalog**: Browse and filter iPhones by condition (Boxed, Pre-Owned, Second-Hand), model, storage, colour, and price
- **Product Details**: Detailed product pages with image galleries, specifications, and customer reviews
- **Shopping Cart**: Full shopping cart functionality with quantity management
- **Checkout System**: Complete checkout with multiple payment methods (EcoCash, ZIPIT, Bank Transfer, Cash on Collection)
- **WhatsApp Integration**: Direct WhatsApp contact for enquiries and support
- **Admin Dashboard**: Secure admin panel for product, order, and customer management
- **Authentication**: User authentication with NextAuth.js
- **SEO Optimized**: Full SEO optimization with metadata, Open Graph tags, and structured data
- **Responsive Design**: Mobile-first design that works on all devices
- **Trade-In System**: Customer trade-in enquiry form
- **Contact Forms**: Contact form and enquiry management
- **Legal Pages**: Privacy Policy, Terms & Conditions, and other legal pages

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **UI Components**: Radix UI components
- **Icons**: Lucide React
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iphone-hub-masvingo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and configure:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/iphone_hub"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   NEXT_PUBLIC_WHATSAPP_NUMBER="263000000000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev --name init
   ```

5. **Create Admin User via Prisma Studio**
   ```bash
   npx prisma studio
   ```
   Then:
   - Navigate to the `User` model
   - Add a new record with:
     - `email`: iphonehub@gmail.com
     - `password`: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH
     - `name`: iPhone Hub Admin
     - `role`: SUPER_ADMIN

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

8. **Access the Admin Dashboard**
   - Navigate to `http://localhost:3000/admin/login`
   - Login with credentials:
     - **Email**: iphonehub@gmail.com
     - **Password**: Artwell@2026

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following main models:

- **User**: Customer and admin accounts
- **Product**: iPhone products with variants
- **ProductVariant**: Product variants (storage, colour, price)
- **Order**: Customer orders
- **OrderItem**: Items in an order
- **Category**: Product categories
- **Review**: Customer reviews
- **BlogPost**: Blog articles
- **Enquiry**: Contact form submissions
- **TradeInEnquiry**: Trade-in requests

## 🔐 Authentication

The application uses NextAuth.js for authentication. Admin users can access the dashboard at `/admin`.

### Admin Credentials

The default admin user is created automatically when you run the database seed:

- **Email**: iphonehub@gmail.com
- **Password**: Artwell@2026
- **Role**: SUPER_ADMIN

### Manual Admin Creation

If you need to create additional admin users manually:

```typescript
await prisma.user.create({
  data: {
    email: "admin@example.com",
    name: "Admin User",
    password: await bcrypt.hash("your-password", 10),
    role: "ADMIN",
  },
});
```

## 📱 WhatsApp Integration

The application includes WhatsApp integration for customer communication. Configure your WhatsApp number in the `.env` file:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER="263000000000"
```

## 🚢 Deployment

### Vercel Deployment

1. **Push your code to GitHub**

2. **Connect your repository to Vercel**

3. **Configure environment variables in Vercel**
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`

4. **Deploy**

### Database Setup for Production

For production, use a managed PostgreSQL service like:
- Vercel Postgres
- Supabase
- Neon
- AWS RDS

Update your `DATABASE_URL` in the production environment.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx prisma generate` - Generate Prisma Client
- `npx prisma migrate dev` - Run database migrations
- `npx prisma studio` - Open Prisma Studio (for admin user creation)

## 🎨 Customization

### Business Information

Update business information in the database through the admin dashboard or directly in the `SiteSettings` table.

### Styling

The application uses Tailwind CSS. Customize the design by modifying Tailwind classes in the components.

### Colors

The primary color scheme is black and white with gray accents. Modify Tailwind color configuration in `tailwind.config.ts` if needed.

## 🔒 Security

- All API routes are protected with proper validation
- Admin routes require authentication and admin role
- Passwords are hashed using bcrypt
- Environment variables are used for sensitive data
- SQL injection prevention through Prisma ORM

## 📧 Email Configuration

To enable email notifications, configure the Resend API key:

```env
RESEND_API_KEY="your-resend-api-key"
```

## 📸 Image Upload

For image uploads, configure Cloudinary:

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 📊 Analytics

To enable analytics, configure:

```env
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
NEXT_PUBLIC_GTM_ID="your-google-tag-manager-id"
```

## 🤝 Support

For support, contact iPhone Hub Masvingo through the contact form or WhatsApp.

## 📄 License

This project is proprietary software for iPhone Hub Masvingo.

## 👨‍💼 Credits

- **CEO**: Artwell Gwata
- **Location**: Masvingo, Zimbabwe
- **Year**: 2026

---

Built with ❤️ for iPhone Hub Masvingo