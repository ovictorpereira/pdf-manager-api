# PDF Thumbnail API

A REST API built with Fastify and TypeScript for managing PDF documents with automatic thumbnail generation. This service allows you to upload PDF files, generate thumbnails, and perform CRUD operations on document metadata.

## Features

- **PDF Upload**: Upload PDF files with metadata labels
- **Automatic Thumbnail Generation**: Creates JPEG thumbnails from uploaded PDFs
- **Document Management**: Full CRUD operations for document metadata
- **Type Safety**: Built with TypeScript and Zod for runtime validation
- **Database Integration**: MySQL database with Drizzle ORM
- **Dockerized**: Complete Docker setup for easy deployment

## Tech Stack

- **Runtime**: Node.js 24
- **Framework**: Fastify with type providers
- **Database**: MySQL with Drizzle ORM
- **Validation**: Zod for schema validation
- **File Processing**: pdf-thumbnail for image generation
- **Container**: Docker & Docker Compose

## API Endpoints

### Upload Document

```
POST /upload
```

Uploads a PDF file and generates a thumbnail.

**Body (multipart/form-data):**

- `file`: PDF file (required)
- `label`: Document label (required, 2-100 characters)

**Response:**

```json
{
  "message": "Success"
}
```

### Get All Documents

```
GET /
```

Retrieves all documents with metadata.

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "label": "Document Label",
      "pdf_path": "/path/to/document.pdf",
      "thumb_path": "/path/to/document_thumb.jpg",
      "createdAt": "2025-08-28T10:00:00Z"
    }
  ]
}
```

### Update Document Label

```
PATCH /update/:id
```

Updates the label of a specific document.

**Parameters:**

- `id`: Document ID (positive integer)

**Body:**

```json
{
  "label": "New Label"
}
```

**Response:**

```json
{
  "message": "Label updated"
}
```

### Delete Document

```
DELETE /remove/:id
```

Deletes a document and its associated files.

**Parameters:**

- `id`: Document ID (positive integer)

**Response:**

```json
{
  "message": "Document deleted"
}
```

## Project Structure

```
src/
├── app.ts              # Fastify application setup
├── server.ts           # Server entry point
├── db/
│   ├── db.ts          # Database connection
│   └── schema.ts      # Database schema definition
├── routes/
│   ├── upload.ts      # PDF upload endpoint
│   ├── get-documents.ts # List documents endpoint
│   ├── update-label.ts # Update document label endpoint
│   └── delete-by-id.ts # Delete document endpoint
└── startup/
    └── routes.ts      # Route registration
```

## Database Schema

The application uses a single table `tb_documents` with the following structure:

- `id`: Primary key, auto-increment
- `label`: Document label (VARCHAR 255, required)
- `pdf_path`: Path to PDF file (VARCHAR 255, unique, required)
- `thumb_path`: Path to thumbnail file (VARCHAR 255, unique, required)
- `created_at`: Creation timestamp (default: now)

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 24+ (for local development)

### Running with Docker

1. Clone the repository:

```bash
git clone <repository-url>
cd pdf-thumbnail-api
```

2. Start the services:

```bash
docker-compose up -d
```

The API will be available at `http://localhost:3000` and MySQL at `localhost:3306`.

### Local Development

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables (create `.env` file):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=mysql
DB_NAME=documents
```

3. Start MySQL database:

```bash
docker-compose up db -d
```

4. Run database migrations:

```bash
npm run db:generate
npm run db:migrate
```

5. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev`: Start development server with file watching
- `npm run db:generate`: Generate database migrations
- `npm run db:migrate`: Run database migrations
- `npm run db:studio`: Open Drizzle Studio for database management

## Environment Variables

| Variable  | Description    | Default   |
| --------- | -------------- | --------- |
| `DB_HOST` | MySQL host     | localhost |
| `DB_PORT` | MySQL port     | 3306      |
| `DB_USER` | MySQL username | root      |
| `DB_PASS` | MySQL password | mysql     |
| `DB_NAME` | Database name  | documents |

## File Storage

- PDF files are stored in the `./documents` directory
- Thumbnails are generated with `_thumb.jpg` suffix
- Maximum file size: 50MB
- Supported format: PDF only

## Dependencies

### Runtime Dependencies

- **fastify**: Fast web framework
- **@fastify/multipart**: File upload support
- **drizzle-orm**: Type-safe ORM
- **mysql2**: MySQL driver
- **pdf-thumbnail**: PDF thumbnail generation
- **zod**: Schema validation
- **pino-pretty**: Logging

### Development Dependencies

- **typescript**: TypeScript compiler
- **drizzle-kit**: Database toolkit
- **@types/node**: Node.js type definitions

## Docker Configuration

The application includes:

- Multi-stage Dockerfile with Node.js Alpine
- ImageMagick and Ghostscript for PDF processing
- Docker Compose with MySQL service
- Volume mounting for document persistence
- Database initialization script

## License

MIT

## Author

Victor Pereira
