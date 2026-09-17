from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'student_id', 'name', 'email', 'department', 'year', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_student_id(self, value):
        val = str(value).strip()
        if not val:
            raise serializers.ValidationError("Student ID cannot be empty.")
        
        # Check uniqueness during creation or update
        instance = getattr(self, 'instance', None)
        qs = Student.objects.filter(student_id__iexact=val)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A student with this Student ID already exists.")
        return val

    def validate_email(self, value):
        val = str(value).strip().lower()
        if not val:
            raise serializers.ValidationError("Email address cannot be empty.")
        
        instance = getattr(self, 'instance', None)
        qs = Student.objects.filter(email__iexact=val)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A student with this Email address already exists.")
        return val

    def validate_name(self, value):
        val = str(value).strip()
        if not val:
            raise serializers.ValidationError("Student name cannot be empty.")
        return val

    def validate_department(self, value):
        val = str(value).strip()
        if not val:
            raise serializers.ValidationError("Department cannot be empty.")
        return val

    def validate_year(self, value):
        try:
            val = int(value)
        except (ValueError, TypeError):
            raise serializers.ValidationError("Year must be an integer between 1 and 4.")
        
        if val not in [1, 2, 3, 4]:
            raise serializers.ValidationError("Year must be either 1, 2, 3, or 4.")
        return val
