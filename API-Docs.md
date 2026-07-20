# Blog API Documentation

By Emad Ahmed

---

## General Info

### Base URL
The API is deployed locally and can be accessed at:
`http://localhost:5000`

### Response Wrapping
- **Success Responses**: Return the raw resource JSON object or array directly without an envelope structure. The HTTP status code (e.g., `200 OK`, `201 Created`) indicates successful completion.
- **Error Responses**: Return a standard error JSON object with a single `message` field describing the issue.
  ```json
  {
    "message": "Error details and description go here"
  }
  ```

### Authentication
Protected routes require JSON Web Token (JWT) authentication. To authenticate, include the token in the HTTP `Authorization` header as a Bearer token:
`Authorization: Bearer <your_jwt_token>`

---

## Endpoints Overview Table

| # | Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- | :---: |
| 1 | POST | `/auth/register` | Register a new user account | ❌ |
| 2 | POST | `/auth/login` | Authenticate user and retrieve JWT token | ❌ |
| 3 | POST | `/auth/forgot-password` | Send password reset link to user's email | ❌ |
| 4 | POST | `/auth/reset-password/:userId/:token` | Validate reset token and update password | ❌ |
| 5 | GET | `/users` | Retrieve list of all users | 🔒 |
| 6 | GET | `/users/:id` | Retrieve detailed profile of a single user by ID | 🔒 |
| 7 | PUT | `/users/:id` | Update account details (Username, Email, Password) | 🔒 |
| 8 | POST | `/users/:id/upload` | Upload or update user profile picture | 🔒 |
| 9 | DELETE | `/users/:id` | Delete user account from the database | 🔒 |
| 10 | GET | `/posts` | Retrieve all blog posts with paginated comments | 🔒 |
| 11 | POST | `/posts` | Create a new blog post with metadata | 🔒 |
| 12 | GET | `/posts/:id` | Retrieve detailed view of a single post by ID | 🔒 |
| 13 | PUT | `/posts/:id` | Update title, description, category, or image of a post | 🔒 |
| 14 | DELETE | `/posts/:id` | Delete a post and clear its associated media | 🔒 |
| 15 | PUT | `/posts/:id/like` | Toggle like/unlike status on a blog post | 🔒 |
| 16 | POST | `/posts/upload` | Upload thumbnail/cover image to Cloudinary | 🔒 |
| 17 | GET | `/posts/:postId/comments` | Retrieve list of comments for a specific post | 🔒 |
| 18 | POST | `/posts/:postId/comments` | Post a new comment under a specific post | 🔒 |
| 19 | PUT | `/posts/:postId/comments/:commentId` | Update text content of a comment | 🔒 |
| 20 | DELETE | `/posts/:postId/comments/:commentId` | Remove a comment from a post | 🔒 |
| 21 | PUT | `/posts/:postId/comments/:commentId/like` | Toggle like/unlike status on a comment | 🔒 |
| 22 | POST | `/posts/:postId/comments/:commentId/upload` | Upload comment image to Cloudinary | 🔒 |

---

## Table of Contents

- [Authentication Endpoints](#authentication-endpoints)
- [User Management Endpoints](#user-management-endpoints)
- [Post Management Endpoints](#post-management-endpoints)
- [Comment Management Endpoints](#comment-management-endpoints)
- [Common HTTP Status Codes](#common-http-status-codes)

---

## Authentication Endpoints

### POST /auth/register
Register a new user account on the platform.

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `username` | string | ✅ | Username of the user (Min length: 3, Max length: 10). |
| `email` | string | ✅ | Valid and unique email address (Min length: 4). |
| `password` | string | ✅ | Secure password (Min length: 6, Max length: 72, must contain uppercase, lowercase, and numeric characters). |

#### Responses

##### Response 200
User registered successfully. Returns user details along with an auto-generated JWT token.
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "_id": "65f1a2b3c4d5e6f789012345",
  "username": "ahmed",
  "email": "ahmed@example.com",
  "isAdmin": false,
  "profilePicture": {
    "url": "",
    "publicId": null
  },
  "createdAt": "2026-07-20T18:27:31.000Z",
  "updatedAt": "2026-07-20T18:27:31.000Z"
}
```

##### Response 400
Invalid input validation or email already exists.
```json
{
  "message": "Email is already exist"
}
```

---

### POST /auth/login
Log in an existing user and retrieve their JWT session token.

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `email` | string | ✅ | The registered email address. |
| `password` | string | ✅ | The account password. |

#### Responses

##### Response 200
Login successful. Returns user account details and the authorization token.
```json
{
  "_id": "65f1a2b3c4d5e6f789012345",
  "username": "ahmed",
  "email": "ahmed@example.com",
  "isAdmin": false,
  "profilePicture": {
    "url": "https://res.cloudinary.com/example/image/upload/profile.jpg",
    "publicId": "profile_picture_123"
  },
  "createdAt": "2026-07-20T18:27:31.000Z",
  "updatedAt": "2026-07-20T18:27:31.000Z",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### Response 400
Invalid email/password, or Joi schema validation failed.
```json
{
  "message": "Invalid email or password"
}
```

---

### POST /auth/forgot-password
Send a secure temporary password reset URL link to the user's registered email address.

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `email` | string | ✅ | The email address associated with the account. |

#### Responses

##### Response 200
Password reset email dispatched successfully.
```json
{
  "message": "Password reset link sent successfully to your email"
}
```

##### Response 404
User account with the provided email address does not exist.
```json
{
  "message": "User was not found"
}
```

---

### POST /auth/reset-password/:userId/:token
Verify the reset token in the URL parameters and change the user's password.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `userId` | string | ✅ | Hexadecimal MongoDB ObjectId of the user account. |
| `token` | string | ✅ | Temporary signed JWT password reset token. |

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `password` | string | ✅ | The new secure password. |
| `confirmPassword` | string | ✅ | Password confirmation (must exactly match `password`). |

#### Responses

##### Response 200
Password updated successfully.
```json
{
  "message": "Password updated successfully"
}
```

##### Response 400
Mismatch in passwords, validation error, or the reset token has expired or is invalid.
```json
{
  "message": "Passwords do not match"
}
```

##### Response 404
The user target was not found in the database.
```json
{
  "message": "User was not found"
}
```

---

## User Management Endpoints

### GET /users 🔒
Retrieve a list of all registered users on the system.

#### Responses

##### Response 200
Successfully retrieved users list.
```json
[
  {
    "_id": "65f1a2b3c4d5e6f789012345",
    "username": "Ahmed",
    "email": "ahmed@example.com",
    "isAdmin": false,
    "profilePicture": {
      "url": "https://res.cloudinary.com/example/image/upload/profile.jpg",
      "publicId": "profile_picture_123"
    },
    "createdAt": "2026-07-20T18:27:31.000Z",
    "updatedAt": "2026-07-20T18:27:31.000Z"
  }
]
```

##### Response 401
Missing or invalid JWT token.
```json
{
  "message": "No token provided"
}
```

---

### GET /users/:id 🔒
Retrieve profile information of a single user by their database ID.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | string | ✅ | The target user ID. |

#### Responses

##### Response 200
Successfully retrieved user details.
```json
{
  "_id": "65f1a2b3c4d5e6f789012345",
  "username": "Ahmed",
  "email": "ahmed@example.com",
  "isAdmin": false,
  "profilePicture": {
    "url": "https://res.cloudinary.com/example/image/upload/profile.jpg",
    "publicId": "profile_picture_123"
  },
  "createdAt": "2026-07-20T18:27:31.000Z",
  "updatedAt": "2026-07-20T18:27:31.000Z"
}
```

##### Response 401
Not authorized.
```json
{
  "message": "Invalid token"
}
```

##### Response 404
User with specified ID was not found.
```json
{
  "message": "User not found"
}
```

---

### PUT /users/:id 🔒
Update user profile information (Username, Email, or Password). Access is restricted to the profile owner or users with Admin privileges.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | string | ✅ | The ID of the user to update. |

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `username` | string | ❌ | Updated username (Min length: 3, Max length: 10). |
| `email` | string | ❌ | Updated email address. |
| `password` | string | ❌ | Updated password (must pass validation checks). |

#### Responses

##### Response 200
Profile updated successfully. Returns updated user document.
```json
{
  "_id": "65f1a2b3c4d5e6f789012345",
  "username": "AhmedUpdated",
  "email": "ahmed.new@example.com",
  "isAdmin": false,
  "profilePicture": {
    "url": "https://res.cloudinary.com/example/image/upload/profile.jpg",
    "publicId": "profile_picture_123"
  },
  "createdAt": "2026-07-20T18:27:31.000Z",
  "updatedAt": "2026-07-20T21:27:00.000Z"
}
```

##### Response 400
Joi schema input validation failure.
```json
{
  "message": "\"username\" length must be at least 3 characters long"
}
```

##### Response 401
Not authorized.
```json
{
  "message": "No token provided"
}
```

##### Response 403
Access Forbidden. The requesting user is not the owner of this account and is not an Administrator.
```json
{
  "message": "You are not allowed"
}
```

##### Response 404
The user target profile was not found.
```json
{
  "message": "User not found"
}
```

---

### POST /users/:id/upload 🔒
Upload and change user profile picture. Restricts access to account owner or Admin. Upload uses multipart binary stream.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | string | ✅ | The user ID. |

#### Request Body (Multipart Form-Data)
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `profilePicture` | binary file | ✅ | The image file to be uploaded. |

#### Responses

##### Response 200
Image uploaded and user profile picture updated successfully.
```json
{
  "_id": "65f1a2b3c4d5e6f789012345",
  "username": "Ahmed",
  "email": "ahmed@example.com",
  "isAdmin": false,
  "profilePicture": {
    "url": "https://res.cloudinary.com/example/image/upload/new_profile.jpg",
    "publicId": "profile_picture_567"
  },
  "createdAt": "2026-07-20T18:27:31.000Z",
  "updatedAt": "2026-07-20T21:27:10.000Z"
}
```

##### Response 400
No binary file provided in the request payload.
```json
{
  "message": "No file provided"
}
```

##### Response 401
Not authorized.
```json
{
  "message": "Invalid token"
}
```

##### Response 403
Forbidden. Requesting user is not the owner or Admin.
```json
{
  "message": "You are not allowed"
}
```

##### Response 404
User account was not found.
```json
{
  "message": "User was not found"
}
```

---

### DELETE /users/:id 🔒
Delete a user from the database. **Admin-only endpoint.**

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | string | ✅ | The target user ID to delete. |

#### Responses

##### Response 200
User deleted successfully.
```json
{
  "message": "User deleted successfully"
}
```

##### Response 401
Not authorized.
```json
{
  "message": "No token provided"
}
```

##### Response 403
Forbidden. Requesting user is not an administrator.
```json
{
  "message": "You are not allowed, only admin allowed"
}
```

##### Response 404
User was not found in the system database.
```json
{
  "message": "User was not found"
}
```

---

## Post Management Endpoints

### GET /posts 🔒
Retrieve a paginated list of blog posts. Populates comments and authors.

#### Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `pageNumber` | integer | ❌ | Page number to fetch (Min: 1, Default: 1). |

#### Responses

##### Response 200
List of posts returned successfully.
```json
[
  {
    "_id": "65f1a2b3c4d5e6f789012345",
    "title": "My First Blog Post",
    "description": "This is my first blog post description.",
    "category": "Technology",
    "user": {
      "_id": "65f1a2b3c4d5e6f789012347",
      "username": "Ahmed"
    },
    "image": {
      "url": "https://example.com/image.jpg",
      "publicId": "blog_image_123"
    },
    "likes": [
      {
        "_id": "65f1a2b3c4d5e6f789012348",
        "username": "Sara"
      }
    ],
    "comments": [],
    "createdAt": "2026-07-20T18:27:29.000Z",
    "updatedAt": "2026-07-20T18:27:29.000Z"
  }
]
```

##### Response 401
Not authorized.
```json
{
  "message": "No token provided"
}
```

---

### POST /posts 🔒
Create a new blog post.

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `title` | string | ✅ | Title of the blog post (Min length: 2, Max length: 32). |
| `description` | string | ✅ | Content text details of the post (Min length: 10, Max length: 250). |
| `category` | string | ✅ | Category category/genre for grouping posts. |
| `image` | object | ❌ | Nested image properties object containing `url` and `publicId`. |

#### Responses

##### Response 201
Post created successfully. Returns the populated post resource.
```json
{
  "_id": "65f1a2b3c4d5e6f789012345",
  "title": "My First Blog Post",
  "description": "This is my first blog post description.",
  "category": "Technology",
  "user": {
    "_id": "65f1a2b3c4d5e6f789012347",
    "username": "Ahmed"
  },
  "image": {
    "url": "",
    "publicId": null
  },
  "likes": [],
  "comments": [],
  "createdAt": "2026-07-20T18:27:29.000Z",
  "updatedAt": "2026-07-20T18:27:29.000Z"
}
```

##### Response 400
Validation failure (e.g. description is too short).
```json
{
  "message": "\"description\" length must be at least 10 characters long"
}
```

##### Response 401
Not authorized.
```json
{
  "message": "Invalid token"
}
```

---

### GET /posts/:id 🔒
Retrieve a single post details with all associated populated child structures.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | string | ✅ | MongoDB ObjectId of the blog post. |

#### Responses

##### Response 200
Post retrieved successfully.
```json
{
  "_id": "65f1a2b3c4d5e6f789012345",
  "title": "My First Blog Post",
  "description": "This is my first blog post description.",
  "category": "Technology",
  "user": {
    "_id": "65f1a2b3c4d5e6f789012347",
    "username": "Ahmed"
  },
  "image": {
    "url": "https://example.com/image.jpg",
    "publicId": "blog_image_123"
  },
  "likes": [],
  "comments": [],
  "createdAt": "2026-07-20T18:27:29.000Z",
  "updatedAt": "2026-07-20T18:27:29.000Z"
}
```

##### Response 401
Not authorized.
```json
{
  "message": "No token provided"
}
```

##### Response 404
Post was not found in the database.
```json
{
  "message": "Post not found"
}
```

---

### PUT /posts/:id 🔒
Update post parameters. Access is allowed only to the post author owner or Admins.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | string | ✅ | Post database record ID. |

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `title` | string | ❌ | Updated title (Min: 2, Max: 32). |
| `description` | string | ❌ | Updated content description body (Min: 10, Max: 250). |
| `category` | string | ❌ | Updated category structure. |
| `image` | object | ❌ | Updated nested image object. |

#### Responses

##### Response 200
Post updated successfully. Returns updated post document.
```json
{
  "_id": "65f1a2b3c4d5e6f789012345",
  "title": "Updated Blog Post Title",
  "description": "This is my updated blog post description content.",
  "category": "Programming",
  "user": "65f1a2b3c4d5e6f789012347",
  "image": {
    "url": "https://example.com/image.jpg",
    "publicId": "blog_image_123"
  },
  "likes": [],
  "createdAt": "2026-07-20T18:27:29.000Z",
  "updatedAt": "2026-07-20T21:28:00.000Z"
}
```

##### Response 400
Joi payload validation error.
```json
{
  "message": "Invalid input"
}
```

##### Response 401
Not authorized.
```json
{
  "message": "Invalid token"
}
```

##### Response 403
Forbidden. The user does not own this post and is not an Admin.
```json
{
  "message": "You are not allowed"
}
```

##### Response 404
Post was not found.
```json
{
  "message": "Post was not found"
}
```

---

### DELETE /posts/:id 🔒
Delete a blog post and remove its media assets. Restricted to the post owner or Admins.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | string | ✅ | Database record ID of the post. |

#### Responses

##### Response 200
Post deleted successfully.
```json
{
  "message": "Post has been deleted successfully"
}
```

##### Response 401
Not authorized.
```json
{
  "message": "No token provided"
}
```

##### Response 403
Forbidden. User has no ownership rights and is not an Admin.
```json
{
  "message": "You are not allowed"
}
```

##### Response 404
Post target was not found in the database.
```json
{
  "message": "Post was not found"
}
```

---

### PUT /posts/:id/like 🔒
Toggle a user's like/unlike status on a specific post.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | string | ✅ | The blog post ID. |

#### Responses

##### Response 200
Post liked status updated. Returns the updated post object showing the new likes array.
```json
{
  "_id": "65f1a2b3c4d5e6f789012345",
  "title": "My First Blog Post",
  "description": "This is my first blog post description.",
  "category": "Technology",
  "user": "65f1a2b3c4d5e6f789012347",
  "image": {
    "url": "https://example.com/image.jpg",
    "publicId": "blog_image_123"
  },
  "likes": [
    {
      "_id": "65f1a2b3c4d5e6f789012347",
      "username": "Ahmed"
    }
  ],
  "createdAt": "2026-07-20T18:27:29.000Z",
  "updatedAt": "2026-07-20T21:28:10.000Z"
}
```

##### Response 401
Missing or invalid authentication token.
```json
{
  "message": "You are not logged in"
}
```

##### Response 404
Post was not found.
```json
{
  "message": "Post was not found"
}
```

---

### POST /posts/upload 🔒
Upload an image to Cloudinary to be used as a post thumbnail or cover. Multipart binary upload required.

#### Request Body (Multipart Form-Data)
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `image` | binary file | ✅ | The image file payload to upload. |

#### Responses

##### Response 200
Image uploaded successfully. Returns URL and public identifier path parameters.
```json
{
  "message": "Uploaded successfully",
  "url": "https://res.cloudinary.com/example/image/upload/post_thumbnail.jpg",
  "publicId": "post_thumbnail_987"
}
```

##### Response 400
No file provided in the request payload.
```json
{
  "message": "No file provided"
}
```

##### Response 401
Not authorized.
```json
{
  "message": "Invalid token"
}
```

---

## Comment Management Endpoints

### GET /posts/:postId/comments 🔒
Retrieve a paginated list of comments associated with a specific blog post.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `postId` | string | ✅ | MongoDB ID of the parent post. |

#### Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `pageNumber` | integer | ❌ | Page index page parameter (Min: 1, Default: 1). |
| `commentsPerPost` | integer | ❌ | Number of comments loaded per page (Default: 5). |

#### Responses

##### Response 200
Comments retrieved successfully.
```json
[
  {
    "_id": "65f1a2b3c4d5e6f789012346",
    "postId": "65f1a2b3c4d5e6f789012345",
    "text": "This is a great post!",
    "user": {
      "_id": "65f1a2b3c4d5e6f789012347",
      "username": "Ahmed"
    },
    "image": {
      "url": "https://res.cloudinary.com/example/image/upload/comment.jpg",
      "publicId": "comment_image_123"
    },
    "likes": [],
    "createdAt": "2026-07-20T18:27:27.000Z",
    "updatedAt": "2026-07-20T18:27:27.000Z"
  }
]
```

##### Response 400
Required path parameters missing.
```json
{
  "message": "Post ID is required"
}
```

##### Response 401
Not authorized.
```json
{
  "message": "No token provided"
}
```

---

### POST /posts/:postId/comments 🔒
Create and post a new comment under a specific post.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `postId` | string | ✅ | The ID of the post. |

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `text` | string | ✅ | Text content of the comment. |

#### Responses

##### Response 201
Comment created successfully. Returns the populated comment payload.
```json
{
  "_id": "65f1a2b3c4d5e6f789012346",
  "postId": "65f1a2b3c4d5e6f789012345",
  "text": "This is a great post!",
  "user": {
    "_id": "65f1a2b3c4d5e6f789012347",
    "username": "Ahmed"
  },
  "image": {
    "url": "",
    "publicId": null
  },
  "likes": [],
  "createdAt": "2026-07-20T18:27:27.000Z",
  "updatedAt": "2026-07-20T18:27:27.000Z"
}
```

##### Response 400
Invalid comment structure validation or missing path parameters.
```json
{
  "message": "Post ID is required"
}
```

##### Response 401
Not authorized.
```json
{
  "message": "Invalid token"
}
```

---

### PUT /posts/:postId/comments/:commentId 🔒
Update the text body of an existing comment. Access restricted to comment author owner or Admins.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `postId` | string | ✅ | ID of the parent post. |
| `commentId` | string | ✅ | ID of the comment to update. |

#### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `text` | string | ✅ | Updated comment body text content. |

#### Responses

##### Response 200
Comment text updated successfully.
```json
{
  "_id": "65f1a2b3c4d5e6f789012346",
  "postId": "65f1a2b3c4d5e6f789012345",
  "text": "Updated comment text details",
  "user": {
    "_id": "65f1a2b3c4d5e6f789012347",
    "username": "Ahmed"
  },
  "image": {
    "url": "https://res.cloudinary.com/example/image/upload/comment.jpg",
    "publicId": "comment_image_123"
  },
  "likes": [],
  "createdAt": "2026-07-20T18:27:27.000Z",
  "updatedAt": "2026-07-20T21:28:30.000Z"
}
```

##### Response 400
Validation failure or comment ID missing.
```json
{
  "message": "Comment ID is required"
}
```

##### Response 401
Not authorized.
```json
{
  "message": "No token provided"
}
```

##### Response 403
Forbidden. Requesting user lacks ownership rights and is not an Admin.
```json
{
  "message": "You are not allowed"
}
```

##### Response 404
Comment not found in the database.
```json
{
  "message": "Comment was not found"
}
```

---

### DELETE /posts/:postId/comments/:commentId 🔒
Remove a comment. Access restricted to comment owner or Admins.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `postId` | string | ✅ | Parent post ID. |
| `commentId` | string | ✅ | The comment database ID. |

#### Responses

##### Response 200
Comment deleted successfully.
```json
{
  "message": "Comment has been deleted successfully"
}
```

##### Response 400
Comment identifier path parameter missing.
```json
{
  "message": "Comment ID is required"
}
```

##### Response 401
Not authorized.
```json
{
  "message": "Invalid token"
}
```

##### Response 403
Forbidden. User lacks ownership rights and is not an Admin.
```json
{
  "message": "You are not allowed"
}
```

##### Response 404
Comment was not found.
```json
{
  "message": "Comment was not found"
}
```

---

### PUT /posts/:postId/comments/:commentId/like 🔒
Toggle user's like/unlike status on a specific comment.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `postId` | string | ✅ | Parent post ID. |
| `commentId` | string | ✅ | Target comment ID. |

#### Responses

##### Response 200
Comment like status updated successfully.
```json
{
  "_id": "65f1a2b3c4d5e6f789012346",
  "postId": "65f1a2b3c4d5e6f789012345",
  "text": "This is a great post!",
  "user": {
    "_id": "65f1a2b3c4d5e6f789012347",
    "username": "Ahmed"
  },
  "image": {
    "url": "https://res.cloudinary.com/example/image/upload/comment.jpg",
    "publicId": "comment_image_123"
  },
  "likes": [
    {
      "_id": "65f1a2b3c4d5e6f789012347",
      "username": "Ahmed"
    }
  ],
  "createdAt": "2026-07-20T18:27:27.000Z",
  "updatedAt": "2026-07-20T21:28:40.000Z"
}
```

##### Response 401
Missing or invalid authentication token.
```json
{
  "message": "You must be logged in to like this comment"
}
```

##### Response 404
Comment was not found.
```json
{
  "message": "Comment was not found"
}
```

---

### POST /posts/:postId/comments/:commentId/upload 🔒
Upload an image to attach to a comment. Restricted to the comment owner or Admins. Uses multipart form-data.

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `postId` | string | ✅ | Parent post ID. |
| `commentId` | string | ✅ | Target comment ID. |

#### Request Body (Multipart Form-Data)
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `image` | binary file | ✅ | The image file to be uploaded. |

#### Responses

##### Response 200
Comment image uploaded successfully.
```json
{
  "message": "Uploaded comment image successfully",
  "image": {
    "url": "https://res.cloudinary.com/example/image/upload/comment_attachment.jpg",
    "publicId": "comment_image_789"
  }
}
```

##### Response 400
No binary file provided, or comment ID missing.
```json
{
  "message": "No file provided"
}
```

##### Response 401
Not authorized.
```json
{
  "message": "Invalid token"
}
```

##### Response 403
Forbidden. User lacks ownership rights and is not an Admin.
```json
{
  "message": "You are not allowed"
}
```

##### Response 404
Comment was not found.
```json
{
  "message": "Comment was not found"
}
```

---

## Common HTTP Status Codes

| Code | Status Text | Description in Context |
| :--- | :--- | :--- |
| `200` | OK | The request succeeded, and the payload is returned in the response. |
| `201` | Created | The resource (post/comment) was successfully created. |
| `400` | Bad Request | The request parameters are invalid or missing, or fail Joi validation rules. |
| `401` | Unauthorized | The request lacks a valid JWT token in the Authorization header. |
| `403` | Forbidden | The authenticated user lacks the required ownership permissions or Admin flag. |
| `404` | Not Found | The requested route, user, post, or comment could not be found. |
| `500` | Internal Server Error | An unexpected server error occurred during database access or image upload. |
