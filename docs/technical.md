# Isling Web App - Technical Overview

## Technology Stack

### Frontend Framework

- **Next.js 15**: Using the App Router architecture for server-side rendering and routing
- **React 19**: Latest version with enhanced features and performance improvements
- **TypeScript**: For type-safe development

### UI Components and Styling

- **Ant Design Mobile**: Mobile-first UI component library
- **Tailwind CSS 4**: Utility-first CSS framework for styling
- **Motion**: Animation library for UI transitions

### State Management

- **Jotai**: Lightweight state management library
- **TanStack React Query**: For server state management and data fetching

### Content Editing

- **Yoopta Editor**: Rich text editor framework
- **Slate.js**: Customizable rich text editing framework

### HTTP Client

- **Axios**: Promise-based HTTP client for API requests

### Development Tools

- **ESLint**: For code linting
- **TypeScript**: For static type checking
- **Turbopack**: For faster development builds

## Architecture

### Application Structure

The application follows a hybrid architecture combining:

1. **Next.js App Router**: For page routing and server components
2. **Domain-Driven Design (DDD)**: For organizing business logic in modules
3. **Atomic Design**: For organizing UI components

### Module Structure

Each domain module follows a consistent structure:

```
module/
├── hooks/            # React hooks for consuming module functionality
├── infrastructure/   # External interfaces
│   ├── api/          # API clients
│   └── repository/   # Data repositories
├── models/           # Domain models and DTOs
└── store/            # State management
```

### Component Structure

UI components follow the Atomic Design methodology:

```
components/
├── atoms/           # Basic building blocks
├── molecules/       # Simple combinations of atoms
├── organisms/       # Complex UI components
├── sections/        # Page sections
├── layouts/         # Layout components
└── templates/       # Page templates
```

## Authentication Flow

1. User signs up or signs in through dedicated pages
2. Authentication tokens (access and refresh) are obtained from the backend
3. Tokens are stored and managed by the auth module
4. Axios interceptors handle token refreshing and authentication errors
5. Protected routes check for authentication status

## Data Flow

1. **API Layer**: Axios instances for authenticated and non-authenticated requests
2. **Repository Layer**: Abstracts data access through infrastructure/repository
3. **Service Layer**: Business logic in modules
4. **State Management**: Combination of Jotai atoms and React Query
5. **UI Components**: Consume data through custom hooks

## Key Technical Features

### Authentication System

- Token-based authentication with refresh mechanism
- Axios interceptors for handling token expiration
- Session management with multiple logout scopes

### Profile Management

- Avatar upload with pre-signed URLs
- Profile data management with optimistic updates
- Form validation and error handling

### Content Creation

- Rich text editing with Yoopta Editor
- Emotion tagging for content
- Media attachment support

### Feed System

- Content display with infinite scrolling
- Pull-to-refresh functionality
- Emotion-based content filtering

### Responsive Design

- Mobile-first approach with Ant Design Mobile
- Tailwind CSS for responsive layouts
- Dynamic viewport height handling

## Performance Considerations

- Server-side rendering for initial page loads
- Client-side navigation for subsequent page transitions
- Optimistic UI updates for better perceived performance
- Lazy loading of components and routes
- Proper data caching with React Query

## Security Measures

- Token-based authentication with short-lived access tokens
- Refresh token rotation
- HTTPS for all API communications
- Input validation on both client and server
- Protection against common web vulnerabilities

## Development Workflow

1. Feature development follows the sprint planning process
2. Code organization follows DDD and Atomic Design principles
3. New features are implemented in dedicated modules
4. UI components are built from the ground up following atomic design

## Deployment and Infrastructure

While not explicitly defined in the codebase, the application is likely deployed using:

- Containerized deployment (Docker)
- CI/CD pipeline for automated testing and deployment
- Cloud hosting with auto-scaling capabilities
- CDN for static assets

## Future Technical Considerations

Based on the sprint planning document:

1. Implementing efficient database queries for the following system
2. Enhancing the notification system with event-driven architecture
3. Optimizing the feed algorithm for content from followed users
4. Implementing proper caching strategies for improved performance
