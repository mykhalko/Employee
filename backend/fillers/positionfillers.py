import os
from random import randint, choice


class PositionRandomizer:

    def __init__(self, positions=None):
        directory = os.path.dirname(os.path.abspath(__file__))
        if positions is None:
            positions = self.read_from(directory + '/data_units/positions.txt')
        self._positions = positions

    def read_from(self, filepath):
        with open(filepath, 'r') as file:
            data = file.read().split('\n')
        return data

    @property
    def random_position(self):
        return choice(self._positions)
