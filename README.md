# Medical Appointment Management System

## Short Description
A comprehensive, production-grade web application designed to streamline medical appointments, bridging the gap between patients, doctors, and administrators. The system provides real-time availability management, secure booking workflows, and administrative oversight within a modern, responsive interface.

## Features
- User registration and secure login.
- Role-based access control (RBAC).
- Doctor availability and schedule management.
- Appointment booking, rescheduling, and cancellation.
- Admin dashboard for user approval and system oversight.
- Real-time notifications via Socket.IO.
- Professional dark mode support.
- Interactive dashboard with system statistics.
- Secure JWT-based authentication and session persistence.

## Tech Stack
### Frontend
- React
- Material UI (MUI)
- Redux Toolkit (State Management)
- Axios (API Integration)
- Socket.IO Client (Real-time updates)

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose (ODM)
- JSON Web Tokens (JWT)
- Socket.IO (Real-time communication)
- Bcrypt.js (Password hashing)

## Architecture Overview
The system follows a decoupled Client-Server architecture:
- **Frontend**: A Single Page Application (SPA) built with React, utilizing Redux Toolkit for global state management and Material UI for a premium design system.
- **Backend**: A RESTful API built with Express, following a Controller-Service-Model pattern to ensure separation of concerns and scalability.
- **Real-time Layer**: A Socket.IO integration for instant notifications and live updates (e.g., chat, status changes).
- **Security**: Stateless authentication using JWT stored in local storage (Access Token) and HttpOnly cookies (Refresh Token).

## Folder Structure

### Backend
```text
backend/
├── controllers/    # Request handling logic
├── models/         # Mongoose schemas and models
├── routes/         # API endpoint definitions
├── services/       # Core business logic
├── sockets/        # Socket.IO handlers and middleware
├── templates/      # Email and UI templates
├── utils/          # Helper functions and utilities
├── config/         # Database and environment configurations
└── server.js       # Application entry point
```

### Frontend
```text
frontend/
├── src/
│   ├── api/        # Axios instances and API definitions
│   ├── app/        # Redux store configuration
│   ├── components/ # Reusable UI components
│   ├── features/   # Redux slices and feature-specific logic
│   ├── hooks/      # Custom React hooks
│   ├── layouts/    # Page layout wrappers
│   ├── pages/      # Full-page components
│   ├── routes/     # Routing configuration
│   └── utils/      # Client-side utility functions
└── public/         # Static assets
```

## Installation Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- npm or yarn

### Steps
1. Clone the repository.
2. Navigate to the backend directory: `cd backend`.
3. Install dependencies: `npm install`.
4. Navigate to the frontend directory: `cd frontend`.
5. Install dependencies: `npm install`.

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medical-system
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Running the Project

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

## API Overview

### Authentication
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate user and return tokens.
- `POST /api/auth/refresh-token` - Refresh expired access tokens.
- `GET /api/auth/me` - Get current authenticated user details.

### Appointments
- `GET /api/appointments` - List appointments (role-filtered).
- `POST /api/appointments/book` - Book a new appointment.
- `PATCH /api/appointments/:id/status` - Update appointment status.

### Doctors
- `GET /api/doctors` - Retrieve list of available doctors.
- `GET /api/doctors/:id/availability` - Fetch doctor's schedules.

## User Roles & Permissions
- **Patient**: Can search doctors, book appointments, view own history, and receive notifications.
- **Doctor**: Can manage availability, view patient records, accept/reject appointments, and update medical notes.
- **Admin**: Full system access, including doctor verification, user management, and global statistics.

## Screenshots
<!-- [IMAGE_PLACEHOLDER: Login_Page] -->
<!-- [IMAGE_PLACEHOLDER: Patient_Dashboard] -->
<!-- [IMAGE_PLACEHOLDER: Doctor_Schedule] -->
<!-- [IMAGE_PLACEHOLDER: Admin_Overview] -->

## Deployment Notes
- **Database**: Use MongoDB Atlas for production-grade reliability.
- **Server**: Deploy the backend to platforms like Heroku, Render, or AWS EC2.
- **Frontend**: Host the frontend on Vercel, Netlify, or AWS S3/CloudFront.
- **Security**: Ensure SSL certificates are active and `secure: true` is set for cookies in production.

## Future Improvements
- Multi-language support (i18n).
- Video consultation integration using WebRTC.
- Automated appointment reminders via SMS.
- Integration with external calendar services (Google/Outlook).

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Author
[Islam Khaled Ali]
