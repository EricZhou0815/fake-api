# The Shoes Shop API

A RESTful API for managing a shoe shop inventory with JWT authentication and search capabilities.

## Features
- User registration and authentication
- CRUD operations for shoes inventory
- Search shoes by brand, model, size, color, and price
- JSON Web Token (JWT) authentication
- JSON-based database using lowdb

## Installation

1. Clone the repository:
```bash
git clone git@github.com:EricZhou0815/fake-api.git
cd shoes-shop-api
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## API Documentation

The API follows the OpenAPI 3.0 specification. You can access the full API documentation by opening the `openapi.json` file in your browser or using an OpenAPI viewer.

[View OpenAPI Specification](./openapi.json)

The OpenAPI documentation provides:
- Detailed endpoint descriptions
- Request/response schemas
- Authentication requirements
- Error responses
- Interactive API exploration (when viewed in an OpenAPI viewer)

### Authentication

#### Register a new user
```http
POST /register
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

#### Login
```http
POST /login
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

### Shoes Operations

#### Get all shoes
```http
GET /shoes
```

#### Get a specific shoe
```http
GET /shoes/{id}
```

#### Create a new shoe (Requires authentication)
```http
POST /shoes
Authorization: Bearer {token}
Content-Type: application/json

{
  "brand": "Nike",
  "model": "Air Max",
  "size": 10.5,
  "color": "Black",
  "price": 129.99
}
```

#### Update a shoe (Requires authentication)
```http
PUT /shoes/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "brand": "Nike",
  "model": "Air Max 90",
  "size": 11,
  "color": "White",
  "price": 139.99
}
```

#### Delete a shoe (Requires authentication)
```http
DELETE /shoes/{id}
Authorization: Bearer {token}
```

#### Search shoes
```http
GET /search-shoes?brand=Nike&size=10&color=Black
```

## Database Structure

The database uses a JSON file (db.json) with the following structure:

```json
{
  "shoes": [
    {
      "id": "unique_id",
      "brand": "string",
      "model": "string",
      "size": "number",
      "color": "string",
      "price": "number"
    }
  ],
  "users": [
    {
      "id": "unique_id",
      "username": "string",
      "password": "hashed_string"
    }
  ]
}
```

## Development

### Environment Variables
Create a `.env` file with the following variables:
```
SECRET_KEY=your_jwt_secret_key
PORT=3000
```

### Running Tests
To run tests (if available):
```bash
npm test
```

### Linting
To check code style:
```bash
npm run lint
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
