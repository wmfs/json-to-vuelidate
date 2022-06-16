/* eslint-env mocha */

const converter = require('./../lib/')
const expect = require('chai').expect
const moment = require('moment')

const input = {
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
  },
  telNum: {
    telephoneNumber: true
  }
}

describe('Test the vuelidate converter', function () {
  let vuelidate

  it('Convert some JSON', () => {
    vuelidate = converter(input)

    console.log('------')
    console.log(JSON.stringify(vuelidate, null, 2))
    console.log('------')

    expect(vuelidate.numberBetween5And10.between.$validator).to.be.a('function')

    expect(vuelidate.numberMin10Max50.minValue.$validator).to.be.a('function')
    expect(vuelidate.numberMin10Max50.maxValue.$validator).to.be.a('function')

    expect(vuelidate.textMinLen5MaxLen50.minLength.$validator).to.be.a('function')
    expect(vuelidate.textMinLen5MaxLen50.maxLength.$validator).to.be.a('function')

    expect(vuelidate.textRequired.required.$validator).to.be.a('function')

    expect(vuelidate.textRequiredIf.requiredIf.$validator).to.be.a('function')

    expect(vuelidate.textEmail.email.$validator).to.be.a('function')
    expect(vuelidate.inputEmail.email.$validator).to.be.a('function')

    expect(vuelidate.list.required.$validator).to.be.a('function')
    expect(vuelidate.apiLookup.params.apiLookupList.required.$validator).to.be.a('function')

    expect(vuelidate.dateOfBirth.maximumDate.$validator).to.be.a('function')
    expect(vuelidate.min3DaysAgo.minimumDate.$validator).to.be.a('function')

    expect(vuelidate.telNum.telephoneNumber.$validator).to.be.a('function')
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
      it(`${label}, should${minResult ? '' : ' not'} be after 3 days ago`, () => expect(vuelidate.min3DaysAgo.minimumDate.$validator(date)).to.eql(minResult))
    }
  })

  describe('Test the validation function for maximum date', () => {
    for (const [label, date, , maxResult] of dates) {
      it(`${label}, should${maxResult ? '' : ' not'} be before today`, () => expect(vuelidate.dateOfBirth.maximumDate.$validator(date)).to.eql(maxResult))
    }
  })

  describe('Test the validation function for between', () => {
    for (let i = 0; i < 30; i++) {
      it(`Is ${i} between 5 and 10?`, () => {
        const expected = i >= 5 && i <= 10

        expect(
          vuelidate.numberBetween5And10.between.$validator(i)
        ).to.eql(
          expected
        )
      })
    }
  })

  describe('Test the validation function for telephone number', () => {
    const telephoneNumbers = [
      ['07123456789', true],
      ['01211234567', true],
      ['0121133', false],
      ['fjahsf', false]
    ]

    for (const [telephoneNumber, expected] of telephoneNumbers) {
      it(`Is ${telephoneNumber} a telephone number?`, () => {
        expect(
          vuelidate.telNum.telephoneNumber.$validator(telephoneNumber)
        ).to.eql(
          expected
        )
      })
    }
  })
})
