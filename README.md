# teste-tecnico-shopper
Teste Técnico da Shopper.com

# Requirements

To run this project, you'll need to have installed in your machine:
- (nodejs)[https://nodejs.org/en]
- (docker)[https://docs.docker.com/]

# How to run

## Database

To start the database, run these commands from the root directory:
```
docker pull mysql:5.7
docker run -p 3306:3306 --name=mysql -e MYSQL_ROOT_PASSWORD=admin -e MYSQL_USER=user -e MYSQL_PASSWORD=password -e MYSQL_DATABASE=products -v $pwd/database:/docker-entrypoint-initdb.d -d mysql:5.7
```

## Backend

To start the backend, run these commands from the root directory:
```
cd backend
npm install
npm start
```

## Frontend

To start the frontend, run these commands from the root directory:
```
cd frontend
npm install
npm run dev
```