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

## Build
```
yarn run build
```
## Configure

- All default config can be found in src/config.js
- Secrets should go in .env which now contains docker config
- Anything to override can be modified in .env or set explicitly

## Run
```
yarn run start
```

## Docker
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
 _ Response Body
  - `errorMsg`: String
  - `message`: String. Present if `errorMsg` not present
  - `body`: Object. Present if `errorMsg` not present
## API

### GET /cars

- Retrieves cars from database.
- Supports query params like:
 ```
 /cars?make=Ford&color=White
 ```
- Supported query type is: AND of all fields specifiednd OR of all values of a field, i.e., 
  for make=Ford&make=Subaru&color=White&color=Black, all models which are either [Ford, White], [Ford, Black], [Subaru, White] and [Subaru. Black] will be returned.
  
### GET /car/:id
 - Retieve car by id
   ```
   /cars/5b6632b7e5f0c52909104905
   ```
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
### PATCH /cars/:id
 - Modify fields
 - Example:
   ```
   {
     "model" : "ecosport",
     "make" : "ford",
    }
   ```
### DELETE /cars/:id
 - Delete a car
     
## Implementation Details
- ES6 is used and babel is used to transpile
- Versioning of API is done
- Supports query of car

## Unit Test
```
yarn run test
```

