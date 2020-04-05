const App = getApp()
Date.prototype.getFormatDate = function () {
  const today = this
  const result = new Date(today)
  result.setDate(result.getDate() + 30)
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return result.getDate() + ' ' + monthNames[result.getMonth()] + ', ' + result.getFullYear();
}

Page({
    data: {
        amounts:[
          5,10,15,20,25
        ],
        qualifiedAmount:17,
        expiration: new Date().getFormatDate(),
        topupPopup:false,
        earnMorePopup: false,
        selectedAmount:0,
    },
    topup(e) {
        const amount = e.currentTarget.dataset.amount
        this.setData({
          topupPopup: true,
          selectedAmount:amount,
        })
    },
    closeTopup() {
      this.setData({
        topupPopup: false,
      })
    },
    success(){
      this.closeTopup()
      App.WxService.navigateTo('/pages/successful/index', {
        amount: this.data.selectedAmount,
      })
    },
    earnMore() {
      this.setData({
        earnMorePopup: true,
      })
    },
    closeEarnMore() {
      this.setData({
        earnMorePopup: false,
      })
  }
})