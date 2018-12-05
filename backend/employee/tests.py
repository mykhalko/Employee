from random import choice
from functools import reduce
import os

from django import test
from django.db.models import Q
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, APIClient
from rest_framework_jwt.views import obtain_jwt_token

from . import models
from .settings import BASE_DIR
from .views import EmployeeViewSet


User = get_user_model()


class EmployeeModelTest(test.TestCase):

    fixtures = [os.path.join(BASE_DIR, 'fixtures/Employee.json')]

    def setUp(self):
        self._root = models.Employee.objects.first()

    def hardcoded_delete_with_subdue(self):
        employee = models.Employee.objects.get(id=244)
        subordinates = employee.subordinates.all()
        superior = employee.superior
        employee.delete(subdue_to=superior)
        for subordinate in subordinates:
            subordinate.refresh_from_db()
            self.assertEqual(subordinate.superior.id, superior.id)

    def hardcoded_branch_delete(self):
        employee_for_delete = models.Employee.objects.get(id=288)
        subordinates_ids = [e.id for e in employee_for_delete.subordinates.all()]
        query = reduce(lambda query, pk: query | Q(pk=pk), subordinates_ids, Q())
        employee_for_delete.delete_branch()
        self.assertFalse(models.Employee.objects.filter(query).exists())

    def random_delete_with_subdue(self):
        for i in range(3):
            employee = choice(models.Employee.objects.all().exclude(superior=None))
            subordinates = employee.subordinates.all()
            superior = employee.superior
            employee.delete(subdue_to=superior)
            for subordinate in subordinates:
                subordinate.refresh_from_db()
                self.assertEqual(subordinate.superiod.id, superior.id)

    def random_branch_delete(self):
        for i in range(3):
            employee_for_delete = choice(models.Employee.objects.all().exclude(superior=None))
            subordinates_ids = [e.id for e in employee_for_delete.subordinates.all()]
            query = reduce(lambda query, pk: query | Q(pk=pk), subordinates_ids, Q())
            if query == Q():
                return
            employee_for_delete.delete_branch()
            self.assertFalse(models.Employee.objects.filter(query).exists())

    def test_delete_with_subdue(self):
        self.hardcoded_delete_with_subdue()
        self.random_delete_with_subdue()

    def test_branch_delete(self):
        self.hardcoded_branch_delete()
        self.random_branch_delete()

    def test_is_subdued_to(self):
        queryset = models.Employee.objects.all().exclude(superior=None)
        for employee in [choice(queryset) for i in range(3)]:
            self.assertTrue(employee.is_subdued_to(self._root))
            self.assertFalse(self._root.is_subdued_to(employee))


class EmployeeViewSetTest(test.TestCase):

    fixtures = [os.path.join(BASE_DIR, 'fixtures/Employee.json'),
                os.path.join(BASE_DIR, 'fixtures/Auth.json')]

    def setUp(self):
        factory = APIRequestFactory()
        superuser = User.objects.filter(is_superuser=True)
        auth_credentials = {
            'username': 'admin',
            'password': 'adminpassword'
        }
        response = obtain_jwt_token(factory.post('/api/token-auth', data=auth_credentials))
        token = response.data['token']
        self.factory = factory
        self.superuser = superuser
        self.auth_credentials = auth_credentials
        self.token = token

    def test_fullname_search(self):
        name_part = 'novak'
        request = self.factory.get(f'/api/employee?search_field=fullname&value={name_part}')
        response = EmployeeViewSet.as_view({'get': 'list'})(request)
        results = response.data['results']
        for item in results:
            fullname = item['fullname']
            self.assertTrue(name_part in fullname.lower())

    def test_position_search(self):
        position_title_part = 'specialist'
        request = self.factory.get(f'/api/employee?search_field=position&value={position_title_part}')
        response = EmployeeViewSet.as_view({'get': 'list'})(request)
        results = response.data['results']
        for item in results:
            position = item['position']
            self.assertTrue(position_title_part in position.lower())

    def test_date_search(self):
        search_date = '2017-05-05'
        request = self.factory.get(f'/api/employee?search_field=employment_date&value={search_date}')
        response = EmployeeViewSet.as_view({'get': 'list'})(request)
        results = response.data['results']
        for item in results:
            employment_date = item['employment_date']
            self.assertEquals(search_date, employment_date)

    def test_salary_search(self):
        search_salary = str(5206.19)
        request = self.factory.get(f'/api/employee?search_field=salary&value={search_salary}')
        response = EmployeeViewSet.as_view({'get': 'list'})(request)
        results = response.data['results']
        for item in results:
            salary = item['salary']
            self.assertEquals(search_salary, salary)

    def test_unauthenticated_safe_methods(self):
        request = self.factory.get('/api/employee')
        response = EmployeeViewSet.as_view({'get': 'list'})(request)
        self.assertEquals(response.status_code, 200)

        request = self.factory.get(f'/api/employee/1')
        response = EmployeeViewSet.as_view({'get': 'retrieve'})(request, pk=1)
        self.assertEquals(response.status_code, 200)

    def test_unauthenticated_unsafe_methods(self):
        data = {
            'fullname': 'abc',
            'position': 'xyz',
            'salary': "9999999.99",
            'employment_date': '2000-12-12',
        }
        request = self.factory.put('/api/employee/1', data=data)
        response = EmployeeViewSet.as_view({'put': 'update'})(request, pk=1)
        self.assertEquals(response.status_code, 401)

        data = {
            'salary': "9.99"
        }
        request = self.factory.patch(f'/api/employee/1')
        response = EmployeeViewSet.as_view({'patch': 'partial_update'})(request, pk=1)
        self.assertEquals(response.status_code, 401)

        request = self.factory.delete('/api/employee/1')
        response = EmployeeViewSet.as_view({'delete': 'destroy'})(request, pk=1)
        self.assertEquals(response.status_code, 401)

        data = {
            'fullname': 'abc',
            'position': 'xyz',
            'salary': "9999999.99",
            'employment_date': '2000-12-12',
        }
        request = self.factory.post('/api/employee')
        response = EmployeeViewSet.as_view({'post': 'create'})(request)
        self.assertEquals(response.status_code, 401)

    def test_authenticated_as_staff_safe_methods(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get('/api/employee')
        self.assertEquals(response.status_code, 200)

        response = client.get('/api/employee/1')
        self.assertEquals(response.status_code, 200)

    def test_authenticated_as_staff_unsafe_methods(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)

        data = {
            'fullname': 'abc',
            'position': 'xyz',
            'salary': "9999999.99",
            'employment_date': '2000-12-12',
        }
        response = client.post('/api/employee', data=data)
        self.assertEquals(response.status_code, 201)
        record_id = response.data['id']
        for key in data:
            self.assertEquals(data[key], response.data[key])

        data = {
            'fullname': 'ABC',
            'position': 'MJK',
            'salary': "99.99",
            'employment_date': '2010-12-12',
        }
        response = client.put(f'/api/employee/{record_id}', data=data)
        self.assertEquals(response.status_code, 200)
        for key in data:
            self.assertEquals(data[key], response.data[key])

        data = {
            'salary': "1.99"
        }
        response = client.patch(f'/api/employee/{record_id}', data=data)
        self.assertEquals(response.status_code, 200)
        for key in data:
            self.assertEquals(data[key], response.data[key])

        response = client.delete(f'/api/employee/{record_id}')
        self.assertEquals(response.status_code, 204)

        response = client.get(f'/api/employee/{record_id}')
        self.assertEquals(response.status_code, 404)
