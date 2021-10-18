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

  it('test the validation function for minimum date', () => {
    const fn = vuelidate.min3DaysAgo.minimumDate

    const oneWeekAgo = moment().subtract(7, 'day')
    const today = moment()
    const tomorrow = moment().add(1, 'day')

    const oneWeekAgoResult = fn(oneWeekAgo)
    expect(oneWeekAgoResult).to.eql(false)

    const todayResult = fn(today)
    expect(todayResult).to.eql(true)

    const tomorrowResult = fn(tomorrow)
    expect(tomorrowResult).to.eql(true)
  })

  it('test the validation function for maximum date', () => {
    const fn = vuelidate.dateOfBirth.maximumDate

    const yesterday = moment().subtract(1, 'day')
    const today = moment()
    const tomorrow = moment().add(1, 'day')

    const yesterdayResult = fn(yesterday)
    expect(yesterdayResult).to.eql(true)

    const todayResult = fn(today)
    expect(todayResult).to.eql(false)

    const tomorrowResult = fn(tomorrow)
    expect(tomorrowResult).to.eql(false)
  })
})
