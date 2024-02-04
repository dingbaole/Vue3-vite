<template>
  <el-card shadow="never">
    <el-form :inline="true" :model="formData" :rules="rules" ref="ruleFormRef">
      <el-form-item label="城市" prop="cityId">
        <el-select
          v-model="formData.cityId"
          @change="cityIdChange"
          filterable
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
      <el-form-item label="服务公司" prop="companyId">
        <el-select
          v-model="formData.companyId"
          @change="companyChange"
          filterable
          placeholder="公司"
        >
          <el-option
            v-for="item in companyList"
            :label="item.companyName"
            :value="item.companyId"
            :key="item.companyId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务站" prop="stationId">
        <el-select v-model="formData.stationId" filterable placeholder="服务站">
          <el-option
            v-for="item in stationList"
            :label="`${item.stationName}`"
            :value="item.stationId"
            :key="item.stationId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库位" prop="storageName">
        <el-input
          style="width: 180px"
          v-model="formData.storageName"
          placeholder="库位"
          clearable
          :parser="parser"
        ></el-input>
      </el-form-item>
      <el-form-item label="物料信息" prop="materialId">
        <el-select
          class="custom-select"
          v-model="formData.materialId"
          filterable
          remote
          placeholder="支持物料名称(模糊)、物料号(精确)查找"
          :remote-method="remoteMethod"
          :loading="optionList.materialLoading"
        >
          <el-option
            v-for="item in optionList.materialList"
            :label="`${item.materialName}(${item.materialNo})`"
            :value="item.materialId"
            :key="item.materialId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="变动日期">
        <el-date-picker
          v-model="dateRangeCreate"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" :loading="props.loading"
          >查询</el-button
        >
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCommon } from '@/store'
import type { CompanyItem } from '@/store/modules/common'
import { useFormRules } from '@/hooks/useFormRule'
import { GetInventoryCompanyList, GetStationList } from '@/webapi/common'
import type { Station } from '@/webapi/common'
import dayjs from 'dayjs'
import { RecordMaterialList } from '@/webapi/material'

const props = defineProps<{ loading: boolean }>()
const { ruleFormRef, rules: defaultRules, resetForm } = useFormRules()
const commonStore = useCommon()
const { init } = commonStore
const { cityList } = storeToRefs(commonStore)
const dateRangeCreate = ref([])
const formData = reactive({
  cityId: undefined,
  companyId: undefined,
  stationId: undefined,
  storageName: undefined,
  materialId: undefined
})
const rules = {
  ...defaultRules,
  stationId: [
    {
      required: true,
      message: '请选择服务站',
      trigger: 'change'
    }
  ],
  storageName: [
    {
      required: true,
      message: '请输入库位',
      trigger: 'blur'
    }
  ],
  materialId: [
    {
      required: true,
      message: '请选择物料信息',
      trigger: 'change'
    }
  ]
}
onMounted(() => {
  init()
})

const companyList = ref<CompanyItem[]>([])
const cityIdChange = (cityId: number) => {
  formData.companyId = undefined
  formData.stationId = undefined
  stationList.value = []
  GetInventoryCompanyList({ cityId }).then(res => {
    companyList.value = res.data
  })
}
const stationList = ref<Station[]>([])
const companyChange = (companyId: number) => {
  formData.stationId = undefined
  stationList.value = []
  GetStationList({ companyId }).then(res => {
    if (res.code === 200) {
      stationList.value = res.data
    }
  })
}
const parser = (val: string) => {
  if (!val) {
    return undefined
  }
  return val
}
const genTime = () => {
  let createTimeStart: string
  let createTimeEnd: string
  if (dateRangeCreate.value?.length > 0) {
    createTimeStart = `${dayjs(dateRangeCreate.value[0]).format(
      'YYYY-MM-DD'
    )} 00:00:00`
    createTimeEnd = `${dayjs(dateRangeCreate.value[1]).format(
      'YYYY-MM-DD'
    )} 23:59:59`
  }
  return {
    createTimeStart,
    createTimeEnd
  }
}
const emit = defineEmits(['change'])
const search = async () => {
  await ruleFormRef.value.validate(valid => {
    formData.storageName = formData.storageName
      ? formData.storageName
      : undefined
    if (valid) {
      emit('change', {
        ...formData,
        serviceCompanyId: formData.companyId,
        ...genTime()
      })
    }
  })
}

const changeResult = async () => {
  const valid = await ruleFormRef.value.validate()
  if (valid) {
    formData.storageName = formData.storageName
      ? formData.storageName
      : undefined
    return {
      ...formData,
      serviceCompanyId: formData.companyId,
      ...genTime()
    }
  } else {
    return null
  }
}
defineExpose({
  changeResult
})
const reset = () => {
  resetForm()
  companyList.value = []
  stationList.value = []
  dateRangeCreate.value = []
}
const optionList = reactive({
  materialList: [],
  materialLoading: false
})
const remoteMethod = (val: string) => {
  if (val) {
    const isNumber = !isNaN(Number(val))
    const params: any = {}
    if (isNumber) {
      params['materialNo'] = val
    } else {
      params['materialName'] = val
    }
    optionList.materialLoading = true
    RecordMaterialList({ limit: 200000, offset: 1, ...params }).then(res => {
      optionList.materialLoading = false
      if (res.rows?.length > 0) {
        optionList.materialList = res.rows
      } else {
        optionList.materialList = []
      }
    })
  } else {
    optionList.materialList = []
  }
}
</script>
<style scoped lang="scss">
.custom-select {
  width: 300px;
  :deep(.el-input) {
    max-width: 300px !important;
  }
}
</style>
