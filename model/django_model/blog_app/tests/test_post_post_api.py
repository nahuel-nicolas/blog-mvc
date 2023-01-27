import pytest

from blog_app.models import Post


@pytest.mark.django_db
def test_get_post(database_auth_user, authenticated_user_client):
    assert not Post.objects.all().exists()

    post_data = dict(
        author=database_auth_user.id,
        title='test post',
        body='test body',
        slug='test-slug',
    )
    client = authenticated_user_client["client"]
    response = client.post("/post/", post_data)
    assert is_response_ok(response)
    database_post = Post.objects.get(slug='test-slug')
    assert database_post.title == post_data['title']
    assert Post.objects.all().count() == 1

    second_post_data = dict(
        author=database_auth_user.id,
        title='test post 2',
        body='test body 2',
        slug='test-slug2',
    )
    response = client.post(f"/post/", second_post_data)
    assert is_response_ok(response)
    assert Post.objects.all().count() == 2

def is_response_ok(response):
    is_response_ok = response.status_code in [200, 201]
    if not is_response_ok:
        print(response.data)
    return is_response_ok