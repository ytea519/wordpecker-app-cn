// MongoDB initialization script for WordPecker App
db = db.getSiblingDB('wordpecker');

// Create collections (optional - Mongoose will create them automatically)
db.createCollection('wordlists');
db.createCollection('words');
db.createCollection('sessions');

// Create indexes for better performance
db.wordlists.createIndex({ "created_at": -1 });
db.words.createIndex({ "list_id": 1 });
db.words.createIndex({ "created_at": 1 });
db.sessions.createIndex({ "list_id": 1 });

print('MongoDB initialized for WordPecker App');