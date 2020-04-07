const App = getApp()
const dateUtils = require('../../helpers/DateUtil.js')
Page({
  data: {
    expiration: dateUtils.dateInOneMonth(),
    amount: 0,
  },
  confirm() {
    // set main balance
    const mainBalance = wx.getStorageSync('mainBalance')
    const newBalance = parseFloat(mainBalance) + parseFloat(this.data.amount)
    wx.setStorageSync('mainBalance', newBalance)
    // set total due
    const totalDue = wx.getStorageSync('totalDue')
    const newDue = parseFloat(totalDue) + parseFloat(this.data.amount)
    wx.setStorageSync('totalDue', newDue)
    const orders = wx.getStorageSync('orders')
    const newOrder = {
      amount: this.data.amount,
      date: dateUtils.today()
    };
    const modifiedOrders = (orders && Array.isArray(orders)) ? [newOrder, ...orders] : [newOrder];
    wx.setStorageSync('orders', modifiedOrders)
    App.WxService.switchTab('/pages/index/index')
  },
  onLoad(options) {
    this.setData({
      amount: options.amount
    })
  }
})