# Introduction
This is the backend API for the up-and-coming app, [BenChat](https://github.com/bencole12345/BenChat).

It is written using NodeJS, Express and MongoDB.

# The API

## Endpoints
Here is a list of all recognised verbs and endpoints.

Verb | Route
--- | ---
`GET` | `/`
`GET` | `/users`
`PUT` | `/users`
`DELETE` | `/users`

There is no notion of a *session*: instead, to perform any task that requires authentication, a password must be supplied.

## Users

### Create a user
To register a new user, send a `POST` request to `/users` with data in the following format:

```json
{
    "username": "username here!",
    "password": "password here!"
}
```

The server will respond accordingly:

```json
{
    "success": true,
    "message": "If success is false, the reason will be explained here."
}
```

When sending the password to the server, do **not** hash it. Send the plaintext password, and hashing will be handled by the server.

### Log in
The API does not use sessions. However, the app may still wish to check that a user's username and password are valid.

Send a `GET` request to `/users` containing a username and password in the following format:

```json
{
    "username": "username here!",
    "password": "plaintext password here!"
}
```

The server will respond with:

```json
{
    "success": true
}
```
to indicate whether the login was successful. If `success` is `true` then the username/password combination is valid: if it is `false` then either the username is not registered, or the incorrect password was supplied. For security reasons, the API will not specify which of these is the case.

### Delete a user
To delete a user, and **all** messages sent from or to that user, send a `DELETE` request containing the username and password like before to `/users`.

```json
{
    "username": "username here!",
    "password": "plaintext password here!"
}
```

The server will respond with:

```json
{
    "success": true
}
```
where `success` indicates whether the delete operation was successful.