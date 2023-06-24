- Fix delay in post update in next app, that may be caused by both SWR and Redis.
- Fix react warnings
- Fix debuggers and console.log statements

- Add tests for node, views and model
- Add .env and prepare for deploying on cloud
- Fixed Alpine/master branch issue
- Add to github
- Deploy on AWS EC2

- Create plain notes app for AWS Lambda and Dynamo
- Create plain todo app for working with Graph QL

Set env for all containers
set password for postgres
set static acces for views as they are in mav2
create readme
create development branch and set it to master, it must be the unique branch
create production branch
add to github

- see diff ec2 and similar alt, does ec2 growes automatically is it still a popular option?
- First set rds postgres with password etc
- Then setup on local prod things. Remove postgres container.
- Upload to github, create ec2, connect to it, install docker and git, download prod branch, create commit that sets on django rds postgres data
- run docker-compose django, fix issues, then run django-compose and fix issues
- once everything is all right commit to github prod final commit
- you've finished deploying to aws ec2


- play with graphiql, to understand request and responses
- set up db connection
- understand mongoose models return
- learn how to test express-graphql
- test express-graphhql server with supertest(or similar) and vitest, mock mongoose models
- AddTaskForm.test needs to mock a function
- Create AddTaskModalForm
- Create TodoContext to inject API data to components
- upload to github
- start aws lamda small app may be notes api lamdba to dynamodb and pull it to aws
- pull blog-mvc to ec2 and aws postgres