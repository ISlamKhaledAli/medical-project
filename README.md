# 🏥 Medical Appointment Management System

A full-stack Medical Appointment Management Web Application that allows Admins, Doctors, and Patients to manage medical appointments efficiently with secure authentication and role-based access control.

---

## 🚀 Tech Stack

### Frontend
- React (Vite)
- React Router
- Redux Toolkit
- Material UI
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt (Password Hashing)

---

## 📦 How to Run the Project

After cloning the repository:

### Backend
cd backend
npm install
Create a .env file
npm run dev

### Frontend
cd frontend
npm install
npm run dev

## 👥 User Roles

---

### 🛠 Admin
- View all users
- Approve or block doctors/patients
- Manage specialties
- View all appointments
- Full system control

### 👨‍⚕️ Doctor
- Manage availability schedule
- View upcoming & past appointments
- Approve / Reject appointments
- Add notes
- Edit profile

### 🧑‍💻 Patient
- Search doctors (filter by specialty/name)
- View doctor availability
- Book appointment
- Cancel / Reschedule appointment
- Manage profile

---

## 🔐 Authentication & Security

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Protected routes (Frontend & Backend)

---

## 📅 Appointment Features

- Real-time availability validation
- Prevent double booking
- Appointment statuses:
  - Pending
  - Confirmed
  - Completed
  - Cancelled

---

## 🗂 Project Structure
