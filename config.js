'use strict';
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000'
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://admin1:admin123@cluster0-cha0k.mongodb.net/test?retryWrites=true';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'secret'
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';