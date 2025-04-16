# St. Nicholas Russian Orthodox School Website

This project is a website for St. Nicholas Russian Orthodox School with a fully functional contact form system.

## Features

- Multilingual support (English and Russian)
- Responsive design
- Secure contact form with backend storage
- Admin notification emails for new messages
- Spam protection and rate limiting
- Form validation
- Ollama-powered AI chatbot using the official Ollama JavaScript library

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- MongoDB (local or Atlas)
- Ollama for the chatbot functionality (optional)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd russian_orthodox_school
   ```

2. Install dependencies
   ```bash
   npm install
   npm run install-server
   ```

3. Create environment variables
   ```bash
   cp .env.example .env
   ```
   
   Then edit the `.env` file with your MongoDB connection string and email settings.

### Setting up Ollama for the Chatbot

The chatbot functionality is powered by [Ollama](https://ollama.ai/), an open-source LLM runner, using the official [Ollama JavaScript library](https://ollama.com/blog/python-javascript-libraries):

1. Install Ollama by following the instructions at [https://ollama.ai/download](https://ollama.ai/download)

2. Pull a model (we recommend Llama2 to start):
   ```bash
   ollama pull llama2
   ```

3. Start the Ollama service:
   ```bash
   ollama serve
   ```

4. The chatbot will automatically connect to the Ollama service on the default port (11434).

### Running the Application

For development (React frontend + Express backend):
```bash
npm run dev
```

For frontend only:
```bash
npm start
```

For backend only:
```bash
npm run server
```

## Production Deployment

1. Build the React application
   ```bash
   npm run build
   ```

2. Set environment variables on your hosting provider:
   - `NODE_ENV=production`
   - `MONGODB_URI=your_mongodb_connection_string`
   - `EMAIL_*` variables for email notifications

3. Start the server
   ```bash
   npm run server
   ```

## Contact Form Security Features

The contact form includes several security measures:

- Input validation and sanitization
- Rate limiting (5 submissions per hour per IP)
- CSRF protection through proper headers
- Spam detection based on content analysis
- Data validation on both client and server
- XSS protection through input escaping
- Proper error handling and logging

## Database Structure

Contact messages are stored in MongoDB with the following schema:

- `name`: Sender's name
- `email`: Sender's email
- `phone`: Sender's phone (optional)
- `subject`: Message subject
- `message`: Message content
- `ipAddress`: Sender's IP address (for security)
- `userAgent`: Sender's browser info (for security)
- `status`: Message status (unread, read, replied, spam, archived)
- `adminNotes`: Notes added by administrators
- `createdAt`: Timestamp when the message was received
- `updatedAt`: Timestamp when the message was last updated

## License

This project is private and proprietary.

## Contact

For inquiries about this website, please contact the school administration.
