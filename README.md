# Node Mongo Cache API

### Routes:

`GET /caches`: return all keys

`DELETE /caches`: delete all keys

`GET /caches/:key`: return or create a key with random value

`PUT /caches/:key`: update or create a key with body `{value: ''}`

`DELETE /caches/:key`: delete key


### LRU Implementation:

- Each Record has a `createdAt` and `updatedAt` timestamp.
- MongoDB TTL index is used to delete a key based on `updatedAt`.
- `updatedAt` is set to current date on `find or update` operations, resetting the TTL index.
- `CACHELIMIT` in `.env` file can be used to change the LRU size. When cache limit is hit on an insert, the key with oldest `updatedAt` is deleted.

### Steps to run:

- clone the repository
- run `npm install`
- please ensure that a mongodb instance is running locally on port 27017
- use `npm run start` or `npm run debug` to get the app up


### Env variables:

- The repo has an `.env.example` file, please copy it and rename that to `.env`
- Please change values of any environment variable required there.


### Testing:

- run `npm run test` to run the test suite.
- integration test suite would run on the same mongodb specified in the `.env` file
- please use a separate `.env` file to run tests on a different db instance. Tests are destructive in nature. Didn't have enough time at end to allow environment specific env files.