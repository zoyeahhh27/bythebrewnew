# ☕ By The Brew

> A responsive cafe web application built to bring together a digital menu, online ordering, customer-shared moments, and an admin order dashboard.

**Live Website:** https://bythebrew.vercel.app/  
**Repository:** https://github.com/zoyeahhh27/bythebrewnew

---

## ✨ Overview

By The Brew is a full-stack cafe website designed around a simple goal: make browsing the menu and placing an order easy for customers while giving the cafe a lightweight way to manage incoming orders.

The project includes:

- Responsive cafe landing page and navigation
- Interactive menu with category filtering
- Shopping cart and checkout flow
- Customer order submission
- **Brew Moments** — customers can upload and share cafe moments
- Admin authentication
- Admin order dashboard
- Order filtering and status management
- Today's sales calculation
- MongoDB-backed data storage
- Separate frontend and backend services

---

## 🛠️ Tech Stack

### Frontend
- React
- JavaScript
- CSS
- Vite
- Responsive UI

### Backend
- Node.js
- Express.js
- REST APIs
- CORS
- dotenv

### Database
- MongoDB
- Mongoose

### Development & Deployment
- Git & GitHub
- VS Code
- Vercel — frontend deployment
- Render — backend deployment

---

## 🚀 Key Features

### 🍰 Interactive Menu

Customers can browse menu items and filter them by categories including:

- Coffee
- Cold Brews
- Food
- Desserts

Each item includes its image, description and price.

### 🛒 Cart & Ordering

Customers can:

1. Add items to their cart
2. Adjust quantities
3. Review the total
4. Enter customer details
5. Choose Dine-in or Takeaway
6. Submit an order through the backend API

Orders are stored in MongoDB.

### 📸 Brew Moments

The **Brew Moments** feature allows customers to share a photo, title and name.

Uploaded moments are sent to the backend and displayed on the website, with the latest five moments loaded from the API.

### 🔐 Admin Dashboard

The application includes a protected admin area with:

- Admin login
- Token-based session handling
- Order listing
- Order filtering by status
- Automatic order refresh
- Today's sales calculation
- Order status updates
- Logout functionality

### 🔌 REST API

The Express backend exposes routes for:

| Route | Purpose |
|---|---|
| `POST /api/orders` | Place a customer order |
| `GET /api/orders` | Retrieve orders for authenticated admins |
| `PATCH /api/orders/:id/status` | Update order status |
| `POST /api/moments` | Add a customer moment |
| `GET /api/moments` | Retrieve recent moments |
| `POST /api/admin/login` | Authenticate an admin |
| `POST /api/admin/logout` | End an admin session |

---

## 📁 Project Structure

```text
bythebrewnew/
├── src/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   └── AdminDashboard.css
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── public/
│   ├── menu images
│   ├── logo
│   └── favicon
│
├── backend/
│   └── server/
│       ├── models/
│       │   ├── Moment.js
│       │   └── Order.js
│       ├── routes/
│       │   ├── adminRoutes.js
│       │   ├── momentRoutes.js
│       │   └── orderRoutes.js
│       ├── server.js
│       └── package.json
│
├── package.json
└── README.md
```

---

## ⚙️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/zoyeahhh27/bythebrewnew.git
cd bythebrewnew
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

### 4. Set up the backend

```bash
cd backend/server
npm install
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5001
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
ADMIN_SECRET=your_admin_secret
```

Start the backend:

```bash
npm start
```

The frontend and backend can then be run as separate services.

---

## 🧩 What I Built

This project gave me hands-on experience with:

- Building responsive React interfaces
- Managing component state with React hooks
- Creating reusable UI interactions
- Integrating frontend applications with REST APIs
- Designing MongoDB schemas with Mongoose
- Building Express.js API routes
- Implementing CRUD-style operations
- Handling authentication and protected admin routes
- Debugging frontend, backend and deployment issues
- Connecting a deployed frontend to a deployed backend
- Managing source code with Git and GitHub

---

## 🎯 What I Learned

Building By The Brew helped me understand the complete workflow of taking a web application from an idea to a deployed product — from designing the interface and handling frontend state to building APIs, connecting MongoDB, implementing an admin workflow, debugging issues and deploying the application.

---

## 👩‍💻 Author

**Zoya Azfareen**

Computer Science Student | Junior Web Developer

- LinkedIn: https://linkedin.com/in/zoya-azfareen-92b736414
- GitHub: https://github.com/zoyeahhh27
- Live Project: https://bythebrew.vercel.app/
