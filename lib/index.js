const validators = require('vuelidate/lib/validators')

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
        case 'minLength':
          result[propertyKey].minLength = validators.minLength(attributeValue)
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
