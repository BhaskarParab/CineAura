# CineAura  
Movie & Series Reviews Web App

CineAura is a full-stack movie and series reviews platform that helps users discover trending, popular, and personalized content. Built with modern technologies, it provides a seamless browsing experience with authentication, dynamic UI, and scalable architecture.

---

## Features

- 🔐 Authentication System
  - JWT-based login & registration
  - Google OAuth integration

- 🎥 Content Discovery
  - Browse movies & TV series
  - Trending, popular, and search functionality

- 🔎 Advanced Search
  - Search movies, series, and people
  - Dynamic filtering and results

- 📜 Infinite Scroll
  - Smooth loading of content without pagination

- 🧠 State Management
  - Managed using Redux for scalability

- ⚡ Performance Optimized
  - Lazy loading and efficient API handling

- 🎨 Modern UI/UX
  - Responsive design
  - Animations with GSAP

---

## Tech Stack

### Frontend
- React + TypeScript
- Redux Toolkit
- Tailwind CSS
- GSAP (animations)

### Backend
- Node.js + Express + Typescript
- JWT Authentication

### Database
- PostgreSQL

### Deployment
- Frontend: Vercel  
- Backend: Railway  

---

## Installation & Setup

### 1️⃣ Clone the repository
``
    git clone https://github.com/your-username/cineaura.git
    cd cineaura
``

---

### 2️⃣ Setup Frontend

``
    cd frontend
    npm install
    npm run dev
``

---

### 3️⃣ Setup Backend
```
    cd backend
    npm install
    npm run dev
```
---

### 4️⃣ Environment Variables

Create .env files in both frontend and backend.

#### Backend `.env`
```
    PORT=5000
    DATABASE_URL=your_postgres_url
    JWT_SECRET=your_secret_key
    GOOGLE_CLIENT_ID=your_google_client_id
```

#### Frontend `.env`

   ``
    VITE_API_URL=http://localhost:5000
    VITE_GOOGLE_CLIENT_ID=your_google_client_id
    ``

---

## 🔐 Authentication Flow

1. User registers or logs in  
2. Backend validates credentials  
3. JWT token is generated  
4. Token is stored on frontend  
5. Protected routes use token for access  

---

## 🌐 API Overview

| Method | Endpoint                        | Description       |
|--------|---------------------------------|-------------------|
| POST   | api/auth/register               | Register user     |
| POST   | api/auth/login                  | Login user        |
| GET    | api/auth/me                     | Fetch user        |
| POST   | api/auth/logout                 | Logout user       |
| POST   | api/auth/google                 | Login google user |
| POST   | api/reviews/                    | Add review        |
| GET    | api/reviews/:mediaType/:tmdbId  | Fetch reviews     |

---

## 📸 Screenshots

    ![Home Page](./screenshots/home.png)
    ![Search Page](./screenshots/search.png)

---

## Future Improvements

-  Personalized recommendations (ML-based)
-  Watchlist & favorites
-  User reviews & ratings
-  Dark/Light theme toggle
-  Mobile app version

---

## Contributing

    # Fork the repo
    # Create a new branch
    ``
    git checkout -b feature-name
    ``

    # Commit changes
    ``
    git commit -m "Added new feature"
    ``

    # Push
    ``
    git push origin feature-name
    ``

---

## License

This project is licensed under the MIT License.

---

## Author

Bhaskar Parab  
Full Stack Developer  

---

## Support

If you like this project, give it a ⭐ on GitHub!
