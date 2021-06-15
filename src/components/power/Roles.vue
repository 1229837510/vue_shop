<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoledialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 渲染一级权限 -->
            <el-row
              :class="['btnbottom', i1 === 0 ? 'btntop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5"
                ><el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 通过for循环 渲染二级权限-->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'btntop', 'vcenter']"
                  type="success"
                >
                  <el-col :span="6">
                    <el-tag> {{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeTag(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showRoleById(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="showAuthorDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setAuthorityDialog"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightList"
        show-checkbox
        default-expand-all
        :default-checked-keys="treeKeys"
        node-key="id"
        ref="treeRef"
        :props="rightProps"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setAuthorityDialog = false">取 消</el-button>
        <el-button type="primary" @click="selectRights()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editdialogVisible" width="50%">
      <el-form :model="showRoleForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="showRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="showRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoledialogVisible"
      width="50%"
      @close="addRoleDialog"
    >
      <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      rightList: [],
      //控制分配权限对话框的显示与隐藏
      setAuthorityDialog: false,
      //树形控件的属性绑定对象
      rightProps: {
        children: 'children',
        label: 'authName',
      },
      treeKeys: [],
      //当前分配角色权限的id
      roleid: '',
      //控制编辑角色对话框的显示与隐藏
      editdialogVisible: false,
      //控制添加角色对话框的显示与隐藏
      addRoledialogVisible: false,
      //角色列表表单
      showRoleForm: {},
      //添加角色列表表单
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      editRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
        ],
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
    },

    async removeTag(roles, rightid) {
      const result = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)

      if (result !== 'confirm') return this.$message.info('取消了删除权限！')

      const { data: res } = await this.$http.delete(`/roles/${roles.id}/rights/${rightid}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败！')

      this.$message.success('删除权限成功！')
      /* this.getRolesList() */
      roles.children = res.data
    },
    async showAuthorDialog(role) {
      this.roleid = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败！')
      this.rightList = res.data
      //递归获取三级节点的id
      this.getTreekeyList(role, this.treeKeys)
      this.setAuthorityDialog = true
    },
    /*通过递归的方式，获取角色下面的所有
    三级权限的id,并保存到treeKeys数组中*/
    getTreekeyList(node, arr) {
      //如果当前node节点不包括children属性，则不是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(element => this.getTreekeyList(element, arr))
    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.treeKeys = []
    },
    //点击为角色选择权限分配
    async selectRights() {
      this.setAuthorityDialog = true
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idstr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleid}/rights`, { rids: idstr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setAuthorityDialog = false
    },
    async removeRoleById(removeById) {
      const { data: res } = await this.$http.delete(`roles/` + removeById)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败！')
      }
      this.$message.success('删除角色成功！')
      this.getRolesList()
    },
    async showRoleById(editByid) {
      const { data: res } = await this.$http.get(`roles/` + editByid)
      this.showRoleForm = res.data
      console.log(this.showRoleForm)
      this.editdialogVisible = true
    },
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`roles/` + this.showRoleForm.roleId, {
          roleName: this.showRoleForm.roleName,
          roleDesc: this.showRoleForm.roleDesc,
        })
        if (res.meta.status != 200) {
          return this.$message.error('更新角色信息失败')
        }
        //关闭对话框
        this.editdialogVisible = false
        //刷新数据列表
        this.getRolesList()
        //提示修改成功
        this.$message.success('更新角色信息成功')
      })
    },
    addRole() {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) return this.$message.error('创建角色失败！')
        //提示添加角色成功
        this.$message.success('添加角色成功！')
        //刷新页面获取角色列表
        this.getRolesList()
        //关闭对话框
        this.addRoledialogVisible = false
      })
    },
    addRoleDialog() {
      this.$refs.addRoleFormRef.resetFields()
    },
  },
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
.btntop {
  border-top: 1px solid #eee;
}
.btnbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>