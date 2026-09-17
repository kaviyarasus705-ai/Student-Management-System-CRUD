# Student Management System

A full-stack, production-ready **Student Management System** web application built for college project submission and academic demonstration. Powered by **Python Django**, **Django REST Framework (DRF)**, **SQLite Database**, and a responsive **HTML5/CSS3/Vanilla JavaScript** single-page frontend.

---

## 📌 Project Overview
The Student Management System (SMS) is designed to streamline administrative tasks in educational institutions by providing a centralized platform for managing student records. The system delivers a seamless user experience where administrators can add, view, update, delete, and search student records dynamically without full page reloads.

---

## 🎯 Problem Statement
Traditional paper-based or file-bound student record management systems are prone to human errors, data duplication, data loss, and inefficient search processes. Maintaining student profiles manually across departments leads to inconsistent information and delayed administrative workflows. There is a need for a lightweight, secure, responsive, and easy-to-deploy web application to manage student data reliably.

---

## 🏁 Objectives
1. Develop a full-stack CRUD (Create, Read, Update, Delete) web application.
2. Build a robust RESTful API using Django REST Framework for standardized data access.
3. Enforce strict data validation (uniqueness of Student ID and Email, formatted input, year limits 1-4).
4. Provide a modern, responsive single-page user interface with real-time analytics (Total Students, Total Departments).
5. Deliver live search capability across Student ID, Full Name, and Department.
6. Ensure zero frontend framework dependencies (pure HTML5, CSS3, and JavaScript ES6) for fast loading and simplicity.

---

## 💻 Technology Stack
- **Backend Framework**: Python 3.14 / Django 6.x
- **REST API Middleware**: Django REST Framework (DRF 3.18)
- **Database Engine**: SQLite 3 (Django ORM integration)
- **Frontend Architecture**: HTML5, Vanilla CSS3 (Custom Glassmorphism design system), Vanilla JavaScript (ES6 `fetch()` API)
- **Security & Middleware**: Django CSRF Token Protection, Form Parsers, JSON Serializers

---

## 🏗️ System Architecture

```
                                +----------------------------------+
                                |      Web Browser (Client)        |
                                |  Single Page Dashboard (HTML/JS) |
                                +----------------------------------+
                                                 |
                                         HTTP / JSON Fetch
                                                 |
                                                 v
                                +----------------------------------+
                                |         Django Backend           |
                                |   (urls.py / views.py / DRF)     |
                                +----------------------------------+
                                                 |
                                          Django ORM Query
                                                 |
                                                 v
                                +----------------------------------+
                                |      SQLite Database (db.sqlite) |
                                |      Table: students_student     |
                                +----------------------------------+
```

### Directory Structure
```
Student Management System/
├── manage.py                   # Django administration entrypoint
├── requirements.txt            # Project dependencies
├── README.md                   # Complete system documentation
├── TESTING.md                  # Test suite & validation test cases
├── .gitignore                  # Version control ignore rules
├── db.sqlite3                  # Relational SQLite database
├── student_config/             # Django root configuration package
│   ├── __init__.py
│   ├── settings.py             # App registration, REST framework, DB setup
│   ├── urls.py                 # Main URL router
│   ├── wsgi.py                 # WSGI application server script
│   └── asgi.py                 # ASGI application server script
└── students/                   # Core application module
    ├── models.py               # Student database model definition
    ├── serializers.py          # DRF validation & JSON serialization
    ├── views.py                # REST ViewSets & Template controller
    ├── urls.py                 # API router endpoints (/api/students/)
    ├── admin.py                # Django Admin portal registration
    ├── migrations/             # Database migration files
    │   └── 0001_initial.py
    ├── templates/
    │   └── students/
    │       └── index.html      # Dashboard user interface
    └── static/
        ├── css/
        │   └── style.css       # Custom modern responsive styling
        └── js/
            └── app.js          # REST API client & DOM manipulation logic
```

---

## 🗄️ Database Design

### Entity Relationship & Schema Details
The application utilizes Django ORM mapped to an SQLite relational database table `students_student`.

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigAutoField | Primary Key, Auto Increment | Unique internal database record ID |
| `student_id` | CharField(30) | Unique, Required, Index | College Registration / Roll ID |
| `name` | CharField(100) | Required | Full Name of the Student |
| `email` | EmailField | Unique, Required, Validated | Email address of the Student |
| `department` | CharField(100) | Required | Academic Department / Major |
| `year` | IntegerField | Required, Range [1-4] | Academic Year (1: Fresh, 2: Soph, 3: Jun, 4: Sen) |
| `created_at` | DateTimeField | Auto Now Add | Record creation timestamp |
| `updated_at` | DateTimeField | Auto Now | Record last update timestamp |

---

## 🔄 CRUD Operations

1. **Create (POST)**: Users click **+ Add Student** to open a modal form. Validated payload is sent to `/api/students/` via `POST`. Upon success (`201 Created`), the table & KPI stat counters refresh automatically.
2. **Read (GET)**: On page load, `loadStudents()` dispatches `GET /api/students/`. Returned JSON records are dynamically rendered into table rows.
3. **Update (PUT/PATCH)**: Clicking **Edit** pre-fills the modal form with student data. Submitting dispatches `PUT /api/students/{id}/`, updating the record in SQLite.
4. **Delete (DELETE)**: Clicking **Delete** opens a confirmation modal dialog. Upon user approval, `DELETE /api/students/{id}/` removes the student from database & UI.

---

## 🌐 REST API Endpoints

| HTTP Method | Endpoint | Action | Request Payload | Response Code |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/students/` | List all students | None | `200 OK` |
| **GET** | `/api/students/?search={q}` | Search students | None | `200 OK` |
| **POST** | `/api/students/` | Create student record | JSON Object | `201 Created` / `400 Bad Request` |
| **GET** | `/api/students/{id}/` | Get student detail | None | `200 OK` / `404 Not Found` |
| **PUT** | `/api/students/{id}/` | Update student record | JSON Object | `200 OK` / `400 Bad Request` |
| **PATCH** | `/api/students/{id}/` | Partial update student | Partial JSON | `200 OK` / `400 Bad Request` |
| **DELETE** | `/api/students/{id}/` | Delete student record | None | `204 No Content` |

---

## 🛡️ Validation Rules

- **Required Fields**: Student ID, Name, Email, Department, and Year cannot be empty or whitespace.
- **Email Validation**: Must follow standard email format (`user@domain.ext`) and must be globally unique across all records.
- **Student ID Validation**: Must be unique in the system.
- **Academic Year Constraint**: Must be an integer restricted to `1`, `2`, `3`, or `4`.
- **Validation Layers**: Both Client-side (JavaScript regex & range checks) and Server-side (DRF Serializers & Django ORM validators) enforce data integrity.

---

## 🧪 Testing

The project includes an automated test runner script verifying all API endpoints and validation constraints.
- Test script location: `scratch/test_crud_api.py`
- Refer to [`TESTING.md`](file:///c:/Users/Lenovo%20L580/OneDrive/Desktop/Agrosential%20project/TESTING.md) for detailed test cases and expected outcomes.

---

## ⚙️ Installation & Execution Steps

### Prerequisites
- Python 3.8 or higher installed on system.

### Steps to Run
1. **Navigate to project directory**:
   ```bash
   cd "Agrosential project"
   ```

2. **Install required dependencies**:
   ```bash
   python -m pip install -r requirements.txt
   ```

3. **Apply database migrations**:
   ```bash
   python manage.py makemigrations students
   python manage.py migrate
   ```

4. **Seed sample data (Optional)**:
   ```bash
   python scratch/seed_data.py
   ```

5. **Start Django development server**:
   ```bash
   python manage.py runserver
   ```

6. **Access Application**:
   Open web browser at **`http://127.0.0.1:8000/`**

---

## 🚀 Future Enhancements
- User authentication and role-based access control (Admin / Teacher / Student view).
- Profile picture and Document file attachments for student profiles.
- Export student table data to PDF and Excel formats.
- Pagination for handling large scale student databases (10,000+ records).
