import os


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEBUG = True

ALLOWED_HOSTS = ['*']

SECRET_KEY = 'jjbc=!99a&xjj&bvz7if7*%u%#=f0dg7*bibl98u7eivm!m-@l'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'EmployeeDevDB',
        'HOST': 'localhost',
        'PORT': 3306,
        'USER': 'EmployeeDevDBAdmin',
        'PASSWORD': 'EmployeeDevDBAdminPass',
    }
}
