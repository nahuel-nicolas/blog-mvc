Run database:
docker-compose up
# docker exec -it postgres bash
# psql -h localhost -p 5432 -U postgres -W
docker exec -it postgres psql -h localhost -p 5432 -U postgres -W
password=(ENTER)

# docker exec -it postgres psql -U postgres

ports
8000 django
3030 node
3000 next
3500 react
4200 angular