// const validators = require('vuelidate/lib/validators')
const validators = require('@vuelidate/validators')
const template = require('lodash.template')
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()
const moment = require('moment')
const isNotDefined = value => value === undefined || value === null || value === ''
const cloneJson = obj => JSON.parse(JSON.stringify(obj))
const parseTemplate = (_template, instance) => template(_template)(instance)

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
      case 'decimal':
        if (attributeValue) result.decimal = validators.decimal
        break
      case 'integer':
        if (attributeValue) result.integer = validators.integer
        break
      case 'email':
        if (attributeValue) result.email = validators.email
        break
      case 'regex':
        result.regex = validators.helpers.withParams(
          { type: 'regex' },
          function (value) {
            // validators.helpers.regex
            if (value !== null && value !== undefined) {
              const regex = new RegExp(attributeValue)
              return regex.test(value)
            } else {
              return true
            }
          }
        )
        break
      case 'postcode':
        if (attributeValue) {
          result.postcode = validators.helpers.withParams(
            { type: 'postcode' },
            function (value) {
              if (value && value.trim().length > 0) {
                const v = value.replace(/\s/g, '')
                const regex = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i
                // const regex = /^([A-Z]){1}([0-9][0-9]|[0-9]|[A-Z][0-9][A-Z]|[A-Z][0-9][0-9]|[A-Z][0-9]|[0-9][A-Z]){1}([ ])?([0-9][A-z][A-z]){1}$/i
                return regex.test(v)
              } else {
                return true
              }
            }
          )
        }
        break
      case 'telephoneNumber':
        if (attributeValue) {
          result.telephoneNumber = validators.helpers.withParams(
            { type: 'telephoneNumber' },
            function (value) {
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
          )
        }
        break
      case 'required':
        if (attributeValue) result.required = validators.required
        break
      case 'requiredIf':
        result.requiredIf = validators.requiredIf(function () {
          const result = parseTemplate('${' + attributeValue + '}', cloneJson({ data: this.data }))
          return result === 'true'
        })
        break
      case 'minimum':
        result.minValue = validators.minValue(attributeValue)
        break
      case 'maximum':
        result.maxValue = validators.maxValue(attributeValue)
        break
      case 'maximum.$':
        result.minimumDate = validators.helpers.withParams(
          { type: 'minimumDate' },
          function (value) {
            if (isNotDefined(value)) return true
            const result = parseTemplate('${' + attributeValue + '}', cloneJson({ data: this.data }))
            return value <= +result
          }
        )

        break
      case 'minimumDate': {
        result.minimumDate = validators.helpers.withParams(
          { type: 'minimumDate' },
          function (value) {
            if (isNotDefined(value)) return true

            const mValue = moment(value)
            const mMin = moment(attributeValue)

            if (!mValue || !mValue.isValid() || !mMin || !mMin.isValid()) {
              return false
            }

            return mMin.isBefore(mValue, 'day') || mMin.isSame(mValue, 'day')
          }
        )

        break
      }
      case 'maximumDate': {
        result.maximumDate = validators.helpers.withParams(
          { type: 'maximumDate' },
          function (value) {
            if (isNotDefined(value)) return true

            const mValue = moment(value)
            const mMax = moment(attributeValue)

            if (!mValue || !mValue.isValid() || !mMax || !mMax.isValid()) {
              return false
            }

            return mValue.isBefore(mMax, 'day') || mValue.isSame(mMax, 'day')
          }
        )

        break
      }
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
