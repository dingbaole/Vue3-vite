<template>
  <div class="order-detail" v-if="!error && !loading && !errorData">
    <div class="card" v-if="orderCheckData.orderInfoRespDTO">
      <div class="title">下单信息</div>
      <div class="form-content">
        <div
          class="content-item"
          v-for="(value, key) in orderInfoRespDTOKeyOfField"
          :key="key"
        >
          <div class="content-item-block content-item-block__label">
            {{ value }}
          </div>
          <div class="content-item-block content-item-block__value">
            {{ orderCheckData.orderInfoRespDTO[key] ?? '--' }}
          </div>
        </div>
      </div>
    </div>
    <div class="card" v-if="orderCheckData.orderBookInfoRespDTO">
      <div class="title">预约信息</div>
      <div class="form-content form-content__3">
        <div
          class="content-item content-item__turn"
          v-for="(value, key) in orderBookInfoRespDTOKeyOfField"
          :key="key"
        >
          <div class="content-item-block content-item-block__label">
            {{ value }}
          </div>
          <div class="content-item-block content-item-block__value">
            {{ orderCheckData.orderBookInfoRespDTO[key] ?? '--' }}
          </div>
        </div>
      </div>
    </div>
    <div class="card" v-if="orderCheckData.orderHouseHoldInfoRespDTO">
      <div class="title">入户信息</div>
      <div class="form-content form-content__3">
        <div class="content-item">
          <div class="content-item-block content-item-block__label">
            上门时间
          </div>
          <div class="content-item-block content-item-block__value">
            <span v-if="orderCheckData.orderHouseHoldInfoRespDTO['arriveTime']">
              {{ orderCheckData.orderHouseHoldInfoRespDTO['arriveTime'] }}
              <span
                v-if="orderCheckData.orderHouseHoldInfoRespDTO.lateType === 1"
                >( <span style="color: #f56c6c">迟到</span> )</span
              >
            </span>
          </div>
        </div>
        <div class="content-item">
          <div class="content-item-block content-item-block__label">
            上门地点经纬度
          </div>
          <div class="content-item-block content-item-block__value">
            <span v-if="orderCheckData.orderHouseHoldInfoRespDTO['longitude']">
              {{ orderCheckData.orderHouseHoldInfoRespDTO['longitude'] }},
              {{ orderCheckData.orderHouseHoldInfoRespDTO['latitude'] }}
              (
              <span style="color: #409eff"
                >距离服务地址:
                {{ orderCheckData.orderHouseHoldInfoRespDTO['distance'] }}
                米</span
              >
              )
            </span>
            <span v-else>--</span>
          </div>
        </div>
        <div class="content-item">
          <div class="content-item-block content-item-block__label">
            入户师傅
          </div>
          <div class="content-item-block content-item-block__value">
            {{ orderCheckData.orderHouseHoldInfoRespDTO['empName'] }}/{{
              orderCheckData.orderHouseHoldInfoRespDTO['empMobile']
            }}
          </div>
        </div>
      </div>
      <div class="second-title" style="margin-top: 15px">
        <div style="font-size: 15px; font-weight: bold; margin-bottom: 10px">
          服务过程图片记录：
        </div>
        <ImageList
          v-for="(value, key) in images"
          :key="key"
          :title="ImagesTitleMap[key]"
          :images="value"
        />
        <!-- <div>现场全景图：</div>
        <div>
          <el-image
            style="width: 100px; height: 100px; margin-right: 15px"
            v-for="(src, index) in orderCheckData.orderHouseHoldInfoRespDTO
              .scenePanoramaImgList"
            :src="src"
            :key="src"
            :zoom-rate="1.2"
            :preview-src-list="
              orderCheckData.orderHouseHoldInfoRespDTO.scenePanoramaImgList
            "
            :initial-index="index"
            fit="cover"
          />
        </div>
        <div>现场情况：</div>
        <div>
          <el-image
            style="width: 100px; height: 100px; margin-right: 15px"
            v-for="(src, index) in orderCheckData.orderHouseHoldInfoRespDTO
              .sceneSituatioinImgList"
            :src="src"
            :key="src"
            :zoom-rate="1.2"
            :preview-src-list="
              orderCheckData.orderHouseHoldInfoRespDTO.sceneSituatioinImgList
            "
            :initial-index="index"
            fit="cover"
          />
        </div> -->
      </div>
      <div>
        服务完成时间：{{ orderCheckData.orderHouseHoldInfoRespDTO.endTime }}
      </div>
    </div>
    <div class="card" v-if="orderCheckData.orderHouseHoldImputaionInfoRespDTO">
      <div class="title">本次入户订单归集</div>
      <div class="desc">
        本次入户收款总金额:
        {{ orderCheckData.orderHouseHoldImputaionInfoRespDTO.orderTotalAmt }},
        (其中服务收费:
        {{ orderCheckData.orderHouseHoldImputaionInfoRespDTO.orderServiceAmt }},
        其中增值收费:
        {{
          orderCheckData.orderHouseHoldImputaionInfoRespDTO
            .orderAppreciationAmt
        }})
      </div>
      <div class="table">
        <el-collapse
          v-model="activeNames"
          v-for="(item, index) in orderCheckData
            .orderHouseHoldImputaionInfoRespDTO
            .orderHouseHoldImputaionDetailInfoRespDTOList"
          :key="index"
        >
          <el-collapse-item :name="index + 1">
            <template #title>
              <div class="table-title">
                <div class="left">
                  <span class="text">{{ item.workOrderNo }}</span>
                  <el-tag
                    style="margin-right: 15px"
                    v-if="item.marketFlag === 1"
                    >集市增值单</el-tag
                  >
                  <span class="text">{{ item.orderStatus }}</span>
                </div>

                <div>
                  <span>{{ item.cityName }}</span> |
                  <span>{{ item.companyName }}</span> |
                  <span>{{ item.stationName }}</span>
                </div>
              </div>
            </template>
            <el-table
              :data="item.orderHouseHoldImputaionItemInfoRespDTOList"
              :summary-method="getSummaries"
              show-summary
              style="width: 100%"
              border
              default-expand-all
            >
              <el-table-column type="expand">
                <template #default="props">
                  <div
                    style="padding-left: 47px"
                    v-if="
                      props.row.orderHouseHoldImputaionMaterialInfoRespDTOList
                        ?.length > 0
                    "
                  >
                    <el-table
                      :data="
                        props.row.orderHouseHoldImputaionMaterialInfoRespDTOList
                      "
                      :header-row-style="{ display: 'none' }"
                    >
                      <el-table-column label="服务/物料" prop="materialName" />
                      <el-table-column
                        label="保内保外标记"
                        width="110"
                        align="center"
                        prop="insuranceMark"
                      />
                      <el-table-column
                        label="单价"
                        width="60"
                        align="center"
                        prop="unitAmt"
                      />
                      <el-table-column
                        label="数量"
                        width="60"
                        align="center"
                        prop="num"
                      />
                      <el-table-column
                        label="应收金额"
                        width="90"
                        align="center"
                        prop="payableAmt"
                      />
                      <el-table-column
                        label="员工减免"
                        width="90"
                        align="center"
                        prop="empReductionAmt"
                      />
                      <el-table-column
                        label="实收金额"
                        width="90"
                        align="center"
                        prop="paidAmt"
                      />
                    </el-table>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="服务/物料" prop="itemName" />
              <el-table-column
                label="保内保外标记"
                width="110"
                align="center"
                prop="insuranceMark"
              />
              <el-table-column
                label="单价"
                width="60"
                align="center"
                prop="unitAmt"
              />
              <el-table-column
                label="数量"
                width="60"
                align="center"
                prop="num"
              />
              <el-table-column
                label="应收金额"
                width="90"
                align="center"
                prop="payableAmt"
                :index="item.totalPayableAmt"
              />
              <el-table-column
                label="员工减免"
                width="90"
                align="center"
                prop="empReductionAmt"
                :index="item.totalEmpReductionAmt"
              />
              <el-table-column
                label="实收金额"
                width="90"
                align="center"
                prop="paidAmt"
                :index="item.totalPaidAmt"
              />
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnCtx } from 'element-plus'
import type { OrderHouseHoldImputaionItemInfoRespDTO } from '@/webapi/houseHoldOrder'
import { ImagesTitleMap } from '@/webapi/houseHoldOrder'
import { useData } from './useData'
import ImageList from './imageList.vue'

const {
  init,
  orderCheckData,
  images,
  loading,
  error: errorData,
  orderBookInfoRespDTOKeyOfField,
  orderInfoRespDTOKeyOfField
} = useData()

const error = ref(false)
onMounted(async () => {
  const urlSearchParams = new URLSearchParams(location.search)
  if (urlSearchParams.get('workOrderNo')) {
    await init(urlSearchParams.get('workOrderNo'))
    error.value = false
  } else {
    error.value = true
    ElMessage({
      type: 'error',
      message: '缺少订单编号'
    })
  }
})

const activeNames = ref([1])

interface SummaryMethodProps<T = OrderHouseHoldImputaionItemInfoRespDTO> {
  columns: TableColumnCtx<T>[]
  data: T[]
}
const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 1) {
      sums[index] = '累计'
      return
    } else if (index === 5 || index === 6 || index === 7) {
      // 暂时将合计金额挂载到 el-table-column -> index 属性上，
      // 实际在现有数据结构下比较符合逻辑的处理应该将合计金额塞进 data 中
      sums[index] = column['index'] as unknown as string
      return
    }
  })

  return sums
}
</script>
<style scoped lang="scss">
.order-detail {
  padding: 10px;
  .card {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #fff;
    margin-bottom: 10px;
    .title {
      font-size: 18px;
      font-weight: bold;
    }
    .desc {
      margin: 15px 0;
      color: #666;
    }
    .form-content {
      margin-top: 12px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      // gap: 5px;
      &__3 {
        grid-template-columns: repeat(3, 1fr);
      }
      .content-item {
        display: flex;
        &-block {
          padding: 5px;
          border: 1px solid #eee;
          margin-left: -1px;
          margin-top: -1px;
          display: flex;
          align-items: center;
          &__label {
            border-right: 0;
            min-width: 90px;
            background-color: #f8f8f8;
          }
          &__value {
            flex: 1;
            word-break: break-all;
          }
        }
        &__turn {
          .content-item-block__label {
            border-right: 0;
            min-width: 100px;
            background-color: #f8f8f8;
          }
        }
      }
    }
    .table {
      .table-title {
        display: flex;
        .left {
          .text {
            display: inline-block;
            margin-right: 15px;
          }
          margin-right: 30px;
        }
      }
    }
  }
}
</style>
