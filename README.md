# Introduction
This is the backend API for the up-and-coming app, [BenChat](https://github.com/bencole12345/BenChat).

It is written using NodeJS, Express and MongoDB.

# The API

## Endpoints
Here is a list of all recognised verbs and endpoints.

Verb | Route | Description
--- | --- | ---
`POST` | `/auth/register` | Register a new user. The username must not already be taken.
`POST` | `/auth/login` | Log in a new user. This endpoint tells you whether the login details are correct.
`POST` | `/conversations` | Create a new conversation with the supplied list of other users.
`GET`  | `/conversations/:conversationId` | Get all or a subset of the messages sent to a conversation, in chronological order. The user must be a member of this conversation in order for the request to be accepted.
`POST` | `/conversations/:conversationId` | Send a new message to a conversation. The user must be a member of this conversation in order for the request to be approved.

## Users and Authentication

This API does not use sessions. Rather, for any action that requires authentication, the request **must** include `"username"` and `"password"` fields.

When sending the password to the server, do **not** hash it. Send the plaintext password, and hashing will be handled by the server.

### Create a user
Coming soon!


### Log in
Also coming soon!

## Sending Messages

## Receiving Messages

## Starting a New Conversation