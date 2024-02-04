<template>
  <el-dialog
    v-model="dialogShow"
    title="查看未配置安装激励的商品"
    width="90%"
    :before-close="toggleDialogStatus"
  >
    <div>以下企业店铺商品未配置安装激励基础规则</div>
    <TableWithPagination
      :table-data="pageData.tableData"
      :table-total="pageData.total"
      :table-page-current-page="pageConfig.currentPage2"
      v-loading="pageData.loading"
      @page-change="tablePageChange"
      border
      max-height="300"
      style="width: 100%; margin-top: 15px"
    >
      <el-table-column property="materialNo" label="物料号" width="120" />
      <el-table-column property="goodsName" label="商品名称" />
      <el-table-column
        property="goodsType"
        label="商品类型"
        width="110"
        align="center"
      >
        <template #default="scope">
          {{
            scope.row.goodsType === 0
              ? '自采商品'
              : scope.row.goodsType === 1
              ? '直发代销'
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column property="skuNo" label="SKU编号" width="120" />
      <el-table-column
        property="price"
        label="商品单价(元)"
        width="105"
        align="center"
      >
        <template #default="scope">
          {{
            scope.row.goodsPrice || scope.row.goodsPrice === 0
              ? scope.row.goodsPrice
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column label="历史激励规则配置记录" width="180" align="center">
        <template #default="scope">
          {{ !scope.row.companyInstallExcitationRuleId ? '否' : '是' }}
        </template>
      </el-table-column>
    </TableWithPagination>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import TableWithPagination from '@/components/tableWithPagination/tableWithPagination.vue'
import { ViewExcitationGoods } from '@/webapi/goods-install'

const cityId = ref(null)
const companyId = ref(null)
const marketShopId = ref(null)
const commissionType = ref(null)
const goodsId = ref('')
const pageConfig = reactive({
  currentPage2: 1,
  pageSize2: 10,
  currentPage: 1,
  pageSize: 10
})
const tablePageChange = ({
  currentPage,
  pageSize
}: {
  currentPage: number
  pageSize: number
}) => {
  pageConfig.currentPage2 = currentPage
  pageConfig.pageSize2 = pageSize
  getList()
}
const pageData = reactive<{
  tableData: any[]
  loading: boolean
  total: number
}>({
  tableData: [],
  loading: false,
  total: 0
})
const getList = () => {
  pageData.loading = true
  ViewExcitationGoods({
    cityId: cityId.value,
    companyId: companyId.value,
    marketShopId: marketShopId.value,
    goodsId: goodsId.value,
    commissionType: commissionType.value,
    ...pageConfig
  }).then(res => {
    pageData.loading = false
    if (res.code === 200) {
      pageData.tableData = res.data.invalidGoodsExcitationRuleOutputs.list
      pageData.total = res.data.invalidGoodsExcitationRuleOutputs.total
    }
  })
}

const dialogShow = ref(false)
const toggleDialogStatus = (
  _cityId: number,
  _companyId: number,
  _marketShopId: number,
  _goodsId: string,
  _commissionType: number
) => {
  if (!dialogShow.value) {
    cityId.value = _cityId
    companyId.value = _companyId
    marketShopId.value = _marketShopId
    commissionType.value = _commissionType
    goodsId.value = _goodsId
    pageConfig.currentPage2 = 1
    getList()
  }
  dialogShow.value = !dialogShow.value
}
defineExpose({
  toggleDialogStatus
})
</script>

<style scoped lang="scss"></style>
