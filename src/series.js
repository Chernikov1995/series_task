/**
 * @param arrOfFunc
 * @param {...any} arrOfFunc.0
 * @param resultcb
 */
function series ([...arrOfFunc], resultcb) {
  let flagWasError = false
  const fabric = (cb) => {
    let flagOnceCall = false

    return (err, res) => {
      if (flagOnceCall) {
        return
      }

      flagOnceCall = true

      if (flagWasError) {
        return false
      }

      cb(err, res)
    }
  }
  const resultCbFabric = (resultcb) => {
    let flagOnceCallResCb = false

    return (err, res) => {
      if (!flagOnceCallResCb) {
        if (err) {
          flagWasError = true
        }

        flagOnceCallResCb = true
        resultcb(err, res)
      } else {
        return false
      }
    }
  }
  const modifiedresultcb = resultCbFabric(resultcb)

  arrOfFunc.reduceRight((nextFn, fn) => {
    const modifiedNextFn = fabric(nextFn)

    return () => {
      fn((err, res) => {
        if (err) {
          return resultcb(err)
        }

        try {
          modifiedNextFn(null, res)
        } catch (err) {
          resultcb(err)
        }
      })
    }
  }, modifiedresultcb)()
}

module.exports = series
