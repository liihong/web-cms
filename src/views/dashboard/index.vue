<template>
  <div class="dashboard-editor-container">

    <panel-group :basicInfo="basicInfo" />
    <el-dialog width="55%"
               size="small"
               :title="$t('main.myPower')"
               :visible.sync="resourceShow"
               :close-on-click-modal="false">
      <resource-view :resource="newSourceData" />
    </el-dialog>
    <el-row :gutter="8">
      <el-col :xs="{span: 24}"
              :sm="{span: 24}"
              :md="{span: 24}"
              :lg="{span: 11}"
              :xl="{span: 12}"
              style="padding-right:8px;margin-bottom:30px;">
        <!-- <transaction-table :messages="basicInfo.messages" /> -->
        <bar-chart />
      </el-col>
      <el-col :xs="{span: 24}"
              :sm="{span: 12}"
              :md="{span: 12}"
              :lg="{span: 6}"
              :xl="{span: 6}"
              style="margin-bottom:30px;">
        <user-list :regUsers="basicInfo.regUsers" />
      </el-col>
      <el-col :xs="{span: 24}"
              :sm="{span: 12}"
              :md="{span: 12}"
              :lg="{span: 7}"
              :xl="{span: 6}"
              style="margin-bottom:30px;">
        <box-card :basicInfo="basicInfo"
                  @showMyResourceBox="showMyResource" />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import ResourceView from './components/ResourceView.vue'
import TransactionTable from './components/TransactionTable'
import UserList from './components/UserList'
import BoxCard from './components/BoxCard'
import BarChart from './components/BarChart'
import { renderTreeData } from '@/utils/format'
import statService from '@/api/util'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    ResourceView,
    TransactionTable,
    UserList,
    BoxCard,
    BarChart
  },
  data () {
    return {
      resourceShow: false,
      basicInfo: {
        userCount: 3,
        newUserCount: 0,
        orgCount: 18,
        shopCount: 3,
        order: {
          orderCount: 18,
          orderTodayCount: 0,
          orderTotalMoney: 0.05,
          orderTodayMoney: 0,
        },
        loginLogs: [],
        messages: [],
        regUsers: [],
        resources: [
        ]
      }
    }
  },
  methods: {
    showMyResource () {
      this.resourceShow = true
    },
    initData () {
      statService.getStatData().then(res => {
        if (res.status === 0) {
          this.basicInfo = res.data
        }
      })
    }
  },
  computed: {
    newSourceData () {
      return renderTreeData({ docs: this.basicInfo.resources })
    }
  },
  mounted () {
    // this.$store.dispatch("getSiteBasicInfo");
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
