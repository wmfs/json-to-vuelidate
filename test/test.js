/* eslint-env mocha */

const converter = require('./../lib/')
// const chai = require('chai')
// const expect = chai.expect

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
    console.log(vuelidate)
  })
})
