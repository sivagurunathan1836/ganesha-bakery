# Ganesh Bakery

This is the source code for the Ganesh Bakery application.

## Prerequisites

- Node.js installed
- MongoDB installed (locally or have a connection string)

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/sivagurunathan1836/ganesha-bakery.git
cd ganesha-bakery
```

### 2. Install Dependencies

You need to install dependencies for both the frontend and backend.

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create a file named `.env` in the `backend/` directory.
Copy the following template and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bakery_shop
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Run the Application

**Start the Backend (from `backend/` directory):**
```bash
npm run dev
# or
node server.js
```

**Start the Frontend (from `frontend/` directory):**
```bash
npm run dev
```

The application should now be accessible at `http://localhost:5173` (or whatever port Vite uses).
