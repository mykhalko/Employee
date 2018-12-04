from random import choice
from functools import reduce
import os

from django import test
from django.db.models import Q

from . import models
from .settings import BASE_DIR


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
