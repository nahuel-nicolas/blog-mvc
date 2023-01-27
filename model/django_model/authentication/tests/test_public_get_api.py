import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_authentication_home_public_acces(client):
	url = reverse("authentication:authentication_home")
	response = client.get(url)
	assert response.status_code == 200

@pytest.mark.django_db
def test_get_public_user_page(client):
	response = client.get("/authentication/user/")
	assert response.status_code == 200