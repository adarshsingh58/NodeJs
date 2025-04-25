Things covered here:
- Google Oauth
- JWT Token Authentications and Authorization
- Node basics
- App server and API development using Express Router
- Cookie based parsing for Refresh token
- Playing Audio file to understand how blobs are sent in chunks
- understanding Middlewares
  - Filtering request 
  - Logging details for each API
- Using Rate limiter with Express Rate limiter and Redis based Rate Limiter for distributed systems
- Simple File reading, Using Paths, Dev tools like nodemon etc
- Understanding of Folder Structure like public, models, controllers, routes etc

For redis rate limiter to work, run the docker-compose file and run the docker redis instance.
once that is running make sure the port is the same as specified in rateLimiter.js
The connection should work now.
To check if the redis is up and running, run following command:
- docker exec -it my-redis-instance redis-cli

This will connect to instance named "my-redis-instance" and the run the command "redis-cli"



