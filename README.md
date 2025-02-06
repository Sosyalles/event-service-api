# Event Service API 🎉

A robust RESTful API for managing events and event participation, built with Node.js, TypeScript, Express, and PostgreSQL.

## Features 🌟

- Create, read, update, and delete events
- Join and leave events
- View event participants
- Category-based event organization
- Location-based event filtering
- Date-based event filtering
- Pagination support
- Authentication and authorization
- Input validation
- Rate limiting
- CORS support
- Error handling

## Tech Stack 💻

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Sequelize ORM
- JSON Web Tokens (JWT)
- Joi (validation)
- Express Rate Limit
- Helmet (security)
- CORS

## Prerequisites 📋

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation 🚀

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd event-service-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure your environment variables:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3000

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=event_service_db
   DB_USER=postgres
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

4. Create the database:
   ```bash
   createdb event_service_db
   ```

5. Build the project:
   ```bash
   npm run build
   ```

6. Start the server:
   ```bash
   npm start
   ```

For development:
```bash
npm run dev
```

## API Endpoints 🛣️

### Events

- `GET /api/events` - Get all events (with filtering and pagination)
- `GET /api/events/:eventId` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:eventId` - Update an event
- `DELETE /api/events/:eventId` - Delete an event
- `POST /api/events/:eventId/join` - Join an event
- `DELETE /api/events/:eventId/leave` - Leave an event
- `GET /api/events/:eventId/participants` - Get event participants

### Request Examples

#### Create Event
```json
POST /api/events
{
  "title": "Summer Music Festival",
  "description": "A fantastic outdoor music festival",
  "categoryId": 1,
  "location": "Central Park",
  "eventDate": "2024-07-15T18:00:00Z",
  "maxParticipants": 1000
}
```

#### Get Events with Filters
```
GET /api/events?page=1&limit=10&categoryId=1&location=park&startDate=2024-07-01&endDate=2024-07-31
```

## Error Handling 🚨

The API uses standard HTTP response codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "status": "error",
  "message": "Error message here",
  "errors": [] // Optional validation errors array
}
```

## Testing 🧪

Run the test suite:
```bash
npm test
```

## Development 👩‍💻

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The server will restart automatically when you make changes.

3. Run linting:
   ```bash
   npm run lint
   ```

4. Format code:
   ```bash
   npm run format
   ```

## Production Deployment 🚀

1. Set environment variables for production
2. Build the project:
   ```bash
   npm run build
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

For support, email [your-email@example.com](mailto:your-email@example.com) or create an issue in the repository.