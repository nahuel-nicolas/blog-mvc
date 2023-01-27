from django.contrib.auth.models import User
from django.urls import reverse

import pytest
from rest_framework.test import APIClient


@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def registered_user(client):
    payload = dict(
		username="nahuel",
		password="password123",
	)
    response = client.post("/authentication/user/", payload)
    return response.data

@pytest.fixture
def authenticated_user_client(client, registered_user):
    url = reverse("authentication:token_obtain_pair")
    response = client.post(url, dict(username="nahuel", password="password123"))
    token = response.data
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + token["access"])
    return dict(client=client, userData=registered_user, token=token)

@pytest.fixture
def database_auth_user():
    return User.objects.create(
        username='test_user',
        password='password123'
    )