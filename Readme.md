# BharatVault

**BharatVault** is a secure document management web application that allows users to register, upload, and manage their personal documents. Built with **React**, **Firebase Authentication**, **Firestore**, and a **Node.js/Express** backend.

---

## 🔗 Live Demo

## Frontend: [\[https://bharatvault.vercel.app\]](https://bharatvault.vercel.app/)

## 📦 Features

- User authentication (signup, login, logout) via Firebase
- Upload, update, and delete personal documents
- Generate shareable links for documents
- Logging of every action taken by user in backend
- Responsive UI built with **react-bootstrap**

---

## 🛠 Tech Stack

**Frontend:**

- React.js
- react-bootstrap
- Firebase Authentication & Firestore

**Backend:**

- Node.js & Express
- Multer for file uploads
- Firebase Admin SDK for token verification
- File logging and auditing

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/coder0898/bharatvault.git
cd bharatvault
```

### Frontend

```bash
cd frontend
npm install
npm run dev   # or npm start
```

### Backend

```bash
cd backend
npm install
npm run dev   # starts Express server
```

---

## 🔑 Environment Variables

### Frontend

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=https://your-backend-url.onrender.com
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
```

### Backend

Create a `.env` file in `backend/`:

```env
PORT=5000
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/serviceAccountKey.json
UPLOAD_FOLDER=uploads
LOGS_FOLDER=logs
```

---

## 📂 Project Structure

```
bharatvault/
├─ frontend/           # React frontend
│  ├─ src/
│  │  ├─ components/   # Reusable UI components
│  │  ├─ context/      # React Context for Auth, Files
│  │  └─ pages/        # Application pages
├─ backend/            # Express backend
│  ├─ routes/          # API routes
│  ├─ middleware/      # Authentication, logging
│  ├─ uploads/         # Uploaded files
│  └─ logs/            # Action logs
```

---

## 🚀 Usage

1. Signup or login as a user
2. Upload documents through the dashboard
3. View uploaded documents and share links
4. Admin can view all uploads and logs

---

## 📝 Logging Actions

All user actions (upload, update, delete) are logged in the backend `logs` folder for auditing. Each log includes:

- Timestamp
- User ID
- Action type
- Details (fileName, document type, etc.)

---

## 💡 Contributing

Contributions are welcome! Feel free to:

- Open issues
- Submit pull requests
- Suggest features

---

## 📄 License

MIT License © 2025

---
