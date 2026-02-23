# Home-Asphere - Airbnb-like Rental Marketplace

A production-ready full-stack rental marketplace web application built with modern technologies.

## 📋 Project Structure

```
home-asphere/
├── apps/
│   ├── web/                 # Frontend (Vite + React)
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── api/                 # Backend (Express)
│       ├── src/
│       │   ├── controllers/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── middleware/
│       │   └── server.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── db/                  # Drizzle ORM schema & config
│   │   ├── schema.ts
│   │   └── drizzle.config.ts
│   │
│   └── shared/              # Shared types & utilities
│       ├── types.ts
│       ├── constants.ts
│       └── utils.ts
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 12
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd home-asphere
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
# Copy example env files
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

4. **Configure Database**
- Create a PostgreSQL database
- Update `DATABASE_URL` in `.env`
- Example: `postgresql://user:password@localhost:5432/home-asphere`

5. **Run Database Migrations**
```bash
npm run db:push
```

6. **Start Development Servers**

From root directory:
```bash
npm run dev
```

This will start both frontend (port 3000) and backend (port 3001) in parallel.

Or separately:
```bash
# Terminal 1 - Frontend
npm run dev:web

# Terminal 2 - Backend
npm run dev:api
```

## 📚 Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **ShadCN UI** - Component library
- **React Query** - Data fetching & caching
- **Wouter** - Lightweight routing
- **React Hook Form** - Form management

### Backend
- **Express.js** - Web server
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Razorpay** - Payment processing
- **bcrypt** - Password hashing

### Shared
- **Zod** - Schema validation
- **date-fns** - Date utilities

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts (guest, host, admin)
- **listings** - Property listings
- **listing_images** - Listing photos
- **bookings** - Booking records
- **payments** - Payment transactions
- **reviews** - Guest reviews
- **availability** - Listing availability calendar
- **wishlist** - Saved listings
- **sessions** - User sessions
- **notifications** - User notifications
- **admin_logs** - Admin activity logs

## 🔐 Authentication

- Email/password registration and login
- JWT token-based authentication
- Role-based access control (Guest, Host, Admin)
- Protected routes with middleware

## 💳 Payment Integration

- **Razorpay** integration for payments
- Webhook verification for payment confirmation
- 12% platform commission on each booking
- Automatic commission calculation

## 🎯 Core Features

### For Guests
- Browse and search listings
- Filter by price, amenities, rating
- View listing details and reviews
- Book properties with date selection
- Make payments via Razorpay
- Leave reviews and ratings
- Save favorite listings

### For Hosts
- Create and manage listings
- Upload multiple property images
- Set prices and availability
- View bookings and earnings
- Respond to guest reviews
- Track earnings dashboard

### For Admins
- View all users and listings
- Suspend users
- View all bookings and revenue
- Commission tracking
- Analytics dashboard

## 📝 API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user
```

### Listings
```
GET    /api/listings/search    - Search listings
GET    /api/listings/:id       - Get listing details
POST   /api/listings           - Create listing (auth required)
PUT    /api/listings/:id       - Update listing (auth required)
DELETE /api/listings/:id       - Delete listing (auth required)
```

### Bookings
```
POST   /api/bookings           - Create booking
GET    /api/bookings/:id       - Get booking details
GET    /api/bookings/guest/list - Guest's bookings
GET    /api/bookings/host/list  - Host's bookings
POST   /api/bookings/:id/cancel - Cancel booking
```

### Reviews
```
POST   /api/reviews            - Create review
GET    /api/reviews/listing/:id - Get listing reviews
POST   /api/reviews/:id/reply  - Add host reply
```

## 🔧 Configuration

### Environment Variables

**Root .env**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

**apps/api/.env**
```
PORT=3001
NODE_ENV=development
DATABASE_URL=...
JWT_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
FRONTEND_URL=http://localhost:3000
```

**apps/web/.env.local**
```
VITE_API_URL=http://localhost:3001/api
```

## 📦 Available Commands

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:web         # Start frontend only
npm run dev:api         # Start backend only

# Building
npm run build           # Build both apps
npm run build:web       # Build frontend
npm run build:api       # Build backend

# Database
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:studio       # Open Drizzle Studio

# Type checking
npm run check           # Type check all apps
```

## 🚢 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Vercel Functions / Railway)
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy to serverless platform

### Database (Supabase / AWS RDS)
1. Create PostgreSQL instance
2. Run migrations
3. Configure backups

## 📊 Performance Optimization

- Image lazy loading
- Code splitting with Vite
- React Query caching
- Database query optimization
- API rate limiting
- Pagination for list endpoints

## 🔒 Security Features

- Input validation with Zod
- SQL injection prevention (ORM)
- CSRF protection
- Password hashing with bcrypt
- JWT token validation
- Rate limiting support
- Webhook signature verification

## 📈 Scalability

### Current Limits (Single Server)
- Up to 1,000 concurrent users
- Up to 10,000 listings

### Scaling Plan (1k → 100k users)
1. **Database**: Add read replicas, implement caching
2. **Cache**: Add Redis for session and data caching
3. **CDN**: Serve images via CloudFront
4. **Microservices**: Split into separate services (auth, listings, bookings, payments, notifications)
5. **Message Queue**: Add RabbitMQ/Kafka for async operations
6. **Monitoring**: Implement APM and logging

## 💰 Cost Estimation (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel (Frontend) | $0-20 | Depends on usage |
| PostgreSQL (Supabase) | $25-100 | Depends on storage |
| Razorpay | 2% + ₹3 | Per transaction |
| AWS S3 (Images) | $5-20 | Upload/storage costs |
| Domain + SSL | $10 | Annual cost |
| **Total** | **~$50-150/month** | Startup phase |

## 🛣️ MVP Build Roadmap (30 Days)

### Week 1: Foundation
- [ ] Setup monorepo structure ✅
- [ ] Database schema ✅
- [ ] API scaffolding ✅
- [ ] Frontend scaffolding ✅

### Week 2: Authentication & Listings
- [ ] User registration/login
- [ ] Create/edit listings
- [ ] Image upload
- [ ] Search listings

### Week 3: Bookings & Payments
- [ ] Booking flow
- [ ] Razorpay integration
- [ ] Payment verification
- [ ] Booking management

### Week 4: Reviews & Polish
- [ ] Review system
- [ ] User profiles
- [ ] Notifications
- [ ] Testing & bug fixes

## 📞 Support & Contact

For questions or issues, please create an issue in the repository.

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ by Full Stack Team**
