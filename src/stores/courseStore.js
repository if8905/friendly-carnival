import { defineStore } from 'pinia'

export const useCourseStore = defineStore('course', {
  state: () => ({
    // 课程列表
    courses: [
      {
        id: 1,
        title: '剪纸基础入门',
        description: '适合初学者的剪纸基础课程，从工具使用到基本剪法',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paper%20cutting%20basic%20course%20cover&image_size=landscape_4_3',
        lessons: 10,
        level: '入门',
        price: 99,
        rating: 4.8,
        category: '入门基础'
      },
      {
        id: 2,
        title: '传统纹样剪纸',
        description: '学习中国传统纹样的剪纸技法，包括吉祥图案、花鸟虫鱼等',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20pattern%20paper%20cutting%20course&image_size=landscape_4_3',
        lessons: 12,
        level: '进阶',
        price: 199,
        rating: 4.9,
        category: '进阶技法'
      },
      {
        id: 3,
        title: '高级剪纸技法',
        description: '掌握复杂剪纸作品的创作技巧，包括多层叠加、立体剪纸等',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=advanced%20paper%20cutting%20techniques%20course&image_size=landscape_4_3',
        lessons: 15,
        level: '高级',
        price: 299,
        rating: 4.7,
        category: '进阶技法'
      },
      {
        id: 4,
        title: '海口秀英剪纸研学',
        description: '实地体验海口秀英剪纸的历史文化，跟随非遗传承人学习',
        cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=haikou%20xiuying%20paper%20cutting%20study%20tour&image_size=landscape_4_3',
        lessons: 5,
        level: '中级',
        price: 399,
        rating: 5.0,
        category: '研学课程'
      }
    ],
    // 课程分类
    categories: [
      { label: '入门基础', value: '入门基础' },
      { label: '进阶技法', value: '进阶技法' },
      { label: '研学课程', value: '研学课程' }
    ]
  }),
  getters: {
    // 根据分类获取课程
    getCoursesByCategory: (state) => (category) => {
      if (!category || category === '全部') {
        return state.courses
      }
      return state.courses.filter(course => course.category === category)
    }
  },
  actions: {
    // 获取课程详情
    getCourseById(id) {
      return this.courses.find(course => course.id === id)
    }
  }
})