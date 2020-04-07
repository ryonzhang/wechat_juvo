Page({
    data: {
      orders:[{
        amount:5,
        date:'20 March, 2020'
      }]
    },
    onShow() {
      var orders = wx.getStorageSync('orders')
      if (orders) {
        this.setData({ orders })
      } else {
        wx.setStorageSync('orders', this.data.orders)
      }
    },
})