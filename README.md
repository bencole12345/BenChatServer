# Introduction
This is the backend API for the up-and-coming app, [BenChat](https://github.com/bencole12345/BenChat).

It is written using NodeJS, Express and MongoDB.

# The API

## Overview
Here is a list of all recognised verbs and endpoints.

Verb | Route | Description
--- | --- | ---
`POST` | `/auth/register` | Register a new user. The username must not already be taken.
`POST` | `/auth/login` | Log in a new user. This endpoint tells you whether the login details are correct.
`POST`  | `/conversations/all` | Get all conversations involving the current user.
`POST` | `/conversations/new` | Create a new conversation with the supplied list of other users.
`POST`  | `/messages/view` | Get all or a subset of the messages sent to a conversation, in chronological order. The user must be a member of this conversation in order for the request to be accepted.
`POST` | `/messages/send` | Send a new message to a conversation. The user must be a member of this conversation in order for the request to be approved.

## Users and Authentication

This API does not use sessions. Rather, for any action that requires authentication, the request **must** include `"username"` and `"password"` fields.

When sending the password to the server, do **not** hash it. Send the plaintext password, and hashing will be handled by the server.

### Create a user
To register a new user, send a `POST` request to `/auth/register`. The request must contain the following data:

```
{
    "username": <username>,
    "password": <password>
}
```

If the registration is successful, the server will respond with an HTTP status 201 (resource created successfully), and will return the `username` and `_id` attributes of the created user. If the username is already taken, it will instead respond with HTTP status 422 (unprocessable entity) and an error message.

### Log in
It is important to note that the API does not use sessions, so there is no need to log in before preforming other actions that require authentication as the username and password must be supplied to these operations anyway.

To check that a username and password are valid, send a `POST` request to `/auth/login` containing the following data:

```
{
    "username": <username>,
    "password": password
}
```

If the login details are correct, the server will respond with an HTTP status 200 (success), and will send back the `username`, along with that user's `_id` attribute. If the password is incorrect, or if the username has not been registered, the server will respond with HTTP code 401 (unauthorised).

## Exchanging Messages

### Start a Conversation
Before anyone can send a message, they first need to be part of a conversation. A conversation can be started with another user via a `POST` request to `/conversations/new`.

There are two ways the other user can be specified. For performance reasons, it is faster to specify the id of the other user, like this:

```
{
    "username": <username>,
    "password": <password>,
    "otherUserId": <the id of the other user to be involved in this conversation>
}
```

Alternatively, one can instead specify the username of the other user. This method should only be used if the id is not known. The data should be formatted like:

```
{
    "username": <username>,
    "password": <password>,
    "otherUsername": <the username of the other user>
}
```

Success will be indicated by an HTTP 201 status (resource created). If a conversation between the two users already exists, this will be indicated by HTTP 422 status, and the `_id` of that conversation will be included in the response.

### Send a Message
Messages are not sent to users: rather, they are sent to conversations. Send an HTTP `POST` request to `/messages/send` containing the following data:

```
{
    "username": <username>,
    "password": <password>,
    "conversationId": <the id of the conversation>,
    "messageContent": <the content of the message>
}
```

Success will be indicated by an HTTP code 201. If the user sending the request is not a member of that conversation, an HTTP code 401 (forbidden) will be returned instead.

### Receive Messages
For now, messages are received by sending a `POST` request to `/messages/view`. This returns all messages sent to the specified conversation. The request should contain the following information:

```
{
    "username": <username>,
    "password": <password>,
    "conversationId": <the id of the conversation>
}
```

An HTTP code 200 indicates success: a list of messages will be returned. Similarly to sending a message, if the user is not a member of that conversation, the response will instead have code 401 (forbidden) and no messages will be returned.

In the future, this endpoint will be expanded to allow for more control: for example, you will be able to request a subset of messages, such as "send me the most recent 100 messages."

### List all Conversations
To view all conversations involving a user, simply `POST` their details like before to `/conversations/all` in the following format:

```
{
    "username": <username>,
    "password": <password>
}
```

Assuming the user is correctly authenticated, the server will respond with an HTTP code 200 (OK) along with a list of all conversations in which the user is a member. If the username is invalid or the password is incorrect, the response will instead be a 401 (unauthorised).