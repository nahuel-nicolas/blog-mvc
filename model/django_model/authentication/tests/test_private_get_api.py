import pytest

@pytest.mark.django_db
def test_get_private_user_page(authenticated_user_client):
    client = authenticated_user_client["client"]
    response = client.get("/authentication/user/")
    assert response.status_code == 200