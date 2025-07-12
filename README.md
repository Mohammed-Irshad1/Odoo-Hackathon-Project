# ReWear - Sustainable Clothing Exchange Platform

A full-stack web application that promotes sustainable fashion by enabling users to exchange unused clothing items, earn points, and reduce textile waste.

## Features

- User Authentication & Registration with JWT tokens
- Item Management - List, browse, and manage clothing items
- Favorites System - Save and track favorite items
- Points System - Earn points for sustainable actions
- Swap Requests - Request item exchanges with other users
- Real-time Notifications - Live notification system
- Admin Panel - Administrative tools for platform management
- Image Upload - Upload item photos with multer
- Search & Filtering - Advanced search with category, size, and condition filters
- Responsive Design - Mobile-friendly Bootstrap interface

## Tech Stack

**Frontend:** React 19.1.0, React Router DOM 7.6.3, React Bootstrap 2.10.10, Bootstrap 5.3.7, Axios 1.10.0, React Icons 5.5.0

**Backend:** Node.js, Express.js 5.1.0, MySQL2 3.14.2, JWT 9.0.2, Bcrypt 6.0.0, Multer 2.0.1, CORS 2.8.5, Dotenv 17.2.0

**Database:** MySQL with migrations

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd ReWear-Odoo-Hackathon
   ```

2. Backend Setup
   ```bash
   cd backend
   npm install
   ```

3. Database Setup
   - Create a MySQL database
   - Update `backend/config.js` with your database credentials
   - Run migrations in order from `backend/migrations/`

4. Environment Variables
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database
   JWT_SECRET=your_jwt_secret
   ```

5. Frontend Setup
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

1. Start Backend Server
   ```bash
   cd backend
   node app.js
   ```

2. Start Frontend Development Server
   ```bash
   cd frontend
   npm start
   ```

## API Endpoints

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

**Users:**
- `GET /api/users/me` - Get current user profile
- `GET /api/users/notifications` - Get user notifications

**Items:**
- `GET /api/items` - Get all items (with filters)
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get specific item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

**Favorites:**
- `GET /api/users/favorites` - Get user favorites
- `POST /api/users/favorites/:itemId` - Add to favorites
- `DELETE /api/users/favorites/:itemId` - Remove from favorites

## Development Scripts

**Backend:**
```bash
npm test
```

**Frontend:**
```bash
npm start
npm run build
npm test
```

## License

This project is licensed under the MIT License.

---

**ReWear** - Making sustainable fashion accessible to everyone! ♻️👕
