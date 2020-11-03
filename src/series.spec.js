const series = require('./series2')

describe('ALL TESTS', () => {
  describe('SYNC TESTS', () => {
    test('SYNC simple test', () => {
      const resultcb = jest.fn()

      expect.assertions(2)

      const f1 = (cb) => {
        cb(null)
      }
      const f2 = (cb) => {
        cb(null)
      }
      const f3 = (cb) => {
        cb(null)
      }

      const arrOfFunc = [f1, f2, f3]

      series(arrOfFunc, resultcb)
      expect(resultcb).toBeCalled()
      expect(resultcb.mock.calls.length).toEqual(1)
    })
    test('SYNC test with ERROR', () => {
      const resultcb = jest.fn()

      expect.assertions(2)

      const f1 = (cb) => {
        cb(null)
      }
      const f2 = (cb) => {
        cb(null)
      }
      const f3 = (cb) => {
        throw Error('err')
        cb(true)
      }

      const arrOfFunc = [f1, f2, f3]

      series(arrOfFunc, resultcb)
      expect(resultcb).toBeCalled()
      expect(resultcb.mock.calls.length).toEqual(1)
    })
    test('SYNC test with data', () => {
      const resultcb = jest.fn()

      expect.assertions(3)

      const dataArr = [0, 0, 0]

      const f1 = (cb) => {
        dataArr[0] += 1
        cb(null)
      }
      const f2 = (cb) => {
        dataArr[1] += 2
        cb(null)
      }
      const f3 = (cb) => {
        dataArr[2] += 3
        cb(null)
      }

      const arrOfFunc = [f1, f2, f3]

      series(arrOfFunc, resultcb)
      expect(resultcb).toBeCalled()
      expect(resultcb.mock.calls.length).toEqual(1)
      expect(dataArr).toEqual([1, 2, 3])
    })

    test('SYNC test with data and twice call', () => {
      const resultcb = jest.fn()

      expect.assertions(3)

      const dataArr = [0, 0, 0]

      const f1 = (cb) => {
        dataArr[0] += 1
        cb(null)
        cb(null)
      }
      const f2 = (cb) => {
        dataArr[1] += 2
        cb(null)
      }
      const f3 = (cb) => {
        dataArr[2] += 3
        cb(null)
      }

      const arrOfFunc = [f1, f2, f3]

      series(arrOfFunc, resultcb)
      expect(resultcb).toBeCalled()
      expect(resultcb.mock.calls.length).toEqual(1)
      expect(dataArr).toEqual([1, 2, 3])
    })
  })

  describe('ASYNC TESTS', () => {
    test('ASYNC simple test', done => {
      const resultcb = jest.fn()

      expect.assertions(2)

      const f1 = (cb) => {
        setTimeout(() => {
          cb(null)
        }, 300)
      }
      const f2 = (cb) => {
        setTimeout(() => {
          cb(null)
        }, 200)
      }
      const f3 = (cb) => {
        setTimeout(() => {
          cb(null)
        }, 100)
      }

      const arrOfFunc = [f1, f2, f3]

      series(arrOfFunc, resultcb)
      setTimeout(() => {
        expect(resultcb).toBeCalled()
        expect(resultcb.mock.calls.length).toEqual(1)
        done()
      }, 1000)
    })

    test('ASYNC simple test', done => {
      const resultcb = jest.fn()

      expect.assertions(2)

      const f1 = cb => setTimeout(() => {
        cb()
      }, 10, null, 'res')
      const f2 = cb => setTimeout(() => {
        cb()
      }, 20, null, 'res')
      const f3 = cb => setTimeout(() => {
        cb()
      }, 30, null, 'res')

      const arrOfFunc = [f1, f2, f3]

      series(arrOfFunc, resultcb)
      setTimeout(() => {
        expect(resultcb).toBeCalled()
        expect(resultcb.mock.calls.length).toEqual(1)

        done()
      }, 100)
    })
    test('Test twice call', done => {
      expect.assertions(3)

      const resultcb = jest.fn()
      const f1 = cb => setTimeout((err, res) => {
        cb(err, res)
        cb(null, 'res2')
      }, 100, null, 'res')

      series([f1], resultcb)

      setTimeout(() => {
        expect(resultcb).toBeCalled()
        expect(resultcb.mock.calls.length).toEqual(1)
        expect(resultcb.mock.calls[0][1]).toEqual('res')

        done()
      }, 200)
    })
    test('error handler', done => {
      expect.assertions(3)

      const resultcb = jest.fn()
      const f1 = cb => setTimeout((err, res) => {
        cb(err, res)
      }, 100, 'error', null)

      series([f1], resultcb)

      setTimeout(() => {
        expect(resultcb).toBeCalled()
        expect(resultcb.mock.calls.length).toEqual(1)
        expect(resultcb.mock.calls[0][0]).toEqual('error')

        done()
      }, 200)
    })
    test('ASYNC test with data and twice cb call', done => {
      const resultcb = jest.fn()

      expect.assertions(3)

      const dataArr = [0, 0, 0]

      const f1 = (cb) => {
        setTimeout(() => {
          dataArr[0] += 1
          cb(null)
          cb(null)
        }, 300)
      }
      const f2 = (cb) => {
        setTimeout(() => {
          dataArr[1] += 2
          cb(null)
        }, 200)
      }
      const f3 = (cb) => {
        setTimeout(() => {
          dataArr[2] += 3
          cb(null)
        }, 100)
      }

      const arrOfFunc = [f1, f2, f3]

      series(arrOfFunc, resultcb)
      setTimeout(() => {
        expect(resultcb).toBeCalled()
        expect(resultcb.mock.calls.length).toEqual(1)
        expect(dataArr).toEqual([1, 2, 3])
        done()
      }, 1000)
    })
    test('test long throw', done => {
      const mockCallback = jest.fn()

      expect.assertions(3)

      const arr = []
      const f1 = cb => setTimeout((err, res) => {
        arr.push('f1_start')
        cb(err, res)
        arr.push('f1_end')
      }, 120, null, 'res')
      const f2 = cb => setTimeout((err, res) => {
        arr.push('f2_start')
        cb(err, res)
        arr.push('f2_end')
      }, 120, null, 'res')
      const f3 = cb => {
        arr.push('f3_start')
        throw Error('err')
        cb()

      }
      const f4 = cb => setTimeout((err, res) => {
        arr.push('f4_start')

        cb(err, res)

        arr.push('f4_end')
      }, 120, null, 'res')
      const f5 = cb => setTimeout((err, res) => {
        arr.push('f5_start')
        cb(err, res)
        arr.push('f5_end')
      }, 400, null, 'res')
      const f6 = cb => setTimeout((err, res) => {
        arr.push('f6_start')
        cb(err, res)
        arr.push('f6_end')
      }, 400, null, 'res')
      const f7 = cb => setTimeout((err, res) => {
        arr.push('f7_start')
        cb(err, res)
        arr.push('f7_end')
      }, 400, null, 'res')
      const f8 = cb => setTimeout((err, res) => {
        arr.push('f8_start')
        cb(err, res)
        arr.push('f8_end')
      }, 400, null, 'res')
      const f9 = cb => setTimeout((err, res) => {
        arr.push('f9_start')
        cb(err, res)
        arr.push('f9_end')
      }, 400, null, 'res')
      const f10 = cb => setTimeout((err, res) => {
        arr.push('f10_start')
        cb(err, res)
        arr.push('f10_end')
      }, 400, null, 'res')

      series([f1, f2, f3, f4, f5, f6, f7, f8, f9, f10], mockCallback)

      setTimeout(() => {
        expect(arr).toEqual([
          'f1_start', 'f1_end', 'f2_start', 'f3_start', 'f2_end'])
        expect(mockCallback).toBeCalled()

        expect(mockCallback.mock.calls.length).toEqual(1)

        done()
      }, 3000)
    })
  })
})
