from rest_framework import serializers
from rest_framework.validators import ValidationError

from . import models


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Employee
        fields = '__all__'

    def create(self, validated_data):
        model = self.Meta.model
        superior_id = validated_data.get('superior')
        if superior_id:
            superior = model.objects.get(id=superior_id)
            validated_data['superior'] = superior
        instance = model(**validated_data)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        # model = self.Meta.model
        # superior = validated_data.get('superior')
        # if superior_id:
        #     superior = validated_data
        #     validated_data['superior'] = superior
        for key in validated_data:
            setattr(instance, key, validated_data[key])
        instance.save()
        return instance

    def validate_superior(self, superior):
        model = self.Meta.model
        if self.instance:
            if superior.is_subdued_to(self.instance):
                raise ValidationError('Incorrect superior id; superior is \
                subordinate of instance to update')
        return superior

    def validate_image(self, image):
        if image.size > 1048576:
            raise ValidationError('Images with size bigger then 1MB not allowed')
        return image
