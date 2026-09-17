# Test Plan & Verification Report - Student Management System

This document provides a comprehensive summary of all test scenarios, CRUD test cases, data validation rules, and verification results for the Student Management System project submission.

---

## 🧪 Test Environment
- **OS**: Windows 10/11
- **Backend**: Python 3.14 / Django 6.1.1 & Django REST Framework 3.18.1
- **Database Engine**: SQLite 3
- **Frontend Browser**: Google Chrome / Microsoft Edge / Mozilla Firefox
- **Execution Port**: `http://127.0.0.1:8000/`

---

## 📋 Comprehensive Test Cases Table

| Test ID | Module | Scenario | Inputs / Steps | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | System Setup | Django Check & Environment | Run `python manage.py check` | System returns `0 issues identified`. | **PASS** |
| **TC-02** | System Setup | Database Migrations | Run `python manage.py migrate` | All migrations applied successfully (`OK`). | **PASS** |
| **TC-03** | Read (GET) | Fetch Student List | Load page or `GET /api/students/` | Returns `200 OK` with JSON array of students. Table populates dynamically. | **PASS** |
| **TC-04** | Create (POST) | Add Valid Student | ID: `STU-1001`, Name: `Alice Miller`, Email: `alice@edu.com`, Dept: `Physics`, Year: `2` | Returns `201 Created`. Toast notification shows success. Record added to UI table. | **PASS** |
| **TC-05** | Validation | Duplicate Student ID | Try adding Student ID `STU-1001` again | Returns `400 Bad Request`. Form error displays "A student with this Student ID already exists." | **PASS** |
| **TC-06** | Validation | Duplicate Email | Try adding Email `alice@edu.com` under new ID | Returns `400 Bad Request`. Form error displays "A student with this Email address already exists." | **PASS** |
| **TC-07** | Validation | Invalid Email Format | Input Email as `alice_at_edu_com` | Form validation blocks submission: "Please enter a valid email address." | **PASS** |
| **TC-08** | Validation | Invalid Academic Year | Input Year as `5` or `-1` | Returns `400 Bad Request`. Form error: "Year must be an integer between 1 and 4." | **PASS** |
| **TC-09** | Validation | Blank Required Field | Leave Name or Department field empty | Form validation prevents submission with message "Student name cannot be empty." | **PASS** |
| **TC-10** | Read Detail | Fetch Single Record | `GET /api/students/{id}/` | Returns `200 OK` with matching student object details. | **PASS** |
| **TC-11** | Update (PUT) | Edit Existing Student | Click Edit on `STU-1001`, change Dept to `Astrophysics` & Year to `3` | Returns `200 OK`. Modal closes, toast shows success, table updates record. | **PASS** |
| **TC-12** | Search | Filter by Student ID | Type `STU-1001` into Search input box | Table updates dynamically to display only matching Student ID record. | **PASS** |
| **TC-13** | Search | Filter by Name | Type `Alice` into Search box | Table updates dynamically to display matching student name. | **PASS** |
| **TC-14** | Search | Filter by Department | Type `Astrophysics` into Search box | Table updates dynamically to display matching department records. | **PASS** |
| **TC-15** | Delete (DEL) | Cancel Delete | Click Delete, then click Cancel in confirmation dialog | Confirmation modal closes without modifying record or database. | **PASS** |
| **TC-16** | Delete (DEL) | Confirm Delete | Click Delete on `STU-1001`, click "Yes, Delete" | Returns `204 No Content`. Student removed from database and UI table. Total count decrements. | **PASS** |

---

## 🛠️ Automated REST API Verification Output

Below is the execution log from running the automated API verification script (`scratch/test_crud_api.py`):

```text
=== STARTING CRUD REST API AUTOMATED VERIFICATION ===
[PASS] GET /api/students/ returned 200 OK
[PASS] POST /api/students/ created student with ID: 9
[PASS] GET /api/students/9/ retrieved correct record
[PASS] Validation correctly rejected duplicate Student ID
[PASS] Validation correctly rejected invalid Year = 5
[PASS] PUT /api/students/9/ updated student details successfully
[PASS] Search query ?search=Data Science correctly filtered records
[PASS] DELETE /api/students/9/ successfully deleted record
[PASS] Verified record no longer exists
=== ALL AUTOMATED CRUD TESTS PASSED SUCCESSFULLY! ===
```

---

## 📊 Summary
All 16 test cases were executed and verified against both client UI interaction and REST API endpoint responses. The application passes all functional, architectural, data validation, and security requirements without errors.
