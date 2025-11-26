# 🎬 MovieApp

A **full-stack movie platform** built with **Angular 17 (SSR)** and **ASP.NET Core + PostgreSQL**.  
Browse genres, search TMDB, check details with dynamic backgrounds, post comments, manage favorites, and administer data via a dedicated backoffice.

---

## 📸 Screenshots


- Home with top-rated carousel
  <img width="1721" height="952" alt="image" src="https://github.com/user-attachments/assets/3584b601-60b6-4ee8-bfe0-3e2445dd0748" />

- Genre browsing + movie cards
  <img width="1716" height="959" alt="image" src="https://github.com/user-attachments/assets/bdcbfd67-bd71-4f27-adbc-3e095b889ac8" />

- Movie details with comments & themed background
  <img width="1721" height="952" alt="image" src="https://github.com/user-attachments/assets/3fd8f412-d9e6-4e0a-b0e0-c0bb3f51dcfa" />
  <img width="1716" height="970" alt="image" src="https://github.com/user-attachments/assets/fdadcb7a-f2fe-46d9-baef-61b63b5f26e4" />

- Search by name

<img width="1719" height="948" alt="image" src="https://github.com/user-attachments/assets/3607e4e1-1a09-4cb0-94ef-6a4f5be7cae4" />

- Favorites
  <img width="1716" height="960" alt="image" src="https://github.com/user-attachments/assets/85190423-a93b-415b-acac-500d1f00e397" />

- Register/Log in
  <img width="1717" height="952" alt="image" src="https://github.com/user-attachments/assets/40c8e73e-d3d4-4838-8773-0babde7143e2" />


- Admin dashboard
<img width="1720" height="952" alt="image" src="https://github.com/user-attachments/assets/003abe1d-cc89-427d-bdcb-041b447dca76" />
<img width="1721" height="953" alt="image" src="https://github.com/user-attachments/assets/0543e646-7dfa-4f41-a082-fca87019a234" />
<img width="1719" height="957" alt="image" src="https://github.com/user-attachments/assets/9f6a12e5-c910-4bce-bde2-ddcc9bf822be" />



---



---

## ⚙️ Requirements

- **Angular CLI** ≥ 17  
- **.NET SDK** ≥ 8.0  
- **PostgreSQL** ≥ 14  
- **TMDB v4 Access Token**

---

## 🚀 Setup Guide

### 1️⃣ Clone the repository

    git clone https://github.com/santiagodap1/movieApp.git
    cd movieApp

### 2️⃣ Backend (.NET) setup

    cd Backend
    dotnet restore

Configure `appsettings.json` (or `appsettings.Development.json`):

    {
      "ConnectionStrings": {
        "DefaultConnection": "Host=localhost;Port=5432;Database=movieapp;Username=postgres;Password=postgres"
      },
      "Jwt": {
        "Key": "<your-strong-secret>"
      },
      "DefaultAdmin": {
        "Name": "Administrator",
        "Email": "admin@example.com",
        "Password": "ChangeMe123!"
      }
    }

> ⚠️ For production, move `Jwt.Key` and `DefaultAdmin` credentials to secure environment variables or secret storage, and rotate the admin password after seeding.

Apply migrations and run the API:

    dotnet ef database update
    dotnet run

Backend listens on `http://localhost:5072/` and seeds the default admin if absent.

---

### 3️⃣ Frontend (Angular) setup

    cd ../Frontend
    npm install

Set TMDB + API base URL in `src/environments/environment.ts`:

    export const environment = {
      production: false,
      tmdbApiKey: 'YOUR_TMDB_V4_ACCESS_TOKEN',
      apiBaseUrl: 'http://localhost:5072/api'
    };

Start the Angular dev server:

    npm run start

Visit `http://localhost:4200`.

---

## 🔐 Key Features

- **User auth** (signup/login) with JWT + BCrypt hashing.
- **Favorites & comments** linked to each account.
- **Top-rated carousel** with automatic scroll and matching page background.
- **Admin backoffice** (`/admin`) for CRUD on users, favorites, and comments (Admin role required).
