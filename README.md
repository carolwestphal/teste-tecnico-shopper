# teste-tecnico-shopper
Teste Técnico da Shopper.com

# Requirements

To run this project, you'll need to have installed in your machine:
- (nodejs)[https://nodejs.org/en]
- (docker)[https://docs.docker.com/]

# How to run

To run the backend, first start a container for the database, running these commands:
```
docker pull mysql/mysql-server:5.7
docker run -p 3306:3306 --name=mysql1 -e MYSQL_USER=user -e MYSQL_PASSWORD=password -e MYSQL_DATABASE=testdb -d mysql/mysql-server:5.7
```

Then, start the backend using this command:

```
cd backend
npm start
```