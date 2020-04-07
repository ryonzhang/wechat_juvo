const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const dateUtils = {
  today: function () {
    const today = new Date()
    return today.getDate() + ' ' + monthNames[today.getMonth()] + ', ' + today.getFullYear();
  },
  dateInOneMonth: function () {
    const today = new Date()
    const result = new Date(today)
    result.setDate(result.getDate() + 30)
    return result.getDate() + ' ' + monthNames[result.getMonth()] + ', ' + result.getFullYear();
  }
}

module.exports = dateUtils