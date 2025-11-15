export function generateAcademicYearSuggestions(query, role) {
  const currentYear = new Date().getFullYear()
  let minYear, maxYear

  if (role === 'student') {
    minYear = currentYear - 1
    maxYear = currentYear + 2
  } else {
    minYear = 2000
    maxYear = currentYear + 5
  }

  const result = []

  for (let y = minYear; y <= maxYear; y++) {
    const item = `${y}/${y + 1}`
    if (!query || item.includes(query)) {
      result.push(item)
    }
  }

  return result
}
