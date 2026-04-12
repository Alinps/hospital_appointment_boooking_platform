# Hospital Appointment Booking Platform (Frontend)

A React-based frontend for a hospital appointment system where patients can register, log in, browse doctors, book appointments, and manage their profile.

## Features

- User registration and login
- Token-based authenticated experience
- Doctor listing with search, department filter, and pagination
- Appointment booking with date-based slot selection
- View upcoming and past appointments
- Reschedule and cancel appointments
- Profile view and update (including avatar upload)
- Change password
- Responsive navigation and protected routes

## Tech Stack

- React 19
- React Router DOM 7
- Redux Toolkit + React Redux
- Axios
- Bootstrap 5 + custom CSS
- Create React App (react-scripts)

## Project Structure

```text
src/
  components/
    auth/                 # Route guards (guest/auth)
    login.js              # Login page
    signup.js             # Registration page
    doctorlistingpage.js  # Doctor directory
    doctorbooking.js      # Appointment booking
    myappointments.js     # Appointment management
    Profile.js            # User profile
    changepassword.js     # Password update
    navbar.js             # Main navigation
    ServerWakeup.js       # Backend health-check splash
  store/
    authSlice.js          # Auth state + localStorage sync
    store.js              # Redux store
  router.js               # App route definitions
  index.js                # App entry point
```

## Routes

- `/` - Server wake-up / health check screen
- `/landing` - Public landing page
- `/login` - Login page (guest only)
- `/signup` - Signup page (guest only)
- `/doctorlistingpage` - Doctor listing (auth required)
- `/doctorbooking/:id` - Book appointment (auth required)
- `/myappointments` - Manage appointments (auth required)
- `/profile` - Profile page (auth required)
- `/changepassword` - Change password (auth required)

## Backend Dependency

This frontend currently uses a hosted backend API:

- `https://hospital-appointment-booking-app-backend.onrender.com`

All authentication and appointment operations depend on this service being available.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Run in Development

```bash
npm start
```

The app runs at `http://localhost:3000`.

## Available Scripts

- `npm start` - Start development server
- `npm test` - Run tests in watch mode
- `npm run build` - Create production build
- `npm run eject` - Eject CRA config (irreversible)

## Authentication Flow

- On successful login, user data (including token) is stored in Redux and `localStorage`.
- On app load, user state is restored from `localStorage`.
- `checkAuth` protects private pages.
- `checkGuest` prevents logged-in users from accessing guest-only pages.

## Notes

- API URLs are currently hardcoded in components.
- For production-ready setup, consider moving API base URL to environment variables.
