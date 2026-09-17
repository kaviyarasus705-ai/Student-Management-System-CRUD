from django.shortcuts import render
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Student
from .serializers import StudentSerializer

def index_view(request):
    """Renders the main single-page dashboard."""
    return render(request, 'students/index.html')

class StudentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for CRUD operations on Students.
    Supports filtering via query parameter: ?search=term
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_queryset(self):
        queryset = Student.objects.all()
        search_query = self.request.query_params.get('search', None) or self.request.query_params.get('q', None)
        if search_query:
            search_query = search_query.strip()
            queryset = queryset.filter(
                Q(student_id__icontains=search_query) |
                Q(name__icontains=search_query) |
                Q(department__icontains=search_query)
            )
        return queryset
