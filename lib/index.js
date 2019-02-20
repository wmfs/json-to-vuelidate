const validators = require('vuelidate/lib/validators')
const template = require('lodash.template')

module.exports = function (json) {
  const result = {}
  Object.entries(json).forEach(([propertyKey, propertyValue]) => {
    result[propertyKey] = {}

    Object.entries(propertyValue).forEach(([attributeKey, attributeValue]) => {
      switch (attributeKey) {
        case 'required':
          if (attributeValue) {
            result[propertyKey].required = validators.required
          }
          break
        case 'requiredIf':
          result[propertyKey].requiredIf = validators.requiredIf(data => {
            const compiled = template('${' + attributeValue + '}')
            const result = compiled({ data })
            return result === 'true'
          })
          break
        case 'minimum':
          result[propertyKey].minValue = validators.minValue(attributeValue)
          break
        case 'maximum':
          result[propertyKey].maxValue = validators.maxValue(attributeValue)
          break
        case 'minLength':
          result[propertyKey].minLength = validators.minLength(attributeValue)
          break
        case 'maxLength':
          result[propertyKey].maxLength = validators.maxLength(attributeValue)
          break
        case 'between':
          const [min, max] = attributeValue
          result[propertyKey].between = validators.between(min, max)
          break
      }
    })
  })
  return result
}
