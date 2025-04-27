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


---------- Prometheus Start--------------

We can only see "http_requests_total" details in prometheus or Grafana? what about pod's health check, resource utilization? Do i need to register everything with promClient?
That's a great question! You're right to think beyond just the custom http_requests_total.
Let's break down what you get by default and how to get the other metrics:
What You Can See Now (With Your Current Code):
http_requests_total: Your custom counter, broken down by method and status_code. This comes directly from your requestCounter.inc() calls.
Default Node.js Process Metrics: Because you called promClient.collectDefaultMetrics(), you also automatically get metrics about the Node.js process itself. These include things like:
process_cpu_user_seconds_total, process_cpu_system_seconds_total, process_cpu_seconds_total: CPU time spent by the Node.js process.
process_resident_memory_bytes: Memory usage (RSS) of the Node.js process.

nodejs_heap_size_total_bytes, nodejs_heap_size_used_bytes: Details about the V8 heap usage.
nodejs_eventloop_lag_seconds: A measure of event loop responsiveness.
nodejs_active_handles_total: Number of active libuv handles.
nodejs_gc_duration_seconds: Statistics about garbage collection runs.
(These give you insight into how your specific Node.js application process is performing).What You DON'T See Now (Pod Health / Resource Utilization):Pod Health Check:
Prometheus itself performs a basic health check by scraping the /metrics endpoint. If the scrape succeeds, the automatically generated metric up{job="your-job-name", instance="your-instance"} will be 1. If the scrape fails (app crashed, network issue), up will be 0. You can create alerts based on up == 0.
This doesn't check deeper application health (e.g., database connectivity) unless you explicitly create custom metrics for that (like a gauge database_connection_ok that you set to 1 or 0).
System/Node/Pod Resource Utilization: collectDefaultMetrics() does not give you metrics for the entire underlying system (the virtual machine, the physical host, or the resource limits/usage of the Kubernetes pod). It only knows about the Node.js process. You won't see:
Overall Server CPU Usage (across all processes).
Overall Server Memory Usage/Available Memory.
Disk I/O and Space Usage for the server/volumes.
Network Traffic for the server's network interfaces.(In Kubernetes) Pod CPU/Memory usage relative to its requests/limits.
Do You Need to Register Everything with promClient? NO!
promClient is primarily for:
Instrumenting your application-specific logic (like http_requests_total).
Getting metrics about the Node.js process itself (collectDefaultMetrics).
You do not (and generally cannot easily) use promClient inside your Node.js app to get host-level system metrics.
How to Get System/Pod Metrics (The Exporter Pattern):
To get system-level resource utilization and other infrastructure metrics, you use separate, dedicated programs called Exporters.
What is an Exporter? An exporter is a piece of software designed to fetch metrics from a specific third-party system (like the host OS, a database, a message queue) and expose them in the Prometheus text format on an HTTP /metrics endpoint, just like your Node.js app does.
node_exporter (Essential for System Metrics): This is the standard, official Prometheus exporter for getting host-level Linux/Unix system metrics.
You run node_exporter as a separate process on the same host/node as your application (or as a DaemonSet in Kubernetes).
It exposes metrics like node_cpu_seconds_total, node_memory_MemAvailable_bytes, node_filesystem_avail_bytes, node_network_receive_bytes_total, etc., usually on port 9100.
Kubernetes Metrics (kube-state-metrics, metrics-server): If you're running in Kubernetes, these services expose cluster-level and pod-level metrics (like pod CPU/memory usage relative to limits) that Prometheus can scrape.
Other Exporters: There are exporters for databases (Postgres, MySQL), message queues (Kafka, RabbitMQ), web servers (Nginx), and many other systems.
How Prometheus Gets Exporter Metrics:
You configure separate scrape jobs in your prometheus.yml file to tell Prometheus where to find these exporters:
# prometheus.yml
scrape_configs:
- job_name: 'your-nodejs-app' # Your application
  static_configs:
  - targets: ['host.docker.internal:3000'] # Or 'myapp:3000' etc.

- job_name: 'node_exporter' # The system metrics exporter
  static_configs:
  - targets: ['host.docker.internal:9100'] # Default port for node_exporter
  # Or the IP/hostname where node_exporter is running

# Example for scraping kube-state-metrics in Kubernetes
# - job_name: 'kube-state-metrics'
#   kubernetes_sd_configs:
#     - role: endpoints
#   relabel_configs:
#     - source_labels: [__meta_kubernetes_service_label_app_kubernetes_io_name]
#       action: keep
#       regex: kube-state-metrics
#     - source_labels: [__meta_kubernetes_endpoint_port_name]
#       action: keep
#       regex: http-metrics


In Summary:
You can see your custom http_requests_total AND Node.js process metrics from your current code in Prometheus/Grafana.
To see system/pod resource utilization (overall CPU, RAM, disk, network), you need to run the node_exporter separately and configure Prometheus to scrape it.
You don't register system metrics using promClient in your Node.js app. Prometheus uses the exporter pattern for that.
Basic health check is covered by the up metric generated by Prometheus based on successful scrapes.



If Prometheus is already tracking default Metrics  from  promClient.collectDefaultMetrics() and custom metrics from, say, new promClient.Counter().
Why do we need "/metrics" API?
That's a fundamental question about how Prometheus works! You need the /metrics API endpoint because Prometheus uses a pull-based model for collecting metrics.
Here's the breakdown:
Internal Collection vs. External Exposure:
promClient.collectDefaultMetrics() and new promClient.Counter() register metrics and provide ways to update their values within your running Node.js application's memory. The promClient library manages an internal registry of these metrics and their current states.
Prometheus itself runs as a separate process (often on a different machine or container). It needs a way to ask your application for the current values of those metrics.
Prometheus Pull Model:
Prometheus doesn't wait for applications to send it data (that's a push model, used less commonly with Prometheus via the Pushgateway for specific cases like batch jobs).
Instead, Prometheus is configured to periodically scrape (make an HTTP GET request to) known endpoints on its targets (your applications, exporters, etc.).
The Role of the /metrics Endpoint:
This endpoint acts as the standardized location where your application makes its collected metrics available for Prometheus to scrape.
When Prometheus scrapes http://yourapp:3000/metrics, your route handler (app.get("/metrics", ...)) executes.
Inside that handler, await promClient.register.metrics() does the crucial work:
It gathers the current values of all metrics registered with promClient (both default and custom).
It formats this data into the Prometheus text exposition format, which is a specific plain text format that Prometheus understands.
Your handler then sends this formatted text back as the HTTP response.
Prometheus receives this text response, parses it, and stores the metrics in its time-series database.
Analogy:
Think of your application as a factory (promClient tracks internal production counters). Prometheus is a quality inspector who needs to check the factory's output regularly. The /metrics endpoint is like the factory's designated loading dock where the factory prepares a standardized report (promClient.register.metrics()) of its current production numbers whenever the inspector arrives (Prometheus scrapes). The inspector doesn't go inside the factory floor randomly; they go to the known loading dock address.
In Summary:
You need the /metrics endpoint because:
Prometheus uses a pull model and needs a specific HTTP URL to request metric data from your application.
promClient collects metrics internally, but the /metrics endpoint is the bridge that exposes this internal data externally.
The handler for /metrics uses promClient.register.metrics() to format the internal data into the specific text format Prometheus requires.
Without the /metrics endpoint, Prometheus would have no way to access the metrics being tracked inside your Node.js application.

---------- Prometheus End ---------------