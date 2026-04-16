import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    // 购物车商品列表
    items: [
      {
        id: 1,
        name: '剪纸工具套装',
        price: 99,
        quantity: 1,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20tool%20set&image_size=landscape_4_3'
      },
      {
        id: 3,
        name: '文创笔记本',
        price: 45,
        quantity: 2,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=creative%20notebook%20paper%20cutting%20pattern&image_size=landscape_4_3'
      }
    ]
  }),
  getters: {
    // 购物车商品数量
    totalQuantity: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },
    // 购物车总价
    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    }
  },
  actions: {
    // 添加商品到购物车
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          ...product,
          quantity: 1
        })
      }
    },
    // 从购物车移除商品
    removeFromCart(id) {
      this.items = this.items.filter(item => item.id !== id)
    },
    // 更新商品数量
    updateQuantity(id, quantity) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        item.quantity = Math.max(1, quantity)
      }
    },
    // 清空购物车
    clearCart() {
      this.items = []
    }
  }
})