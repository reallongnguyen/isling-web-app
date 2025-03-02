# Isling Web App - Folder Structure

## Root Structure

```
isling-web-app/
├── app/                  # Next.js App Router pages and layouts
├── components/           # React components organized by atomic design
├── modules/              # Domain-driven feature modules
├── public/               # Static assets
├── tasks/                # Project task definitions and planning
├── docs/                 # Project documentation
├── .next/                # Next.js build output (generated)
├── node_modules/         # Dependencies (generated)
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── postcss.config.mjs    # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
└── ...                   # Other configuration files
```

## App Directory (Next.js App Router)

```
app/
├── globals.css           # Global CSS styles
├── layout.tsx            # Root layout with providers
├── page.tsx              # Home page component
├── provider.tsx          # Global providers (React Query, Ant Design Mobile)
├── favicon.ico           # Site favicon
├── app/                  # App route
├── profile/              # Profile routes
│   ├── page.tsx          # Profile page
│   └── me/               # Current user profile route
├── signin/               # Sign in route
├── signup/               # Sign up route
├── signout/              # Sign out route
└── notification/         # Notifications route
```

## Components Directory (Atomic Design)

```
components/
├── atoms/                # Smallest, indivisible UI components
│   └── buttons/          # Button components
├── molecules/            # Simple combinations of atoms
├── organisms/            # Complex UI components
│   ├── contents/         # Content display components
│   │   └── PostCard.tsx  # Post card component
│   ├── editor/           # Content editor components
│   │   └── SimpleEditor.tsx # Simple content editor
│   ├── EmotionLand.tsx   # Emotion display component
│   ├── NavBar.tsx        # Navigation bar component
│   └── TabBar.tsx        # Tab bar navigation component
├── sections/             # Page sections
│   └── home/             # Home page sections
│       └── AddPostPopup.tsx # Post creation popup
├── layouts/              # Layout components
└── templates/            # Page templates
```

## Modules Directory (Domain-Driven Design)

```
modules/
├── auth/                 # Authentication module
│   ├── hooks/            # React hooks for auth
│   ├── infrastructure/   # External interfaces
│   │   ├── api/          # API clients
│   │   │   ├── auth.api.ts # Auth API client
│   │   │   └── user.api.ts # User API client
│   │   ├── repository/   # Data repositories
│   │   └── axios.config.ts # Axios configuration
│   ├── models/           # Domain models
│   │   ├── auth-token.model.ts # Auth token model
│   │   ├── profile.model.ts # User profile model
│   │   ├── signin.dto.ts # Sign in data transfer objects
│   │   └── signup.dto.ts # Sign up data transfer objects
│   └── store/            # State management
├── user/                 # User module
│   ├── hooks/            # React hooks for user
│   ├── infrastructure/   # External interfaces
│   │   ├── api/          # API clients
│   │   │   └── user.api.ts # User API client
│   │   └── repository/   # Data repositories
│   ├── models/           # Domain models
│   │   ├── profile.model.ts # User profile model
│   │   ├── edit-profile.dto.ts # Edit profile DTO
│   │   └── file.dto.ts   # File upload DTOs
│   └── store/            # State management
├── common/               # Shared utilities and models
│   ├── axios/            # Axios instances and configuration
│   └── util/             # Utility functions
└── ping/                 # Ping/emotion module
    └── store/            # State management
        └── emotion.ts    # Emotion state
```
