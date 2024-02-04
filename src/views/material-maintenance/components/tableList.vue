<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <!-- 搜索区域 -->
    <el-form :model="formData" ref="formDateEl" class="demo-form-inline" label-position="right" label-width="70px"
      :rules="searchRules">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item prop="cityId" label="城市">
            <el-select placeholder="全部" v-model="formData.cityId" clearable filterable @change="cityChange">
              <el-option v-for="item in cityList" :key="item.cityId" :label="item.cityName" :value="item.cityId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="companyId" label="公司">
            <el-select placeholder="全部" v-model="formData.companyId" clearable filterable>
              <el-option v-for="item in companyList" :key="item.companyId" :label="item.companyName"
                :value="item.companyId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="oldChangeStat" label="维保状态">
            <el-select placeholder="全部" v-model="formData.oldChangeStat" filterable clearable>
              <el-option key="1" label="启用" value="2" />
              <el-option key="2" label="禁用" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" v-if="props.type == 1">
          <el-form-item prop="materialName" label="物料名称">
            <el-input v-model="formData.materialName" clearable placeholder="请输入物料名称" />
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="props.type == 1">
          <el-form-item prop="materialNo" label="物料号">
            <el-input v-model="formData.materialNo" clearable placeholder="请输入物料号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="validityPeriod" label="有效期">
            <el-date-picker v-model="validityPeriod" type="datetimerange" start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="searchForm()">查询</el-button>
            <el-button type="primary" @click="onEmpty(formDateEl)">清空</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 按钮组 -->
    <div style="margin: 10px 0;">
      <el-button type="primary" @click="batchSetup" v-permission="'material:insurance:change:batch:settings'">{{
        '设置'
      }}</el-button>
      <el-button type="danger" @click="() => { if (isSelectData() != false) enableBulletFrame = true }"
        v-permission="'material:insurance:change:enable'">启用</el-button>
      <el-button type="success" @click="() => { if (isSelectData() != false) disabledStatus = true }"
        v-permission="'material:insurance:change:disable'">禁用</el-button>
      <el-button type="primary" @click="() => {
        formDateEl?.validate((valid: any) => {
          if (valid) {
            exportStatus = true
          }
        })
      }" v-permission="'material:insurance:change:export'">异步导出</el-button>
    </div>
    <!-- 表格 -->
    <div v-if="props.type == 1">
      <el-table :data="tableData" border style="width: 100%" ref="tableEl" v-loading="loading">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="cityName" label="城市" min-width="60">
          <template #default="scope">{{ emptyProcessing(scope.row.cityName) }}</template>
        </el-table-column>
        <el-table-column prop="companyName" label="公司" min-width="200">
          <template #default="scope">{{ emptyProcessing(scope.row.companyName) }}</template>
        </el-table-column>
        <el-table-column prop="materialNo" label="物料号" min-width="100">
          <template #default="scope">{{ emptyProcessing(scope.row.materialNo) }}</template>
        </el-table-column>
        <el-table-column prop="materialName" label="物料名称" min-width="300">
          <template #default="scope">{{ emptyProcessing(scope.row.materialName) }}</template>
        </el-table-column>
        <el-table-column prop="unitName" label="计量单位" min-width="100">
          <template #default="scope">{{ emptyProcessing(scope.row.unitName) }}</template>
        </el-table-column>
        <el-table-column prop="materialType" label="物料分类" min-width="100">
          <template #default="scope">{{ emptyProcessing(scope.row.materialType) }}</template>
        </el-table-column>
        <el-table-column prop="sellFlag" label="商店可售" min-width="100">
          <template #default="scope">
            {{
              scope.row.sellFlag == 1 ? '是' : '否'
            }}
          </template>
        </el-table-column>
        <el-table-column label="价格" min-width="100">
          <template #default="scope">{{ emptyProcessing(scope.row.price) }}</template>
        </el-table-column>
        <el-table-column prop="fixedFeeAmt" label="维保状态" min-width="110">
          <template #default="scope">
            {{
              scope.row.insuranceStat ? scope.row.insuranceStat == 2 ? '启用' : '禁用'
              : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column prop="validStartTime" label="启用开始时间" min-width="180">
          <template #default="scope">{{
            scope.row.validStartTime ? dayjs(scope.row.validStartTime).format('YYYY-MM-DD HH: mm: ss') : '--'
          }}</template>
        </el-table-column>
        <el-table-column prop="validEndTime" label="启用结束时间" min-width="180">
          <template #default="scope">{{
            scope.row.validEndTime ? dayjs(scope.row.validEndTime).format('YYYY-MM-DD HH: mm: ss') : '--'
          }}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作" min-width="100" fixed="right">
          <template #default="scope">
            <a href="#" @click="() => {
              row = scope.row
              logForm.ecejCurrentPage = 1
              getLogList()
            }">日志</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <el-table :data="tableData" border style="width: 100%" ref="tableEl" v-loading="loading">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="cityName" label="城市" show-overflow-tooltip>
          <template #default="scope">{{ emptyProcessing(scope.row.cityName) }}</template>
        </el-table-column>
        <el-table-column prop="companyName" label="公司" show-overflow-tooltip>
          <template #default="scope">{{ emptyProcessing(scope.row.companyName) }}</template>
        </el-table-column>
        <el-table-column prop="fixedFeeAmt" label="维保状态" min-width="110">
          <template #default="scope">
            {{
              scope.row.insuranceStat ? scope.row.insuranceStat == 2 ? '启用' : '禁用'
              : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column prop="validStartTime" label="启用开始时间" show-overflow-tooltip width="180px">
          <template #default="scope">{{
            scope.row.validStartTime ? dayjs(scope.row.validStartTime).format('YYYY-MM-DD HH: mm: ss') : '--'
          }}</template>
        </el-table-column>
        <el-table-column prop="validEndTime" label="启用结束时间" show-overflow-tooltip width="180px">
          <template #default="scope">{{
            scope.row.validEndTime ? dayjs(scope.row.validEndTime).format('YYYY-MM-DD HH: mm: ss') : '--'
          }}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作" min-width="100" fixed="right">
          <template #default="scope">
            <a href="#" @click="() => {
              row = scope.row
              logForm.ecejCurrentPage = 1
              getLogList()
            }">日志</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="margin: 10px 0;">
      <el-pagination :page-sizes="[10, 50, 100, 150]" :page-size="formData.ecejPageSize"
        :current-page="formData.ecejCurrentPage" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 启用弹框 -->
    <el-dialog v-model="enableBulletFrame" center="true" title="启用" width="50%"
      :before-close="() => { enableBulletFrame = false }">
      <div class="dialogConent">
        <p class="on">请确认是否<span class="highlightRed">启用</span>选中数据的维保规则？</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="enableDisableConfirm(2)">确认</el-button>
          <el-button @click="enableBulletFrame = false">
            取消
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 禁用弹框 -->
    <el-dialog v-model="disabledStatus" center="true" title="禁用" width="50%"
      :before-close="() => { disabledStatus = false }">
      <div class="dialogConent">
        <p class="on">请确认是否<span class="highlightGreen">禁用</span>选中数据的维保规则？</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="enableDisableConfirm(1)">确认</el-button>
          <el-button @click="disabledStatus = false">
            取消
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 设置弹框 -->
    <el-dialog v-model="batchSetupStatus" center="true" :title="'设置'" width="50%"
      :before-close="() => { batchSetupStatus = false }" v-if="batchSetupStatus == true">
      <div class="dialogConent">
        <el-form :model="batchSetupForm" label-width="120px" ref="batchSetupFormEl" :rules="batchSetupRules">
          <el-form-item label="维保状态" prop="changeStat">
            <el-radio-group v-model="batchSetupForm.changeStat">
              <el-radio label="1">禁用</el-radio>>
              <el-radio label="2">启用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="启用有效期" prop="validityPeriod">
            <el-date-picker v-model="batchSetupForm.validityPeriod" type="datetimerange" @change="confirmCheck"
              @calendar-change="batchSetupChangeTime" :disabled-date="batchSetupDisabledDate" start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间" :defaultTime="defaultTime" :teleported="false" />
          </el-form-item>
          <el-form-item label="维保说明" prop="changePriceReason">
            <el-input v-model="batchSetupForm.changePriceReason" :rows="5" type="textarea" placeholder="请说明设置维保原因（100字以内）"
              maxlength="100" />
          </el-form-item>
        </el-form>
        <span class="footerButton">
          <el-button type="primary" @click="batchSetupConfirm(batchSetupFormEl)">确认</el-button>
          <el-button @click="batchSetupStatus = false">
            取消
          </el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 日志弹框 -->
    <el-dialog v-model="logStatus" title="日志" width="50%" :before-close="() => { logStatus = false }">
      <div class="dialogConent">
        <el-table :data="logTable" border style="width: 100%">
          <el-table-column prop="createTime" label="操作时间" width="180">
            <template #default="scope">{{ dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</template>
          </el-table-column>
          <el-table-column prop="operateUserName" label="操作人" width="190">
            <template #default="scope">{{ emptyProcessing(scope.row.operateUserName) + '-' +
              emptyProcessing(scope.row.operateUserPhone) }}</template>
          </el-table-column>
          <el-table-column prop="operateText" label="操作内容">
            <template #default="scope">
              <p v-for="item in scope.row.operateText">{{ item }}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination background layout="prev, pager, next" :total="logTotal" @current-change="logCurrentChange"
        :page-size="5" style="margin-top: 10px;" :current-page="logForm.ecejCurrentPage" />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="logStatus = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 导出弹框 -->
    <el-dialog v-model="exportStatus" title="导出" width="30%" :before-close="() => { exportStatus = false }">
      <span>是否确定导出？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportStatus = false">取消</el-button>
          <el-button type="primary" @click="exportButton">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRaw, watch } from "vue";
import { ElTable, ElForm, ElMessage, ElMessageBox } from "element-plus";
import {
  getAuthedCityList,
  getAuthedCompanyList,
  getMaintenanceList,
  getMainChangeLog,
  MainbatchSetting,
  InsurancematerialEnableDisable,
  MainExport
} from "@/webapi/common";
import dayjs from "dayjs";
const props = defineProps({
  type: Number
})
// 搜索参数
let formData = reactive<{
  ecejCurrentPage: number,
  ecejPageSize: number,
  cityId: number | undefined,
  companyId: number | undefined,
  oldChangeStat: number | undefined,
  materialName: any,
  materialNo: any
}>({
  ecejCurrentPage: 1, // 当前页码
  ecejPageSize: 10, // 每页显示条数
  cityId: undefined,
  companyId: undefined,
  oldChangeStat: undefined,
  materialName: undefined,
  materialNo: undefined
})
// 批量设置提交信息
let batchSetupForm = reactive({
  validityPeriod: undefined,
  changePriceReason: undefined,
  changeStat: "1"
})

// 查询日志
let logForm: {
  ecejPageSize: number,
  ecejCurrentPage: number,
  companyItemChangePriceId: any
} = {
  ecejPageSize: 5,
  ecejCurrentPage: 1,
  companyItemChangePriceId: undefined
}
let defaultTime = ref([
  new Date(2000, 1, 1, 12, 0, 0),
  new Date(2000, 2, 1, 8, 0, 0),
])
let validityPeriod = ref([]);
let row: any = undefined
let settingsStartDate: Date = new Date();// 开始时间(设置改价)
let batchSetupStartDate: Date = new Date();// 开始时间(批量改价)
let tableEl = ref<InstanceType<typeof ElTable> | null>(null); //Table Dome
let formDateEl = ref<InstanceType<typeof ElForm> | null>(null);//Form Dome
let batchSetupFormEl = ref<InstanceType<typeof ElForm> | null>(null);//批量设置Form Dome
let settingsFormEl = ref<InstanceType<typeof ElForm> | null>(null);//设置Form Dome
let enableBulletFrame = ref<boolean>(false) // 启用弹窗状态
let disabledStatus = ref<boolean>(false)// 禁用弹窗状态
let batchSetupStatus = ref<boolean>(false)// 批量设置弹框状态
let settingsStatus = ref<boolean>(false)// 批量设置弹框状态
let logStatus = ref<boolean>(false)// 日志弹框状态
let exportStatus = ref<boolean>(false)// 导出确认弹框状态
let total = ref<number>(0) //条数
let logTotal = ref<number>(0)
let cityList = ref<any[]>([])  //城市数据
interface companyClass { companyId: Number, companyName: string, companyCodeNo: string }
let companyList = ref<companyClass[]>([]) //公司数据
const tableData = ref([]) // 表格数据
const logTable = ref([]) // 日志表格数据
const informationTable = ref()//设置表格数据
let loading = ref(false) //表格loding状态
// 为空处理
const emptyProcessing = (value: any) => {
  return value || value == 0 ? value : "--"
}
// 获取城市数据
const getCityList = () => {
  getAuthedCityList({ model: props.type }).then((res) => {
    console.log(res)
    if (res.code == 200) {
      cityList.value = res.data
    }
  })
}
getCityList()
// 城市下拉触发
const cityChange = (value: any, item: any) => {
  // clearList([companyList, bigClassList, deviceList, serviceClassList, serviceItemList])
  formData.companyId = undefined
  getAuthedCompanyList({ cityId: value, model: props.type }).then(res => {
    if (res.code == 200) {
      companyList.value = res.data
    }
  })
}

// 搜索form校验
const searchRules = reactive({
  cityId: [{
    required: true, message: '城市不能为空！', trigger: 'blur'
  }],
  companyId: [{
    required: true, message: '公司不能为空！', trigger: 'blur'
  }]
})
//搜索操作
const searchForm = () => {
  formData.ecejCurrentPage = 1
  formData.ecejPageSize = 10
  onSubmit()
}
//搜索查询
const onSubmit = () => {
  // 表单校验
  formDateEl.value?.validate((valid: any, fields: any) => {
    loading.value = true
    if (valid) {
      let parme = cullEmpty({
        ...toRaw(formData),
        oldValidStartTime: validityPeriod.value && validityPeriod.value.length ? validityPeriod.value[0]?.getTime() : '',
        oldValidEndTime: validityPeriod.value && validityPeriod.value.length ? validityPeriod.value[1]?.getTime() : '',
        model: props.type
      })
      // 如果是非燃控物料
      if (props.type == 2) {
        parme.materialName = undefined
        parme.materialNo = undefined
      }
      console.log(parme)
      getMaintenanceList(parme).then(res => {
        loading.value = false
        if (res.code != 200) {
          ElMessage.error(res.message)
          return false
        }
        tableData.value = res.rows
        tableData.value.forEach((item: any, index: number) => {
          item.index = index
        });
        total.value = res.total
      })
    } else {
      loading.value = false
      return false
    }
  })
  console.log(formData, tableEl.value?.getSelectionRows());
  console.log({ ...toRaw(formData) }, validityPeriod)
};

// 清空
const onEmpty = (formDateEl: any) => {
  formDateEl.resetFields()
  validityPeriod.value = []
}

// 批量设置form校验
const batchSetupRules = reactive({
  changeStat: [{
    required: true, message: '维保状态不能为空！', trigger: 'blur'
  }],
  validityPeriod: [{
    required: true, message: '启用有效期不能为空！', trigger: 'blur'
  }],
  changePriceReason: [{
    required: true, message: '维保说明不能为空！', trigger: 'blur'
  }],
})
// 设置操作
const batchSetup = () => {
  if (isSelectData() != false) {
    defaultTime.value = [
      new Date(new Date().getTime() + 1000 * 60 * 5),
      new Date(2000, 2, 1, 0, 0, 0),
    ]
    batchSetupStatus.value = true
    batchSetupForm.validityPeriod = []
    batchSetupForm.changePriceReason = ''
    batchSetupForm.changeStat = '1'
    if (tableEl.value?.getSelectionRows().length == 1) {
      let tableData = tableEl.value?.getSelectionRows()[0]
      console.log(batchSetupForm.validityPeriod)
      if (tableData.validStartTime || tableData.validEndTime) batchSetupForm.validityPeriod = [new Date(tableData.validStartTime), new Date(tableData.validEndTime)]
      batchSetupForm.changePriceReason = tableData.changePriceReason
      batchSetupForm.changeStat = tableData.insuranceStat + ''
    }
  }
}
// 批量设置确认
const batchSetupConfirm = (batchSetupFormEl: any) => {
  let rows = JSON.parse(JSON.stringify(tableData.value.filter((item: any) => tableEl.value?.getSelectionRows().map((item: any) => item.index).includes(item.index))))
  console.log(rows, batchSetupForm)
  batchSetupFormEl.validate((valid: any, fields: any) => {
    if (valid) {
      let parme = {
        rows: JSON.stringify(rows),
        model: props.type,
        changeStat: batchSetupForm.changeStat,
        changePriceReason: batchSetupForm.changePriceReason,
        oldValidStartTime: batchSetupForm.validityPeriod[0].getTime(),
        oldValidEndTime: batchSetupForm.validityPeriod[1].getTime(),
      }
      let getItem = serverInterface(parme, MainbatchSetting)
      getItem.then(res => {
        if (res.code != 200) {
          ElMessage.error(res.message)
          return false
        }
        ElMessage({
          message: res.message,
          type: 'success',
        })
        batchSetupFormEl.resetFields()
        batchSetupStatus.value = false
        onSubmit()
      })
    }
  })
}

// 获取日志数据
const getLogList = () => {
  console.log(row)
  logForm.companyItemChangePriceId = props.type == 1 ? row.companyMaterialInsuranceConfigId : row.companyInsuranceConfigId
  let getItem = serverInterface({ ...toRaw(logForm), model: props.type }, getMainChangeLog)
  getItem.then(res => {
    if (res.code != 200) {
      ElMessage.error(res.message)
      return false
    }
    logTable.value = res.rows
    logTable.value.forEach(itme => {
      itme.operateText = itme.operateText.split(',')
    })
    logTotal.value = res.total
    logStatus.value = true
  })
}

// 启用禁用确认
const enableDisableConfirm = (type: Number) => {
  let rowList = JSON.parse(JSON.stringify(tableData.value.filter((item: any) => tableEl.value?.getSelectionRows().map((item: any) => item.index).includes(item.index))))
  let params = {
    changeStat: type,
    rows: JSON.stringify(rowList),
    model: props.type
  }
  let getItem = serverInterface(params, InsurancematerialEnableDisable)
  getItem.then(res => {
    if (res.code != 200) {
      ElMessage.error(res.message)
      return false
    }
    ElMessage({
      message: res.message,
      type: 'success',
    })
    enableBulletFrame.value = false
    disabledStatus.value = false
    onSubmit()
  })
}
// 导出
const exportButton = () => {
  let parme = cullEmpty({
    ...toRaw(formData),
    oldValidStartTime: validityPeriod.value && validityPeriod.value.length ? validityPeriod.value[0]?.getTime() : '',
    oldValidEndTime: validityPeriod.value && validityPeriod.value.length ? validityPeriod.value[1]?.getTime() : '',
    model: props.type
  })
  delete parme.ecejPageSize
  delete parme.ecejCurrentPage
  let getItem = serverInterface(parme, MainExport)
  getItem.then(res => {
    if (res.code != 200) {
      ElMessage.error(res.message)
      return false
    }
    ElMessageBox.alert('导出申请提交成功!(请您稍后到页面右上方“下载暂存”中下载文件~)', '提示', {
      confirmButtonText: '确认',
    })
    exportStatus.value = false
  })
}


// 分页触发
function handleSizeChange(value: number) {
  console.log(value)
  formData.ecejPageSize = value
  onSubmit()
}
function handleCurrentChange(value: number) {
  console.log(value)
  formData.ecejCurrentPage = value
  onSubmit()
}
function logCurrentChange(value: number) {
  logForm.ecejCurrentPage = value
  getLogList()
}
// 去除空字段
const cullEmpty = (obj: any) => {
  let retObj: any = {}
  for (const key in obj) {
    if (obj[key]) {
      retObj[key] = obj[key]
    }
  }
  return retObj
}





// 监听点击事件
const settingsChangeTime = (date: Date[]) => {
  settingsStartDate = date[0];
};
// 设置时间范围
let settingsDisabledDate = (time: { getTime: () => number }) => {
  let threeDate = new Date(settingsStartDate.getTime() + 365 * 24 * 3600 * 1000);
  return (
    time.getTime() < dayjs().startOf("day").valueOf() ||
    time.getTime() > threeDate.getTime()
  );
};
// 监听点击事件
const batchSetupChangeTime = (date: Date[]) => {
  batchSetupStartDate = date[0];
};
// 设置时间范围
let batchSetupDisabledDate = (time: { getTime: () => number }) => {
  let threeDate = new Date(batchSetupStartDate.getTime() + 365 * 24 * 3600 * 1000);
  return (
    time.getTime() < dayjs().startOf("day").valueOf() ||
    time.getTime() > threeDate.getTime()
  );
};
// 时间确认校验
const confirmCheck = (val: any) => {
  // console.log(val[0], val[0].getTime() < new Date().getTime())
  if (val[0].getTime() < new Date().getTime()) {
    ElMessage.error('有效期开始时间无效')
    batchSetupForm.validityPeriod = []
    return false
  }
}
// 请求统一管理
let fullscreenLoading = ref<boolean>(false)
interface Result {
  [x: string]: any;
  code: number;
  message: string;
}
// 统一调用接口
const serverInterface = async (parme: any, fun: (p: any) => any): Promise<Result> => {
  fullscreenLoading.value = true
  let retDate = await fun(parme)
  fullscreenLoading.value = false
  return retDate
}
// 校验是否选中数据
function isSelectData() {
  if (!tableEl.value.getSelectionRows().length) {
    ElMessage.error('请选择要操作的数据')
    return false
  }
}
</script>

<style scoped lang="scss">
.block {
  width: 100%;
}



.header {
  border-bottom: 1px solid #C5C4C4;
  padding: 10px 0;
  padding-left: 20px;
  margin-bottom: 15px;

  span {
    font-weight: bolder;
    font-size: 18px;
  }
}

.dialogConent {
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    margin: 0;
  }

  .on {
    font-size: 16px;
    font-weight: bolder;

    .highlightRed {
      font-size: 18px;
      color: red;
    }

    .highlightGreen {
      font-size: 18px;
      color: #02AF13;
    }
  }

  .next {
    font-size: 14px;
    color: red;
  }

  .information {
    margin-bottom: 10px;
  }

  .information,
  td {
    border: 1px solid #AFB1B7;
    border-collapse: collapse;
    text-align: center;
    color: black;
    padding: 5px;
  }

  //奇数
  .information td:nth-child(odd) {
    background: #E2E5EA;
    min-width: 80px;
  }

  //偶数
  .information td:nth-child(even) {
    min-width: 170px;
  }


}

.footerButton {
  margin-top: 20px;
}
</style>

