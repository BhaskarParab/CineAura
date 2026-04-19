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
```
    git clone https://github.com/your-username/cineaura.git
    cd cineaura
```

---

### 2️⃣ Setup Frontend

```
    cd frontend/cine-app
    pnpm install
    pnpm run dev
```

---

### 3️⃣ Setup Backend
```
    cd backend/app
    pnpm install
    pnpm run dev
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

   ```
    VITE_API_URL=http://localhost:5000
    VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

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

### Home

<img width="1920" height="994" alt="cineauragit2" src="https://github.com/user-attachments/assets/1d9751eb-3e00-42dd-8b1e-92d5958c111e" />

---

### Explore

<img width="1920" height="994" alt="cineauragit1" src="https://github.com/user-attachments/assets/16df083a-6287-4b04-9c7d-d9c69cb06c73" />

---

### Search result

<img width="1920" height="993" alt="cineauragit" src="https://github.com/user-attachments/assets/25b43e5c-abdb-4270-8f73-d94aa3517c18" />

---
### Movie page

<img width="1920" height="993" alt="cineauragit5" src="https://github.com/user-attachments/assets/0c94bc82-dbb9-49e9-bb8c-d1b455aad1f9" />

---
### Series page

<img width="1920" height="993" alt="cineauragit7" src="https://github.com/user-attachments/assets/f9f4011f-1ee1-4fb6-8611-00ef96bca6af" />

---
### People page

<img width="1920" height="993" alt="cineauragit6" src="https://github.com/user-attachments/assets/6edf43af-6f30-4faf-b27d-09431e0621ed" />

---
### Sign-Up

<img width="1920" height="992" alt="cineauragit3" src="https://github.com/user-attachments/assets/d46043f0-4653-45cf-8abc-a04fb930568f" />

---
### Login

<img width="1920" height="995" alt="cineauragit4" src="https://github.com/user-attachments/assets/46966d2b-8a5b-4200-9f97-004e858bd724" />

---

## Contributing

### Fork the repo
### Create a new branch
  ```
  git checkout -b feature-name
  ```
### Commit changes
  ```
  git commit -m "Added new feature"
  ```
### Push
  ```
  git push origin feature-name
  ```
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
