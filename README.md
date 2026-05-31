<div align="center">

# 🩺 HealthCare Service

### A modern full-stack healthcare platform for hospitals, diagnostics, blood banks, pharmacies, ambulance support, telemedicine, appointments, and drug safety.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## ✨ Overview

**HealthCare Service** is a React + Node.js + MySQL healthcare management system built to connect users with essential healthcare services from one clean dashboard.

The platform includes user authentication, hospital and diagnostic search, blood bank donor/request tools, pharmacy ordering, prescription scanning, ambulance service communication, telemedicine consultation, appointments, and drug interaction safety checks.

---

## 🚀 Features

### 👤 User & Authentication
- Sign up and sign in with JWT authentication
- Protected user dashboard routes
- User session stored locally
- Dedicated admin/manager portals for pharmacy, ambulance, and telemedicine doctors

### 🏥 Healthcare Directory
- Hospitals page
- Diagnostic centers page
- Nearby healthcare service modules
- Search-focused healthcare navigation

### 🩸 Blood Bank
- Donor registration/profile support
- Search donors by blood group and location
- Active donor view
- Blood request system
- Emergency blood request handling
- Complaint submission with attachment support
- Chat/message flow for accepted requests

### 💊 Pharmacy
- Medicine/product listing
- Cart and checkout flow
- Order placement and order tracking
- Pharmacy admin dashboard
- Product image upload
- Stock, price, discount, and offer management
- Delivery status management
- Prescription scan and add-to-cart support

### 🚑 Ambulance
- Ambulance search and filters
- 999 emergency call card
- Details modal with map support
- Call ambulance directly
- Share pickup location to ambulance manager
- Message ambulance manager
- Ambulance manager inbox and reply/status system
- Reviews and ratings

### 🧪 Drug Interactions
- Medicine database
- Pairwise interaction checking
- Interaction severity results
- Prescription upload and automatic medicine detection
- Prescription interaction report
- Reminders and saved prescriptions

### 🩺 Telemedicine
- Online doctor consultation dashboard
- Doctor telemedicine portal
- Video/chat request flow
- Queue and appointment-oriented consultation handling

### 📅 Appointments
- User appointment booking
- Online doctor appointment support
- Hospital/physical appointment flow
- Appointment management page

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Lucide React icons
- Leaflet / React Leaflet map support

### Backend
- Node.js
- Express
- MySQL2
- JWT authentication
- bcryptjs password hashing
- Multer file uploads
- PDF parsing
- Tesseract OCR

### Database
- MySQL
- Auto-created backend tables in route modules
- SQL import supported for initial database setup

---

## 📁 Project Structure

```text
Healthcare-react/
├── backend/
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── healthcare.routes.js
│   │   ├── bloodbank.routes.js
│   │   ├── pharmacy.routes.js
│   │   ├── ambulance.routes.js
│   │   ├── drug.routes.js
│   │   ├── telemedicine.routes.js
│   │   └── appointment.routes.js
│   ├── uploads/
│   ├── db.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Hospitals.jsx
│   │   │   ├── DiagnosticCenters.jsx
│   │   │   ├── BloodBanksPhp.jsx
│   │   │   ├── Pharmacies.jsx
│   │   │   ├── PharmacyAdminDashboard.jsx
│   │   │   ├── Ambulance.jsx
│   │   │   ├── AmbulanceManagerDashboard.jsx
│   │   │   ├── Telemedicine.jsx
│   │   │   ├── DoctorTelemedicineDashboard.jsx
│   │   │   ├── DrugInteractions.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── SignIn.jsx
│   │   │   └── SignUp.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/iRfANhAiDeRABiR/Healthcare-react.git
cd Healthcare-react
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=healthcare_service

JWT_SECRET=your_user_jwt_secret

PHARMACY_ADMIN_USERNAME=pharmacyadmin
PHARMACY_ADMIN_PASSWORD=your_pharmacy_admin_password
PHARMACY_ADMIN_JWT_SECRET=your_pharmacy_admin_jwt_secret

AMBULANCE_MANAGER_JWT_SECRET=your_ambulance_manager_secret
DOCTOR_TELEMEDICINE_JWT_SECRET=your_doctor_secret
```

Run backend server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🧩 API Modules

| Module | Base API |
|---|---|
| Auth | `/api/auth` |
| Dashboard | `/api/dashboard` |
| Healthcare | `/api/healthcare` |
| Blood Bank | `/api/bloodbank` |
| Pharmacy | `/api/pharmacy` |
| Ambulance | `/api/ambulance` |
| Drug Interactions | `/api/drug-interactions` |
| Telemedicine | `/api/telemedicine` |
| Appointments | `/api/appointments` |

---

## 🔐 Main App Routes

| Route | Page |
|---|---|
| `/signin` | User sign in |
| `/signup` | User registration |
| `/dashboard` | User dashboard |
| `/hospitals` | Hospitals |
| `/diagnostic-centers` | Diagnostic centers |
| `/blood-banks` | Blood banks |
| `/pharmacies` | Pharmacy shop |
| `/ambulance` | Ambulance services |
| `/telemedicine` | Telemedicine |
| `/drug-interactions` | Drug interaction checker |
| `/appointments` | Appointments |
| `/pharmacy-admin` | Pharmacy admin portal |
| `/ambulance-manager` | Ambulance manager portal |
| `/telemedicine-doctor` | Doctor telemedicine portal |

---

## 🖼️ Screenshots

Add your screenshots here:

```text
assets/screenshots/dashboard.png
assets/screenshots/pharmacy.png
assets/screenshots/ambulance.png
assets/screenshots/drug-interactions.png
```

```md
![Dashboard](assets/screenshots/dashboard.png)
![Pharmacy](assets/screenshots/pharmacy.png)
![Ambulance](assets/screenshots/ambulance.png)
![Drug Interactions](assets/screenshots/drug-interactions.png)
```

---

## 🧪 Useful Commands

### Backend

```bash
cd backend
npm run dev
npm start
```

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run preview
```

---

## 🌐 Deployment Notes

The frontend API helper currently points to:

```js
http://localhost:5000/api
```

Before deploying, update the API base URL to your production backend URL.

Recommended production setup:

- Deploy frontend on Vercel / Netlify
- Deploy backend on Render / Railway / VPS
- Use hosted MySQL database
- Add production environment variables
- Allow the production frontend URL in backend CORS

---

## 🧯 Troubleshooting

### Backend database connection failed
Check:

```env
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
```

Also make sure MySQL is running and the database exists.

### Frontend cannot connect to backend
Check `frontend/src/services/api.js` and confirm the backend is running on:

```text
http://localhost:5000
```

### Uploads not showing
Make sure backend serves the upload folder and backend is running. Uploaded files are served from:

```text
/uploads
```

### Admin login not working
Check the admin credentials in `.env`, then restart the backend.

---

## 🤝 Team

Built by **Team Titans**.

---

## 📌 Project Status

This project is actively developed as a complete healthcare service platform with multiple connected service modules.

---

<div align="center">

### ⭐ Star this repository if you like the project

Made with ❤️ for smarter healthcare access.

</div>
