const App = getApp()

Page({
    data: {
        helps: {items:[
          {_id:0,
            title: 'What is a FAQ page?',
            content:'In contrast to a landing page, where the goal is to convert buyers, the Frequently Asked Questions (FAQ) section is a part of your website where you address common concerns, questions, and objections that customers have.',
            },
          {
            _id: 1,
            title: 'When is a FAQ page appropriate?',
            content: 'Customers email you with the same questions on an ongoing basis, so it’s better to address them publicly and prominently.You have or plan to create content/landing pages that you can link to and continue the journey from question to conversion.',
          },
          {
            _id: 2,
            title: 'Where do I look for “Frequently Asked” Questions?',
            content: 'Your inbox and customer support tickets will likely be the first places to look. But you should also anticipate objections that you can turn into questions, especially if the answer will put your customer’s mind at ease.',
          }
        ],
        paginate:{
          total:3
        }},
        prompt: {
            hidden: !0,
            icon: '../../../assets/images/iconfont-empty.png',
        },
    },
    onLoad() {
       // this.helps = App.HttpResource('/help/:id', {id: '@id'})
        this.onPullDownRefresh()
      
    },
    initData() {
      wx.setStorageSync('help', this.data.helps.items)
        // this.setData({
        //     helps: {
        //         items: [],
        //         params: {
        //             page : 1,
        //             limit: 10,
        //         },
        //         paginate: {}
        //     }
        // })
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/help/detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    getList() {
        const helps = this.data.helps
        wx.setStorageSync('help', this.data.helps)
        const params = helps.params
      console.log(helps)
        this.setData({
                    helps: helps,
                    'prompt.hidden': helps.items.length,
                })
      // console.log(helps)
      //   this.helps.queryAsync(params)
      //   .then(res => {
      //       const data = res.data
      //       console.log(data)
      //       if (data.meta.code == 0) {
      //           helps.items = [...helps.items, ...data.data.items]
      //           helps.paginate = data.data.paginate
      //           helps.params.page = data.data.paginate.next
      //           helps.params.limit = data.data.paginate.perPage
      //           this.setData({
      //               helps: helps,
      //               'prompt.hidden': helps.items.length,
      //           })
      //       }
      //   })
    },
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        this.initData()
        this.getList()
    },
    onReachBottom() {
        console.info('onReachBottom')
        if (!this.data.helps.paginate.hasNext) return
        this.getList()
    },
})