/* eslint-env mocha */

const converter = require('./../lib/')
const expect = require('chai').expect
const moment = require('moment')

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
    requiredIf: 'data.pokemon = \'Psyduck\' || data.pokemon = \'Pikachu\''
  },
  textEmail: {
    email: true
  },
  inputEmail: {
    email: true
  },
  list: {
    required: true
  },
  apiLookup: {
    params: {
      apiLookupList: {
        required: true
      }
    }
  },
  dateOfBirth: {
    maximumDate: new Date()
  },
  min3DaysAgo: {
    minimumDate: moment().subtract(3, 'days').format('YYYY/MM/DD')
  }
}

describe('Test the vuelidate converter', function () {
  let vuelidate

  it('Convert some JSON', () => {
    vuelidate = converter(JSON)

    console.log('\n------\n', vuelidate)
    expect(vuelidate.numberBetween5And10.between).to.be.a('function')

    expect(vuelidate.numberMin10Max50.minValue).to.be.a('function')
    expect(vuelidate.numberMin10Max50.maxValue).to.be.a('function')

    expect(vuelidate.textMinLen5MaxLen50.minLength).to.be.a('function')
    expect(vuelidate.textMinLen5MaxLen50.maxLength).to.be.a('function')

    expect(vuelidate.textRequired.required).to.be.a('function')

    expect(vuelidate.textRequiredIf.requiredIf).to.be.a('function')

    expect(vuelidate.textEmail.email).to.be.a('function')
    expect(vuelidate.inputEmail.email).to.be.a('function')

    expect(vuelidate.list.required).to.be.a('function')
    expect(vuelidate.apiLookup.params.apiLookupList.required).to.be.a('function')

    expect(vuelidate.dateOfBirth.maximumDate).to.be.a('function')

    expect(vuelidate.min3DaysAgo.minimumDate).to.be.a('function')
  })

  const dates = [
    ['1 year ago', moment().subtract(1, 'year'), false, true],
    ['7 days ago', moment().subtract(7, 'day'), false, true],
    ['4 days ago', moment().subtract(4, 'day'), false, true],
    ['3 days ago', moment().subtract(3, 'day'), true, true],
    ['yesterday', moment().subtract(1, 'day'), true, true],
    ['today', moment(), true, true],
    ['tomorrow', moment().add(1, 'day'), true, false],
    ['3 days ahead', moment().add(3, 'day'), true, false],
    ['4 days ahead', moment().add(4, 'day'), true, false],
    ['7 days ahead', moment().add(7, 'day'), true, false],
    ['1 year ahead', moment().add(1, 'year'), true, false]
  ]

  describe('Test the validation function for minimum date', () => {
    for (const [label, date, minResult] of dates) {
      it(`${label}, should${minResult ? '' : ' not'} be after 3 days ago`, () => expect(vuelidate.min3DaysAgo.minimumDate(date)).to.eql(minResult))
    }
  })

  describe('Test the validation function for maximum date', () => {
    for (const [label, date, , maxResult] of dates) {
      it(`${label}, should${maxResult ? '' : ' not'} be before today`, () => expect(vuelidate.dateOfBirth.maximumDate(date)).to.eql(maxResult))
    }
  })
})
