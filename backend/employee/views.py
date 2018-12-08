from django.core.exceptions import ValidationError
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework import status

from . import models
from . import serializers
from . import permissions


class EmployeeViewSet(ModelViewSet):

    model = models.Employee
    parser_classes = MultiPartParser, JSONParser
    serializer_class = serializers.EmployeeSerializer
    permission_classes = (permissions.IsStaffOrReadOnly, )
    queryset = models.Employee.objects.all()

    def get_queryset(self):
        query_params = self.request.query_params
        ordering = query_params.get('order_by')
        reverse = query_params.get('reverse')
        if ordering is not None:
            ordering = ordering.lower()
            if ordering in ('fullname', 'position', 'salary', 'employment_date'):
                ordering = ('-' if reverse is not None else '') + ordering
                return self.queryset.order_by(ordering)
        return self.queryset

    def filter_queryset(self, queryset):
        # get searching params
        query_params = self.request.query_params
        search_field = query_params.get('search_field')
        value = query_params.get('value')
        chief_only = query_params.get('chief_only')
        # filter to return chief only, if chief parameter provided
        # return data only with tree root nodes
        if chief_only is not None:
            queryset = queryset.filter(is_general_chief=True)
        # filter for searching
        # if parameters provided
        if search_field in ('fullname', 'position', 'employment_date', 'salary') and value:
            search_field = search_field.lower()
            try:
                # if searching by fullname or position
                # enough symbols sequence match, use query fieldname__icontains=value
                if search_field in ('fullname', 'position'):
                    search_field += '__icontains'
                # if searching by salary or date filter
                # queryset for records with equal field value
                # if value is incorrect (not float for salary search
                # or not in format %Y-%m-%d for employment date search)
                # return empty queryset
                db_query_args = {search_field: value}
                return queryset.filter(**db_query_args)
            except ValidationError:
                return queryset.none()
        return queryset

    def list(self, request, *args, **kwargs):
        query_params = request.query_params
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        query_params = request.query_params
        if query_params.get('subordinates') is not None:
            record = self.get_object()
            serializer = self.serializer_class(record.subordinates.all(), many=True)
            return Response(serializer.data)
        return super().retrieve(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        try:
            query_params = request.query_params
            instance = self.get_object()
            deletion_type = query_params.get('type')
            if deletion_type == 'delete_branch':
                instance.delete_branch()
            elif deletion_type == 'resubmission':
                print('in resub')
                new_superior_id = int(query_params.get('subdue_to'))
                new_superior = self.queryset.get(id=new_superior_id)
                print('new superior got')
                if new_superior.is_subdued_to(instance):
                    raise ValueError('New superior is subdued to employee for deletion')
                instance.delete(subdue_to=new_superior)
            else:
                instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except (TypeError, ValueError, self.model.DoesNotExist) as e:
            print(e)
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={'error': e.args[0]})
