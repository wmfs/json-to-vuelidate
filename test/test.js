/* eslint-env mocha */

const converter = require('./../lib/')
const expect = require('chai').expect

describe('Test the vuelidate converter', function () {
  it('Convert some JSON', () => {
    const vuelidate = converter({
      name: {
        required: true,
        minLength: 4
      },
      age: {
        between: [20, 30]
      }
    })
    expect(vuelidate.name.required).to.be.a('function')
    expect(vuelidate.name.minLength).to.be.a('function')
    expect(vuelidate.age.between).to.be.a('function')
  })
})
