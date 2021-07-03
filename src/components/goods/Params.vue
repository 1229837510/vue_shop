<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card
      ><el-row class="tag_alert">
        <el-col>
          <el-alert
            show-icon
            :closable="false"
            title="注意：只允许为第三级分类设置相关参数"
            type="warning"
          >
          </el-alert>
        </el-col>
      </el-row>
      <!-- 级联选择器区域 -->
      <span>选择商品分类：</span>
      <el-cascader
        v-model="selectKeys"
        :options="cateOptions"
        :props="cateProps"
        @change="handleCateChange"
      ></el-cascader>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isBtnsdisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            \<el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showeditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isBtnsdisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            \<el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showeditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
      </el-tabs>
    </el-card>
    <!-- 添加对话款 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogVisibleClose"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话款 -->
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogVisibleClose"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //级联选择框的选择
      selectKeys: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //商品分类列表数组
      cateOptions: [],
      //tab 的激活名字
      activeName: 'many',
      //动态参数数据
      manyTableData: [],
      //静态属性数据
      onlyTableData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: '',
      },

      //添加表单的验证规则
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
      },
      //控制编辑对话框的显示
      editDialogVisible: false,
      //修改表单的验证规则
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur',
          },
        ],
      },
      editForm: {},
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      this.cateOptions = res.data
    },
    //级联选择框的变化
    handleCateChange() {
      this.getParamList()
    },
    //Tab 页签的点击事件处理
    handleClick() {
      this.getParamList()
    },
    //获取商品参数分类列表
    async getParamList() {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { attr_sel: this.activeName },
      })
      console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品参数分类失败！')
      }
      if (this.activeName === 'many') {
        return (this.manyTableData = res.data)
      }
      this.onlyTableData = res.data
    },
    //添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          params: {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          },
        })
        if (res.meta.status !== 201) {
          this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.getParamList()
        this.addDialogVisible = false
      })
    },
    //监听对话框的关闭，重置对话框
    addDialogVisibleClose() {
      this.$refs.addFormRef.resetFields()
    },
    //重置修改的表单
    editDialogVisibleClose() {
      this.$refs.editFormRef.resetFields()
    },
    async showeditDialog(id) {
      //查询当前参数的信息
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: {
          attr_sel: this.activeName,
        },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            params: {
              attr_name: this.editForm.attr_name,
              attr_id: this.editForm.attr_id,
              attr_sel: this.activeName,
            },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
        this.getParamList()
        this.editDialogVisible = false
      })
    },
  },
  computed: {
    //控制按钮的禁用
    isBtnsdisabled() {
      if (this.selectKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
}
</script>
<style lang="less" scoped>
.tag_alert {
  margin: 15px 0;
}
</style>