# Project Deployment Images #

## AWS Postgres DB page ##
![user](images/1-aws-postgres.png)

## AWS EC2 Instance page ##
![user](images/2-ec2-instance.png)

## Console Server Run ##
![user](images/3-running-server.png)


## Registering user on React (main) View ##
![user](images/4-registering-on-80.png)


## Main View Home ##
![user](images/5-80-home.png)

## Main View Create post ##
![user](images/6-80-first-post.png)
![user](images/7-80-home.png)

## Angular View ##
![user](images/8-angular-login.png)
![user](images/9-angular-home.png)
![user](images/10-angular-create-post.png)
![user](images/11-angular-home.png)

## Next View ##
![user](images/12-next-home.png)
![user](images/13-next-create-post.png)
![user](images/14-next-update-post.png)
![user](images/15-next-home.png)

## Node Controller ##
![user](images/16-node.png)

## Django Model ##
![user](images/17-django.png)
![user](images/18-django-posts.png)
![user](images/19-django-auth.png)
![user](images/20-django-users.png)

## React view ##
![user](images/21-react-home.png)

## React view DELETE Post ##
![user](images/22-react-delete-post.png)
![user](images/23-react-home.png)

## Server Console logs ##
![user](images/24-console-requests.png)

# Start containers:

docker-compose up

# Visit apps

react_view: http://0.0.0.0:3500/

angular_view: http://0.0.0.0:4200/

next_view: http://0.0.0.0:3000/

node_controller: http://0.0.0.0:3030/

django_model: http://0.0.0.0:8000/


# Manage database:

docker exec -it postgres psql -h localhost -p 5432 -U postgres -W

password=(ENTER)

postgres does not ask for password if user access from same origin.
