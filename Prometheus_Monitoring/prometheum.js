//https://blog.devgenius.io/quick-guide-application-monitoring-with-node-js-grafana-and-prometheus-ba4854014102
const express = require("express");
const promClient = require("prom-client");

const app = express();
const port = 3002;

const collectDefaultMetrics = promClient.collectDefaultMetrics; //Automatic metrics collection: Configure automatic collection of default metrics using collectDefaultMetrics. This includes system metrics such as CPU and memory usage.
collectDefaultMetrics();

//Creating a Metric Counter: A counter called “http_requests_total” is created using the library prom-client. This counter will track the total number of HTTP requests, and has additional labels for the request method (GET, POST, etc.) and status code.
const requestCounter = new promClient.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "status_code"],
});

app.get("/", (req, res) => {
    requestCounter.inc({ method: req.method, status_code: res.statusCode });
    res.send("Hello World!");
});

app.get("/metrics", async (req, res) => {
    res.set("Content-Type", promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});