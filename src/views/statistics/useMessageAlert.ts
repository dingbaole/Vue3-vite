import { h } from 'vue'
import { ElMessageBox, ElTable, ElTableColumn } from 'element-plus'
interface ErrorMessageData {
  mobileNo: string
  nowPromoterName: string
  oldPromoterName: string
}
export const useMessageAlert = (errorMessageData: ErrorMessageData[]) => {
  ElMessageBox({
    message: h('div', null, [
      h(
        'div',
        {
          style: {
            marginBottom: '10px'
          }
        },
        [
          h(
            'div',
            {
              style: {
                fontSize: '15px',
                fontWeight: 'bold'
              }
            },
            '当前使用以下手机号录入姓名，与之前录入的姓名不符！'
          ),
          h(
            'div',
            {
              style: {
                fontSize: '12px',
                marginTop: '2px'
              }
            },
            '（如需变更姓名，请联系区域支持协助处理！）'
          )
        ]
      ),
      h(
        ElTable,
        {
          data: errorMessageData,
          border: true
        },
        [
          h(ElTableColumn, {
            property: 'mobileNo',
            label: '手机号'
          }),
          h(ElTableColumn, {
            property: 'oldPromoterName',
            label: '上次录入的人员姓名'
          }),
          h(ElTableColumn, {
            property: 'nowPromoterName',
            label: '当前录入的人员姓名'
          })
        ]
      )
    ]),
    title: '温馨提示',
    confirmButtonText: '关闭',
    customStyle: {
      maxWidth: '500px'
    }
  })
}
