const App = getApp()

Page({
    data: {
        canEdit: !1,
        carts: {
            items: []
        },
        prompt: {
            hidden: !0,
            icon: '../../assets/images/iconfont-cart-empty.png',
            title: 'The shopping cart is empty',
            text: 'Choose some products please',
            buttons: [
                {
                    text: 'Browse',
                    bindtap: 'bindtap',
                },
            ],
        },
    },
    bindtap(e) {
        const index = e.currentTarget.dataset.index
        
        switch(index) {
            case 0:
                App.WxService.switchTab('/pages/index/index')
                break
            default:
                break
        }
    },
    onLoad() {
    },
    onShow() {
        this.getCarts()
    },
    getCarts() {
        // App.HttpService.getCartByUser()
        // .then(res => {
        //     const data = res.data
        //     console.log(data)
        //     if (data.meta.code == 0) {
        //         data.data.forEach(n => n.goods.thumb_url = App.renderImage(n.goods.images[0] && n.goods.images[0].path))
        //         this.setData({
        //             'carts.items': data.data,
        //             'prompt.hidden': data.data.length,
        //         })
        //     }
        // })
      this.setData({
        'carts.items': Object.values(wx.getStorageSync('cart')),
        'prompt.hidden': Object.values(wx.getStorageSync('cart')).length,
      })
    },
    onPullDownRefresh() {
        this.getCarts()
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods/detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    confirmOrder(e) {
        console.log(e)
        App.WxService.setStorageSync('confirmOrder', this.data.carts.items)
        App.WxService.navigateTo('/pages/order/confirm/index')
    },
    del(e) {
        const id = e.currentTarget.dataset.id

        App.WxService.showModal({
            title: 'Reminder', 
            content: 'Are you sure to delete this item？', 
        })
        .then(data => {
            if (data.confirm == 1) {
              var cart = wx.getStorageSync('cart');
              delete cart[id]
              wx.setStorageSync('cart', cart)
              this.getCarts()
            }
        })
    },
    clear() {
        App.WxService.showModal({
            title: 'Reminder', 
            content: 'Are you sure to clear the shopping cart?', 
        })
        .then(data => {
            if (data.confirm == 1) {
              if (data.confirm == 1) {
                wx.setStorageSync('cart', {})
                this.getCarts()
              }
            }
        })
    },
    onTapEdit(e) {
        this.setData({
            canEdit: !!e.currentTarget.dataset.value
        })
    },
    bindKeyInput(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.detail.value)
        if (total < 0 || total > 100) return
        this.putCartByUser(id, {
            total: total
        })
    },
    putCartByUser(id, params) {
        // App.HttpService.putCartByUser(id, params)
        // .then(res => {
        //     const data = res.data
        //     console.log(data)
        //     if (data.meta.code == 0) {
        //         this.getCarts()
        //     }
        // })
        console.log(params)
        var cart = wx.getStorageSync('cart');
      cart ||={ }
      if (cart[id]) {
        cart[id].total = params.total
      } 
      cart[id].amount = cart[id].goods.price
      cart[id].totalAmount = cart[id].goods.price * cart[id].total
      wx.setStorageSync('cart', cart)
      this.getCarts()
    },
    decrease(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.currentTarget.dataset.total)
        if (total == 1) return
        this.putCartByUser(id, {
            total: total - 1
        })
    },
    increase(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.currentTarget.dataset.total)
        if (total == 100) return
        this.putCartByUser(id, {
            total: total + 1
        })
    },
})