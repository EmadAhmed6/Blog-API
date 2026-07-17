🚀 Blog API Project
A robust and secure RESTful API built for a blogging platform, designed to manage users, posts, and interactions with clean architecture.

🛠️ Tech Stack
Runtime: Node.js

Framework: Express.js

Database: MongoDB & Mongoose (ODM)

Authentication: JSON Web Tokens (JWT)

Validation: Joi (with joi-password-complexity)

Security: Bcrypt.js

Environment: Dotenv

📋 Features
[ ] Authentication: Secure user registration and login endpoints.

[ ] Post Management: Full CRUD operations for blog posts.

[ ] Interaction: User commenting system integrated with posts.

[ ] Admin Control: Administrative privileges to manage content and moderate platform activity.

[ ] Data Integrity: Strict input validation and error handling middleware.

🚀 Getting Started
Prerequisites
Node.js installed.

MongoDB (Local or Cloud instance).

Installation
Clone the repository:

Install dependencies:

Bash
npm install
Configure environment variables:
Create a .env file in the root directory and add:

Code snippet
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog
JWT_SECRET_KEY=your_super_secret_key
Run the server:

Bash
npm run dev
🔐 Security & Validation
Validation: All user inputs are validated against schema definitions using Joi to prevent malicious or malformed data injection.

Encryption: User passwords are encrypted using Bcrypt with a salt round of 10.

Protected Routes: JWT-based authentication ensures that sensitive endpoints are only accessible to authorized users.
