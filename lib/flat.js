const yaml = require('js-yaml')
const flattenRuleSet = require('./flat-ruleset')

module.exports = async function (orginalSub) {
    const orginal = yaml.safeLoad(orginalSub, 'utf-8')
    const ruleProviders = orginal['rule-providers']
    const newRules = []
    const rules = orginal['rules']
    const flat = flattenRuleSet(ruleProviders)
    for (const rule of rules) {
        if (rule.startsWith('RULE-SET')) {
            const flatten = await flat(rule)
            newRules.push(...flatten)
        } else {
            newRules.push(rule)
        }
    }
    orginal.rules = newRules
    delete orginal['rule-providers']
    return yaml.safeDump(orginal)
}
