const validators = require('vuelidate/lib/validators')
const template = require('lodash.template')
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

module.exports = function (json) {
  const result = {}

  Object.entries(json).forEach(([propertyKey, propertyValue]) => {
    // todo: refactor to make recursive on any object
    if (propertyValue.params) {
      result[propertyKey] = { params: {} }
      Object.entries(propertyValue.params).forEach(([k, v]) => {
        result[propertyKey].params[k] = parse(v)
      })
    } else {
      result[propertyKey] = parse(propertyValue, propertyKey)
    }

    // result[propertyKey] = parse(propertyValue)
  })

  return result
}

function parse (val, key) {
  const result = {}
  Object.entries(val).forEach(([attributeKey, attributeValue]) => {
    switch (attributeKey) {
      case 'email':
        if (attributeValue) {
          result.email = validators.email
        }
        break
      case 'telephoneNumber':
        if (attributeValue) {
          result.telephoneNumber = value => {
            // todo: differ between landline and mobile?
            if (value && value.trim().length > 0) {
              try {
                const parsed = phoneUtil.parse(value, 'GB') // todo: define country code in cardscript?
                return phoneUtil.isValidNumber(parsed)
              } catch (err) {
                console.warn(`Failed to parse telephone number on element '${key}'. Error: ${err}`)
                return false
              }
            } else {
              return true
            }
          }
        }
        break
      case 'required':
        if (attributeValue) {
          result.required = validators.required
        }
        break
      case 'requiredIf':
        result.requiredIf = validators.requiredIf(function () {
          const compiled = template('${' + attributeValue + '}')
          const result = compiled(this)
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
      case 'between': {
        const [min, max] = attributeValue
        result.between = validators.between(min, max)
        break
      }
    }
  })
  return result
}
