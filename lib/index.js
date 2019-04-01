const validators = require('vuelidate/lib/validators')
const template = require('lodash.template')

module.exports = function (json) {
  const result = {}

  Object.entries(json).forEach(([propertyKey, propertyValue]) => {
    if (propertyValue.selected) {
      result[propertyKey] = {
        selected: parse(propertyValue.selected)
      }
    } else {
      result[propertyKey] = parse(propertyValue)
    }
  })

  return result
}

function parse (val) {
  const result = {}
  Object.entries(val).forEach(([attributeKey, attributeValue]) => {
    switch (attributeKey) {
      case 'required':
        if (attributeValue) {
          result.required = validators.required
        }
        break
      case 'requiredIf':
        result.requiredIf = validators.requiredIf(data => {
          const compiled = template('${' + attributeValue + '}')
          const result = compiled({ data })
          return result === 'true'
        })
        break
      case 'minimum':
        result.minValue = validators.minValue(attributeValue)
        break
      case 'maximum':
        result.maxValue = validators.maxValue(attributeValue)
        break
      case 'minLength':
        result.minLength = validators.minLength(attributeValue)
        break
      case 'maxLength':
        result.maxLength = validators.maxLength(attributeValue)
        break
      case 'between':
        const [min, max] = attributeValue
        result.between = validators.between(min, max)
        break
    }
  })
  return result
}
