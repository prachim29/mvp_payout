# Payout Management MVP

## Run Steps

### 1. Clone Repository

```
git clone <repository-url>
cd payout-mvp
```

### 2. Backend Setup

```
cd backend
npm install
```

Create a `.env` file in the backend folder:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection
JWT_SECRET=supersecret
```

Seed the demo users:

```
node src/seed/seedUsers.js
```

Start the backend server:

```
npm run dev
```

Backend will run on:

```
http://localhost:5000
```

---

### 3. Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## Demo Login Users

OPS User
Email: [ops@demo.com](mailto:ops@demo.com)
Password: ops123

FINANCE User
Email: [finance@demo.com](mailto:finance@demo.com)
Password: fin123

---

## Assumptions

* Authentication is implemented using JWT.
* Role-based access control is enforced on the backend.
* OPS users can create and submit payouts.
* FINANCE users can approve or reject payouts.
* Invalid status transitions are restricted (e.g., Draft cannot be approved directly).
* Audit trail records each payout action (CREATED, SUBMITTED, APPROVED, REJECTED).
* UI is kept simple as focus is on functionality and backend logic.
