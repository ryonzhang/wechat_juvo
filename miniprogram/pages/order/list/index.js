const App = getApp()

Page({
    data: {
        activeIndex: 0,
        navList: [],
        order: {},
        prompt: {
            hidden: !0,
            icon: '../../../assets/images/iconfont-order-default.png',
            title: 'You have no orders yet',
            text: 'Browse what you would like to order',
        },
    },
    onLoad() {
        this.order = App.HttpResource('/order/:id', {id: '@id'})
        this.setData({
            navList: [
                {
                    name: 'All',
                    _id: 'all',
                },
                {
                    name: 'Submitted',
                    _id: 'submitted',
                },
                {
                    name: 'Confirmed',
                    _id: 'confirmed',
                },
                {
                    name: 'Finished',
                    _id: 'finished',
                },
                {
                    name: 'Canceled',
                    _id: 'canceled',
                },
            ]
        })
        this.onPullDownRefresh()
    },
    initData() {
        const order = this.data.order
        const params = order && order.params
        const type = params && params.type || 'all'

        this.setData({
            order: {
                items: [],
                params: {
                    page : 1,
                    limit: 10,
                    type : type,
                },
                paginate: {}
            }
        })
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/order/detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    getList() {
        //const order = this.data.order
        // const params = order.params

        // // App.HttpService.getOrderList(params)
        // this.order.queryAsync(params)
        // .then(res => {
        //     const data = res.data
        //     console.log(data)
        //     if (data.meta.code == 0) {
        //         order.items = [...order.items, ...data.data.items]
        //         order.paginate = data.data.paginate
        //         order.params.page = data.data.paginate.next
        //         order.params.limit = data.data.paginate.perPage
        //       console.log(order);
        //         this.setData({
        //             order: order,
        //             'prompt.hidden': order.items.length,
        //         })
        //     }
        // })

       var order = wx.getStorageSync('orders')
       if(!order){
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
      
      // console.log(wx.getStorageSync('order').items)
      // console.log(order.items)
      // order.items.items = [...wx.getStorageSync('order').items, ...order.items]
      // order.items.totalAmount += wx.getStorageSync('order').totalAmount
      const params = order.params
      console.log(order.items.filter(i=>i.status=='submitted'))
        this.setData({
          order: {
            items: this.data.order.params.type=='all'?order.items:order.items.filter(i => i.status == this.data.order.params.type), "params": {
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
            } },
                    'prompt.hidden': order.items.length,
                })
    },
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        this.initData()
        this.getList()
    },
    onReachBottom() {
        console.info('onReachBottom')
        if (!this.data.order.paginate.hasNext) return
        this.getList()
    },
    onTapTag(e) {
        const type = e.currentTarget.dataset.type
        console.log(type)
        const index = e.currentTarget.dataset.index
        this.initData()
        this.setData({
            activeIndex: index,
            'order.params.type': type,
        })
        this.getList()
    },
})