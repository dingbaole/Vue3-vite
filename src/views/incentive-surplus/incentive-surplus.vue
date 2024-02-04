<template>
  <div id="Box">
    <div id="search">
      <el-form :inline="true" :model="formData" class="demo-form-inline" ref="ruleFormRef" :rules="rules">
        <el-form-item label="城市" prop="cityId">
          <el-select v-model="formData.cityId" @change="cityIdChange" filterable placeholder="城市" clearable>
            <el-option v-for="item in cityList" :label="item.cityName" :value="item.cityId" :key="item.cityId" />
          </el-select>
        </el-form-item>
        <el-form-item label="公司" prop="companyId">
          <el-select v-model="formData.companyId" @change="companyChange" placeholder="公司" filterable clearable>
            <el-option v-for="item in companyList" :label="item.companyName" :value="item.companyId"
              :key="item.companyId" />
          </el-select>
        </el-form-item>
        <el-form-item label="员工" prop="empId">
          <el-select v-model="formData.empId" placeholder="请输入员工编号/姓名/手机号" filterable clearable>
            <el-option v-for="item in empList" :label="`${item.promoterName}-${item.empNo}-${item.mobileNo}`"
              :value="item.empId" :key="item.empId" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit()">查询</el-button>
          <el-button @click="() => { resetForm() }">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div id="table">
      <el-table :data="tableData.list" border style="width: 100%" :cell-style="cellStyle">
        <el-table-column prop="empNo" label="员工编号" width="180" />
        <el-table-column prop="promoterName" label="员工姓名" width="180" />
        <el-table-column prop="mobileNo" label="员工手机号" />
        <el-table-column prop="companyName" label="激励公司名称" />
        <el-table-column prop="totalRemainCommissionAmount" label="结余金额" />
        <el-table-column prop="operation" label="操作" align="center">
          <template #default="scope">
            <div class="operation">
              <el-link type="primary" @click="detail(scope.row)">查看明细</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin-top: 10px;">
        <el-pagination background layout="total,sizes,prev, pager, next" :total="tableData.total"
          v-model:current-page="formData.ecejCurrentPage" v-model:page-size="formData.ecejPageSize" />
      </div>
    </div>


    <!-- <el-dialog v-model="surplusDetailVisible" destroy-on-close :fullscreen="true" title="激励结余明细">
            <IncentiveSurplusDetail :id="childrenData.empId" :companyId="childrenData.companyId">
            </IncentiveSurplusDetail>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="surplusDetailVisible = false">关闭</el-button>
                </span>
            </template>
        </el-dialog> -->
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue'
import { GetCompanyList } from '@/webapi/common'
import { useFormRules } from '@/hooks/useFormRule'
import { useCommon } from '@/store'
import { storeToRefs } from 'pinia'
import { queryEmpList, selectListEmpAccountList } from "@/webapi/incentive-proofread";
import IncentiveSurplusDetail from "@/views/incentive-surplus/incentive-surplusDetail.vue";
import { useDialog } from '@/components/dialog'
const { ruleFormRef, rules, resetForm } = useFormRules()
const commonStore = useCommon()
const { getCityList } = commonStore
const { cityList } = storeToRefs(commonStore)
const companyList = ref([])
const empList = ref([])
// const surplusDetailVisible = ref(false)
// const childrenData = ref({
//   empId: undefined,
//   companyId: undefined
// })
const formData = reactive({ empId: undefined, cityId: undefined, companyId: undefined, ecejCurrentPage: null, ecejPageSize: null })
const tableData = ref({ list: [], total: 0 })
onMounted(async () => {
  getCityList()
})
// 分页器触发
watch([() => formData.ecejCurrentPage, () => formData.ecejPageSize], () => { queryTable() })
// 城市下拉触发
const cityIdChange = (cityId: any) => {
  formData.companyId = undefined
  GetCompanyList({ cityId }).then(res => {
    if (res.code === 200) {
      companyList.value = res.data
    }
  })
}
// 公司下拉触发
const companyChange = () => {
  formData.empId = undefined
  queryEmpList({ empId: formData.empId, cityId: formData.cityId, companyId: formData.companyId }).then(res => {
    if (res.code === 200) {
      empList.value = res.data.list
    }
  })
}
// 提交
const onSubmit = () => {
  ruleFormRef.value.validate(async valid => {
    if (valid) {
      formData.ecejCurrentPage = 1
      formData.ecejPageSize = 10
      queryTable()
    }
  })
}
// 查询
const queryTable = () => {
  selectListEmpAccountList({ ...formData }).then((res) => {
    tableData.value = res.data
  })
}

const surplusDetailDialog = useDialog<typeof IncentiveSurplusDetail>(
  IncentiveSurplusDetail,
  {
    title: '激励结余明细',
    fullscreen: true,
    confirmShow: false,
    cancelText: '关闭'
  }
)
// 详情
const detail = (row: any) => {
  surplusDetailDialog.open({ empId: row.empId, companyId: row.companyId })
  // childrenData.value = {
  //     empId: row.empId,
  //     companyId: row.companyId
  // }
  // surplusDetailVisible.value = true
  // router.push({
  //     name: 'incentive-surplusDetail',
  //     params: {
  //         empId: row.empId,
  //         companyId: row.companyId,
  //     },
  // });
}
// 表格字段为空操作
const cellStyle = ({ row, column, rowIndex, columnIndex }: any) => {
  let value = row[column.property]
  if (row[column.property] === null || row[column.property] === undefined || row[column.property] === '') {
    // console.log(row[column.property] == '')
    value = '--'
  }
  row[column.property] = value
}
</script>
<style lang='scss' scoped>
#Box {
  padding: 20px;
}

.el-link {
  margin-right: 8px;
}
</style>