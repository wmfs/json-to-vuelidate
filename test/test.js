/* eslint-env mocha */

const converter = require('./../lib/')
const expect = require('chai').expect

const JSON = {
  numberBetween5And10: {
    between: [5, 10]
  },
  numberMin10Max50: {
    minimum: 10,
    maximum: 50
  },
  textMinLen5MaxLen50: {
    minLength: 5,
    maxLength: 50
  },
  textRequired: {
    required: true
  },
  textRequiredIf: {
    requiredIf: `data.pokemon = 'Psyduck' || data.pokemon = 'Pikachu'`
  },
  textEmail: {
    email: true
  }
}

describe('Test the vuelidate converter', function () {
  it('Convert some JSON', () => {
    const vuelidate = converter(JSON)

    expect(vuelidate.numberBetween5And10.between).to.be.a('function')

    expect(vuelidate.numberMin10Max50.minValue).to.be.a('function')
    expect(vuelidate.numberMin10Max50.maxValue).to.be.a('function')

    expect(vuelidate.textMinLen5MaxLen50.minLength).to.be.a('function')
    expect(vuelidate.textMinLen5MaxLen50.maxLength).to.be.a('function')

    expect(vuelidate.textRequired.required).to.be.a('function')

    expect(vuelidate.textRequiredIf.requiredIf).to.be.a('function')

    expect(vuelidate.textEmail.email).to.be.a('function')
  })
})
