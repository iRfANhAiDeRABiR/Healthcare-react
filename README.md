# Healthcare Service Platform

A full‑stack healthcare hub that connects patients with nearby facilities, blood banks, pharmacies, ambulance services, telemedicine, and drug‑safety tools.

## ✨ Highlights

- **Map-based discovery** of hospitals and diagnostic centers with distance sorting
- **Blood bank network** for donor discovery, requests, and message threads
- **Pharmacy marketplace** with product catalog, orders, and admin management
- **Ambulance services** directory with reviews, messages, and live location sharing
- **Telemedicine** consultations, credit top‑ups, and a doctor portal
- **Drug safety tools** for interaction checks, reminders, and prescription uploads (OCR/PDF)
- **Appointments** booking with schedules and credit handling
- **JWT authentication** across user and admin flows

## 🧱 Tech Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, Leaflet, Lucide |
| Backend | Node.js, Express, MySQL, JWT, Multer, Tesseract.js, pdf-parse |
| Tooling | ESLint, Nodemon |

## 🗂️ Project Structure

```
Healthcare-react/
├─ backend/               # Express + MySQL API
│  ├─ routes/             # Feature routes (telemedicine, pharmacy, blood bank, etc.)
│  ├─ middleware/         # Auth middleware
│  ├─ uploads/            # Uploaded files
│  └─ server.js
└─ frontend/              # React + Vite client
   ├─ src/
   │  ├─ pages/           # Dashboard + feature pages
   │  ├─ components/      # Shared UI and maps
   │  └─ services/        # API client
   └─ vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18.x or 20.x**
- **MySQL** (database: `healthcare_service`)

### 1) Backend

```bash
cd backend
npm install
```

Create or update `backend/.env` (this repo includes sample/dev values you can copy and adjust):

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=healthcare_service
JWT_SECRET=replace_with_a_strong_secret
CLIENT_URL=http://localhost:5173
```

Start the API:

```bash
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the app: `http://localhost:5173`

## 🔌 Key Modules & Routes

Frontend routes (examples):

- `/dashboard` — user overview
- `/hospitals` / `/diagnostic-centers` — map-based discovery
- `/blood-banks` — blood bank network
- `/pharmacies` — pharmacy catalog and orders
- `/ambulance` — ambulance services
- `/telemedicine` — consultations and credits
- `/drug-interactions` — safety checker & reminders
- `/appointments` — schedules and booking
- `/pharmacy-admin` / `/ambulance-manager` / `/telemedicine-doctor` — admin/manager portals

Backend API base: `http://localhost:5000/api`

Notable API domains:

- `/auth` — signup, login, current user
- `/healthcare` — nearby hospitals/diagnostics
- `/bloodbank` — donors, requests, chats, complaints
- `/pharmacy` — products, orders, admin tools
- `/ambulance` — services, reviews, messages
- `/telemedicine` — doctors, credits, consultations
- `/drug-interactions` — checks, reminders, prescriptions
- `/appointments` — booking and schedules

## 🧪 Scripts

**Backend**

```bash
npm run dev     # start with nodemon
npm start       # start with node
```

**Frontend**

```bash
npm run dev     # Vite dev server
npm run lint    # ESLint
npm run build   # Production build
```

## 📝 Notes

- Admin/manager credentials and portal URLs are configured in `backend/.env`.
- Replace all JWT and admin secrets with strong values before deployment.
- Uploaded files are stored in `backend/uploads`.