const App = getApp()

Page({
	data: {
		userInfo: {},
		items: [
			{
				icon: '../../assets/images/iconfont-order.png',
				text: 'Orders',
				path: '/pages/order/list/index'
			}, 
			{
				icon: '../../assets/images/iconfont-kefu.png',
				text: 'Contact us',
				path: '98144617',
			}, 
      
			{
				icon: '../../assets/images/iconfont-help.png',
				text: 'FAQ',
				path: '/pages/help/list/index',
			},
		],
		settings: [
			{
				icon: '../../assets/images/iconfont-clear.png',
				text: 'Clear cache',
				path: '0.0KB'
			}, 
			{
				icon: '../../assets/images/iconfont-about.png',
				text: 'About us',
				path: '/pages/about/index'
			}, 
		]
	},
	onLoad() {
		this.getUserInfo()
		this.getStorageInfo()
	},
	navigateTo(e) {
		const index = e.currentTarget.dataset.index
		const path = e.currentTarget.dataset.path

		switch(index) {
      case 1:
				App.WxService.makePhoneCall({
					phoneNumber: path
				})
				break
			default:
				App.WxService.navigateTo(path)
		}
    },
    getUserInfo() {
    	const userInfo = App.globalData.userInfo

		if (userInfo) {
			this.setData({
				userInfo: userInfo
			})
			return
		}

		App.getUserInfo()
		.then(data => {
            console.log(data)
			this.setData({
				userInfo: data
			})
		})
    },
    getStorageInfo() {
    	App.WxService.getStorageInfo()
    	.then(data => {
    		console.log(data)
    		this.setData({
    			'settings[0].path': `${data.currentSize}KB`
    		})
    	})
    },
    bindtap(e) {
    	const index = e.currentTarget.dataset.index
		const path = e.currentTarget.dataset.path

		switch(index) {
			case 0:
				App.WxService.showModal({
		            title: 'Reminder', 
		            content: 'Are you sure to clear the cache?', 
		        })
		        .then(data => data.confirm == 1 && App.WxService.clearStorage())
				break
      
			default:
				App.WxService.navigateTo(path)
		}
    },
    logout() {
    	App.WxService.showModal({
            title: 'Reminder', 
            content: 'Are you sure to log out?', 
        })
        .then(data => data.confirm == 1 && this.signOut())
    },
    signOut() {
    	App.HttpService.signOut()
    	.then(res => {
    		const data = res.data
    		console.log(data)
    		if (data.meta.code == 0) {
    			App.WxService.removeStorageSync('token')
    			App.WxService.redirectTo('/pages/login/index')
    		}
    	})
    },
})