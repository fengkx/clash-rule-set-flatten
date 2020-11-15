const getText = require('./get-text')
const yaml = require('js-yaml')
module.exports = (ruleProviders) => async (rule) => {
    const [ruleType, ruleName, strategy] = rule.split(',')
    const ruleProvider = ruleProviders[ruleName]
    if (ruleProvider.type === 'http') {
        const payloadText = await getText(ruleProvider.url)
        const rulesInSet = yaml.safeLoad(payloadText).payload
        return rulesInSet.map((r) => {
            const splited = r.split(',')
            const result = [...splited.slice(0, 2), strategy, splited.slice(2)]
            return result.join(',')
        })
    }
    console.warn(
        `Only http type provider support: ${ruleName} has has type ${ruleProvider.type}`
    )
    return []
}
