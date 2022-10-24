Run database:
docker-compose up
# docker exec -it postgres bash
# psql -h localhost -p 5432 -U postgres -W
docker exec -it postgres psql -h localhost -p 5432 -U postgres -W
password=(ENTER)

# docker exec -it postgres psql -U postgres