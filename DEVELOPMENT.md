# Development Guide - Home-Asphere

## Architecture Overview

### Monorepo Structure
This project uses a monorepo architecture with workspaces:

- **apps/web** - React frontend with Vite
- **apps/api** - Express backend
- **packages/db** - Drizzle ORM & database
- **packages/shared** - Shared types & utilities

### Data Flow

```
Frontend (React) <---> API (Express) <---> Database (PostgreSQL)
   |                        |
   +- Auth Hook            +- Auth Service
   +- Query Hooks          +- Controllers
   +- Pages                +- Services
   +- Components           +- Routes
                            +- Middleware
```

## Backend Development

### Adding a New Feature

1. **Define Database Schema**
   - Add table to `packages/db/schema.ts`
   - Add Zod schemas for validation

2. **Create Service**
   - Create file in `apps/api/src/services/feature.service.ts`
   - Implement business logic

3. **Create Controller**
   - Create file in `apps/api/src/controllers/feature.controller.ts`
   - Import service and handle requests

4. **Create Routes**
   - Create file in `apps/api/src/routes/feature.routes.ts`
   - Import controller and define routes

5. **Update Server**
   - Add routes to `apps/api/src/server.ts`

### Example: Adding User Profile Endpoint

```typescript
// 1. Schema (packages/db/schema.ts)
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  bio: text("bio"),
  // ...
});

// 2. Service (apps/api/src/services/user.service.ts)
export class UserService {
  static async getProfile(userId: string) {
    return db.select().from(users)
      .where(eq(users.id, userId))
      .limit(1);
  }

  static async updateProfile(userId: string, data: UpdateProfileData) {
    return db.update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();
  }
}

// 3. Controller (apps/api/src/controllers/user.controller.ts)
export class UserController {
  static async getProfile(req: AuthRequest, res: Response) {
    const profile = await UserService.getProfile(req.userId!);
    res.json({ success: true, data: profile[0] });
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    const profile = await UserService.updateProfile(req.userId!, req.body);
    res.json({ success: true, data: profile[0], message: "Profile updated" });
  }
}

// 4. Routes (apps/api/src/routes/user.routes.ts)
router.get("/profile", authMiddleware, UserController.getProfile);
router.put("/profile", authMiddleware, UserController.updateProfile);

// 5. Server (apps/api/src/server.ts)
app.use("/api/users", userRoutes);
```

## Frontend Development

### Adding a New Page

1. **Create Page Component**
   - File: `apps/web/src/pages/Feature.tsx`
   - Use hooks for data fetching

2. **Create Hook (if needed)**
   - File: `apps/web/src/hooks/use-feature.ts`
   - Use React Query for data fetching

3. **Update Router**
   - Add route to `apps/web/src/Router.tsx`

4. **Add Navigation**
   - Update `apps/web/src/components/Navbar.tsx`

### Example: Adding Feature Page

```typescript
// 1. Hook (apps/web/src/hooks/use-feature.ts)
export function useFeature(filters?: any) {
  return useQuery({
    queryKey: ["feature", filters],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/feature?${params}`);
      return res.json();
    },
  });
}

// 2. Page (apps/web/src/pages/Feature.tsx)
export default function FeaturePage() {
  const { data, isLoading } = useFeature();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container">
      {/* Feature content */}
    </div>
  );
}

// 3. Router (apps/web/src/Router.tsx)
<Route path="/feature" component={FeaturePage} />
```

## Database Migrations

### Creating & Running Migrations

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push schema directly (development only)
npm run db:push

# Open Drizzle Studio for database inspection
npm run db:studio
```

## Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Common Tasks

### Add a New Dependency

```bash
# Global package
npm install package-name

# Workspace specific (web)
npm install --workspace=apps/web package-name

# Workspace specific (api)
npm install --workspace=apps/api package-name
```

### View Database Schema

```bash
npm run db:studio
```

Opens Drizzle Studio at http://localhost:3001

### Build for Production

```bash
npm run build
```

## Debugging

### Backend Debugging

Add to `apps/api/src/server.ts`:
```typescript
import debugModule from "debug";
const debug = debugModule("app:*");

debug("Server started");
```

### Frontend Debugging

Use React DevTools and Redux DevTools browser extensions.

## Git Workflow

```bash
# Feature branch
git checkout -b feature/feature-name

# Commit with conventional commits
git commit -m "feat: add new feature"
git commit -m "fix: bug fix"
git commit -m "docs: update readme"

# Push and create PR
git push origin feature/feature-name
```

## Performance Tips

### Backend
- Use database indices for frequently queried columns
- Implement pagination for large datasets
- Cache expensive operations
- Use connection pooling

### Frontend
- Use React Query for caching
- Code split with dynamic imports
- Lazy load images
- Memoize expensive components

## Troubleshooting

### Database Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:5432

Solution:
1. Ensure PostgreSQL is running
2. Check DATABASE_URL format
3. Verify database exists: psql -l
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001

Solution:
# Find process using port
lsof -i :3001

# Kill process
kill -9 PID
```

### Module Import Errors
```
Error: Cannot find module '@home-asphere/shared'

Solution:
1. Ensure workspace dependencies are in package.json
2. Run: npm install
3. Restart dev server
```

## Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [TailwindCSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
