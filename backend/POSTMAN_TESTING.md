

# Endpoint Reference by Category (with Sample Data)

## Admin Endpoints

- **Get All Users**
  - `GET /api/admin/users`
  - Headers: `Authorization: Bearer <admin_accessToken>`

- **Get User by ID**
  - `GET /api/admin/users/64f1a2b3c4d5e6f7a8b9c0d1`
  - Headers: `Authorization: Bearer <admin_accessToken>`

- **Approve Doctor**
  - `PATCH /api/admin/users/64f1a2b3c4d5e6f7a8b9c0d1/approve`
  - Headers: `Authorization: Bearer <admin_accessToken>`

- **Block User**
  - `PATCH /api/admin/users/64f1a2b3c4d5e6f7a8b9c0d1/block`
  - Headers: `Authorization: Bearer <admin_accessToken>`

- **Unblock User**
  - `PATCH /api/admin/users/64f1a2b3c4d5e6f7a8b9c0d1/unblock`
  - Headers: `Authorization: Bearer <admin_accessToken>`

- **Change User Role**
  - `PATCH /api/admin/users/64f1a2b3c4d5e6f7a8b9c0d1/role`
  - Headers: `Authorization: Bearer <admin_accessToken>`
  - Body:
    ```json
    {
      "role": "doctor"
    }
    ```

- **Delete User**
  - `DELETE /api/admin/users/64f1a2b3c4d5e6f7a8b9c0d1`
  - Headers: `Authorization: Bearer <admin_accessToken>`

---

## User Endpoints

- **Register**
  - `POST /api/auth/register`
  - Body:
    ```json
    {
      "email": "patient1@example.com",
      "password": "PatientPass123",
      "fullName": "Patient One"
    }
    ```

- **Login**
  - `POST /api/auth/login`
  - Body:
    ```json
    {
      "email": "patient1@example.com",
      "password": "PatientPass123"
    }
    ```

- **Get Profile**
  - `GET /api/users/profile`
  - Headers: `Authorization: Bearer <patient_accessToken>`

- **Update Profile**
  - `PATCH /api/users/profile`
  - Headers: `Authorization: Bearer <patient_accessToken>`
  - Body:
    ```json
    {
      "fullName": "Patient One Updated",
      "email": "patient1updated@example.com"
    }
    ```

- **Change Password**
  - `PATCH /api/users/change-password`
  - Headers: `Authorization: Bearer <patient_accessToken>`
  - Body:
    ```json
    {
      "currentPassword": "PatientPass123",
      "newPassword": "NewPatientPass456"
    }
    ```

- **Delete Account**
  - `DELETE /api/users/profile`
  - Headers: `Authorization: Bearer <patient_accessToken>`
  - Body:
    ```json
    {
      "password": "NewPatientPass456"
    }
    ```

---

## Doctor Endpoints

- **Create Doctor Profile**
  - `POST /api/doctors/profile`
  - Headers: `Authorization: Bearer <doctor_accessToken>`
  - Body:
    ```json
    {
      "specialty": "Cardiology",
      "bio": "Experienced cardiologist."
    }
    ```

- **List All Doctors**
  - `GET /api/doctors/`

- **Get Doctor by ID**
  - `GET /api/doctors/64f1a2b3c4d5e6f7a8b9c0d2`

- **Update Doctor Profile**
  - `PATCH /api/doctors/profile`
  - Headers: `Authorization: Bearer <doctor_accessToken>`
  - Body:
    ```json
    {
      "bio": "Updated bio."
    }
    ```

- **Delete Doctor Profile**
  - `DELETE /api/doctors/profile`
  - Headers: `Authorization: Bearer <doctor_accessToken>`

---

## Patient Endpoints

- **Book Appointment**
  - `POST /api/appointments/`
  - Headers: `Authorization: Bearer <patient_accessToken>`
  - Body:
    ```json
    {
      "doctorId": "64f1a2b3c4d5e6f7a8b9c0d2",
      "appointmentDate": "2026-03-01",
      "startTime": "10:00",
      "endTime": "10:30"
    }
    ```

- **Get My Appointments**
  - `GET /api/appointments/my`
  - Headers: `Authorization: Bearer <patient_accessToken>`

---

## Notification Endpoints

- **Create Notification**
  - `POST /api/notifications/`
  - Headers: `Authorization: Bearer <admin_accessToken>`
  - Body:
    ```json
    {
      "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "type": "booking",
      "message": "Your appointment is confirmed."
    }
    ```

- **Get My Notifications**
  - `GET /api/notifications/`
  - Headers: `Authorization: Bearer <accessToken>`

- **Mark All as Read**
  - `PATCH /api/notifications/read-all`
  - Headers: `Authorization: Bearer <accessToken>`

- **Mark One as Read**
  - `PATCH /api/notifications/64f1a2b3c4d5e6f7a8b9c0d4/read`
  - Headers: `Authorization: Bearer <accessToken>`

- **Delete Notification**
  - `DELETE /api/notifications/64f1a2b3c4d5e6f7a8b9c0d4`
  - Headers: `Authorization: Bearer <accessToken>`

---

## Availability Endpoints (Doctor Only)

- **Set Availability**
  - `POST /api/availability/`
  - Headers: `Authorization: Bearer <doctor_accessToken>`
  - Body:
    ```json
    {
      "doctorId": "64f1a2b3c4d5e6f7a8b9c0d2",
      "slots": [
        { "date": "2026-03-01", "startTime": "10:00", "endTime": "10:30" }
      ]
    }
    ```

- **Update Availability**
  - `PATCH /api/availability/64f1a2b3c4d5e6f7a8b9c0d5`
  - Headers: `Authorization: Bearer <doctor_accessToken>`
  - Body:
    ```json
    {
      "slots": [
        { "date": "2026-03-01", "startTime": "11:00", "endTime": "11:30" }
      ]
    }
    ```

- **Delete Availability**
  - `DELETE /api/availability/64f1a2b3c4d5e6f7a8b9c0d5`
  - Headers: `Authorization: Bearer <doctor_accessToken>`

- **Get Doctor Availability**
  - `GET /api/availability/64f1a2b3c4d5e6f7a8b9c0d2`

---

## Specialty Endpoints

- **Create Specialty**
  - `POST /api/specialties/`
  - Body:
    ```json
    {
      "name": "Cardiology"
    }
    ```

- **List All Specialties**
  - `GET /api/specialties/`

- **Get Specialty by ID**
  - `GET /api/specialties/64f1a2b3c4d5e6f7a8b9c0d6`

- **Update Specialty**
  - `PATCH /api/specialties/64f1a2b3c4d5e6f7a8b9c0d6`
  - Body:
    ```json
    {
      "name": "Updated Specialty"
    }
    ```

- **Delete Specialty**
  - `DELETE /api/specialties/64f1a2b3c4d5e6f7a8b9c0d6`

---

# Replace all IDs and tokens with real values from your database or API responses.

