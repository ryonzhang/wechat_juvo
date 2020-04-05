const App = getApp()

Page({
  data: {
    indicatorDots: !0,
    vertical: !1,
    autoplay: !1,
    interval: 3000,
    duration: 1000,
    current: 0,
    goods: {
      item: {}
    },
  },
  swiperchange(e) {
    this.setData({
      current: e.detail.current,
    })
  },
  onLoad(option) {
    this.goods = App.HttpResource('/goods/:id', { id: '@id' })
    this.setData({
      id: option.id
    })
  },
  onShow() {
    this.getDetail(this.data.id)
  },
  onShareAppMessage: function (res) {
    return {
      title: this.goods.item.name,
      success: function (shareTickets) {
        console.info(shareTickets + '成功');
        // 转发成功
      },
      fail: function (res) {
        console.log(res + '失败');
        // 转发失败
      },
      complete: function (res) {
        // 不管成功失败都会执行
      }
    }
  },
  addCart(e) {
    const item = {}
    const id = this.data.goods.item._id
    const goods = this.data.goods.item
    item.goods = goods
    item._id = id

    var cart = wx.getStorageSync('cart');
    cart ||={ }
    if (cart[id]) {
      cart[id].total += 1
    } else {
      item.total = 1
      cart[id] = item
    }
    cart[id].amount = item.goods.price
    cart[id].totalAmount = item.goods.price * item.total
    wx.setStorageSync('cart', cart)


    this.showToast('Added to cart')
    // App.HttpService.addCartByUser(goods)
    // .then(res => {
    //     const data = res.data
    //     console.log(data)
    //     if (data.meta.code == 0) {
    //         this.showToast(data.meta.message)
    //     }
    // })
  },
  previewImage(e) {
    const urls = this.data.goods && this.data.goods.item.images.map(n => n.path)
    const index = e.currentTarget.dataset.index
    const current = urls[Number(index)]

    App.WxService.previewImage({
      current: current,
      urls: urls,
    })
  },
  showToast(message) {
    App.WxService.showToast({
      title: message,
      icon: 'success',
      duration: 1500,
    })
  },
  getDetail(id) {
    // App.HttpService.getDetail(id)
    // this.goods.getAsync({id: id})
    // .then(res => {
    //     const data = res.data
    //     console.log(data)
    // 	if (data.meta.code == 0) {
    //         data.data.images.forEach(n => n.path = App.renderImage(n.path))
    // 		this.setData({
    //             'goods.item': data.data, 
    //             total: data.data.images.length, 
    //         })
    // 	}
    // })
    var goodsList = wx.getStorageSync('goods')
    var good = goodsList.map(i => i.items).flat().filter(item => item._id == id)
    this.setData({
      'goods.item': good[0],
      total: good[0].images.length,
    })
  },
})