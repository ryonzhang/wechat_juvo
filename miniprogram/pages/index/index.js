Page({
  data: {
    mainBalance: 18.16,
    totalDue: 0.00,
    level:'GOLD',
    currentPoints:700,
    pointsToNextLevel:40,
    nextLevel:'Diamond',
    dataBalance:'1GB',
    dataExpiredDays:2,
    dataTimeRemainedInMins:86,
    inNetworkCallExpiredDays:5,
    inNetworkTimeRemainedInMins:51,
    globalCallExpiredDays:28,
    globalCallTimeRemainedInMins:32,
    smsExpiredDays: 56,
    smsTimeRemainedInMins: 12,
  },
  onShow() {
    // set main balance to the current value unless stored in local
    var mainBalance = wx.getStorageSync('mainBalance')
    if (mainBalance) {
      this.setData({
        mainBalance:parseFloat(mainBalance)
      })
    } else {
      wx.setStorageSync('mainBalance', this.data.mainBalance)
    }
    // set total due to the current value unless stored in local
    var totalDue = wx.getStorageSync('totalDue')
    if (totalDue) {
      this.setData({
        totalDue: parseFloat(totalDue)
      })
    } else {
      wx.setStorageSync('totalDue', this.data.totalDue)
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