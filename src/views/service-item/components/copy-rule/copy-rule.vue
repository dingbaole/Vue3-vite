<template>
  <el-dialog
    v-model="dialogShow"
    title="复制规则发布到其他公司"
    width="80%"
    :show-close="false"
    :close-on-click-modal="false"
    :before-close="toggleDialogStatus"
  >
    <Steps :current="current" progress-dot>
      <Step v-for="item in steps" :key="item.title" :title="item.title" />
    </Steps>
    <div
      class="content"
      v-show="current === 0"
      style="height: 400px; overflow: auto; padding: 0 30px"
    >
      <div style="max-width: 450px; margin: 15px 0">
        <!-- <h3>选择公司</h3> -->
        <!-- <p>根据您个人账号拥有的公司权限，可对以下这些公司做配置。</p> -->
        <el-alert
          title="根据您个人账号拥有的公司权限，可对以下这些公司做配置。"
          type="warning"
          :closable="false"
        />
      </div>
      <div>
        <el-tree
          ref="treeRef"
          :data="treeData"
          show-checkbox
          :default-expanded-keys="defaultCheckedKeys"
          node-key="id"
          highlight-current
          :props="defaultProps"
          @check="change"
        />
      </div>
    </div>
    <div class="content" v-if="current === 1">
      <div class="content-button" v-if="!isStartCopy">
        <el-button size="large" type="primary" @click="startCopy"
          >开始复制</el-button
        >
      </div>
      <div class="content-wrapper" v-if="isStartCopy">
        <el-progress
          :percentage="progress"
          :stroke-width="15"
          :text-inside="true"
          :status="progress === 100 ? 'success' : ''"
          striped
          striped-flow
          :duration="10"
          style="margin: 30px 0 45px"
        />
        <el-collapse>
          <el-collapse-item
            v-for="item in fetchElement"
            :key="item.key"
            :name="item.key"
          >
            <template #title>
              <span
                v-if="item.status !== Status.loading"
                style="
                  display: inline-flex;
                  align-items: center;
                  margin-right: 10px;
                "
              >
                <el-icon
                  v-if="item.status === Status.success"
                  :size="22"
                  color="#67C23A"
                  ><SuccessFilled
                /></el-icon>
                <el-icon
                  v-if="item.status === Status.fail"
                  :size="22"
                  color="#F56C6C"
                  ><CircleCloseFilled
                /></el-icon>
              </span>
              {{ item.fetchContent.companyName }}
              <span v-if="item.successResult"
                >配置成功{{
                  item.successResult.successNumber
                }}条数据，配置失败{{
                  item.successResult.failNumber
                }}条数据！</span
              >
            </template>
            <div v-if="item.status === Status.success">
              <el-table
                :data="item.successResult.copyBaseRuleItemOutputs"
                border
                style="width: 100%; margin-top: 15px"
              >
                <el-table-column label="配置结果" width="180">
                  <template #default="scope: { row: CopyBaseRuleItemOutputs }">
                    <div
                      class="result"
                      v-if="scope.row.configResultCode === 200"
                    >
                      <el-icon :size="22" color="#67C23A"
                        ><SuccessFilled
                      /></el-icon>
                      <div class="text">配置成功</div>
                    </div>
                    <div
                      class="result"
                      v-if="scope.row.configResultCode === 500"
                    >
                      <el-icon :size="22" color="#F56C6C"
                        ><CircleCloseFilled
                      /></el-icon>
                      <div class="text">
                        <p>配置失败</p>
                        <p class="desc">{{ scope.row.failReason }}</p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column property="bigClassName" label="服务大类" />
                <el-table-column property="deviceName" label="设备" />
                <el-table-column property="serviceClassName" label="服务品类" />
                <el-table-column property="serviceItemName" label="服务项目" />
                <el-table-column
                  property="serviceFee"
                  label="项目单价(元)"
                  align="center"
                />
                <el-table-column
                  property="updateBeforeRule"
                  label="更新前激励基础规则"
                >
                  <template #default="scope">
                    {{
                      scope.row.updateBeforeRule
                        ? scope.row.updateBeforeRule
                        : '--'
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  property="copyAfterRule"
                  label="复制发布后基础规则"
                >
                  <template #default="scope">
                    <div v-if="scope.row.copyAfterRule">
                      <div>{{ scope.row.copyAfterRule }}</div>
                      <div
                        v-if="scope.row.calcGroupId === 11"
                        style="font-size: 12px; color: #666"
                      >
                        (多项目最高值激励)
                      </div>
                    </div>
                    <div v-else>--</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else>失败原因: {{ item.failResult }}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="toggleDialogStatus"
          v-if="current === 0 || progress === 100"
          >{{ progress === 100 ? '关闭' : '取消' }}</el-button
        >
        <el-button @click="prev" v-if="current !== 0 && isStartCopy === false"
          >上一步</el-button
        >
        <el-button
          type="primary"
          v-if="current === 0"
          :disabled="!isAbledNext"
          @click="next"
          >下一步</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElTree } from 'element-plus'
import { Steps, Step } from 'ant-design-vue'
import 'ant-design-vue/es/steps/style/css'
import { useCityWithCompany } from './useCityWithCompany'
import { useCopyCompany } from './useCopyCompany'
import { Status } from './types'
import type { CopyBaseRuleItemOutputs } from './types'
import { SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'

const current = ref<number>(0)
const steps = [
  {
    title: '选择公司'
  },
  {
    title: '开始复制'
  }
]
const defaultProps = {
  children: 'children',
  label: 'label'
}
const treeRef = ref<InstanceType<typeof ElTree>>()

const props = defineProps<{
  cityId: number | undefined
  companyId: number | undefined
  comnanyItemExcitationRuleId: number
}>()

const treeData = ref([])
const defaultCheckedKeys = ref()
const disabledNode = ref()
const abledNode = ref()
const isAbledNext = ref(false)
const isStartCopy = ref(false)
const init = () => {
  const {
    cityWithCompanyTree,
    defaultCheckedKeys: keys,
    disabledNode: disabledNodeFn,
    abledNode: abledNodeFn
  } = useCityWithCompany(props.cityId, props.companyId)
  disabledNode.value = disabledNodeFn
  abledNode.value = abledNodeFn
  defaultCheckedKeys.value = [keys]
  treeData.value = cityWithCompanyTree.value
  current.value = 0
  isAbledNext.value = false
  isStartCopy.value = false
}
watch(props, () => {
  init()
})

const change = () => {
  const res = treeRef.value
    ?.getCheckedNodes(false, false)
    ?.filter(item => item.isLeaf)
  const cityId = res?.length > 0 ? res[0]['parentId'] : undefined
  if (cityId) {
    disabledNode.value(cityId)
    isAbledNext.value = true
  } else {
    abledNode.value()
    isAbledNext.value = false
  }
}

const prev = () => current.value--

const next = () => current.value++

const { init: initCopyCompany, fetchElement, progress } = useCopyCompany()
const startCopy = () => {
  const res: any = treeRef.value
    ?.getCheckedNodes(false, false)
    ?.filter(item => item.isLeaf)
  isStartCopy.value = true
  initCopyCompany(res, props.comnanyItemExcitationRuleId)
}

const dialogShow = ref(false)
const toggleDialogStatus = () => {
  if (!dialogShow.value) {
    init()
  }
  dialogShow.value = !dialogShow.value
}
defineExpose({
  toggleDialogStatus
})
</script>

<style scoped lang="scss">
.content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  &-button {
    min-height: 200px;
    text-align: center;
    padding-top: 80px;
  }
  &-wrapper {
    padding: 10px 15px;
    .result {
      display: flex;
      align-items: center;
      .text {
        padding-left: 6px;
        font-size: 12px;
        color: #333;
      }
      .desc {
        color: #666;
        margin-top: 5px;
      }
      p {
        margin: 0;
        line-height: 1;
      }
    }
  }
}
.module-box {
  margin-bottom: 10px;
  &-desc {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    &__input {
      width: 360px;
      margin-left: 10px;
    }
    &__button {
      margin-left: 10px;
    }
  }
}
</style>
