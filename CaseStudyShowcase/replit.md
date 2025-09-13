# Smart Campus Wellbeing & Sustainability Hub

## Overview

The Smart Campus Wellbeing & Sustainability Hub is a comprehensive web application designed to support student wellbeing and promote environmental sustainability on campus. The platform integrates four core modules: mental health support with mood tracking and AI chatbot assistance, campus safety features including SOS emergency alerts, sustainability tracking for waste management and energy monitoring, and a gamification system that rewards student engagement through points and leaderboards.

The application targets university students as the primary users, with an admin role available for system management. The platform emphasizes student engagement through a reward-based point system that encourages regular participation across all modules.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built with React 18 and TypeScript, utilizing a modern component-based architecture. The application employs Vite as the build tool and development server, providing fast hot module replacement and optimized production builds. The UI is constructed with shadcn/ui components built on Radix UI primitives, ensuring accessibility and consistent design patterns.

State management is handled through React Query (TanStack Query) for server state management, providing caching, synchronization, and background updates. The application uses Wouter for client-side routing, offering a lightweight alternative to React Router.

The design system follows Material Design principles with custom campus-focused theming. Tailwind CSS provides utility-first styling with custom CSS variables for theme consistency across light and dark modes. The color scheme emphasizes sustainable green as the primary color with trust blue as secondary.

### Backend Architecture
The server is built with Express.js and TypeScript, following a RESTful API architecture. The application uses Firebase Authentication for user management and Firestore as the primary database for real-time data synchronization.

The server implements Firebase Admin SDK for token verification and user management. Session management is handled through Firebase ID tokens with automatic renewal. The API follows standard HTTP conventions with proper error handling and response formatting.

The application uses a hybrid approach where Firebase handles authentication and real-time data while Express provides additional business logic and API endpoints. This architecture supports real-time updates for features like mood tracking and chat functionality.

### Data Storage Solutions
Firebase Firestore serves as the primary NoSQL database, providing real-time synchronization capabilities essential for features like chat messaging and live updates. The database is structured around user collections with subcollections for moods, chats, safety alerts, and gamification data.

The schema is defined using Zod for runtime type validation, ensuring data integrity across the application. User profiles include role-based access control (student/admin), points tracking, and engagement metrics.

While the application currently uses Firebase Firestore, the configuration includes Drizzle ORM setup for potential PostgreSQL integration, indicating flexibility for future database migrations or hybrid storage solutions.

### Authentication and Authorization
The application implements Firebase Authentication as the primary identity provider, supporting email/password authentication and Google OAuth integration. The auth system includes automatic user profile creation, session management through ID tokens, and role-based access control.

The frontend uses React Context for authentication state management, providing user information and authentication methods throughout the component tree. Protected routes ensure authenticated access to all main features.

Firebase Admin SDK on the server validates ID tokens and manages user sessions. The system supports both development and production configurations with proper environment variable management.

## External Dependencies

**Authentication & Database Services:**
- Firebase Authentication for user identity management
- Firebase Firestore for real-time NoSQL data storage
- Firebase Admin SDK for server-side user management

**Frontend Framework & Libraries:**
- React 18 with TypeScript for component-based UI
- Vite for fast development and optimized builds
- TanStack React Query for server state management
- Wouter for lightweight client-side routing

**UI Components & Styling:**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling
- Radix UI for accessible headless components
- Lucide React for consistent iconography

**Development & Build Tools:**
- ESBuild for fast JavaScript bundling
- PostCSS with Autoprefixer for CSS processing
- TypeScript for static type checking
- Drizzle ORM for potential database operations

**Potential IoT Integrations:**
- Geolocation API for campus safety features
- Real-time energy monitoring systems (planned)
- Smart waste bin sensors (planned)
- Campus building management systems (planned)

The application architecture is designed to support real-time features while maintaining scalability and developer experience through modern tooling and established patterns.