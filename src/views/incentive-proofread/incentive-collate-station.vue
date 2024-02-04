<template>
  <div class="incentive-collate-station">
    <div class="row">
      <el-card shadow="never">
        <div class="company-info">
          <div class="item">公司名称：{{ initData?.companyName ?? '--' }}</div>
          <div class="item">激励类型：{{ initData?.excitationType ?? '--' }}</div>
          <div class="item">账期月份：{{ initData?.statementMonthName ?? '--' }}</div>
        </div>
      </el-card>
    </div>
    <div class="row">
      <el-card shadow="never">
        <div class="station-info">
          <div class="label">服务站：</div>
          <div class="station-list">
            <div class="item"
              :class="[promoterDeptId === item.promoterDeptId ? 'active' : '']"
              v-for="item in initData?.deptList" :key="item.promoterDeptId"
              @click="selectStation(item)"
              >
              <div class="name">{{ item.deptName }}</div>
              <div class="desc">({{ item.deptCheckStatusDesc }})</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="row">
      <el-tabs v-model="checkStatus" type="border-card">
        <el-tab-pane
          v-for="[name, label] in CheckStatusMap.entries()"
          :key="name"
          :label="label"
          :name="name"
        >
          <div v-if="!initData || !promoterDeptId" v-loading style="min-height: 300px;"></div>
          <div v-else>
            <table-form
              :init-data="initData"
              :promoter-dept-id="promoterDeptId"
              :check-status="name"
              :current-active-tab="checkStatus"
              @isReInit="init"
            />
          </div>
        </el-tab-pane>
        
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import {
  LoadPageInitDataStation,
  MainCheckStatus,
  CheckStatusMap
} from '@/webapi/incentive-collate'
import TableForm from './component/incentive-collate-station-table.vue'


const props = defineProps<{
  companyMonthStatementExcitationCheckId: number
}>()

const promoterDeptId = ref<number>()
const checkStatus = ref(MainCheckStatus.SVC_STA_CHECK)
/**
 * @description 选择服务站
 */
const selectStation = (station: InitData['deptList'][0]) => {
  promoterDeptId.value = station.promoterDeptId
}

/**
 * @description 初始化数据
 */
type InitData = API.ReturnFetchDataType<typeof LoadPageInitDataStation>
const initData = ref<InitData>()
const init = () => {
  LoadPageInitDataStation({...props}).then(res => {
    if (res.code === 200) {
      initData.value = res.data
      if (res.data) {
        if (!promoterDeptId.value) {
          promoterDeptId.value = res.data.deptList[0]?.promoterDeptId
        }
      }
    }
  })
}
init()
</script>
<style scoped lang="scss">
.incentive-collate-station {
  .row + .row {
    margin-top: 10px;
  }
  .company-info {
    display: flex;
    .item {
      margin-right: 35px;
    }
  }
  .station-info {
    display: flex;
    align-items: center;
    .station-list {
      display: flex;
      .item{
        padding: 2px 10px;
        color: #409eff;
        background: #ecf5ff;
        border: 1px solid #a0cfff;
        border-radius: 3px;
        font-size: 10px;
        font-weight: 500;
        text-align: center;
        cursor: pointer;
        &:hover {
          color: #fff;
          border-color: #409eff;
          background: #409eff;
        }
        &.active {
          color: #fff;
          border-color: #409eff;
          background: #409eff;
        }
        .name{
          font-size: 14px;
        }
        +&{
          margin-left: 10px;
        }
      }
    }
  }
}
</style>

