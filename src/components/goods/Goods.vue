<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card> </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods')
      console.log(res)
    },
  },
}
</script>
<style lang="less" scoped>
</style>