const App = getApp()

Page({
  data: {
    activeIndex: 0,
    navList: [{ name: 'Core', _id: 0 }, { name: 'Airtime', _id: 1 }, { name: 'Data', _id: 2 }, { name: 'SMS', _id: 3 }],
    indicatorDots: !0,
    autoplay: true,
    current: 0,
    interval: 3000,
    duration: 1000,
    circular: !0,
    goods: {},
    prompt: {
      hidden: !0,
    },
    images: [{ path: '/assets/images/juvo1.jpg' }, { path: '/assets/images/juvo2.jpeg' }, { path: '/assets/images/juvo3.jpg' }],

    goodsList: [
      {
        items: [{
          _id: 1,
          images: [{ path: '/assets/images/5.jpeg' }],
          name: 'Top up 5 dollars core balance',
          price: 5,
          remark: 'Top up your account of core balance by 5 dollars',
          thumb_url: '/assets/images/5.jpeg',
        },
        {
          _id: 2,
          images: [{ path: '/assets/images/10.jpg'}],
          name: 'Top up 10 dollars core balance',
          price: 10,
          remark: 'Top up your account of core balance by 10 dollars',
          thumb_url: '/assets/images/10.jpg',
        },
        {
          _id: 3,
          images: [{ path: '/assets/images/20.jpg'}],
          name: 'Top up 20 dollars for core balance',
          price: 20,
          remark: 'Top up your account of core balance by 20 dollars',
          thumb_url: '/assets/images/20.jpg',
        }
          , {
          _id: 4,
            images: [{ path: '/assets/images/50.jpeg'}],
          name: 'Top up 50 dollars for core balance',
          price: 50,
          remark: 'Top up your account of core balance by 50 dollars',
          thumb_url: '/assets/images/50.jpeg',
        }
        ],
        paginate: {
          total: 4,
        }
      },
      {
        items: [{
          _id: 5,
          images: [{ path: '/assets/images/5.jpeg' }],
          name: 'Top up 5 dollars airtime balance',
          price: 5,
          remark: 'Top up your account of airtime balance by 5 dollars',
          thumb_url: '/assets/images/5.jpeg',
        },
        {
          _id: 6,
          images: [{ path: '/assets/images/10.jpg'}],
          name: 'Top up 10 dollars airtime balance',
          price: 10,
          remark: 'Top up your account of airtime balance by 10 dollars',
          thumb_url: '/assets/images/10.jpg',
        },
        {
          _id: 7,
          images: [{ path: '/assets/images/20.jpg'}],
          name: 'Top up 20 dollars for airtime balance',
          price: 20,
          remark: 'Top up your account of airtime balance by 20 dollars',
          thumb_url: '/assets/images/20.jpg',
        }
          , {
          _id: 8,
            images: [{ path: '/assets/images/50.jpeg'}],
          name: 'Top up 50 dollars for airtime balance',
          price: 50,
          remark: 'Top up your account of airtime balance by 50 dollars',
          thumb_url: '/assets/images/50.jpeg',
        }
        ],
        paginate: {
          total: 4,
        }
      },
      {
        items: [{
          _id: 9,
          images: [{ path: '/assets/images/5.jpeg' }],
          name: 'Top up 5 dollars data balance',
          price: 5,
          remark: 'Top up your account of data balance by 5 dollars',
          thumb_url: '/assets/images/5.jpeg',
        },
        {
          _id: 10,
          images: [{ path: '/assets/images/10.jpg'}],
          name: 'Top up 10 dollars data balance',
          price: 10,
          remark: 'Top up your account of data balance by 10 dollars',
          thumb_url: '/assets/images/10.jpg',
        },
        {
          _id: 11,
          images: [{ path: '/assets/images/20.jpg'}],
          name: 'Top up 20 dollars for data balance',
          price: 20,
          remark: 'Top up your account of data balance by 20 dollars',
          thumb_url: '/assets/images/20.jpg',
        }
          , {
          _id: 12,
            images: [{ path: '/assets/images/50.jpeg'}],
          name: 'Top up 50 dollars for data balance',
          price: 50,
          remark: 'Top up your account of data balance by 50 dollars',
          thumb_url: '/assets/images/50.jpeg',
        }
        ],
        paginate: {
          total: 4,
        }
      },
      {
        items: [{
          _id: 13,
          images: [{ path: '/assets/images/5.jpeg' }],
          name: 'Top up 5 dollars SMS balance',
          price: 5,
          remark: 'Top up your account of SMS balance by 5 dollars',
          thumb_url: '/assets/images/5.jpeg',
        },
        {
          _id: 14,
          images: [{ path: '/assets/images/10.jpg'}],
          name: 'Top up 10 dollars SMS balance',
          price: 10,
          remark: 'Top up your account of SMS balance by 10 dollars',
          thumb_url: '/assets/images/10.jpg',
        },
        {
          _id: 15,
          images: [{ path: '/assets/images/20.jpg'}],
          name: 'Top up 20 dollars for SMS balance',
          price: 20,
          remark: 'Top up your account of SMS balance by 20 dollars',
          thumb_url: '/assets/images/20.jpg',
        }
          , {
          _id: 16,
            images: [{ path: '/assets/images/50.jpeg'}],
          name: 'Top up 50 dollars for SMS balance',
          price: 50,
          remark: 'Top up your account of SMS balance by 50 dollars',
          thumb_url: '/assets/images/50.jpeg',
        }
        ],
        paginate: {
          total: 4,
        }
      },
    ]
  },
  swiperchange(e) {
    // console.log(e.detail.current)
  },
  onLoad() {
    this.banner = App.HttpResource('/banner/:id', { id: '@id' })
    this.goods = App.HttpResource('/goods/:id', { id: '@id' })
    this.classify = App.HttpResource('/classify/:id', { id: '@id' })
    wx.setStorageSync('goods', this.data.goodsList)
    this.getBanners()
    this.getClassify()
    
    this.getList(0)

  },
  initData() {
    const goods = this.data.goodsList[0]
    this.setData({
      goods: goods,
      'prompt.hidden': goods.items.length,
    })
    // const type = this.data.goods.params && this.data.goods.params.type || ''
    // const goods = {
    //     items: [],
    //     params: {
    //         page : 1,
    //         limit: 10,
    //         type : type,
    //     },
    //     paginate: {}
    // }

    // this.setData({
    //     goods: goods
    // })
  },
  navigateTo(e) {
    console.log(e)
    App.WxService.navigateTo('/pages/goods/detail/index', {
      id: e.currentTarget.dataset.id
    })
  },
  search() {
    App.WxService.navigateTo('/pages/search/index')
  },
  getBanners() {
    // App.HttpService.getBanners({is_show: !0})
    // this.banner.queryAsync({is_show: !0})
    // .then(res => {
    //     const data = res.data
    // 	console.log(data)
    // 	if (data.meta.code == 0) {
    //         data.data.items.forEach(n => n.path = App.renderImage(n.images[0].path))
    // 		this.setData({
    //             images: data.data.items
    //         })
    // 	}
    // })
  },
  getClassify() {
    // const activeIndex = this.data.activeIndex

    // // App.HttpService.getClassify({
    // //     page: 1, 
    // //     limit: 4, 
    // // })
    // this.classify.queryAsync({
    //     page: 1, 
    //     limit: 4, 
    // })
    // .then(res => {
    //     const data = res.data
    //     console.log(data)
    //     if (data.meta.code == 0) {
    //         this.setData({
    //             navList: data.data.items,
    //             'goods.params.type': data.data.items[activeIndex]._id
    //         })
    //         this.onPullDownRefresh()
    //     }
    // })
  },
  getList(id) {
    // const goods = this.data.goods
    // const params = goods.params

    // // App.HttpService.getGoods(params)
    // this.goods.queryAsync(params)
    // .then(res => {
    //     const data = res.data
    //     console.log(data)
    //     if (data.meta.code == 0) {
    //         data.data.items.forEach(n => n.thumb_url = App.renderImage(n.images[0] && n.images[0].path))
    //         goods.items = [...goods.items, ...data.data.items]
    //         goods.paginate = data.data.paginate
    //         goods.params.page = data.data.paginate.next
    //         goods.params.limit = data.data.paginate.perPage
    //         this.setData({
    //             goods: goods,
    //             'prompt.hidden': goods.items.length,
    //         })
    //     }
    // })
    const goods = this.data.goodsList[id]
    this.setData({
      goods: goods,
      'prompt.hidden': goods.items.length,
    })
  },
  onPullDownRefresh() {
    console.info('onPullDownRefresh')
    this.initData()
    this.getList()
  },
  onReachBottom() {
    console.info('onReachBottom')
    if (!this.data.goods.paginate.hasNext) return
    this.getList()
  },
  onTapTag(e) {
    const type = e.currentTarget.dataset.type
    const index = e.currentTarget.dataset.index
    const goods = {
      items: [],
      params: {
        page: 1,
        limit: 10,
        type: type,
      },
      paginate: {}
    }
    this.setData({
      activeIndex: index,
      goods: goods,
    })
    this.getList(index)
  },
})
