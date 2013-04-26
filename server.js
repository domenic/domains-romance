"use strict";

var concatStream = require("concat-stream");
var http = require("http");
var url = require("url");

http.createServer(function (req, res) {
    handleRequest(req, res);
}).listen(1337);

function handleRequest(req, res) {
    var parsedUrl = url.parse(req.url, true);
    console.log(req.method, parsedUrl.href);

    if (parsedUrl.pathname === "/sum-numbers" && req.method === "POST") {
        req.pipe(concatStream(function (err, data) {
            var numbers = JSON.parse(data);
            var sum = numbers.reduce(function (soFar, current) { return soFar + current; }, 0);

            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("Sum: " + sum);
        }));
    } else if (parsedUrl.pathname === "/throw" && req.method === "GET") {
        throw new Error("Pretend I am deeply nested inside library code!")
    } else if (parsedUrl.pathname === "/pipe" && req.method === "GET") {
        var siteToGet = parsedUrl.query.site;
        var getReq = http.get(siteToGet, function (getRes) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            getRes.pipe(res);
        });
    }
}
