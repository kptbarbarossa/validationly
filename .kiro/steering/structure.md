# Project Structure

## Root Level
- **Configuration Files**: TypeScript, ESLint, Prettier, Tailwind, Vite configs
- **Environment**: `.env.local` for development, `env.example` as template
- **Documentation**: README.md, DEVELOPMENT_RULES.md, FEATURE_IDEAS.md
- **Deployment**: `vercel.json` for Vercel configuration

## Source Organization

### `/src` - Frontend Application
- `main.tsx` - Application entry point
- `App.tsx` - Main app component with routing and error boundary
- `index.css` - Global styles and Tailwind imports
- `types.ts` - Shared TypeScript interfaces and types
- `vite-env.d.ts` - Vite environment type definitions

### `/src/components` - Reusable UI Components
- Shared components used across multiple pages
- Follow React functional component patterns

### `/src/pages` - Route Components
- `HomePage.tsx` - Landing page with idea input form
- `ResultsPage.tsx` - Validation results display
- Each page handles its own state and API calls

### `/src/services` - External Integrations
- API service functions
- Data fetching and transformation logic

### `/api` - Serverless Functions
- `validate.ts` - Main validation endpoint with AI integration
- `test.ts` - Testing utilities
- Vercel serverless function format

### `/public` - Static Assets
- Favicon variants and brand assets
- `robots.txt` and `sitemap.xml` for SEO
- Logo and social media images

## Key Patterns

### Component Structure
- Functional components with TypeScript
- Props interfaces defined inline or in types.ts
- Error boundaries for robust error handling

### State Management
- React hooks for local state
- URL state for navigation (React Router)
- No global state management (Redux/Zustand not needed)

### API Integration
- Serverless functions in `/api` directory
- Type-safe request/response with shared interfaces
- Error handling with proper HTTP status codes

### Styling Approach
- Tailwind CSS utility classes
- Custom utilities defined in tailwind.config.js
- Responsive design with mobile-first approach
- Accessibility-first styling (WCAG compliance)