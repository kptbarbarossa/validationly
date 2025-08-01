# Technology Stack

## Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom utilities
- **Routing**: React Router DOM v6
- **Build Tool**: Vite with esbuild minification
- **Font**: Inter font family

## Backend
- **Runtime**: Vercel Serverless Functions
- **AI**: Google Gemini 2.0 Flash Experimental via @google/genai
- **Language**: TypeScript with strict mode enabled

## Development Tools
- **TypeScript**: Strict configuration with comprehensive linting rules
- **ESLint**: React and TypeScript rules with custom configurations
- **Prettier**: Code formatting
- **PostCSS**: CSS processing with Autoprefixer

## Key Dependencies
- `@google/genai`: AI model integration
- `react-router-dom`: Client-side routing
- `tailwindcss`: Utility-first CSS framework
- `@vercel/node`: Serverless function types

## Common Commands

### Development
```bash
npm run dev              # Start development server (Vite)
npm run build           # Production build
npm run preview         # Preview production build
```

### Code Quality
```bash
npm run type-check      # TypeScript checking
npm run lint            # ESLint checking  
npm run lint:fix        # Auto-fix ESLint issues
npm run format          # Prettier formatting
npm run security-check  # Security audit
```

### Testing
```bash
npm run test            # Run tests (Vitest)
npm run test:ui         # Run tests with UI
```

## Environment Requirements
- Node.js 18+
- npm 8+
- API_KEY environment variable for Google Gemini

## Deployment
- Platform: Vercel
- Auto-deployment from Git
- Environment variables configured in Vercel dashboard