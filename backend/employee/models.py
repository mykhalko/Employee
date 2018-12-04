from django.db import models


class Employee(models.Model):

    fullname = models.CharField(max_length=255, null=False, blank=False)
    position = models.CharField(max_length=127, null=False, blank=False)
    employment_date = models.DateField(null=False, blank=False)
    salary = models.DecimalField(max_digits=12, decimal_places=2, null=False, blank=False)
    superior = models.ForeignKey('employee.Employee', related_name='subordinates',
                                 null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return str(self.pk) + '. ' + str(self.fullname) + ' ' + str(self.position)

    def delete(self, *args, subdue_to=None, **kwargs):
        if subdue_to is not None:
            if not isinstance(subdue_to, Employee):
                raise TypeError('subdue_to argument must be employee.Employee instance')
            if subdue_to.is_subdued_to(self):
                raise ValueError(str(subdue_to) + ' is subdued to Employee for delete')
            for subordinate in self.subordinates.all():
                subordinate.superior = subdue_to
                subordinate.save()
        super().delete(*args, **kwargs)

    def delete_branch(self):
        for subordinate in self.subordinates.all():
            subordinate.delete_branch()
        self.delete()

    def is_subdued_to(self, employee):
        superior = self.superior
        while superior:
            if superior == employee:
                return True
            superior = superior.superior
        return False

