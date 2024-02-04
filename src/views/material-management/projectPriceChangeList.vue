<template>
  <div class="wrap" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="header">
      <span>查询条件</span>
    </div>
    <!-- 搜索区域 -->
    <el-form :model="formData" ref="formDateEl" class="demo-form-inline" label-position="right" label-width="70px"
      :rules="searchRules">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item prop="cityId" label="城市">
            <el-select placeholder="请选择" v-model="formData.cityId" clearable filterable @change="cityChange"
              ref="citySelect">
              <el-option v-for="item in cityList" :key="item.cityId" :label="item.cityName" :value="item.cityId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="companyId" label="公司">
            <el-select placeholder="请选择" v-model="formData.companyId" clearable filterable @change="companyChange"
              ref="companySelect">
              <el-option v-for="item in companyList" :key="item.companyId" :label="item.companyName"
                :value="item.companyId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="bigClassId" label="服务大类">
            <el-select placeholder="全部" v-model="formData.bigClassId" filterable clearable @change="bigClassChange">
              <el-option v-for="item in bigClassList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="deviceId" label="设备">
            <el-select placeholder="全部" v-model="formData.deviceId" filterable clearable @change="deviceIdChange">
              <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="serviceClassId" label="服务品类">
            <el-select placeholder="全部" v-model="formData.serviceClassId" filterable clearable
              @change="serviceClassChange">
              <el-option v-for="item in serviceClassList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="serviceItemId" label="服务项目">
            <el-select placeholder="全部" v-model="formData.serviceItemId" filterable clearable>
              <el-option v-for="item in serviceItemList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item prop="baseDataVersion" label="数据版本">
            <el-select placeholder="全部" v-model="formData.baseDataVersion" filterable clearable>
              <el-option v-for="item in dataVersionList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="oldChangeStat" label="改价状态">
            <el-select placeholder="全部" v-model="formData.oldChangeStat" filterable clearable>
              <el-option key="1" label="启用" value="2" />
              <el-option key="2" label="禁用" value="1" />
            </el-select>
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
      <el-button type="primary" @click="batchSetup" v-permission="'project:price:change:batch:settings'">批量设置</el-button>
      <el-button type="danger" @click="() => { if (isSelectData() != false) enableBulletFrame = true }"
        v-permission="'project:price:change:enable'">启用</el-button>
      <el-button type="success" @click="() => { if (isSelectData() != false) disabledStatus = true }"
        v-permission="'project:price:change:disable'">禁用</el-button>
      <el-button type="primary" @click="() => {
        formDateEl.validate((valid: any) => {
          if (valid) {
            exportStatus = true
          }
        })
      }" v-permission="'project:price:change:export'">异步导出</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" ref="tableEl" v-loading="loading">
      <el-table-column width="55" type="selection" />
      <el-table-column label="城市" min-width="60">
        <template #default="scope">{{ emptyProcessing(cityName) }}</template>
      </el-table-column>
      <el-table-column label="公司" min-width="200">
        <template #default="scope">{{ emptyProcessing(companyName) }}</template>
      </el-table-column>
      <el-table-column label="服务大类名称" min-width="120">
        <template #default="scope">{{ emptyProcessing(scope.row.bigClassName) }}</template>
      </el-table-column>
      <el-table-column label="设备名称" min-width="100">
        <template #default="scope">{{ emptyProcessing(scope.row.deviceName) }}</template>
      </el-table-column>
      <el-table-column label="服务品类名称" min-width="110">
        <template #default="scope">{{ emptyProcessing(scope.row.serviceClassName) }}</template>
      </el-table-column>
      <el-table-column label="服务项目名称" min-width="110">
        <template #default="scope">{{ emptyProcessing(scope.row.serviceItemName) }}</template>
      </el-table-column>
      <el-table-column label="数据版本" min-width="110">
        <template #default="scope">{{ emptyProcessing(scope.row.baseDataVersionText) }}</template>
      </el-table-column>
      <el-table-column label="服务费用" min-width="90">
        <template #default="scope">{{ emptyProcessing(scope.row.serviceFee) }}</template>
      </el-table-column>
      <el-table-column label="改价状态" min-width="90">
        <template #default="scope">{{
          scope.row.changeStat ? scope.row.changeStat == 2 ? '启用' : '禁用' : '--'
        }}</template>
      </el-table-column>
      <el-table-column label="服务费固定值" min-width="110">
        <template #default="scope">{{ emptyProcessing(scope.row.fixedFeeAmt) }}</template>
      </el-table-column>
      <el-table-column label="服务费最低值" min-width="110">
        <template #default="scope">{{ scope.row.rangeFeeMinAmt != null ? scope.row.rangeFeeMinAmt : '--' }}</template>
      </el-table-column>
      <el-table-column label="服务费最高值" min-width="110">
        <template #default="scope">{{ emptyProcessing(scope.row.rangeFeeMaxAmt) }}</template>
      </el-table-column>
      <el-table-column label="启用开始时间" min-width="180">
        <template #default="scope">{{
          scope.row.validStartTime ? dayjs(scope.row.validStartTime).format('YYYY-MM-DD HH: mm: ss') : '--'
        }}</template>
      </el-table-column>
      <el-table-column label="启用结束时间" min-width="180">
        <template #default="scope">{{
          scope.row.validStartTime ? dayjs(scope.row.validEndTime).format('YYYY-MM-DD HH: mm: ss') : '--'
        }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" fixed="right">
        <template #default="scope">
          <a href="#" @click="operation(scope.row)" v-permission="'project:price:change:export'">设置</a>
          &nbsp;
          <a href="#" @click="() => {
            row = scope.row
            logForm.ecejCurrentPage = 1
            getLogList()
          }">日志</a>
        </template>
      </el-table-column>
    </el-table>
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
        <p class="on">请确认是否<span class="highlightRed">启用</span>选中数据的改价规则？</p>
        <p class="next">包含改价类型、服务费最低值、服务费最高值、服务费固定值、启用开始时间、启用结束时间信息</p>
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
        <p class="on">请确认是否<span class="highlightGreen">禁用</span>选中数据的改价规则？</p>
        <p class="next">包含改价类型、服务费最低值、服务费最高值、服务费固定值、启用开始时间、启用结束时间信息</p>
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
    <!-- 批量设置弹框 -->
    <el-dialog v-model="batchSetupStatus" center="true" title="批量设置" width="50%"
      :before-close="() => { batchSetupStatus = false }">
      <div class="dialogConent">
        <el-form :model="batchSetupForm" label-width="120px" ref="batchSetupFormEl" :rules="batchSetupRules"
          v-if="batchSetupStatus">
          <el-form-item label="启用有效期" prop="validityPeriod">
            <el-date-picker v-model="batchSetupForm.validityPeriod" type="datetimerange" @change="confirmCheck"
              @calendar-change="batchSetupChangeTime" :disabled-date="batchSetupDisabledDate" start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间" :defaultTime="defaultTime" :teleported="false" />
          </el-form-item>
          <el-form-item label="改价说明" prop="explain">
            <el-input v-model="batchSetupForm.explain" :rows="5" maxlength="100" type="textarea"
              placeholder="请说明设置改价原因（100字以内）" />
          </el-form-item>
        </el-form>
        <div style="text-align: center;">
          <p style="color:red">注意：改价类型及改价金额不支持批量设置。</p>
          <p style="color:red">若未设置改价类型及改价金额，默认为区间值，服务费最低值默认为0元，服务费最高值默认为服务费用</p>
          <p style="color:red">若已设置改价类型及改价金额，则改价类型及改价金额延用此前设置的数据。</p>
        </div>
        <span class="footerButton">
          <el-button type="primary" @click="batchSetupConfirm(batchSetupFormEl)">确认</el-button>
          <el-button @click="batchSetupStatus = false">
            取消
          </el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 设置改价弹框 -->
    <el-dialog v-model="settingsStatus" center="true" title="设置改价" width="50%"
      :before-close="() => { settingsStatus = false }" v-if="settingsStatus == true">
      <div class="dialogConent">

        <table class="information">
          <tr>
            <td>城市</td>
            <td>{{ cityName }}</td>
            <td>公司</td>
            <td>{{ companyName }}</td>
          </tr>
          <tr>
            <td>服务大类</td>
            <td>{{ emptyProcessing(informationTable.bigClassName) }}</td>
            <td>设备</td>
            <td>{{ emptyProcessing(informationTable.deviceName) }}</td>
          </tr>
          <tr>
            <td>服务品类</td>
            <td>{{ emptyProcessing(informationTable.serviceClassName) }}</td>
            <td>服务项目</td>
            <td>{{ emptyProcessing(informationTable.serviceItemName) }}</td>
          </tr>
          <tr>
            <td>数据版本</td>
            <td>{{ emptyProcessing(informationTable.baseDataVersionText) }}</td>
            <td>服务费用</td>
            <td>{{ emptyProcessing(informationTable.serviceFee) }}</td>
          </tr>
        </table>

        <el-form :model="settingsForm" label-width="120px" ref="settingsFormEl" :rules="settingsRules">
          <el-form-item label="改价状态" prop="changeStat">
            <el-radio-group v-model="settingsForm.changeStat">
              <el-radio label="1">禁用</el-radio>>
              <el-radio label="2">启用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="改价类型" prop="serviceFeeType">
            <el-radio-group v-model="settingsForm.serviceFeeType">
              <el-radio label="2">
                区间值
                <el-input v-model="settingsForm.rangeFeeMinAmt" :disabled="settingsForm.serviceFeeType != 2"
                  style="width: 100px;margin-left: 10px;" />
                <span>--</span>
                <el-input v-model="settingsForm.rangeFeeMaxAmt" :disabled="settingsForm.serviceFeeType != 2"
                  style="width: 100px;" />
              </el-radio>
              <el-radio label="1">固定值
                <el-input v-model="settingsForm.fixedFeeAmt" :disabled="settingsForm.serviceFeeType != 1"
                  style="width: 100px;margin-left: 10px;" />
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="启用有效期" prop="validityPeriod">
            <el-date-picker v-model="settingsForm.validityPeriod" type="datetimerange" @change="confirmCheck"
              :is-range="true" @calendar-change="settingsChangeTime" :disabled-date="settingsDisabledDate"
              start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" :defaultTime="defaultTime" :teleported="false" />
          </el-form-item>
          <el-form-item label="改价说明" prop="explain">
            <el-input v-model="settingsForm.explain" :rows="5" maxlength="100" type="textarea"
              placeholder="请说明设置改价原因（100字以内）" />
          </el-form-item>
        </el-form>
        <span class="footerButton">
          <el-button type="primary" @click="settingsConfirm(settingsFormEl)">确认</el-button>
          <el-button @click="settingsStatus = false">
            取消
          </el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 日志弹框 -->
    <el-dialog v-model="logStatus" title="日志">
      <el-table :data="logTable" border>
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
      <el-pagination background layout="prev, pager, next" :total="logTotal" @current-change="logCurrentChange"
        :page-size="5" style="margin-top: 10px;" :current-page="logForm.ecejCurrentPage" />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="logStatus = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 导出确认框 -->
    <el-dialog v-model="exportStatus" title="导出" width="30%" :before-close="() => { exportStatus = false }">
      <span>是否确定导出？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportStatus = false">取消</el-button>
          <el-button type="primary" @click="confirmExport">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, toRaw, toRefs, watch } from "vue";
import { storeToRefs } from 'pinia'
import { ElTable, ElForm, ElSelect, ElMessage, ElMessageBox } from "element-plus";
import { useCommon } from "@/store";
import {
  GetCompanyList,
  GetCompanyBigClassList,
  GetCompanyDeviceList,
  GetCompanyServiceClassList,
  GetCompanyServiceItemList,
  GetdataVersionList,
  GetprojectSeverList,
  projectPriceBatch,
  enableDisable,
  priceChangeSetting,
  getChangeLog,
  setExport,
  getPriceItem
} from "@/webapi/common";
import dayjs from "dayjs";
// 搜索参数
let formData = reactive<{
  ecejCurrentPage: number,
  ecejPageSize: number,
  cityId: number,
  companyId: number,
  bigClassId: number,
  deviceId: number,
  serviceClassId: number,
  serviceItemId: number,
  baseDataVersion: number,
  oldChangeStat: number,
}>({
  ecejCurrentPage: 1, // 当前页码
  ecejPageSize: 10, // 每页显示条数
  cityId: undefined,
  companyId: undefined,
  bigClassId: undefined,
  deviceId: undefined,
  serviceClassId: undefined,
  serviceItemId: undefined,
  baseDataVersion: undefined,
  oldChangeStat: undefined,
})
// 批量设置提交信息
let batchSetupForm = reactive({
  cityId: undefined,
  companyId: undefined,
  validityPeriod: undefined,
  explain: undefined,
})
// 设置改价提交信息
let settingsForm = reactive<{
  rangeFeeMinAmt: any,
  rangeFeeMaxAmt: any,
  fixedFeeAmt: any,
  changeStat: string,
  serviceFeeType: any,
  validityPeriod: any,
  explain: any
}>({
  changeStat: "1",
  serviceFeeType: undefined,
  rangeFeeMinAmt: 0,
  rangeFeeMaxAmt: undefined,
  fixedFeeAmt: undefined,
  validityPeriod: undefined,
  explain: undefined
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
let row: any = undefined
let validityPeriod = ref([]);
let settingsStartDate: Date = new Date();// 开始时间(设置改价)
let batchSetupStartDate: Date = new Date();// 开始时间(批量改价)
let tableEl = ref<InstanceType<typeof ElTable> | null>(null); //Table Dome
let formDateEl = ref<InstanceType<typeof ElForm> | null>(null);//Form Dome
let citySelect = ref<InstanceType<typeof ElSelect> | null>(null);//citySelect Dome
let companySelect = ref<InstanceType<typeof ElSelect> | null>(null);//companySelect Dome
let batchSetupFormEl = ref<InstanceType<typeof ElForm> | null>(null);//批量设置Form Dome
let settingsFormEl = ref<InstanceType<typeof ElForm> | null>(null);//设置Form Dome
let enableBulletFrame = ref<boolean>(false) // 启用弹窗状态
let disabledStatus = ref<boolean>(false)// 禁用弹窗状态
let batchSetupStatus = ref<boolean>(false)// 批量设置弹框状态
let settingsStatus = ref<boolean>(false)// 批量设置弹框状态
let logStatus = ref<boolean>(false)// 日志弹框状态
let exportStatus = ref<boolean>(false)// 导出确认弹框状态
let store = useCommon()
store.getCityList()
let { cityList } = storeToRefs(store)  //城市数据(转换成响应式数据)
interface companyClass { companyId: Number, companyName: string, companyCodeNo: string }
interface serviceClass { id: Number, name: string }
let companyList = ref<companyClass[]>([]) //公司数据
let bigClassList = ref<serviceClass[]>([])  //服务大类数据
let deviceList = ref<serviceClass[]>([]) //设备数据
let serviceClassList = ref<serviceClass[]>([]) //服务品类数据
let serviceItemList = ref<serviceClass[]>([]) //服务项目数据
let dataVersionList = ref<serviceClass[]>([]) //数据版本数据
const tableData = ref([]) // 表格数据
const logTable = ref([]) // log表格数据
const informationTable = ref()//设置表格数据
let loading = ref(false) //表格loding状态
let total = ref<number>(0)
let logTotal = ref<number>(0)
let cityName = ref<string>('')
let companyName = ref<string>('')
// 为空处理
const emptyProcessing = (value: any) => {
  return value ? value : "--"
}
// 获取版本信息数据
GetdataVersionList().then(res => {
  if (res.code == 200) {
    dataVersionList.value = res.data
  }
})
// 城市下拉触发
const cityChange = (value: any, item: any) => {
  // clearList([companyList, bigClassList, deviceList, serviceClassList, serviceItemList])
  bigClassList.value = []
  deviceList.value = []
  serviceClassList.value = []
  serviceItemList.value = []
  formData.companyId = undefined
  formData.bigClassId = undefined
  formData.deviceId = undefined
  formData.serviceClassId = undefined
  formData.serviceItemId = undefined
  GetCompanyList({ cityId: value }).then(res => {
    if (res.code == 200) {
      companyList.value = res.data
    }
  })
}
// 公司下拉触发
const companyChange = (value: any, item: any) => {
  deviceList.value = []
  serviceClassList.value = []
  serviceItemList.value = []
  formData.bigClassId = undefined
  formData.deviceId = undefined
  formData.serviceClassId = undefined
  formData.serviceItemId = undefined
  GetCompanyBigClassList({ companyId: value }).then(res => {
    if (res.code == 200) {
      bigClassList.value = res.data
    }
  })
}
// 服务大类触发
const bigClassChange = (value: any, item: any) => {
  serviceClassList.value = []
  serviceItemList.value = []
  formData.deviceId = undefined
  formData.serviceClassId = undefined
  formData.serviceItemId = undefined
  GetCompanyDeviceList({
    companyId: formData.companyId,
    bigClassId: value
  }).then(res => {
    if (res.code == 200) {
      deviceList.value = res.data
    }
  })
}
// 设备下拉触发
const deviceIdChange = (value: any, item: any) => {
  serviceItemList.value = []
  formData.serviceClassId = undefined
  formData.serviceItemId = undefined
  GetCompanyServiceClassList({
    companyId: formData.companyId,
    deviceId: value
  }).then(res => {
    if (res.code == 200) {
      serviceClassList.value = res.data
    }
  })
}
// 服务品类下拉触发
const serviceClassChange = (value: any, item: any) => {
  formData.serviceItemId = undefined
  GetCompanyServiceItemList({
    companyId: formData.companyId,
    serviceClassId: value
  }).then(res => {
    if (res.code == 200) {
      serviceItemList.value = res.data
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
  }],
})
//搜索操作
const searchForm = () => {
  formData.ecejCurrentPage = 1
  formData.ecejPageSize = 10
  onSubmit()
}
//搜索查询
const onSubmit = () => {
  console.log(formDateEl)
  // 表单校验
  formDateEl.value.validate((valid: any, fields: any) => {
    console.log(formData, tableEl.value?.getSelectionRows());
    console.log({ ...toRaw(formData) }, validityPeriod)
    loading.value = true
    if (valid) {
      cityName.value = citySelect.value.selectedLabel
      companyName.value = companySelect.value.selectedLabel
      let parme = {
        ...toRaw(formData),
        cityName: cityName.value,
        companyName: companyName.value,
        validStartTime: validityPeriod.value && validityPeriod.value.length ? dayjs(validityPeriod.value[0]).format('YYYY-MM-DD HH:mm:ss') : undefined,
        validEndTime: validityPeriod.value && validityPeriod.value.length ? dayjs(validityPeriod.value[1]).format('YYYY-MM-DD HH:mm:ss') : undefined
      }
      GetprojectSeverList(parme).then(res => {
        loading.value = false
        if (res.code != 200) {
          ElMessage.error(res.message)
          return false
        }
        tableData.value = res.rows
        tableData.value.forEach((item: any, index: number) => {
          item.index = index
        });
        console.log(tableData.value)
        total.value = res.total
      })
    } else {
      total.value = 0
      loading.value = false
      return false
    }
  })
};
// 清空
const onEmpty = (formDateEl: any) => {
  formDateEl.resetFields()
  validityPeriod.value = []
}
// 批量设置form校验
const batchSetupRules = reactive({
  validityPeriod: [{
    required: true, message: '启用有效期不能为空！', trigger: 'blur'
  }],
  explain: [{
    required: true, message: '改价说明不能为空！', trigger: 'blur'
  }],
})
// 批量设置操作
const batchSetup = () => {
  console.log(tableEl.value?.getSelectionRows(), tableData.value.filter((item: any) => tableEl.value?.getSelectionRows().map((item: any) => item.index).includes(item.index)))
  // tableData.value.filter((item: any) => tableEl.value?.getSelectionRows().map((item: any) => item.index).include( item.index ))
  debugger
  if (isSelectData() != false) {
    defaultTime.value = [
      new Date(new Date().getTime() + 1000 * 60 * 5),
      new Date(2000, 2, 1, 0, 0, 0),
    ]
    batchSetupStatus.value = true
    batchSetupForm.validityPeriod = []
    batchSetupForm.explain = ''
  }
}
// 批量设置确认
const batchSetupConfirm = (batchSetupFormEl: any) => {
  batchSetupFormEl.validate((valid: any, fields: any) => {
    if (valid) {
      let rowList = JSON.parse(JSON.stringify(tableData.value.filter((item: any) => tableEl.value?.getSelectionRows().map((item: any) => item.index).includes(item.index))))
      let validStartTime = dayjs(batchSetupForm.validityPeriod[0]?.getTime()).format('YYYY-MM-DD HH:mm:ss')
      let validEndTime = dayjs(batchSetupForm.validityPeriod[1]?.getTime()).format('YYYY-MM-DD HH:mm:ss')
      let params = {
        validStartTime,
        validEndTime,
        explain: batchSetupForm.explain,
        cityId: rowList[0].cityId,
        companyId: rowList[0].serviceCompanyId,
        rows: rowList
      }
      console.log(params)
      let getItem = serverInterface(params, projectPriceBatch)
      getItem.then(res => {
        console.log(res)
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
    } else {
      batchSetupStatus.value = true
    }
  })

}
// 操作设置
const operation = (rowDate: any) => {
  defaultTime.value = [
    new Date(new Date().getTime() + 1000 * 60 * 5),
    new Date(2000, 2, 1, 0, 0, 0),
  ]
  console.log(defaultTime)
  settingsStatus.value = true
  row = rowDate
  informationTable.value = row
  let getItem = serverInterface({
    companyItemChangePriceId: row.companyItemChangePriceId,
    cityId: row.cityId,
    companyId: row.serviceCompanyId,
    serviceClassId: row.serviceClassId,
    serviceItemId: row.serviceItemId,
  }, getPriceItem)
  getItem.then(res => {
    settingsFormEl.value.resetFields()
    // 回显数据
    let data = res.data
    if (data.serviceFee) {
      settingsForm.rangeFeeMinAmt = 0
      settingsForm.rangeFeeMaxAmt = data.serviceFee
      settingsForm.fixedFeeAmt = undefined
    } else {
      settingsForm.rangeFeeMinAmt = data.rangeFeeMinAmt * 1
      settingsForm.rangeFeeMaxAmt = data.rangeFeeMaxAmt * 1
      settingsForm.fixedFeeAmt = data.fixedFeeAmt
    }
    settingsForm.serviceFeeType = data.serviceFeeType ? data.serviceFeeType + '' : '2'
    settingsForm.explain = data.changePriceReason
    if (data.changeStat) {
      settingsForm.changeStat = data.changeStat + ""
    } else {
      settingsForm.changeStat = "1"
    }
    let DateList = []
    if (data.validStartTime) {
      DateList.push(data.validStartTime)
      DateList.push(data.validEndTime)
    } else {
      DateList = []
    }
    settingsForm.validityPeriod = DateList
    console.log(settingsForm)
  })

}
// 设置改价校验
const settingsRules = reactive({
  changeStat: [{
    required: true, message: '改价状态不能为空！', trigger: 'blur'
  }],
  serviceFeeType: [{
    required: true, message: '改价类型不能为空！', trigger: 'blur'
  }],
  validityPeriod: [{
    required: true, message: '启用有效期不能为空！', trigger: 'blur'
  }],
  explain: [{
    required: true, message: '改价说明不能为空！', trigger: 'blur'
  }],
})
// 设置改价确认
const settingsConfirm = (settingsFormEl: any) => {
  console.log(row)
  settingsFormEl.validate((valid: any, fields: any) => {
    if (valid) {
      debugger
      if (settingsForm.serviceFeeType == 2) {
        if (settingsForm.rangeFeeMinAmt === '' || settingsForm.rangeFeeMinAmt === undefined || settingsForm.rangeFeeMinAmt === null) {
          ElMessage.error('价格最低值不能为空');
          return false
        }
        if (settingsForm.rangeFeeMaxAmt === '' || settingsForm.rangeFeeMaxAmt === undefined || settingsForm.rangeFeeMaxAmt === null) {
          ElMessage.error('价格最高值不能为空');
          return false
        }
      } else {
        if (settingsForm.fixedFeeAmt === '' || settingsForm.fixedFeeAmt === undefined || settingsForm.fixedFeeAmt === null) {
          ElMessage.error('价格固定值不能为空');
          return false
        }
      }
      let params = {
        companyItemChangePriceId: row.companyItemChangePriceId,
        companyId: row.serviceCompanyId,
        serviceItemId: row.serviceItemId,
        cityId: row.cityId,
        serviceClassId: row.serviceClassId,
        validStartTime: dayjs(settingsForm.validityPeriod[0]).format('YYYY-MM-DD HH:mm:ss'),
        validEndTime: dayjs(settingsForm.validityPeriod[1]).format('YYYY-MM-DD HH:mm:ss'),
        ...toRaw(settingsForm)
      }
      let getItem = serverInterface(params, priceChangeSetting)
      getItem.then(res => {
        if (res.code != 200) {
          ElMessage.error(res.message)
          return false
        }
        settingsStatus.value = false
        settingsFormEl.resetFields()
        onSubmit()
      })
    }
  })
}

// 启用禁用确认
const enableDisableConfirm = (type: Number) => {
  let rowList = JSON.parse(JSON.stringify(tableData.value.filter((item: any) => tableEl.value?.getSelectionRows().map((item: any) => item.index).includes(item.index))))
  let params = {
    cityId: rowList[0].cityId,
    companyId: rowList[0].serviceCompanyId,
    changeStat: type,
    rows: rowList
  }
  console.log(params)
  let getItem = serverInterface(params, enableDisable)
  getItem.then(res => {
    if (res.code != 200) {
      ElMessage.error(res.message)
      return false
    }
    ElMessage.success('成功')
    enableBulletFrame.value = false
    disabledStatus.value = false
    onSubmit()
  })
}
// 获取日志数据
const getLogList = () => {
  logForm.companyItemChangePriceId = row.companyItemChangePriceId
  let getItem = serverInterface({ ...toRaw(logForm) }, getChangeLog)
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
  // getChangeLog({
  //   ...toRaw(logForm)
  // }).then(res => {
  // })
}
// 导出
const confirmExport = () => {
  let parme = {
    ...toRaw(formData),
    validStartTime: validityPeriod.value && validityPeriod.value.length ? dayjs(validityPeriod.value[0]).format('YYYY-MM-DD HH:mm:ss') : undefined,
    validEndTime: validityPeriod.value && validityPeriod.value.length ? dayjs(validityPeriod.value[1]).format('YYYY-MM-DD HH:mm:ss') : undefined
  }
  delete parme.ecejPageSize
  delete parme.ecejCurrentPage
  let getItem = serverInterface(parme, setExport)
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
  if (val[0].getTime() < new Date().getTime()) {
    ElMessage.error('有效期开始时间无效')
    batchSetupForm.validityPeriod = []
    settingsForm.validityPeriod = []
    return false
  }
}
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
// 服务价格输入监听
watch([() => settingsForm.rangeFeeMinAmt, () => settingsForm.rangeFeeMaxAmt, () => settingsForm.fixedFeeAmt], (newDate, oldDate) => {
  console.log(newDate, oldDate)
  if (newDate[0] != oldDate[0]) {
    let value = newDate[0] + ''
    settingsForm.rangeFeeMinAmt = value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''
  }
  if (newDate[1] != oldDate[1]) {
    let value = newDate[1] + ''
    settingsForm.rangeFeeMaxAmt = value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''
  }
  if (newDate[2] != oldDate[2]) {
    let value = newDate[2] + ''
    settingsForm.fixedFeeAmt = value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''
  }
})
</script>

<style scoped lang="scss">
.block {
  width: 100%;
}

.wrap {
  padding: 20px;
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

