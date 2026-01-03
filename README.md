# Attendance Management System (AMS)

The **Attendance Management System (AMS)** is a full-stack web application developed to efficiently manage and monitor academic attendance.  
It supports **role-based access** for **Admin, Teacher, and Student**, ensuring proper control, transparency, and ease of use.

The system is designed with a **modern frontend**, a **secure backend**, and a **lightweight database**, making it suitable for academic projects and real-world learning purposes.

---

## 🎯 Project Objectives

- Digitize the traditional attendance process
- Provide role-based dashboards and access control
- Maintain accurate and persistent attendance records
- Generate attendance summaries and reports
- Offer a clean and responsive user interface

---

## 🧰 Tech Stack

### 🔙 Backend
- **Framework:** .NET 9.0 Web API  
- **Database:** SQLite  
- **ORM:** Entity Framework Core  
- **Authentication:** JWT (JSON Web Tokens)  
- **API Documentation:** Swagger UI  

### 🎨 Frontend
- **Framework:** React 19 (Vite)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS  
- **API Communication:** Axios  
- **State Management:** Context API  
- **Reports & Visualization:** Chart.js, jsPDF  

---

## ✨ System Features

### 🛡️ Admin Panel
- Create and manage **Teachers** and **Students**
- Manage **Academic Sessions**, **Courses**, and **Sections**
- Assign teachers to courses and sections
- Define and manage **Timetables**
- View system overview and statistics

---

### 👨‍🏫 Teacher Dashboard
- View assigned courses and sections
- Mark daily student attendance
- View and generate attendance reports
- Access personal teaching timetable

---

### 👨‍🎓 Student Dashboard
- View personal attendance statistics
- Access complete attendance history
- View enrolled courses and profile information

---

## 📂 Project Structure

```bash
AttendanceManagementSystem/
│
├── AMS.API/                 # Backend (.NET Web API)
│   ├── Controllers/         # API Controllers
│   ├── Models/              # Database Entities
│   ├── Data/                # DbContext & Data Seeding
│   ├── Migrations/          # EF Core Migrations
│   └── ams.db               # SQLite Database
│
└── AMS.Frontend/            # Frontend (React + Vite)
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Role-based pages
    │   ├── context/         # Authentication & global state
    │   └── api/             # Axios configuration
````

---

## ⚙️ Getting Started

### ✅ Prerequisites

* [.NET 9.0 SDK](https://dotnet.microsoft.com/)
* [Node.js](https://nodejs.org/) (v18+ recommended)
* Git

---

## 🔧 Backend Setup (`AMS.API`)

```bash
cd AMS.API
dotnet restore
dotnet run
```

* Database is **automatically created and seeded**
* Backend runs on `http://localhost:5000`
* Swagger UI available at:

  ```
  http://localhost:5000/swagger/index.html
  ```

---

## 🎨 Frontend Setup (`AMS.Frontend`)

```bash
cd AMS.Frontend
npm install
npm run dev
```

* Frontend runs on:

  ```
  http://localhost:5173
  ```

---

## 🔐 Authentication & Roles

The system uses **JWT-based authentication**.

Default seeded credentials *(if enabled in `DbInitializer.cs`)*:

| Role    | Email                                     | Password    |
| ------- | ----------------------------------------- | ----------- |
| Admin   | [admin@ams.com](mailto:admin@ams.com)     | Admin123!   |
| Teacher | [teacher@ams.com](mailto:teacher@ams.com) | Teacher123! |

> ⚠️ Credentials may vary — check
> `AMS.API/Data/DbInitializer.cs`

---

## 📌 Notes

* This project is intended for **educational and learning purposes**
* Easily extendable for:

  * Biometric attendance
  * QR-based attendance
  * Cloud database integration
  * Role-based analytics

---

## 📄 License

This project is licensed under the **MIT License**.