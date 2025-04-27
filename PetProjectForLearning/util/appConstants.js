require('dotenv').config();
module.exports = Object.freeze({ // <-- Use Object.freeze()

    REDIS: process.env.REDIS,
    EXPRESS_LIMITER: process.env.EXPRESS_RATE_LIMITER,
    // API Related
    API_TIMEOUT_MS: 5000,
    MAX_RETRIES: 3,

    // User Roles
    USER_ROLE_ADMIN: 'admin',
    USER_ROLE_MEMBER: 'member',
    USER_ROLE_GUEST: 'guest',

    // Default Values
    DEFAULT_PAGE_SIZE: 20,

    // Event Names
    EVENT_USER_REGISTERED: 'user_registered',
    EVENT_ORDER_PLACED: 'order_placed',

    // Other application-specific constants
    MIN_PASSWORD_LENGTH: 8,
});