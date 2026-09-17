/**
 * Student Management System - Vanilla JavaScript Client
 * Handles API communication via fetch(), DOM manipulation, and UI states.
 */

const API_BASE_URL = '/api/students/';

let currentStudentsList = [];
let editingStudentId = null;
let deletingStudentId = null;

// Utility to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Show Toast Notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span style="font-weight: 600;">${type === 'success' ? '✓' : '⚠'}</span>
    <div>${message}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadStudents();

  // Search input live handler with debounce
  const searchInput = document.getElementById('searchInput');
  let searchTimeout = null;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadStudents(e.target.value.trim());
    }, 300);
  });

  // Form Submission
  const studentForm = document.getElementById('studentForm');
  studentForm.addEventListener('submit', handleFormSubmit);
});

// Fetch Students from REST API
async function loadStudents(query = '') {
  const tableBody = document.getElementById('studentTableBody');
  tableBody.innerHTML = `
    <tr>
      <td colspan="6" style="text-align: center; padding: 2rem; color: #64748b;">
        Loading student records...
      </td>
    </tr>
  `;

  try {
    let url = API_BASE_URL;
    if (query) {
      url += `?search=${encodeURIComponent(query)}`;
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching records: ${response.statusText}`);
    }

    const data = await response.json();
    currentStudentsList = data;
    renderStudentsTable(data);
    updateDashboardStats(data);
  } catch (error) {
    console.error('Fetch error:', error);
    showToast(`Failed to load students: ${error.message}`, 'error');
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: #ef4444;">
          Failed to load students. Please check server connection.
        </td>
      </tr>
    `;
  }
}

// Update Dashboard Statistics Cards
function updateDashboardStats(students) {
  const totalStudentsElem = document.getElementById('totalStudentsCount');
  const totalDeptsElem = document.getElementById('totalDeptsCount');

  if (totalStudentsElem) {
    totalStudentsElem.textContent = students.length;
  }

  if (totalDeptsElem) {
    const uniqueDepts = new Set(
      students.map(s => (s.department || '').trim().toLowerCase()).filter(Boolean)
    );
    totalDeptsElem.textContent = uniqueDepts.size;
  }
}

// Render Table Rows
function renderStudentsTable(students) {
  const tableBody = document.getElementById('studentTableBody');
  tableBody.innerHTML = '';

  if (!students || students.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p>No student records found.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  students.forEach(student => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="student-id-badge">${escapeHtml(student.student_id)}</span></td>
      <td style="font-weight: 500; color: #0f172a;">${escapeHtml(student.name)}</td>
      <td style="color: #475569;">${escapeHtml(student.email)}</td>
      <td><span class="dept-badge">${escapeHtml(student.department)}</span></td>
      <td><span class="year-badge">Year ${student.year}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-edit" onclick="openEditModal(${student.id})">
            Edit
          </button>
          <button class="btn btn-delete" onclick="confirmDeleteStudent(${student.id}, '${escapeHtml(student.name)}')">
            Delete
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Helper to escape HTML string
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Open Modal for Add
function openAddModal() {
  editingStudentId = null;
  document.getElementById('modalTitle').textContent = 'Add New Student';
  document.getElementById('studentForm').reset();
  document.getElementById('formErrors').style.display = 'none';
  document.getElementById('studentModal').classList.add('active');
}

// Open Modal for Edit
async function openEditModal(id) {
  editingStudentId = id;
  document.getElementById('modalTitle').textContent = 'Edit Student Details';
  document.getElementById('studentForm').reset();
  document.getElementById('formErrors').style.display = 'none';

  let student = currentStudentsList.find(s => s.id === id);

  if (!student) {
    try {
      const response = await fetch(`${API_BASE_URL}${id}/`);
      if (response.ok) {
        student = await response.json();
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!student) {
    showToast('Failed to load student details for editing', 'error');
    return;
  }

  document.getElementById('studentIdInput').value = student.student_id;
  document.getElementById('nameInput').value = student.name;
  document.getElementById('emailInput').value = student.email;
  document.getElementById('departmentInput').value = student.department;
  document.getElementById('yearInput').value = student.year;

  document.getElementById('studentModal').classList.add('active');
}

// Close Student Modal
function closeModal() {
  document.getElementById('studentModal').classList.remove('active');
  editingStudentId = null;
}

// Validate Form Inputs Client-Side
function validateFormInputs(payload) {
  const errors = [];

  if (!payload.student_id) {
    errors.push('Student ID is required.');
  }

  if (!payload.name) {
    errors.push('Name is required.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!payload.email) {
    errors.push('Email is required.');
  } else if (!emailRegex.test(payload.email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!payload.department) {
    errors.push('Department is required.');
  }

  const yearNum = parseInt(payload.year, 10);
  if (isNaN(yearNum) || yearNum < 1 || yearNum > 4) {
    errors.push('Year must be an integer between 1 and 4.');
  }

  return errors;
}

// Handle Form Submit (CREATE / UPDATE)
async function handleFormSubmit(e) {
  e.preventDefault();

  const payload = {
    student_id: document.getElementById('studentIdInput').value.trim(),
    name: document.getElementById('nameInput').value.trim(),
    email: document.getElementById('emailInput').value.trim(),
    department: document.getElementById('departmentInput').value.trim(),
    year: parseInt(document.getElementById('yearInput').value, 10)
  };

  const clientErrors = validateFormInputs(payload);
  const errorBox = document.getElementById('formErrors');

  if (clientErrors.length > 0) {
    errorBox.innerHTML = clientErrors.join('<br>');
    errorBox.style.display = 'block';
    return;
  } else {
    errorBox.style.display = 'none';
  }

  const isEdit = editingStudentId !== null;
  const url = isEdit ? `${API_BASE_URL}${editingStudentId}/` : API_BASE_URL;
  const method = isEdit ? 'PUT' : 'POST';

  const csrftoken = getCookie('csrftoken') || '';

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMsg = 'Validation failed: ';
      if (typeof data === 'object') {
        const messages = [];
        for (const [key, val] of Object.entries(data)) {
          const text = Array.isArray(val) ? val.join(' ') : val;
          messages.push(`${key.toUpperCase()}: ${text}`);
        }
        errorMsg += messages.join(' | ');
      } else {
        errorMsg += response.statusText;
      }
      errorBox.innerHTML = errorMsg;
      errorBox.style.display = 'block';
      return;
    }

    closeModal();
    showToast(isEdit ? 'Student record updated successfully!' : 'Student added successfully!', 'success');
    loadStudents();
  } catch (error) {
    console.error('API Error:', error);
    errorBox.innerHTML = `Server Connection Error: ${error.message}`;
    errorBox.style.display = 'block';
  }
}

// Open Delete Confirmation Modal
function confirmDeleteStudent(id, name) {
  deletingStudentId = id;
  document.getElementById('deleteStudentName').textContent = name;
  document.getElementById('deleteModal').classList.add('active');
}

// Close Delete Modal
function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('active');
  deletingStudentId = null;
}

// Execute Delete Request
async function executeDelete() {
  if (!deletingStudentId) return;

  const csrftoken = getCookie('csrftoken') || '';

  try {
    const response = await fetch(`${API_BASE_URL}${deletingStudentId}/`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': csrftoken
      }
    });

    if (response.status === 204 || response.ok) {
      closeDeleteModal();
      showToast('Student deleted successfully', 'success');
      loadStudents();
    } else {
      const data = await response.json().catch(() => ({}));
      showToast(`Delete failed: ${data.detail || response.statusText}`, 'error');
    }
  } catch (error) {
    console.error('Delete error:', error);
    showToast(`Network error while deleting student: ${error.message}`, 'error');
  }
}
