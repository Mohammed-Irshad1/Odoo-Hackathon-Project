# ReWear

ReWear is a modern, full-featured MERN e-commerce platform focused on sustainable fashion. Buy, sell, and swap clothing and accessories, earn points, and join a community making fashion circular and accessible for all.

---

## ✨ Features
- User authentication & account management
- Product listing, search, and filtering
- Shopping cart & checkout with payment integration
- Swap system: offer and accept item swaps
- Points system: earn and spend points
- Admin dashboard for product and order management
- Responsive, modern UI

---

## 🛠️ Tech Stack
- **MongoDB**: NoSQL database
- **Express.js**: RESTful API backend
- **React**: Frontend SPA
- **Node.js**: Server runtime
- **Redux Toolkit**: State management
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast React build tool

---

## 🚀 Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/your-username/rewear.git
cd rewear
```

### 2. Install dependencies
```sh
cd server && npm install
cd ../client && npm install
```

### 3. Configure environment variables
- Copy `server/env.example` to `server/.env` and fill in your MongoDB URI and any secrets.

### 4. Seed the database
```sh
cd server
node seed.js
```

### 5. Assign random points to products (optional)
```sh
node assignPointsValue.js
```

### 6. Start the servers
- **Backend:**
  ```sh
  npm run dev
  ```
- **Frontend:**
  ```sh
  cd ../client
  npm run dev
  ```

---

## 📁 Folder Structure
```
client/      # React frontend
  src/
    components/
    pages/
    assets/
server/      # Express backend
  controllers/
  models/
  routes/
  seed.js
  assignPointsValue.js
```

---

## 🌐 Main Pages
- **Home:** `/shop/home` — Browse featured products and categories
- **About:** `/shop/about` — Learn about ReWear's mission
- **Contact:** `/shop/contact` — Contact form for support or feedback
- **Account, Cart, Checkout, Admin Dashboard, and more**

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
This project is licensed under the MIT License. 
