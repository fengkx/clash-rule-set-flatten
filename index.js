const {parse} = require('url')
const http = require("http");
const {send} = require('micro')
const flatten = require('./lib/flat')
const getText = require('./lib/get-text')

const app = async (req, res) => {
    const {query, pathname} = parse(req.url, true)
    if(pathname !== '/flat') {
        send(res, 200, 'Usage: /flat?url=<clash subscription url>')
        return
    }
    const subUrl = query.url
    console.log(subUrl)
    const orgianlSub = await getText(subUrl)
    res.setHeader('Content-Type', 'text/plain; charset=utf8')
    send(res, 200, await flatten(orgianlSub))
}
http.createServer(app).listen(3000);
module.exports = app;
