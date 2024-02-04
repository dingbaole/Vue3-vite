<template>
  <div class="compute-panel">
    <el-steps :active="active" align-center>
      <el-step title="选择激励重跑公司" />
      <el-step title="确认重跑规则及数据范围" />
      <el-step title="人工核对并确认计算结果" />
      <!-- <el-step title="Step 4" description="Some description" /> -->
    </el-steps>
    <div class="content">
      <Init :status="status" v-if="active === 1" ref="InitRef" />
      <Config :status="status" v-if="active === 2" ref="ConfigRef" />
      <Result :status="status" v-if="active === 3" />
    </div>
    <div class="button-group">
      <el-button @click="close">
        {{ active === 3 ? '关闭' : '取消' }}
      </el-button>
      <el-button
        v-if="
          active === 3 &&
          (status.workStatus === RerunStatus.CALCULAING ||
            status.workStatus === RerunStatus.CONFIRM)
        "
        type="primary"
        :loading="getStatusLoading"
        @click="getStatus"
      >
        刷新
      </el-button>
      <el-button
        v-show="active === 1"
        v-permission="'excitation:rerun-company-goods-rule:get-rerun-status'"
        type="primary"
        :loading="nextLoading"
        @click="next"
      >
        下一步
      </el-button>
      <el-button
        v-show="
          active !== 1 &&
          status.workStatus !== RerunStatus.CALCULAING &&
          status.workStatus !== RerunStatus.CONFIRM
        "
        v-permission="
          'excitation:rerun-company-goods-rule:return-previous-step'
        "
        type="warning"
        :disabled="resetLoading"
        :loading="prevLoading"
        @click="prev"
      >
        上一步
      </el-button>
      <el-button
        v-show="active === 3 && status.workStatus === RerunStatus.SUCCESS"
        v-permission="
          'excitation:rerun-company-goods-rule:rerun-calc-difference-as'
        "
        type="success"
        plain
        :loading="exportLoading"
        @click="exportList"
      >
        导出全部计算结果
      </el-button>
      <el-button
        v-show="active === 2"
        v-permission="'excitation:rerun-company-goods-rule:rstart-rerun-calc'"
        type="success"
        :disabled="resetLoading"
        :loading="startLoading"
        @click="start"
      >
        开始重跑计算
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import Init from './components/compute-init.vue'
import Config from './components/compute-config.vue'
import Result from './components/compute-result.vue'
import { ref, provide } from 'vue'
import { ElMessage } from 'element-plus'
import { RerunStatus } from '@/types'
import {
  ReturnPrevStep,
  GetRerunStatus,
  GetRerunCalcResultExport
} from './components/api'

type Status = API.UnPromisify<ReturnType<typeof InitRef.value.getStatus>>
const active = ref<1 | 2 | 3>(1)
const InitRef = ref<InstanceType<typeof Init>>()
const ConfigRef = ref<InstanceType<typeof Config>>()
const status = ref<Status>()

const resetLoading = ref(false)
provide('resetLoading', resetLoading)
const nextLoading = ref(false)
const next = async () => {
  nextLoading.value = true
  const res = await InitRef?.value.getStatus().catch(err => {
    if (typeof err === 'string') {
      ElMessage({
        type: 'error',
        message: err
      })
    }
  })
  nextLoading.value = false
  if (!res) return
  processHandler(res)
}

const processHandler = (_status: Status) => {
  status.value = _status
  if (_status?.workStatus === RerunStatus.CREATE) {
    active.value = 2
  } else if (
    [
      RerunStatus.CONFIRM,
      RerunStatus.CALCULAING,
      RerunStatus.FAIL,
      RerunStatus.SUCCESS
    ].includes(_status?.workStatus)
  ) {
    active.value = 3
  }
}

const prevLoading = ref(false)
const prev = async () => {
  if (active.value === 3) {
    prevLoading.value = true
    const res = await ReturnPrevStep({
      orderExcitationCalculateWorkId:
        status.value.orderExcitationCalculateWorkId
    })
    prevLoading.value = false
    if (res.code !== 200) {
      return
    }
  }
  active.value--
}

const startLoading = ref(false)
const start = () => {
  startLoading.value = true
  ConfigRef?.value
    .start()
    .then(res => {
      startLoading.value = false
      if (res.code === 200) {
        getStatus()
      } else {
        ElMessage({
          type: 'error',
          message: res.message
        })
      }
    })
    .catch(err => {
      startLoading.value = false
      ElMessage({
        type: 'error',
        message: err
      })
    })
}

const exportLoading = ref(false)
const exportList = () => {
  exportLoading.value = true
  GetRerunCalcResultExport({
    orderExcitationCalculateWorkId: status.value.orderExcitationCalculateWorkId
  }).then(res => {
    exportLoading.value = false
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '导出成功'
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

const getStatusLoading = ref(false)
// 获取状态
const getStatus = () => {
  getStatusLoading.value = true
  const { cityId, companyId, marketShopId } = status.value
  GetRerunStatus({
    cityId,
    companyId,
    marketShopId
  }).then(res => {
    getStatusLoading.value = false
    if (res.code === 200) {
      processHandler({
        ...res.data,
        cityId,
        companyId,
        marketShopId
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

const close = () => {
  emit('close')
}
const emit = defineEmits(['close'])
provide('GetStatus', {
  getStatusLoading,
  getStatus
})
</script>
<style scoped lang="scss">
.compute-panel {
  .content {
    min-height: 300px;
    padding: 30px 0;
  }
  .button-group {
    display: flex;
    justify-content: center;
  }
}
</style>
