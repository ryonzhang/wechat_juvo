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
Date.prototype.getTodayFormatDate = function () {
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return this.getDate() + ' ' + monthNames[this.getMonth()] + ', ' + this.getFullYear();
}

Page({
    data: {
      expiration: new Date().getFormatDate(),
      amount: 0,
    },
    confirm() {
      var mainBalance = wx.getStorageSync('mainBalance')
      const value = (parseFloat(mainBalance) + parseFloat(this.data.amount)).toFixed(2)
      wx.setStorageSync('mainBalance', value)
      var orders = wx.getStorageSync('orders')
      if (orders && Array.isArray(orders)) {
        wx.setStorageSync( 'orders',[...orders, { amount: this.data.amount, date: new Date().getTodayFormatDate()}])
      } else {
        wx.setStorageSync('orders', [{ amount: this.data.amount, date: new Date().getTodayFormatDate() }])
      }
      App.WxService.switchTab('/pages/index/index')
    },
    onLoad(options){
      this.setData({ amount: options.amount})
    }

})