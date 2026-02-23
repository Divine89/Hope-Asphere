# Home-Asphere Setup Guide

Complete step-by-step setup guide for local development.

## Prerequisites

- **Node.js** 18+ (Download from nodejs.org)
- **PostgreSQL** 12+ (Download from postgresql.org)
- **Git** (Download from git-scm.com)
- **VS Code** (Recommended editor)

## Step 1: Environment Setup

### macOS / Linux
```bash
node --version  # Should be v18+
npm --version   # Should be 9+
psql --version  # Should be 12+
```

### Windows
```powershell
node --version
npm --version
psql --version
```

## Step 2: Clone Repository

```bash
git clone https://github.com/your-username/home-asphere.git
cd home-asphere
```

## Step 3: Install Dependencies

```bash
npm install
```

This will install dependencies for all workspaces:
- Root dependencies
- apps/web dependencies
- apps/api dependencies  
- packages/db dependencies
- packages/shared dependencies

## Step 4: Setup Database

### Create PostgreSQL Database

**On macOS/Linux:**
```bash
# Start PostgreSQL service
brew services start postgresql

# Create database
createdb home-asphere

# Create user (optional)
createuser home_user -P
```

**On Windows:**
```powershell
# Assuming PostgreSQL is installed
psql -U postgres

# In psql prompt:
CREATE DATABASE home-asphere;
```

### Verify Connection
```bash
psql -U postgres -d home-asphere
```

## Step 5: Configure Environment

### Root Level (.env)
```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/home-asphere
JWT_SECRET=your-secret-key-here-min-32-chars-long
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Backend (.env)
```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/home-asphere
JWT_SECRET=your-secret-key-here-min-32-chars-long
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```bash
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/web/.env.local`:
```
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Home-Asphere
```

## Step 6: Database Schema

### Push Schema to Database
```bash
npm run db:push
```

This creates all necessary tables defined in `packages/db/schema.ts`

### Inspect Database (Optional)
```bash
npm run db:studio
```

Opens Drizzle Studio UI at http://localhost:3001

## Step 7: Start Development Servers

### From Root Directory (Both servers at once)
```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Start Individually

**Terminal 1 - Frontend:**
```bash
npm run dev:web
```

**Terminal 2 - Backend:**
```bash
npm run dev:api
```

## Step 8: Verify Setup

### Test Frontend
1. Open http://localhost:3000 in browser
2. Should see Home-Asphere landing page

### Test Backend
1. Open http://localhost:3001/api/health
2. Should see JSON response:
```json
{
  "success": true,
  "message": "API is running"
}
```

## Step 9: Install VS Code Extensions (Optional)

Recommended extensions for development:

- ESLint
- Prettier
- Thunder Client (API testing)
- Drizzle Studio
- PostgreSQL
- Tailwind CSS IntelliSense

## Troubleshooting

### Port Already in Use

**macOS/Linux:**
```bash
lsof -i :3000  # Find process on port 3000
kill -9 <PID>  # Kill process
```

**Windows:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Error

```
Error: connect ECONNREFUSED
```

**Solution:**
1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verify DATABASE_URL format:
   ```
   postgresql://username:password@host:port/database
   ```

3. Test connection:
   ```bash
   psql $DATABASE_URL
   ```

### Module Not Found

```
Error: Cannot find module '@home-asphere/shared'
```

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear cache and restart
npm cache clean --force
npm run dev
```

### Migrations Failed

```bash
# Reset database (Warning: deletes all data)
npm run db:drop
npm run db:push
```

## Next Steps

1. Read [DEVELOPMENT.md](DEVELOPMENT.md) for development guide
2. Read [README.md](README.md) for architecture overview
3. Check [API Documentation](DEVELOPMENT.md#api-endpoints)
4. Start building features!

## Common Commands

```bash
# Install new package
npm install package-name

# Install to specific workspace
npm install --workspace=apps/web package-name

# Build for production
npm run build

# Type check
npm run check

# Database operations
npm run db:push      # Push schema
npm run db:studio    # Open UI
npm run db:generate  # Generate migration

# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Useful Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/en/starter/basic-routing.html)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [TailwindCSS](https://tailwindcss.com/docs)

## Getting Help

1. Check [Troubleshooting](#troubleshooting) section
2. Review [DEVELOPMENT.md](DEVELOPMENT.md)
3. Check existing issues on GitHub
4. Create new issue with error details

---

Happy coding! 🚀
