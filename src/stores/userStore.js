import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户信息
    userInfo: {
      id: 1,
      username: '游客',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20default%20portrait&image_size=square',
      isLogin: false
    },
    // 我的课程
    myCourses: [
      {
        id: 1,
        title: '剪纸基础入门',
        progress: 30,
        lastChapter: '第2章 基本剪法',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20basic%20course%20cover&image_size=landscape_4_3'
      },
      {
        id: 2,
        title: '传统纹样剪纸',
        progress: 60,
        lastChapter: '第4章 吉祥纹样',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20pattern%20paper%20cutting%20course&image_size=landscape_4_3'
      }
    ],
    // 我的订单
    myOrders: [
      {
        id: 1001,
        status: '已完成',
        totalAmount: 199,
        createTime: '2026-04-01',
        items: [
          { name: '剪纸工具套装', price: 99, quantity: 1 },
          { name: '文创书签', price: 50, quantity: 2 }
        ]
      },
      {
        id: 1002,
        status: '待发货',
        totalAmount: 299,
        createTime: '2026-04-10',
        items: [
          { name: '火山荔枝礼盒', price: 299, quantity: 1 }
        ]
      }
    ],
    // 我的收藏
    myFavorites: {
      courses: [
        {
          id: 3,
          title: '高级剪纸技法',
          price: 299,
          cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=advanced%20paper%20cutting%20techniques%20course&image_size=landscape_4_3'
        }
      ],
      products: [
        {
          id: 2,
          name: 'IP周边抱枕',
          price: 89,
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20paper%20cut%20style%20girl%20with%20red%20dress%20and%20flower%20hair%20accessory%20traditional%20chinese%20style&image_size=landscape_4_3'
        }
      ]
    }
  }),
  actions: {
    // 登录
    login(username, password) {
      this.userInfo = {
        id: 1,
        username: username,
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait%20friendly&image_size=square',
        isLogin: true
      }
    },
    // 登出
    logout() {
      this.userInfo = {
        id: 1,
        username: '游客',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20default%20portrait&image_size=square',
        isLogin: false
      }
    },
    // 添加收藏
    addFavorite(type, item) {
      if (type === 'course') {
        this.myFavorites.courses.push(item)
      } else if (type === 'product') {
        this.myFavorites.products.push(item)
      }
    },
    // 取消收藏
    removeFavorite(type, id) {
      if (type === 'course') {
        this.myFavorites.courses = this.myFavorites.courses.filter(item => item.id !== id)
      } else if (type === 'product') {
        this.myFavorites.products = this.myFavorites.products.filter(item => item.id !== id)
      }
    }
  }
})