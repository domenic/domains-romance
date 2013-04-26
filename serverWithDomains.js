"use strict";

var concatStream = require("concat-stream");
var domain = require("domain");
var http = require("http");
var url = require("url");

http.createServer(function (req, res) {
    var d = domain.create();

    d.on("error", function (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("We encountered an error!\n\n" + err.stack);
    });

    d.run(function () {
        handleRequest(req, res);
    });
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
