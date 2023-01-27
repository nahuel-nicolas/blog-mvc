import pytest
from blog_app.models import Post


@pytest.mark.django_db
def test_check_no_posts_in_database():
    posts = Post.objects.all()
    assert not posts.exists()

@pytest.mark.django_db
def test_check_no_post_in_api(authenticated_user_client):
    client = authenticated_user_client["client"]
    response = client.get("/post/")
    assert response.data == []

@pytest.mark.django_db
def test_get_post(database_auth_user, authenticated_user_client):
    post_data = dict(
        author=database_auth_user,
        title='test post',
        body='test body',
        slug='test-slug',
    )
    created_post = Post.objects.create(**post_data)
    client = authenticated_user_client["client"]
    response = client.get(f"/post/{created_post.id}/")
    assert response.data['title'] == post_data['title']

    response = client.get(f"/post/")
    assert len(response.data) == 1

    second_created_post = Post.objects.create(
        author=database_auth_user,
        title='test post 2',
        body='test body 2',
        slug='test-slug2',
    )
    response = client.get(f"/post/")
    assert len(response.data) == 2