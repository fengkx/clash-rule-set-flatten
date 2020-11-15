const fetch = require('node-fetch')
const ProxyAgent = require('proxy-agent')
const proxyUri = process.env.http_proxy || process.env.all_proxy
const proxyAgent = new ProxyAgent(proxyUri)
const http = require('http')
const https = require('https')

const httpAgent = new http.Agent({
    keepAlive: true,
})
const httpsAgent = new https.Agent({
    keepAlive: true,
})
module.exports = async function (url, initOptions) {
    try {
        const resp = await fetch(url, {
            agent: function (_parsedURL) {
                if (proxyUri) {
                    return proxyAgent
                }
                if (_parsedURL.protocol === 'http:') {
                    return httpAgent
                } else {
                    return httpsAgent
                }
            },
            ...initOptions,
        })
        if (!resp.ok) {
            if (resp.status === 404) throw new Error(404)
            throw new Error()
        }
        const text = await resp.text()
        return text
    } catch (err) {
        throw err
    }
}
