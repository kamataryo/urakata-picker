function urakataPicker(urakataData) {
  const dateRow = urakataData.shift()

  const dateMatched = dateRow[0].match(
    /^受付表(20[1-9][0-9])年([1-9]|10|11|12)月([1-9]|[1-2][0-9]|30|31)日\([日月火水木金土]\)$/
  )

  if (!dateMatched) {
    return {
      error: true,
      message:
        '日付が検出できませんでした。"受付表20xx年yy月zz日"形式の日付を指定してください。'
    }
  }

  const date = parseDate(dateMatched)

  const tours = parseTour(urakataData)

  return tours
}

function parseDate(dateMatched) {
  const year = dateMatched[1]
  const month = ('0' + dateMatched[2]).slice(-2)
  const day = ('0' + dateMatched[3]).slice(-2)
  const date = year + '/' + month + '/' + day
  return date
}

function parseTour(urakataData) {
  var prevIndex = -1
  const tours = []
  const MEMO_COL_INDEX = 7
  const NAME_COL_INDEX = 0

  urakataData.forEach(function(cols, index) {
    if (cols.join('') === '') {
      const match1 = urakataData[prevIndex + 1][0].match(
        /^(.*?)(([0-9]|1[0-9]|2[0-4]):[0-5][0-9])$/
      )

      const match2 = urakataData[prevIndex + 1][1].match(/^([0-9]+)名$/)

      const name = match1[1]
      const startAt = match1[2]
      const num = parseInt(match2[1])

      const groups = urakataData.slice(prevIndex + 3, index)
      const names = groups
        .map(function(group) {
          return group[NAME_COL_INDEX]
        })
        .join(',')
      const memos = groups
        .filter(function(group) {
          return !!group[MEMO_COL_INDEX]
        })
        .map(function(group) {
          return group[NAME_COL_INDEX] + 'さん: ' + group[MEMO_COL_INDEX]
        })
        .join('\n')

      tours.push({
        name: name,
        startAt: startAt,
        num: num,
        groups: groups,
        names: names,
        memos: memos
      })
      prevIndex = index
    }
  })

  return tours
}

console.log(urakataPicker(require('./appendice/data.json')))
