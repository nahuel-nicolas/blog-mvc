import pytest
from django.urls import reverse
from django.contrib.auth.models import User

@pytest.mark.django_db
def test_register_user(client):
	payload = dict(
		username="nahuel",
		password="password123",
	)
	response = client.post("/authentication/user/", payload)
	data = response.data
	assert data["username"] == payload["username"]
	userInDatabase = User.objects.get(id=data["id"])
	assert userInDatabase.id == data["id"]

@pytest.mark.django_db
def test_login_user(client, registered_user):
	url = reverse("authentication:token_obtain_pair")
	response = client.post(url, dict(username="nahuel", password="password123"))
	assert response.status_code == 200

@pytest.mark.django_db
def test_token_refresh(authenticated_user_client):
	url = reverse("authentication:token_refresh")
	client = authenticated_user_client["client"]
	token = authenticated_user_client["token"]
	response = client.post(url, dict(refresh=token["refresh"]))
	assert response.status_code == 200
	newToken = response.data
	client.credentials(HTTP_AUTHORIZATION='Bearer ' + newToken["access"])

	url = reverse("authentication:authentication_home")
	client = authenticated_user_client["client"]
	response = client.get(url)
	assert response.status_code == 200