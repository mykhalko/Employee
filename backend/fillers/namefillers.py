import os
from random import choice, randint


class FullnameRandomizer:

    def __init__(self, male_names=None, female_names=None, surnames=None):
        directory = os.path.dirname(os.path.abspath(__file__))
        if male_names is None:
            male_names = self.read_from(directory + '/data_units/male_names.txt')
        if female_names is None:
            female_names = self.read_from(directory + '/data_units/female_names.txt')
        if surnames is None:
            surnames = self.read_from(directory + '/data_units/surnames.txt')
        self._male_names = male_names
        self._female_names = female_names
        self._surnames = surnames

    def read_from(self, filepath):
        with open(filepath, 'r') as file:
            data = file.read().split('\n')
        return data

    @property
    def random_name(self):
        if randint(0, 1):
            names = self._male_names
        else:
            names = self._female_names
        first_name = choice(names)
        middle_name = choice(names)
        surname = choice(self._surnames)
        return ' '.join((first_name, middle_name, surname))
