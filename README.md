# URL Shortener

## Description

This is a simple URL shortener application built using Node.js, Express, MongoDB, and EJS for the frontend. It allows users to generate shortened URLs, track URL analytics, and manage shortened links efficiently.

## Features

- Generate shortened URLs for long URLs.
- Option to provide a custom alias.
- Store shortened URLs in MongoDB.
- Track analytics such as total clicks and visit history.
- Implement rate limiting to prevent abuse.
- Error handling and logging for better debugging.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ORM
- **Frontend:** HTML, CSS, JavaScript, EJS
- **Middleware:** Express-rate-limit, Winston for logging

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/url-shortener.git
   cd url-shortener
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables: Create a `.env` file in the root directory and configure the following:

   ```env
   PORT=8001
   MONGO_URI=mongodb://localhost:27017/urlShortener
   ```

4. Start the server:

   ```sh
   npm start
   ```

## API Endpoints

### 1. Generate a Short URL

**Endpoint:** `POST /url`

**Request Body:**

```json
{
  "longUrl": "https://example.com",
  "customAlias": "myCustomAlias" // (Optional)
}
```

**Response:**

```json
{
  "shortUrl": "http://localhost:8001/urls/myCustomAlias"
}
```

### 2. Get URL Analytics

**Endpoint:** `GET /url/analytics/:shortId`

**Response:**

```json
{
  "totalClicks": 10,
  "analytics": [
    {
      "timeStamp": "2024-03-23T12:00:00Z",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0"
    }
  ]
}
```

## Project Structure

```
url-shortener/
│-- controllers/
│   ├── url.js       # Handles URL generation & analytics
│-- middlewares/
│   ├── errorHandler.js  # Handles errors
│   ├── logger.js        # Logs errors and info
│   ├── rateLimiter.js   # Limits API requests
│-- models/
│   ├── url.js       # Mongoose schema for URLs
│-- public/
│   ├── scripts.js   # Frontend interactions
│   ├── styles.css   # Styling
│-- routes/
│   ├── staticRouter.js  # Serves home page
│   ├── url.js          # URL-related routes
│-- views/
│   ├── home.ejs     # Main frontend view
│-- .env             # Environment variables
│-- index.js         # Main server file
│-- connect.js       # Connect mongoose schema  
│-- package.json     # Project dependencies
│-- README.md        # Project documentation
```

## Middleware Implementations

- **Rate Limiting:** Limits users to 10 requests per minute.
- **Error Handling:** Centralized error handler for better debugging.
- **Logging:** Logs errors and important info using Winston.

## Future Enhancements

- Add authentication for URL management.
- Implement a user dashboard to view and manage URLs.
- Custom expiration for shortened URLs.
- Deploy to a cloud provider (Heroku, Vercel, or AWS).

## License

This project is open-source and available under the MIT License.

## Author

Atul Kumar Kanojia
