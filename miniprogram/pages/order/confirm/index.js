const App = getApp()

Page({
    onShow() {
      var orders = wx.getStorageSync('orders')
      if (orders) {
        this.setData({ orders })
      } else {
        wx.setStorageSync('orders', this.data.mainBalance)
      }
    },
})