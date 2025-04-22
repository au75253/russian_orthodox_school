#!/bin/bash

echo "Stopping running containers..."
docker-compose down

echo "Building and starting all containers..."
docker-compose up -d --build

echo "Waiting for services to start..."
sleep 5

echo "Checking MongoDB connection..."
docker exec russian_orthodox_school-app-1 node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://mongodb:27017/orthodox_school').then(() => console.log('MongoDB connected successfully!')).catch(err => console.error('MongoDB connection error:', err))"

echo "Container logs:"
echo "============== MongoDB =============="
docker logs russian_orthodox_school-mongodb-1 --tail 10

echo "============== App Container =============="
docker logs russian_orthodox_school-app-1 --tail 20

echo "Containers are up and running!"
echo "- Frontend: http://localhost:3009"
echo "- Backend API: http://localhost:5000"
echo "- Ollama Python Server: http://localhost:5001"
echo ""
echo "To test the contact form, use: http://localhost:3009/contact"
echo "To check app logs in real-time: docker logs russian_orthodox_school-app-1 -f" 