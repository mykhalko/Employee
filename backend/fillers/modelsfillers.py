from random import random, choice, randint
from datetime import datetime

from employee.models import Employee
from . import namefillers
from . import positionfillers


class EmployeeRandomizer():

    def __init__(self):
        self._name_filler = namefillers.FullnameRandomizer()
        self._position_filler = positionfillers.PositionRandomizer()

    @property
    def random_employee(self, start=1000000000, end=1500000000, queryset=None):
        if queryset is None:
            queryset = Employee.objects.all()
        fullname = self._name_filler.random_name
        position = self._position_filler.random_position
        salary = random() * 7000
        employment_date = datetime.date(datetime.fromtimestamp(randint(start, end)))
        superior = choice(queryset) if queryset.exists() else None
        return {
            'fullname': fullname,
            'position': position,
            'salary': salary,
            'employment_date': employment_date,
            'superior': superior
        }

    def fill_model_with(self, amount=10, leafs_only=False):
        queryset = None
        if leafs_only:
            queryset = [i for i in Employee.objects.all()]
        for i in range(amount):
            employee = Employee(**self.random_employee, queryset=queryset)
            employee.save()
