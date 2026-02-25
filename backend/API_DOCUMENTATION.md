# Medical Project — Full API Documentation

> **Base URL:** `http://localhost:5000`
>
> **Auth Header (for protected endpoints):**
> `Authorization: Bearer <accessToken>`
>
> **Content-Type:** `application/json`

---

## 1. Authentication (`/api/auth`)

### 1.1 Register
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/register` |
| **Auth** | None |
| **Body** | |
```json
{
  "fullName": "Ahmed Ali",
  "email": "ahmed@example.com",
  "password": "Ahmed12345"
}
```
| **Success Response** | `201` — Registration successful. Check email to verify. |

---

### 1.2 Verify Email
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/auth/verifyemail/:token` |
| **Auth** | None |
| **Example** | `/api/auth/verifyemail/abc123def456` |
| **Success Response** | `200` — Email verified |

---

### 1.3 Resend Verification Email
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/resend-verification` |
| **Auth** | None |
| **Body** | |
```json
{
  "email": "ahmed@example.com"
}
```

---

### 1.4 Login
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/login` |
| **Auth** | None |
| **Body** | |
```json
{
  "email": "ahmed@example.com",
  "password": "Ahmed12345"
}
```
| **Success Response** | `200` — Returns `accessToken` and `user` object |

---

### 1.5 Refresh Token
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/refresh-token` |
| **Auth** | None (uses `refreshToken` cookie) |
| **Success Response** | `200` — Returns new `accessToken` |

---

### 1.6 Forgot Password
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/forgot-password` |
| **Auth** | None |
| **Body** | |
```json
{
  "email": "ahmed@example.com"
}
```

---

### 1.7 Reset Password
| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/auth/reset-password/:token` |
| **Auth** | None |
| **Body** | |
```json
{
  "password": "NewPassword123"
}
```

---

### 1.8 Logout
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/logout` |
| **Auth** | ✅ JWT Required |

---

### 1.9 Get Current User
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/auth/me` |
| **Auth** | ✅ JWT Required |

---

## 2. User Profile (`/api/users`)

> All endpoints require JWT authentication.

### 2.1 Get Profile
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/users/profile` |
| **Auth** | ✅ JWT Required |

---

### 2.2 Update Profile
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/users/profile` |
| **Auth** | ✅ JWT Required |
| **Body** | |
```json
{
  "fullName": "Ahmed Ali Updated",
  "email": "ahmedupdated@example.com"
}
```

---

### 2.3 Change Password
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/users/change-password` |
| **Auth** | ✅ JWT Required |
| **Body** | |
```json
{
  "currentPassword": "Ahmed12345",
  "newPassword": "AhmedNew12345"
}
```

---

### 2.4 Delete Account
| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/users/profile` |
| **Auth** | ✅ JWT Required |
| **Body** | |
```json
{
  "password": "AhmedNew12345"
}
```

---

## 3. Specialties (`/api/specialties`)

### 3.1 Create Specialty
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/specialties/` |
| **Auth** | ✅ JWT Required |
| **Body** | |
```json
{
  "name": "Cardiology",
  "description": "Heart and blood vessel specialist"
}
```

---

### 3.2 List All Specialties
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/specialties/` |
| **Auth** | None |

---

### 3.3 Get Specialty by ID
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/specialties/<specialty_id>` |
| **Auth** | None |

---

### 3.4 Update Specialty
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/specialties/<specialty_id>` |
| **Auth** | ✅ JWT Required |
| **Body** | |
```json
{
  "name": "Neurology",
  "description": "Brain and nervous system"
}
```

---

### 3.5 Delete Specialty
| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/specialties/<specialty_id>` |
| **Auth** | ✅ JWT Required |

---

## 4. Doctor (`/api/doctors`)

### 4.1 Create Doctor Profile
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/doctors/profile` |
| **Auth** | ✅ JWT Required (doctor role) |
| **Body** | |
```json
{
  "specialty": "<specialty_id>",
  "bio": "Experienced cardiologist with 10 years of practice.",
  "experienceYears": 10,
  "consultationFee": 200,
  "address": "123 Main St, Cairo"
}
```

---

### 4.2 Get My Doctor Profile
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/doctors/profile` |
| **Auth** | ✅ JWT Required (doctor role) |

---

### 4.3 List All Doctors
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/doctors/` |
| **Auth** | None (Public) |
| **Query Params** | `?page=1&limit=20&specialty=<specialty_id>` |

---

### 4.4 Get Doctor by ID
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/doctors/<doctor_profile_id>` |
| **Auth** | None (Public) |

---

### 4.5 Update Doctor Profile
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/doctors/profile` |
| **Auth** | ✅ JWT Required (doctor role) |
| **Body** | |
```json
{
  "bio": "Updated bio with 12 years experience.",
  "experienceYears": 12,
  "consultationFee": 250
}
```

---

### 4.6 Delete Doctor Profile
| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/doctors/profile` |
| **Auth** | ✅ JWT Required (doctor role) |

---

## 5. Availability (`/api/availability`)

### 5.1 Set Availability
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/availability/` |
| **Auth** | ✅ JWT Required (doctor role) |
| **Body** | |
```json
{
  "dayOfWeek": 3,
  "startTime": "09:00",
  "endTime": "17:00",
  "slotDuration": 30
}
```
> `dayOfWeek`: 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday

---

### 5.2 Update Availability
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/availability/<availability_id>` |
| **Auth** | ✅ JWT Required (doctor role) |
| **Body** | |
```json
{
  "startTime": "10:00",
  "endTime": "18:00",
  "slotDuration": 30
}
```

---

### 5.3 Delete Availability
| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/availability/<availability_id>` |
| **Auth** | ✅ JWT Required (doctor role) |

---

### 5.4 Get Doctor Availability
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/availability/<doctor_profile_id>` |
| **Auth** | None (Public) |

---

## 6. Appointments (`/api/appointments`)

### 6.1 Book Appointment (Patient Only)
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/appointments/` |
| **Auth** | ✅ JWT Required (patient role) |
| **Body** | |
```json
{
  "doctorId": "<doctor_profile_id>",
  "appointmentDate": "2026-03-01",
  "startTime": "10:00",
  "endTime": "10:30"
}
```
> `doctorId` is the DoctorProfile `_id` (from `GET /api/doctors/`), NOT the User `_id`.

---

### 6.2 Approve / Confirm Appointment (Doctor/Admin)
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/appointments/<appointment_id>/status` |
| **Auth** | ✅ JWT Required (doctor or admin role) |
| **Body** | |
```json
{
  "status": "confirmed"
}
```

---

### 6.3 Complete Appointment (Doctor/Admin)
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/appointments/<appointment_id>/status` |
| **Auth** | ✅ JWT Required (doctor or admin role) |
| **Body** | |
```json
{
  "status": "completed"
}
```

---

### 6.4 Cancel Appointment (Doctor/Admin via status)
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/appointments/<appointment_id>/status` |
| **Auth** | ✅ JWT Required (doctor or admin role) |
| **Body** | |
```json
{
  "status": "cancelled"
}
```

---

### 6.5 Cancel Appointment (Any authenticated user)
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/appointments/<appointment_id>/cancel` |
| **Auth** | ✅ JWT Required |

---

### 6.6 Reschedule Appointment
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/appointments/<appointment_id>/reschedule` |
| **Auth** | ✅ JWT Required |
| **Body** | |
```json
{
  "appointmentDate": "2026-03-05",
  "startTime": "11:00",
  "endTime": "11:30"
}
```

---

### 6.7 Get My Appointments
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/appointments/my` |
| **Auth** | ✅ JWT Required |
| **Query Params** | `?status=pending` (optional filter) |

---

### 6.8 Get All Appointments (Admin Only)
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/appointments/` |
| **Auth** | ✅ JWT Required (admin role) |
| **Query Params** | `?page=1&limit=10&status=pending&doctor=<id>&patient=<id>&startDate=2026-03-01&endDate=2026-03-31` |

---

### 6.9 Get Appointment Stats (Admin Only)
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/appointments/stats` |
| **Auth** | ✅ JWT Required (admin role) |

---

### 6.10 Get Appointment by ID
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/appointments/<appointment_id>` |
| **Auth** | ✅ JWT Required |

---

### Appointment Status Flow
```
pending → confirmed → completed
pending → cancelled
confirmed → cancelled
```

---

## 7. Notifications (`/api/notifications`)

> All endpoints require JWT authentication.

### 7.1 Create Notification (Manual Trigger)
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/notifications/` |
| **Auth** | ✅ JWT Required |
| **Body** | |
```json
{
  "userId": "<recipient_user_id>",
  "type": "booking",
  "message": "Your appointment has been confirmed."
}
```
> `type` must be one of: `booking`, `cancel`, `reschedule`

---

### 7.2 Get My Notifications
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/notifications/` |
| **Auth** | ✅ JWT Required |
| **Query Params** | `?page=1&limit=20&isRead=false` |

---

### 7.3 Mark All Notifications as Read
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/notifications/read-all` |
| **Auth** | ✅ JWT Required |

---

### 7.4 Mark One Notification as Read
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/notifications/<notification_id>/read` |
| **Auth** | ✅ JWT Required |

---

### 7.5 Delete Notification
| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/notifications/<notification_id>` |
| **Auth** | ✅ JWT Required |

---

## 8. Admin (`/api/admin`)

> All endpoints require JWT + admin role.

### 8.1 List All Users
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/admin/users` |
| **Auth** | ✅ JWT Required (admin) |
| **Query Params** | `?page=1&limit=20&role=doctor&isBlocked=false` |

---

### 8.2 Get User by ID
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/admin/users/<user_id>` |
| **Auth** | ✅ JWT Required (admin) |

---

### 8.3 Approve Doctor
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/admin/users/<user_id>/approve` |
| **Auth** | ✅ JWT Required (admin) |

---

### 8.4 Reject Doctor
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/admin/users/<user_id>/reject` |
| **Auth** | ✅ JWT Required (admin) |

---

### 8.5 Block User
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/admin/users/<user_id>/block` |
| **Auth** | ✅ JWT Required (admin) |

---

### 8.6 Unblock User
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/admin/users/<user_id>/unblock` |
| **Auth** | ✅ JWT Required (admin) |

---

### 8.7 Change User Role
| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/admin/users/<user_id>/role` |
| **Auth** | ✅ JWT Required (admin) |
| **Body** | |
```json
{
  "role": "doctor"
}
```
> `role` must be one of: `patient`, `doctor`, `admin`

---

### 8.8 Delete User
| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/admin/users/<user_id>` |
| **Auth** | ✅ JWT Required (admin) |

---

## 9. Real-Time Notifications (Socket.IO)

| | |
|---|---|
| **URL** | `http://localhost:5000` |
| **Auth** | Pass JWT as `auth.token` on connection |
| **Event (receive)** | `newNotification` |

### Connection Example (Frontend)
```javascript
const socket = io("http://localhost:5000", {
  auth: { token: "<accessToken>" }
});

socket.on("newNotification", (data) => {
  console.log("New notification:", data);
});
```

---

## Quick Test Flow

### Step 1: Create Admin (already seeded)
- **Email:** `admin@example.com`
- **Password:** `A123456789d.`

### Step 2: Login as Admin
`POST /api/auth/login` → Copy `accessToken`

### Step 3: Create Specialty
`POST /api/specialties/` → Copy `_id` as `<specialty_id>`

### Step 4: Register a Doctor
`POST /api/auth/register` with doctor email

### Step 5: Admin → Change Role to Doctor
`PATCH /api/admin/users/<user_id>/role` → `{ "role": "doctor" }`

### Step 6: Admin → Approve Doctor
`PATCH /api/admin/users/<user_id>/approve`

### Step 7: Login as Doctor
`POST /api/auth/login` → Copy `accessToken`

### Step 8: Create Doctor Profile
`POST /api/doctors/profile` → with `<specialty_id>`

### Step 9: Set Doctor Availability
`POST /api/availability/` → with `dayOfWeek`, `startTime`, `endTime`, `slotDuration`

### Step 10: Register a Patient
`POST /api/auth/register` with patient email

### Step 11: Login as Patient
`POST /api/auth/login` → Copy `accessToken`

### Step 12: Book Appointment
`POST /api/appointments/` → with `doctorId` (DoctorProfile `_id`), `appointmentDate`, `startTime`, `endTime`

### Step 13: Doctor → Approve Appointment
`PATCH /api/appointments/<appointment_id>/status` → `{ "status": "confirmed" }`

### Step 14: Doctor → Complete Appointment
`PATCH /api/appointments/<appointment_id>/status` → `{ "status": "completed" }`

---

## Notes
- All IDs (e.g., `<user_id>`, `<doctor_profile_id>`, `<specialty_id>`) are MongoDB ObjectIds returned in API responses.
- `doctorId` in appointments refers to the **DoctorProfile `_id`**, not the User `_id`.
- Notifications are sent automatically when appointments are booked, cancelled, or rescheduled.
- The real-time test page is at `http://localhost:5000/socket-test.html`.
