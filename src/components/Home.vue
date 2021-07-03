<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/imgs/img.jpg" style="width: 50px; height: 40px" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="tog-button" @click="toggleCollapse">
          <i :class="isCollapse ? 'el-icon-s-fold' : 'el-icon-s-fold'"></i>
        </div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#185168"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单模板区 -->
          <el-submenu :index="menu.id + ''" v-for="menu in menuList" :key="menu.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="icon[menu.id]"></i>
              <!-- 文本 -->
              <span>{{ menu.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + submenu.path"
              v-for="submenu in menu.children"
              :key="submenu.id"
              @click="saveNavState('/' + submenu.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ submenu.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      icon: {
        125: 'iconfont icon-yonghuguanli',
        103: 'iconfont icon-quanxianguanli',
        101: 'iconfont icon-shangpinguanli',
        102: 'iconfont icon-dingdanguanli',
        145: 'iconfont icon-shujutongji',
      },
      isCollapse: false,
      activePath: '',
    }
  },
  created() {
    this.getMenuList()
    this.active = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status != 200) return this.$message.msg()
      this.menuList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: rgb(70, 164, 187);
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      border-radius: 50%;
    }
    span {
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: rgb(24, 81, 104);
  .el-menu {
    border-right: none;
  }
}
.iconfont {
  margin-right: 10px;
}
.tog-button {
  background-color: rgb(24, 81, 104);
  font-size: 24px;
  text-align: center;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
  color: #fff;
}
</style>