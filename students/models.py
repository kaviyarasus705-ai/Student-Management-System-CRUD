from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Student(models.Model):
    student_id = models.CharField(
        max_length=30,
        unique=True,
        null=False,
        blank=False,
        help_text="Unique student registration ID"
    )
    name = models.CharField(
        max_length=100,
        null=False,
        blank=False
    )
    email = models.EmailField(
        unique=True,
        null=False,
        blank=False
    )
    department = models.CharField(
        max_length=100,
        null=False,
        blank=False
    )
    year = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(4)],
        null=False,
        blank=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student_id} - {self.name}"
