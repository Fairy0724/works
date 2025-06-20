window.mixin = {
  data() {
    return {
      mixinData: '这是一个mixin数据！'
    }
  },
  mounted() {
    console.log('mixin的mounted钩子被调用了！')
  },
  methods: {
    mixinMethod() {
      console.log('这是一个mixin方法！')
    }
  }
}