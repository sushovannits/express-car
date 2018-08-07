# Express Car
An express app to support CRUD on car model information
<!-- toc -->

- [Overview](#overview)
- [System Requirements](#system-requirements)
- [Build](#build)
- [Configure](#configure)
- [Run](#run)
- [Docker](#docker)
- [Schema](#schema)
- [API](#api)
- [Implementation Details](#implementation-details)
- [Unit Test](#unit-test)
<!-- tocstop -->

## Overview
- The server stores and retrieves cars model info (make, model and color)
- Supports query on make, model and color
- Uses momngodb
- Pagination supported out of box
- Written in ES6 and babel transpiled

## System Requirements
- node
- yarn/ npm
- mongodb
- docker

## Build
```
yarn run build
```
## Configure

- All default config can be found in src/config.js
- Secrets should go in .env which now contains docker config
- Anything to override can be modified in .env or set explicitly

## Run
- By default app will start at `http://localhost:8000/`
- Must start mongodb with command in some other shell. It will listen at port 27017 by default
  ```
  mongod
  ```
- Start the server
  ```
  yarn run start
  ```

## Docker
For docker the .ev file contains the configuration.
Commands
```
docker-compose build
docker-compose up
```

## Schema
- Car
  - `make`: Required. String.
  - `model`: Required. String.
  - `color` : Required. One of [Black, Blue, White, Brown...] (_All CSS colours_) (_Case sensitive_)

- Response Body
  - `errorMsg`: String
  - `message`: String. Present if `errorMsg` not present
  - `body`: Object. Present if `errorMsg` not present

## API

### GET /cars

- Retrieves cars from database.
- Supports query params: `make`, `model`, `color`, `page`
- Supports query params example:
 ```
 /cars?make=Ford&color=White&page=2
 ```
- Supported query type is: AND of all fields specifiednd OR of all values of a field, i.e., 
  for make=Ford&make=Subaru&color=White&color=Black, all models which are either [Ford, White], [Ford, Black], [Subaru, White] and [Subaru. Black] will be returned.
- By default it returns page 0
- The count for each page is 10 by default.
- Will return a 404 if page queried is out of bound
  
### GET /car/:id
 - Retieve car by id
   ```
   /cars/5b6632b7e5f0c52909104905
   ```
 - The id is to be retieved from the response body of a POST or GET /cars

### POST /cars
 - Create a car
 - JSON accepted
 - Request body should be:
   ```
    {
     "model" : "ecosport",
     "make" : "ford",
     "color" : "Pink"
    }
   ```
  - Sample response would be:
    ```
    {
    "message": "Car created",
    "body": {
        "_id": "5b6854e2f7b9ef534db67e92",
        "make": "ford",
        "model": "ecosport",
        "color": "Pink",
        "createdAt": "2018-08-06T14:02:10.606Z",
        "updatedAt": "2018-08-06T14:02:10.606Z",
        "__v": 0
       }
    }
    ```

### PUT /cars/:id
 - Update a car by id
 - Request body should be:
   ```
   {
     "model" : "ecosport",
     "make" : "ford",
     "color" : "Pink"
    }
    ```
  - Returns the updated item in response as 
    ```
    {
    "message": "Car updated",
    "body": {
        "_id": "5b6854e2f7b9ef534db67e92",
        "make": "ford",
        "model": "endeavour",
        "color": "Black",
        "createdAt": "2018-08-06T14:02:10.606Z",
        "updatedAt": "2018-08-06T14:06:40.052Z",
        "__v": 0
      }
    }
    ```

### PATCH /cars/:id
 - Modify fields
 - Example:
   ```
   {
     "model" : "ecosport",
     "make" : "ford",
    }
   ```
  - Returns modified item in response like in PUT

### DELETE /cars/:id
 - Delete a car
     
## Implementation Details
- ES6 is used and babel is used to transpile
- Versioning of API is done
- Supports query of car
- Used supertest for integration test
- Used mongodb for express session storage also
- Cors enabled

## Unit Test
```
yarn run test
```

