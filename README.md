# Sunuvan Journey Hub

Sunuvan Journey Hub is a modern vehicle rental platform designed to provide a seamless booking experience for both luxury and standard transportation needs. Built with a focus on user experience and administrative efficiency, it connects customers with a diverse fleet of vehicles while providing powerful tools for fleet and booking management.

## Features

### For Customers
- **Fleet Browsing**: Explore a wide range of vehicles with filtering by category (Standard, Premium, Van/Minibus).
- **Detailed Vehicle Information**: View specifications, amenities (AC, Wifi, etc.), and pricing.
- **Booking System**: Easy-to-use booking interface for scheduling pickups and drop-offs.
- **Favorites**: specialized "wishlist" to save preferred vehicles for quick access.
- **Authentication**: Secure user accounts to manage bookings and preferences.

### For Administrators
- **Comprehensive Dashboard**: Real-time overview of bookings, fleet status, and key metrics.
- **Fleet Management**: specific tools to add, edit, and remove vehicles, including managing availability and attributes.
- **Booking Management**: Track and update booking statuses (Pending, Confirmed, Completed, Cancelled).
- **Driver Management**: Manage driver profiles and assignments.
- **Analytics**: Visual insights into booking trends and performance.

## Technology Stack

This project is built using a modern, robust technology stack:

- **Frontend Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Database**: [Supabase](https://supabase.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Routing**: [React Router](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

Follow these steps to set up the project locally:

### Prerequisites
- Node.js & npm installed (users [nvm](https://github.com/nvm-sh/nvm) is recommended)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <YOUR_GIT_URL>
    cd sunuvan-journey-hub
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    npm i
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:8080`.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks (Auth, Toast, etc.)
├── integrations/   # Third-party integrations (Supabase)
├── lib/            # Utility functions
├── pages/          # Application pages/routes
│   ├── AdminDashboard.tsx  # Main admin interface
│   ├── Fleet.tsx           # Fleet listing page
│   └── ...
└── App.tsx         # Main application entry point
```

## Deployment

This project is optimized for deployment on modern web hosting platforms. Build the project for production using:

```bash
npm run build
```
