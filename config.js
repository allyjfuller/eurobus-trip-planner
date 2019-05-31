'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://admin:admin123@ds263436.mlab.com:63436/eurobus';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'secret'
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';