# Domains and Catching Errors: A Romance

The two servers in this repository show a before and after picture of Node.js error handling.

- `server.js` exposes a number of endpoints which, if hit in certain ways, can cause uncaught exceptions or unheard
  `"error"` events that then crash the server.

- In contrast, `serverWithDomains.js` applies a bit of extra code to wrap the server's route processing in a
  [domain][], and the server stays up the whole time.


[domain]: http://nodejs.org/api/domain.html

## The Commands

Hit the servers with the following commands to explore the failure modes of `server.js`, and the resiliency of
`serverWithDomains.js`:

```
curl --data "[1, 2, 3]" http://localhost:1337/sum-numbers -v
curl --data "[1, 2, 3" http://localhost:1337/sum-numbers -v

curl http://localhost:1337/throw

curl http://localhost:1337/pipe?site=http://www.google.com -v
curl http://localhost:1337/pipe?site=http://www.googlexysyd.com -v
```
