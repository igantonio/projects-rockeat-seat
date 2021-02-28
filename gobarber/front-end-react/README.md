<h1 align="center">
    <img alt="GoStack" src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/bootcamp-header.png" width="200px" />
</h1>

<h3 align="center">
  Projeto: GoBarber
</h3>

This repository is destined to GoBarber application developed at  GoStack Bootcamp from Rocketseat

## About GoBaber

It is an application designed for barbershops that allows customers to reserve a time and barbershop owners to control their schedule.

## Technologies

- NodeJS
- Docker
- Postgres
- MongoDb
- Redis
- Express
- Sequelize
- ESLint
- Prettier
- Sucrase
- Nodemon
- Bcrypt
- Yup
- JsonWebToken

## How to use

To use this application you need clone this repository in you favorite directory

```
git clone git@github.com:igantonio/gobarber.git
```

- Enter in project folder
```
cd gobarber/back-end
```

- Install the applications dependencies
```
yarn
```

- Init containers
```
DataBase Postgres: docker run --name postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres

DataBase MongoDb: docker run --name mongo -p 27017:27017 -d -t mongo

Redis: docker run --name redis -p 6379:6379 -d -t redis:alpine

```

- Create DataBase to Postgres
```
Need create database in postgres with name gobarber
```

- Init tables to postgres
```
yarn sequelize db:migrate
```

- Run the application
```
yarn dev
```

- Run the queue jobs
```
yarn queue
```

- Note
```
At the root of the project it contains a file GoBarberRequests.Json to be imported into some tool for API requests.
```
```
It is necessary to create an .env file at the root of the project to configure environment variables. At the root of the project contains an example file named .env.example
```

