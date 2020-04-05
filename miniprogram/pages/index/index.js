const App = getApp()

Page({
  data: {
    mainBalance: 18.16,
    totalDue: 0.0
  },
  onShow(){
    var mainBalance = wx.getStorageSync('mainBalance')
    if (mainBalance){
      this.setData({mainBalance})
    }else{
      wx.setStorageSync('mainBalance', this.data.mainBalance)
    }
  },
  onLoad() {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 500
    });
    animation.opacity(1).step()
    this.setData({
      level_ease: animation.export()
    })
  },
  topup() {
    wx.switchTab({
      url: '/pages/cart/index',
    })
  },
})
