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
      console.log(title)
        App.WxService.setNavigationBarTitle({
            title: title, 
        })
    },
    getDetail(id) {
        // this.helps.getAsync({id: id})
        // .then(res => {
        //     const data = res.data
        //     console.log(data)
        // 	if (data.meta.code == 0) {
        // 		this.setData({
        //             'helps.item': data.data
        //         })
        // 	}
        // })
        console.log(id)
      console.log(wx.getStorageSync('help'))
      this.setData({
        'helps.item': wx.getStorageSync('help').items.filter(item => item._id == id)[0]
      })
    },
})