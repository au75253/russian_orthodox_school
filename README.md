# St. Aiden & Chad Russian Orthodox School Website

This project is a website for St. Aiden & Chad Russian Orthodox School in Nottingham, UK, with a fully functional contact form system and an AI-powered chatbot assistant.

## About

St. Aiden & Chad Russian Orthodox School, founded in 2024, is associated with the Nottingham Russian Orthodox Church of St. Aiden & Chad. The school provides quality education in:
- Russian language for different age groups
- Russian literature
- Music (Solfège)
- Закон Божий (Law of God)

## Features

- Multilingual support (English and Russian)
- Responsive design for all devices
- Secure contact form with backend storage in MongoDB
- Admin notification emails for new enquiries
- Automatic confirmation emails to form submitters
- Spam protection and rate limiting
- Client and server-side form validation
- Ollama-powered AI chatbot to answer visitor questions

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- MongoDB (local or Atlas)
- Python 3.8+ (for the Ollama API server)
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

3. Set up Python environment
   ```bash
   # Create a virtual environment
   python -m venv server/python/venv
   
   # Activate the virtual environment
   # On macOS/Linux:
   source server/python/venv/bin/activate
   # On Windows:
   # server\python\venv\Scripts\activate
   
   # Install Python dependencies
   pip install -r server/python/requirements.txt
   ```

4. Create environment variables
   ```bash
   cp .env.example .env
   ```
   
   Then edit the `.env` file with your MongoDB connection string and email settings.

### Setting up Ollama for the Chatbot

The chatbot functionality is powered by [Ollama](https://ollama.ai/), an open-source LLM runner:

1. Install Ollama by following the instructions at [https://ollama.ai/download](https://ollama.ai/download)

2. Pull a model (we recommend Llama3 to start):
   ```bash
   ollama pull llama3
   ```

3. Start the Ollama service:
   ```bash
   ollama serve
   ```

## Running the Application

### All-in-one Development Mode

For development with all components (React frontend + Express backend + Python Ollama server):
```bash
npm run dev
```

### Separate Deployment (Recommended for Production)

For better error logging, monitoring, and scaling, you can deploy each component separately:

#### 1. MongoDB Server

```bash
mongod --dbpath=/path/to/data/directory
```

For production:
- Consider using MongoDB Atlas cloud service
- Or set up as a systemd service on Linux

#### 2. Python Ollama Server

```bash
# Navigate to the Python server directory
cd server/python/ollama_api

# Activate the virtual environment if not already activated
# On macOS/Linux:
source ../venv/bin/activate
# On Windows:
# ..\venv\Scripts\activate

# Run the server
python ollama_server.py
```

For production:
- Use Gunicorn with the virtual environment:
  ```bash
  source ../venv/bin/activate
  gunicorn -w 4 'ollama_server:app'
  ```
- Or run as a systemd service (include the path to the virtual environment's Python interpreter)

#### 3. Node.js Backend

```bash
cd server
node server.js
```

For production:
- Use PM2: `pm2 start server.js --name "school-backend"`
- For development: `nodemon server.js`

#### 4. Frontend React App

Development:
```bash
npm run start
```

Production:
```bash
npm run build
npx serve -s build
```

## Running with Docker

To run the application using Docker (recommended for consistent environments across different machines):

1. Ensure you have Docker and Docker Compose installed on your system.

2. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd russian_orthodox_school
   ```

3. Build and start all services with Docker Compose:
   ```bash
   docker-compose up
   ```
   
   This will start:
   - MongoDB database
   - Ollama service
   - Python Ollama server
   - Node.js backend
   - React frontend

4. Access the application:
   - Frontend: http://localhost:3009
   - Backend API: http://localhost:5000
   - Ollama Python Server: http://localhost:5001

5. To stop all services:
   ```bash
   docker-compose down
   ```

6. To rebuild the application after making changes:
   ```bash
   docker-compose up --build
   ```

Note: On the first run, Ollama may need a few minutes to download the default language model. The contact form will be fully functional once all services are running.

After the build is complete run this command to load in the llm model

```bash
docker exec russian_orthodox_school-ollama-1 ollama pull llama3.2:1b
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

3. Deploy to GitHub Pages (if using GitHub Pages)
   ```bash
   npm run deploy
   ```

## Email Configuration

To enable email notifications:

1. Update the `.env` file with your email settings:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=no-reply@staidenchadrussianschool.org
   ADMIN_EMAIL=your-personal-email@gmail.com
   SEND_EMAILS_IN_DEV=true
   ```

2. For Gmail, enable 2-Factor Authentication and create an App Password

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
