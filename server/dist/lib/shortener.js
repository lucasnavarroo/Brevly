"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShortCode = generateShortCode;
const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function generateShortCode(length = 6) {
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
