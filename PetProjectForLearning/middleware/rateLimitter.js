const express = require('express');
const rateLimit = require('express-rate-limit');
const {RateLimiterRedis} = require('rate-limiter-flexible');
const Redis = require('redis');

//THIS IS NORMAL LOCAL LATE LIMITER USING EXPRESS-RATE-LIMIT API

//by default, the express-rate-limit middleware limits based on the requester's IP address.
// Rate Limiter: 15 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // disable `X-RateLimit-*` headers
    keyGenerator: (req, res) => {
        return req.user?.id || req.ip; // fall back to IP if user not authenticated
    },
    message: {
        status: 429,
        message: "Too many requests. Please try again later."
    }
});


//THIS IS REDIS BASED CENTRALIZED RATE LIMITER FOR DISTRIBUTED SYSTEM
//To Apply per API key/user instead of IP? Use req.user.id or header token
// Use sliding window? rate-limiter-flexible supports that too
// Block longer after abuse? Tweak blockDuration

// Create Redis client
const redisClient = Redis.createClient({
    socket: {
        host: '127.0.0.1', // Replace with your Redis host
        port: 6379,
    }
});
redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Connected to Redis for rate limiting.'));

 redisClient.connect(); // for Redis v4+

// Configure rate limiter: 10 requests per 10 seconds. Tracks request counts in Redis, Applies limits across all app instances, Responds with 429 Too Many Requests when limits exceeded
const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware', // Prefix for Redis keys
    points: 3,             // Max requests (limit)
    duration: 10,            // Per 10 seconds window
    blockDuration: 60,    // Optional: Block duration if points exceeded
    // insuranceLimiter: ... // Optional: Add insurance limiter for Redis outages
});

// Middleware to apply rate limit per IP
const rateLimiterMiddleware = async (req, res, next) => {
    const key = req.ip; // Use IP address as the key
    const pointsToConsume = 1; // Consume 1 point per request

    try {
        console.log(`Rate limit check for IP: ${key}`);
        const rateLimiterRes = await rateLimiter.consume(key, pointsToConsume);

        // --- Set Headers on Success ---
        // X-RateLimit-Limit: The maximum number of requests allowed in the window.
        res.setHeader('X-RateLimit-Limit', rateLimiter.points);
        // X-RateLimit-Remaining: The number of requests remaining in the current window.
        res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
        // X-RateLimit-Reset: The time (in seconds since epoch) when the window resets.
        // msBeforeNext gives ms until the limit resets or a point is regenerated
        const resetTime = Math.ceil((Date.now() + rateLimiterRes.msBeforeNext) / 1000);
        res.setHeader('X-RateLimit-Reset', resetTime);

        console.log(`IP ${key} allowed. Remaining: ${rateLimiterRes.remainingPoints}/${rateLimiter.points}`);
        next(); // Request allowed, proceed

    } catch (rejRes) { // Catch the rejection, which contains rate limit info
        console.warn(`IP ${key} blocked. Too many requests.`);

        // --- Set Headers on Rejection ---
        // Ensure headers are set even when the request is blocked
        res.setHeader('X-RateLimit-Limit', rateLimiter.points);
        // Usually 0 when blocked, but get it from the rejection object just in case
        res.setHeader('X-RateLimit-Remaining', rejRes.remainingPoints);

        const resetTime = Math.ceil((Date.now() + rejRes.msBeforeNext) / 1000);
        res.setHeader('X-RateLimit-Reset', resetTime);

        // Also include Retry-After header (in seconds)
        const retryAfterSeconds = Math.ceil(rejRes.msBeforeNext / 1000);
        res.setHeader('Retry-After', retryAfterSeconds);

        res.status(429).send('Too Many Requests - slow down 😓');
    }
};


module.exports = {limiter, rateLimiterMiddleware};
