<template>
  <div class="recommend-config-modal">
    <el-button
      v-if="props.showButton"
      :loading="company.loading"
      @click="toggleDialogStatus()"
    >
      推荐配置
    </el-button>
    <el-dialog
      class="custom-dialog"
      v-model="dialogShow"
      title="激励配置建议"
      width="1000px"
      destroy-on-close
      top="5vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :before-close="toggleDialogStatus"
    >
      <RecommendCompanyList
        :company-list="company.list"
        @on-change="companyIdChange"
      />
      <div class="desc" style="margin-top: 10px">
        <h3 style="margin: 0">
          根据你的账号权限，系统扫描发现相似物料配件未配置激励，如下物料：
        </h3>
        <p>
          说明：一键配置相同激励操作，将相似物料与已配置激励物料应用相同的激励基础规则
        </p>
      </div>
      <el-table
        :data="tableData.data"
        v-loading="tableData.loading"
        max-height="400"
      >
        <el-table-column label="未配置激励物料" prop="materialName" />
        <el-table-column
          label="系统匹配已配置激励物料"
          prop="similarMaterialName"
        />
        <el-table-column label="已配置物料激励基础规则" prop="ruleDesc" />
        <el-table-column
          label="名称相似度"
          prop="similarScoreStr"
          width="100"
          align="center"
        />
        <el-table-column label="操作" align="center" width="150">
          <template #default="scope">
            <el-button type="text" @click="handlerConfig(scope.row)">
              手动匹配其他物料
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px; padding-left: 10px; font-weight: bold">
        累计 {{ tableData.data.length }} 条数据
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="toggleDialogStatus">忽略关闭</el-button>
          <el-button
            type="primary"
            @click="oneTap"
            :loading="oneTapLoading"
            :disabled="configuredCompanyId.has(currentCompanyId)"
          >
            一键配置相同激励
          </el-button>
        </span>
      </template>
      <RecommendMaterialList
        @is-confirm="shouldRefresh"
        ref="RecommendMaterialListRef"
      />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import RecommendCompanyList from './components/recommend-company-list.vue'
import RecommendMaterialList from './recommend-maerial-list-modal.vue'
import { reactive, ref, onMounted, nextTick, computed } from 'vue'
import {
  ExcitationConfigRecommendCompanyList,
  ExcitationConfigRecommendList,
  OneClickConfigIdenticalExcitation
} from '@/webapi/recommendConfig'
import { ElMessage } from 'element-plus'
import { freshUser } from '@/utils'

interface Company {
  companyId: number
  companyName: number
  companyCode: number
}

const props = withDefaults(
  defineProps<{
    showButton: boolean
  }>(),
  {
    showButton: false
  }
)

const tableData = reactive({
  data: [],
  loading: false
})
const companyIdChange = (companyId: number) => {
  currentCompanyId.value = companyId
  getRecommendList(companyId)
}

const RecommendMaterialListRef =
  ref<InstanceType<typeof RecommendMaterialList>>()
const handlerConfig = (row: any) => {
  RecommendMaterialListRef.value?.toggleDialogStatus(
    row.companyId,
    row.materialId,
    row.materialNo,
    row.companyUnconfigExcitationMaterialItemId
  )
}

const currentCompanyId = ref()
const configuredCompanyId = new Set<number>()
const oneTapLoading = ref(false)
const oneTap = () => {
  const inputs = tableData.data.map(item => {
    return {
      similarMaterialId: item.materialId,
      materialNo: item.materialNo,
      similarComnanyMaterialExcitationRuleId:
        item.similarComnanyMaterialExcitationRuleId,
      companyUnconfigExcitationMaterialItemId:
        item.companyUnconfigExcitationMaterialItemId
    }
  })
  oneTapLoading.value = true
  OneClickConfigIdenticalExcitation(inputs).then(res => {
    oneTapLoading.value = false
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '配置成功'
      })
      configuredCompanyId.add(currentCompanyId.value)
      shouldRefresh(currentCompanyId.value)
    } else {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  })
}

onMounted(() => {
  nextTick(() => {
    if (freshUser()) {
      setTimeout(() => {
        toggleDialogStatus()
      }, 300)
    }
  })
})

const company = reactive<{
  list: Company[]
  loading: boolean
}>({
  list: [],
  loading: false
})

// 获取公司列表
const getRecommendCompanyList = async () => {
  company.loading = true
  const res = await ExcitationConfigRecommendCompanyList()
  company.loading = false
  if (res.code === 200) {
    company.list = res.data
  } else {
    company.list = []
    if (props.showButton) {
      ElMessage({
        type: 'error',
        message: res.message
      })
    }
  }
}

// 获取推荐列表
const getRecommendList = (companyId: number) => {
  tableData.loading = true
  ExcitationConfigRecommendList({ companyId }).then(res => {
    tableData.loading = false
    if (res.code === 200) {
      tableData.data = res.data
      if (tableData.data.length === 0) {
        configuredCompanyId.add(currentCompanyId.value)
      }
    }
  })
}

const shouldRefresh = (companyId?: number) => {
  companyIdChange(currentCompanyId.value)
}

const dialogShow = ref(false)
const toggleDialogStatus = async () => {
  if (!dialogShow.value) {
    await getRecommendCompanyList()
    if (company.list?.length > 0) {
      dialogShow.value = true
    }
  } else {
    dialogShow.value = false
  }
}
defineExpose({
  toggleDialogStatus
})
</script>
<style scoped lang="scss">
.recommend-config-modal {
  display: inline-flex;
  margin-left: 12px;
  :deep(.custom-dialog) {
    .el-dialog__body {
      padding: 0 20px;
    }
  }
}
</style>
