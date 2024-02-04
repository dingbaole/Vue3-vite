<template>
  <el-dialog
    v-model="dialogShow"
    title="新增调整"
    width="50%"
    :before-close="toggleDialogStatus"
  >
    <el-form
      label-position="right"
      label-width="100px"
      style="max-width: 460px"
      :model="formData"
      :rules="rules"
      ref="ruleFormRef"
    >
      <el-form-item label="适用城市" prop="cityId">
        <el-select
          v-model="formData.cityId"
          filterable
          @change="cityIdChange"
          placeholder="城市"
        >
          <el-option
            v-for="item in cityList"
            :label="item.cityName"
            :value="item.cityId"
            :key="item.cityId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="适用公司" prop="companyId">
        <el-select v-model="formData.companyId" filterable placeholder="公司">
          <el-option
            v-for="item in companyList"
            :label="item.companyName"
            :value="item.companyId"
            :key="item.companyId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择员工" prop="empId">
        <el-select
          v-model="formData.empId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入姓名或手机号"
          :remote-method="remoteMethod"
          :loading="selectRemote.loading"
          style="width: 190px"
        >
          <el-option
            v-for="item in selectRemote.options"
            :key="item.empId"
            :label="`${item.mobileNo}(${item.empName})`"
            :value="item.empId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="调整类型" prop="redressType">
        <el-radio-group v-model="formData.redressType" class="ml-4">
          <el-radio label="plus">增加金额</el-radio>
          <el-radio label="minus">扣减金额</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="调整金额" prop="redressAmount">
        <el-input v-model="formData.redressAmount" placeholder="请输入, 必填" />
      </el-form-item>
      <el-form-item label="关联订单号" prop="orderNo">
        <el-input
          style="max-width: 220px !important"
          v-model="formData.orderNo"
          placeholder="请输入调整关联订单号, 选填"
          clearable
        />
      </el-form-item>
      <el-form-item label="调整原因" prop="remark">
        <el-input
          type="textarea"
          v-model="formData.remark"
          placeholder="请输入调整原因, 必填"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="toggleDialogStatus">取消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="confirm"
          >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { GetCompanyList } from '@/webapi/common'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import { RedressItemAdd } from '@/webapi/statistics'
import { ElMessage } from 'element-plus'
import { useRemoteSearchEmp } from '@/hooks/useRemoteSearch'
import { useFormRulesRedress } from '@/hooks/useFormRule'

const { ruleFormRef, rules, resetForm } = useFormRulesRedress()
const commonStore = useCommon()
const { cityList } = storeToRefs(commonStore)

const formData = reactive({
  cityId: null,
  companyId: null,
  empId: null,
  orderNo: '',
  redressAmount: '',
  remark: '',
  redressType: undefined
})
const { selectRemote, remoteMethod } = useRemoteSearchEmp()

const reset = () => {
  setTimeout(() => {
    resetForm()
    companyList.value = []
  }, 50)
}

const emit = defineEmits(['isConfirm'])
const confirmLoading = ref(false)
const confirm = async () => {
  await ruleFormRef.value.validate(valid => {
    if (valid) {
      const { redressAmount, ...rest } = formData
      confirmLoading.value = true
      RedressItemAdd({
        redressAmount: parseFloat(
          `${formData.redressType === 'minus' ? '-' : ''}${redressAmount}`
        ),
        ...rest
      }).then(res => {
        confirmLoading.value = false
        if (res.code == 200) {
          ElMessage({
            type: 'success',
            message: '保存成功'
          })
          emit('isConfirm')
          setTimeout(() => {
            toggleDialogStatus()
          }, 500)
        } else {
          ElMessage({
            type: 'error',
            message: res.message
          })
        }
      })
    }
  })
}

const companyList = ref<CompanyItem[]>([])
const cityIdChange = (cityId: number) => {
  formData.companyId = undefined
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}

const dialogShow = ref(false)
const toggleDialogStatus = () => {
  if (!dialogShow.value) {
    reset()
  }
  dialogShow.value = !dialogShow.value
}
defineExpose({
  toggleDialogStatus
})
</script>

<style scoped lang="scss"></style>
