<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-table border stripe :data="authorList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"> </el-table-column>
        <el-table-column label="路径" prop="path"> </el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">权限1</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">权限2</el-tag>
            <el-tag type="warning" v-else>权限3</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!--      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryAuthor.pagenum"
        :page-sizes="[20, 25, 30, 35]"
        :page-size="queryAuthor.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination> -->
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //权限列表
      authorList: [],
      //查询权限列表的条件
      queryAuthor: {
        query: '',
        //当前的页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 5,
      },

      total: 0,
    }
  },
  created() {
    this.getAuthorList()
  },
  methods: {
    async getAuthorList() {
      //获取权限列表接口
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status != 200) return this.$message.error('获取权限列表失败')
      this.authorList = res.data
      this.total = res.data.length
    },
    /*  handleSizeChange(newSize) {
      this.queryAuthor.pagesize = newSize
      this.getAuthorList()
    },
    handleCurrentChange(newPage) {
      this.queryAuthor.pagenum = newPage
      this.getAuthorList()
    }, */
  },
}
</script>
<style lang="less" scoped>
</style>