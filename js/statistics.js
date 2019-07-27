// W - WHITE
// GW - GREY WHITE
// G - GREY
// GB - GREY BLACK
// B - BLACK

const YA = 'Ya'
const TIDAK = 'Tidak'
const TIDAK_PASTI = 'Tidak Pasti'

const questionGroups = {
  set1: {
    W: [
      [YA, YA, YA],
      [YA, TIDAK, YA],
      [YA, TIDAK_PASTI, YA],
      [TIDAK_PASTI, TIDAK, YA]
    ],
    GW: [
      [YA, YA, YA],
      [YA, TIDAK, YA],
      [YA, TIDAK_PASTI, YA],
      [TIDAK_PASTI, TIDAK, YA]
    ],
    G: [
      [YA, YA, TIDAK_PASTI],
      [YA, TIDAK, TIDAK],
      [YA, TIDAK_PASTI, TIDAK],
      [TIDAK, YA, YA],
      [TIDAK, TIDAK, TIDAK_PASTI],
      [TIDAK, TIDAK_PASTI, YA],
      [TIDAK_PASTI, YA, YA],
      [TIDAK_PASTI, TIDAK_PASTI, TIDAK_PASTI],
    ],
    GB: [
      [YA, YA, TIDAK],
      [TIDAK, YA, TIDAK_PASTI],
      [TIDAK, TIDAK_PASTI, TIDAK_PASTI],
      [TIDAK_PASTI, YA, TIDAK_PASTI],
      [TIDAK_PASTI, TIDAK, TIDAK],
    ],
    B: [
      [TIDAK, YA, TIDAK],
      [TIDAK, TIDAK, TIDAK],
      [TIDAK, TIDAK_PASTI, TIDAK],
      [TIDAK_PASTI, YA, TIDAK],
      [TIDAK_PASTI, TIDAK_PASTI, TIDAK],
    ],
  },
  set2: {
    W: [
      [YA, YA, TIDAK],
      [YA, TIDAK, TIDAK],
      [YA, TIDAK_PASTI, TIDAK],
      [TIDAK_PASTI, TIDAK, TIDAK]
    ],
    GW: [
      [YA, TIDAK, TIDAK_PASTI],
      [YA, TIDAK_PASTI, TIDAK_PASTI],
      [TIDAK, TIDAK, TIDAK],
      [TIDAK_PASTI, TIDAK, TIDAK_PASTI],
      [TIDAK_PASTI, TIDAK_PASTI, TIDAK],
    ],
    G: [
      [YA, YA, TIDAK_PASTI],
      [YA, TIDAK, YA],
      [YA, TIDAK_PASTI, YA],
      [TIDAK, YA, TIDAK],
      [TIDAK, TIDAK, TIDAK_PASTI],
      [TIDAK, TIDAK_PASTI, TIDAK],
      [TIDAK_PASTI, YA, TIDAK],
      [TIDAK_PASTI, TIDAK_PASTI, TIDAK_PASTI],
    ],
    GB: [
      [YA, YA, YA],
      [TIDAK, YA, TIDAK_PASTI],
      [TIDAK, TIDAK_PASTI, TIDAK_PASTI],
      [TIDAK_PASTI, YA, TIDAK_PASTI],
      [TIDAK_PASTI, TIDAK, YA],
    ],
    B: [
      [TIDAK, YA, YA],
      [TIDAK, TIDAK, YA],
      [TIDAK, TIDAK_PASTI, YA],
      [TIDAK_PASTI, YA, YA],
      [TIDAK_PASTI, TIDAK_PASTI, YA],
    ],
  }
}

async function questionDistributionData(surveys = [], url) {
  const result = surveys.map(async ({ question_survey, operator_id }) => {
    if (!operator_id) return null
    try {
      const setNumber = await getSetNumber(url, operator_id)

      if (question_survey) {
        const surveyQuestions = JSON.parse(question_survey)
        if (surveyQuestions && surveyQuestions.length) {
          const firstThree = surveyQuestions.slice(0, 3)
          const keys = Object.keys(questionGroups.set1)
          const groups = Object.values(questionGroups[`set${setNumber}`])

          const outcome = groups.reduce((acc, g, i) => {
            let key = keys[i]

            const gIndex = g.findIndex(answers => firstThree[0] === answers[0] && firstThree[1] === answers[1] && firstThree[2] === answers[2])

            acc = gIndex > -1 ? key : acc

            return acc
          }, '')
          return outcome
        }
        return null
      } else
        return null
    } catch (err) {
      console.log(err, 'error')
      return null
    }
  })
  const testttt = await Promise.all(result)

  const totalOutcomes = testttt.reduce((acc, r) => {
    if (r)
      acc[r] += 1
    return acc
  }, {
      W: 0,
      GW: 0,
      G: 0,
      GB: 0,
      B: 0
    })

  return totalOutcomes
}

async function getSetNumber(url, operator_id) {
  return new Promise(async (resolve, reject) => {
    try {
      const operatorRes = await fetch(`${url}profile/${operator_id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      })

      if (operatorRes.status === 401) {
        await Swal.fire('Ouppss..', 'Please Re-Login', 'error')
        return window.location.href = '/js/pages/page-login.html'
      }

      const { data: [operator1] } = await operatorRes.json()

      return resolve(operator1.set_id)
    } catch (err) {
      console.error(err)
      return reject(err)
    }
  })
}