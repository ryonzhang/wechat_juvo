const App = getApp()
Page({
  data: {
    helps: {
      item: {}
    }
  },
  onLoad(option) {
    this.setData({
      id: option.id
    })
  },
  onShow() {
    this.getDetail(this.data.id)
  },
  onReady() {
    const item = wx.getStorageSync('help').items.filter(item => item._id == this.data.id)[0]
    const title = item && item.title
    App.WxService.setNavigationBarTitle({
      title: title,
    })
  },
  getDetail(id) {
    this.setData({
      'helps.item': wx.getStorageSync('help').items.filter(item => item._id == id)[0]
    })
  },
})