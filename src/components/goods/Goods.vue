<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="goodsInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品搜索区域 -->

      <!-- 商品列表表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column calss="table_column" prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_number" label="商品数量"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品权重"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品权重"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsInfo: {
        //查询
        query: '',
        //当前的页数
        pagenum: 1,
        //当前页展示多少条数据
        pagesize: 20,
      },
      total: 0,
      goodsList: [],
    }
  },
  created() {
    this.getGoodsList()
  },

  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.goodsInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      console.log(res)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
  },
}
</script>
<style lang="less" scoped>
.table_column {
  height: 200px;
  background: red;
}
</style>