# bookish-backend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Book Review Application

This is a full stack web application for book reviews built with Next.js, TypeScript, Express.js, Node.js, and MongoDB. The application consists of two separate repositories for the frontend and backend.

## API Schema and dummy data (Notion Documentation)

I've created an API documentation at notion, which includes API schema and seed data information. (https://marbled-clef-9c0.notion.site/Book-Review-Application-API-Template-dummy-data-2aafbf3043ea47998fdda360ce3ec0f8)

## Frontend Repository

The frontend repository contains the client-side code of the application, built with Next.js and TypeScript.

Repository: [book-review-app-frontend](https://github.com/vinayakgarg20/bookish-frontend.git)

### Installation

1. Clone the frontend repository:
   ```
   git clone https://github.com/your-username/bookish-frontend.git
   ```

2. Navigate to the frontend directory:
   ```
   cd bookish-frontend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

### Running the Frontend

1. Start the frontend development server:
   ```
   npm run dev
   ```

2. Open your browser and visit `http://localhost:3000` to access the application.

## Backend Repository

The backend repository contains the server-side code of the application, built with Express.js, Node.js, and MongoDB.

Repository: [book-review-app-backend](https://github.com/vinayakgarg20/bookish-backend.git)

### Installation

1. Clone the backend repository:
   ```
   git clone https://github.com/your-username/bookish-backend.git
   ```

2. Navigate to the backend directory:
   ```
   cd bookish-backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

### Configuration

1. Create a `.env` file in the backend directory and provide the following environment variables:
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

2. Replace `<your-mongodb-atlas-connection-string>` with the connection string for your MongoDB Atlas database.

3. Replace `<your-jwt-secret>` with a secret key for JSON Web Token (JWT) authentication.

### Running the Backend

1. Start the backend server:
   ```
   npm start
   ```

2. The backend server will run on `http://localhost:5000` by default.

## MongoDB Atlas Configuration

This application uses MongoDB Atlas as the online database provider. To set up the database:

 Update the `MONGODB_URI` environment variable in the backend's `.env` file with your MongoDB Atlas connection string given below.

```
mongodb+srv://<username>:<password>@bookreviewcluster.asrdiqr.mongodb.net/?retryWrites=true&w=majority&appName=BookReviewCluster
```
Replace <password> with the password for the <username> user.
```
 testing credentials : { username: testingUser , password: hRLyBokLQpXhD8Hr}
```

## Additional Notes

- The frontend development server runs on `http://localhost:3000` by default.
- The backend server runs on `http://localhost:5000` by default.
- Make sure to have both the frontend and backend servers running simultaneously for the application to function properly.

If you have any questions or encounter any issues, please feel free to reach out.
```
