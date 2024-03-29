<script lang="tsx">
import { ElCheckbox, ElTable, ElTableColumn } from 'element-plus'
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRef,
  toRefs,
  watch
} from 'vue'
import { defaultCheckboxWidth, getDataCount, getDataRow } from '.'
import Style from './index.module.css'
import type { CheckConfig } from '.'
import type { PropType, Ref } from 'vue'

export default defineComponent({
  props: {
    forwardRef: {
      type: Function as PropType<(ref: Ref) => void>
    },
    rowKey: {
      type: String,
      required: true
    },
    checkboxConfig: {
      type: Object as PropType<CheckConfig>
    },
    selection: {
      type: Boolean
    },
    checkRowKeys: {
      type: Array as PropType<string[]>
    },
    defaultCheckedRow: {
      type: Array as PropType<any[]>,
      required: true
    }
  },
  emits: ['rowClick', 'selectionChange', 'select'],
  setup(props, { emit, attrs, slots, expose }) {
    const dataCount = ref(0)
    const dataTableRef = ref<InstanceType<typeof ElTable>>()
    const selectionRows = ref<Map<string, any>>(new Map())
    const indeterminateRows = ref<Map<string, any>>(new Map())
    const tableSlots = reactive({ default: slots.default })
    const { 'tree-props': treeProps, data: tableData } = toRefs(attrs as any)
    const treeChildrenProp = toRef(treeProps.value, 'children')

    const setDeepCheck = (row: any, checked: string | number | boolean) => {
      const rowKey = row[props.rowKey]
      if (checked) {
        selectionRows.value.set(rowKey, row)
      } else {
        selectionRows.value.delete(rowKey)
      }
      row[treeChildrenProp.value]?.forEach((child: any) => {
        const rowKey = child[props.rowKey]
        const children = child[treeChildrenProp.value]
        if (checked) {
          selectionRows.value.set(rowKey, child)
        } else {
          selectionRows.value.delete(rowKey)
        }
        if (children) {
          children.forEach((child: any) => {
            setDeepCheck(child, checked)
          })
        }
      })
    }

    const clearSelection = () => {
      selectionRows.value.clear()
      indeterminateRows.value.clear()
    }

    onMounted(() => {
      props.defaultCheckedRow.forEach((row: any) => {
        selectionRows.value.set(row[props.rowKey], row)
      })

      if (props.selection) {
        if (!props.rowKey) {
          console.warn('please set the rowKey')
          return
        }
        tableSlots.default = () => {
          const columnsVNodes = slots.default!()
          columnsVNodes.unshift(
            <ElTableColumn
              className={Style['checkbox-column']}
              align="center"
              width={props.checkboxConfig?.width || defaultCheckboxWidth}
            >
              {{
                default: ({ row }: any) => {
                  const rowKey = row[props.rowKey]
                  const isChecked = selectionRows.value.has(rowKey)
                  const children = row[treeChildrenProp.value] as any[]
                  const checkRows = children?.filter(child =>
                    // 多层级需要处理
                    selectionRows.value.has(child[props.rowKey])
                  )
                  if (
                    checkRows &&
                    selectionRows.value.size > 0 &&
                    checkRows.length > 0 &&
                    checkRows.length < children.length
                  ) {
                    indeterminateRows.value.set(rowKey, row)
                  } else {
                    if (
                      checkRows?.length > 0 &&
                      checkRows?.length === children?.length
                    ) {
                      selectionRows.value.set(rowKey, row)
                    } else if (checkRows?.length === 0) {
                      selectionRows.value.delete(rowKey)
                    }
                    indeterminateRows.value.delete(rowKey)
                  }

                  return (
                    <ElCheckbox
                      modelValue={isChecked}
                      indeterminate={indeterminateRows.value.has(
                        row[props.rowKey]
                      )}
                      onChange={value => {
                        setDeepCheck(row, value)
                      }}
                    />
                  )
                },
                header: () => {
                  const isIndeterminateRows =
                    selectionRows.value.size > 0 &&
                    selectionRows.value.size < dataCount.value

                  const isChecked =
                    selectionRows.value.size > 0 &&
                    selectionRows.value.size === dataCount.value

                  return (
                    <ElCheckbox
                      class={Style['header-cell']}
                      modelValue={isChecked}
                      indeterminate={isIndeterminateRows}
                      onChange={value => {
                        tableData.value.forEach((row: any) => {
                          setDeepCheck(row, value)
                        })
                      }}
                    />
                  )
                }
              }}
            </ElTableColumn>
          )
          return columnsVNodes
        }
      }
    })

    watch(
      tableData,
      async () => {
        dataCount.value = await getDataCount(
          tableData.value,
          treeChildrenProp.value
        )
      },
      { immediate: true }
    )

    watch(
      () => props.checkRowKeys,
      () => {
        props.checkRowKeys?.forEach(key => {
          const row: any = getDataRow(
            key,
            tableData.value,
            props.rowKey,
            treeChildrenProp.value
          )
          selectionRows.value.set(row[props.rowKey], row)
          console.log(selectionRows.value)
        })
      },
      { immediate: true, flush: 'post' }
    )

    // watch(defaultCheckedRow, () => {
    //   defaultCheckedRow.value.forEach((row: any) => {
    //     selectionRows.value.set(row[props.rowKey], row);
    //   });
    // })

    watch(tableData, () => {
      props.defaultCheckedRow.forEach((row: any) => {
        selectionRows.value.set(row[props.rowKey], row)
      })
      console.log(props.defaultCheckedRow)

      console.log('-----', selectionRows.value)

      // const setCheckFileSelection = (children: any[]) => {
      //   if (children) {
      //     children.forEach((child) => {
      //       const rowKey = child[props.rowKey];
      //       const checkFileValue = child[props.checkboxConfig!.checkField];
      //       if (checkFileValue) {
      //         selectionRows.value.set(rowKey, child);
      //       } else {
      //         selectionRows.value.delete(rowKey);
      //       }

      //       const children = child[treeChildrenProp.value];
      //       setCheckFileSelection(children);
      //     });
      //   }
      // };

      // setCheckFileSelection(tableData.value);
    })

    watch(
      selectionRows,
      (newValue: Map<string, any>, oldValue: Map<string, any>) => {
        const selection = [...newValue.values()]
        const oldSelection = [...oldValue.values()]
        const checkRow = selection.find(role => !selectionRows.value.has(role))
        const cancelRow = oldSelection.filter(role => !selection.includes(role))
        if (checkRow) {
          emit('selectionChange', {
            selection,
            row: checkRow,
            checked: true
          })
        } else if (cancelRow) {
          emit('selectionChange', {
            selection,
            row: cancelRow,
            checked: false
          })
        }
      },
      {
        deep: true
      }
    )

    expose({ clearSelection })

    return () => (
      <ElTable
        {...attrs}
        rowKey={props.rowKey}
        tableLayout="fixed"
        height="100%"
        width="100%"
        default-expand-all
        ref={(ref: any) => {
          dataTableRef.value = ref as any
          props.forwardRef?.(ref)
        }}
      >
        {tableSlots}
      </ElTable>
    )
  }
})
</script>

<style lang="css" scoped>
.checkbox-column {
  display: flex;
  justify-content: center;
}
</style>
