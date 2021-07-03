<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCatdialogVisible">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        class="treetable"
        :data="CateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="danger" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatdialogVisible"
      width="50%"
      @close="closeaddCateDialog()"
    >
      <el-form :model="catRuleForm" :rules="catRules" ref="catFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="catRuleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options指定数据源 -->
          <el-cascader
            v-model="selectedKeys"
            :options="ParentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            change-on-select
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/* import * as echarts from 'echarts' */
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        //当前页面展示多少条数据
        pagesize: 5,
        //当前的页码
        pagenum: 1,
      },
      total: 0,
      CateList: [],
      columns: [
        { label: '产品分类名称', prop: 'cat_name' },
        { label: '是否有效', prop: 'cat_deleted', type: 'template', template: 'isok' },
        { label: '排序', prop: 'cat_level', type: 'template', template: 'sort' },
        { label: '操作', prop: 'cat_id', type: 'template', template: 'opt' },
      ],
      addCatdialogVisible: false,
      //父级分类列表
      ParentCateList: [],

      //指定级联选择器的配置对象
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      //选择的父级id数组
      selectedKeys: [],
      catRuleForm: {
        //将要添加的分类名称
        cat_name: '',
        //父级分类的id
        cat_pid: 0,
        //分类的等级
        cat_level: 0,
      },
      //添加分类的表单验证规则
      catRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {
    this.getCateList()
    this.addCate()
    this.showCatdialogVisible()
    this.getParentCateList()
  },
  methods: {
    //获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      console.log(res.data)
      this.CateList = res.data.result
      this.total = res.data.total
    },
    //监听pagesize的改变
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    //监听pagenum的改变
    handleCurrentChange(newpage) {
      console.log(newpage)
      this.queryInfo.pagenum = newpage
      this.getCateList()
    },
    //添加商品分类
    addCate() {
      this.$refs.catFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.catRuleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品分类失败！')
        }
        this.$message.success('添加商品分类成功！')
        this.addCatdialogVisible = false
        this.getCateList()
      })
    },
    showCatdialogVisible() {
      //获取父级分类的数据列表
      this.getParentCateList()
      this.addCatdialogVisible = true
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('获取父级分类列表失败！')
      this.ParentCateList = res.data
    },
    parentCateChange() {
      console.log(this.selectedKeys)
      //如果selectedKeys数组中的length大于0，证明选中的父级分类
      //反之，就说明没有选择任何父级分类
      if (this.selectedKeys.length >= 0) {
        //父级 的id
        this.catRuleForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        //为当前的等级复制
        this.catRuleForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.catRuleForm.cat_pid = 0
        this.catRuleForm.cat_level = 0
      }
    },
    closeaddCateDialog() {
      this.$refs.catFormRef.resetFields()
      this.selectedKeys = []
      this.catRuleForm.cat_pid = 0
      this.catRuleForm.cat_level = 0
    },
  },
}
</script>
<style lang="less" scoped>
.treetable {
  margin-top: 15px;
}
.el-pagination {
  display: flex;
  justify-content: flex-end;
}
.el-cascader {
  width: 100%;
}
</style>