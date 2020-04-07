const App = getApp()
const dateUtils = require('../../helpers/DateUtil.js')
Page({
  data: {
    amounts: [
      5, 10, 15, 20, 25
    ],
    qualifiedAmount: 23,
    expiration: dateUtils.dateInOneMonth(),
    topupPopup: false,
    earnMorePopup: false,
    selectedAmount: 0,
  },
  topup(e) {
    const amount = e.currentTarget.dataset.amount
    this.setData({
      topupPopup: true,
      selectedAmount: amount,
    })
  },
  closeTopup() {
    this.setData({
      topupPopup: false,
    })
  },
  success() {
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