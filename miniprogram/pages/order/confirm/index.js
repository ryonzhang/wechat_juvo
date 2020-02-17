const App = getApp()

Page({
    data: {
        hidden: !0,
        carts: {},
        address: {
            item: {},
        }
    },
    onLoad(option) {
        console.log(option)
        this.setData({
            address_id: option.id
        })

        const carts = {
            items: App.WxService.getStorageSync('confirmOrder'), 
            totalAmount: 0, 
        }

        carts.items.forEach(n => carts.totalAmount+=n.totalAmount)
        
        this.setData({
            carts: carts
        })

        console.log(this.data.carts)
    },
    onShow() {
        // const address_id = this.data.address_id
        // if (address_id) {
        //     this.getAddressDetail(address_id)
        // } else {
        //     this.getDefalutAddress()
        // }
    },
    redirectTo(e) {
        console.log(e)
        App.WxService.redirectTo('/pages/address/confirm/index', {
            ret: this.data.address_id
        })
    },
    getDefalutAddress() {
        App.HttpService.getDefalutAddress()
        .then(res => {
            const data = res.data
            console.log(data)
            if (data.meta.code == 0) {
                this.setData({
                    address_id: data.data._id, 
                    'address.item': data.data, 
                })
            } else {
                this.showModal()
            }
        })
    },
    showModal() {
        App.WxService.showModal({
            title: '友情提示', 
            content: '没有收货地址，请先设置', 
        })
        .then(data => {
            console.log(data)
            if (data.confirm == 1) {
                App.WxService.redirectTo('/pages/address/add/index')
            } else {
                App.WxService.navigateBack()
            }
        })
    },
    getAddressDetail(id) {
        App.HttpService.getAddressDetail(id)
        .then(res => {
            const data = res.data
            console.log(data)
            if (data.meta.code == 0) {
                this.setData({
                    'address.item': data.data
                })
            }
        })
    },
    addOrder() {
        // const address_id = this.data.address_id
        // const params = {
        //     items: [], 
        //     address_id: address_id, 
        // }
        // this.data.carts.items.forEach(n => {
        //     params.items.push({
        //         id: n.goods._id,
        //         total: n.total,
        //     })
        // })
        // console.log(params)
        // App.HttpService.postOrder(params)
        // .then(res => {
        //     const data = res.data
        //     console.log(data)
        //     if (data.meta.code == 0) {
        //         App.WxService.redirectTo('/pages/order/detail/index', {
        //             id: data.data._id
        //         })
        //     }
        // })
      this.data.carts.created_at = new Date().toLocaleDateString()
      this.data.carts.status='submitted'
        wx.setStorageSync('order', this.data.carts)
      wx.setStorageSync('cart', {})
        console.log(this.data.carts)
      var order = wx.getStorageSync('orders')
      if (!order) {
        order = {
          "items": [
            {
              "_id": "5e42fbb066e2d6167c262e76",
              "totalAmount": 20,
              "created_at": "June 21st 2019",
              "items": [
                {
                  "goods": {
                    "price": 10,
                    "name": "Top up 10 dollars for core balance",
                  },
                  "meta": {
                    "total": 1,
                    "totalAmount": 10
                  },
                  "total": 1,
                },
                {
                  "goods": {
                    "price": 10,
                    "name": "Top up 10 dollars for SMS balance",
                    "_id": "5dc3778b09b51655fa9e4421"
                  },
                  "meta": {
                    "total": 1,
                    "totalAmount": 10
                  },
                  "total": 1,
                },

              ],
              "status": "submitted"
            },
            {
              "_id": "5e42fbb066e2d6167c262e76",
              "totalAmount": 30,
              "created_at": "June 21st 2019",
              "items": [
                {
                  "goods": {
                    "price": 5,
                    "name": "Top up 5 dollars for core balance",
                    "amount": 2,
                  },
                  "meta": {
                    "total": 2,
                    "totalAmount": 10
                  },
                  "total": 2,
                },
                {
                  "goods": {
                    "price": 20,
                    "name": "Top up 20 dollars for SMS balance",
                    "_id": "5dc3778b09b51655fa9e4421",
                    "amount": 2,
                  },
                  "meta": {
                    "total": 1,
                    "totalAmount": 20
                  },
                  "total": 1,
                },

              ],
              "status": "confirmed"
            },
          ],
          "params": {
            "page": 2,
            "limit": 10,
            "type": "all"
          },
          "paginate": {
            "page": 1,
            "pages": 59,
            "perPage": 10,
            "total": 582,
            "prev": 1,
            "next": 2,
            "hasNext": true,
            "hasPrev": false
          }
        }
      }
      order.items.unshift(this.data.carts)
      const params = order.params
      console.log(order.items.filter(i => i.status == 'submitted'))
      wx.setStorageSync('orders', order)
        App.WxService.redirectTo('/pages/order/list/index')
    },
    clear() {
        App.HttpService.clearCartByUser()
        .then(res => {
            const data = res.data
            console.log(data)
        })
    },
})