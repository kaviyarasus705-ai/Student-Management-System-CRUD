from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'name', 'email', 'department', 'year', 'created_at')
    search_fields = ('student_id', 'name', 'email', 'department')
    list_filter = ('department', 'year')
