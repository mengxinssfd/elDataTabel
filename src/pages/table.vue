<template>
  <div class="pg-table">
    <!--<img class="home-img" :src="$store.state.meta.homePageImg" alt="homeImg" />-->
    <my-table
      :url="url"
      :columns="columns"
      :searchForm="searchForm"
      :beforeSearch="beforeSearch"
      :hasView="true"
      :hasEdit="true"
      :hasOperation="true"
      :tableAttrs="{cellClassName: tableColumnClassName}"
      :form="form"
      :extraButtons="extraButtons"
      :operationAttrs="operationAttrs"
      :formAttrs="formAttrs"
      :onNew="onNew"
      :onEdit="onEdit"
      :onDelete="onDelete"
    >
    </my-table>
  </div>
</template>

<script>
import {formatDate} from '../const/filter'
import myTable from '../components/my-tabel'

export default {
  components: {
    myTable
  },
  data() {
    return {
      url: '/api/getAllList',
      columns: [
        {type: 'selection' /*selectable: (row, index) => index > 0*/},
        {prop: 'name', label: '组件名称'},
        {prop: 'type', label: '分类'},
        {prop: 'version', label: '版本'},
        {prop: 'language', label: '开发语言'},
        {
          prop: 'time',
          label: '最后更新时间',
          formatter: row => formatDate(+row.time || 0, 'YYYY-MM-DD')
        },
        {
          prop: 'status',
          label: '状态'
        }
      ],
      searchForm: [
        {
          $type: 'input',
          $id: 'name',
          label: '组件名称',
          $el: {placeholder: '请输入'}
          //            rules: [{required: true, trigger: 'blur', whitespace: true}]
        },
        {
          $type: 'select',
          $id: 'type',
          label: '分类',
          $options: [],
          $el: {placeholder: '请选择'}
        },
        {
          $type: 'select',
          $id: 'status',
          label: '状态',
          $options: [],
          $el: {placeholder: '请选择'}
          //            rules: [{required: true, trigger: 'blur', whitespace: true}]
        }
      ],
      extraButtons: [
        {
          type: '',
          getText({row}) {
            return row.status === '上架' ? '下架' : '上架'
          },
          // row 是单行的数据
          atClick: row => {
            return this.$axios.post('/api/updateStatus', {
              id: row.id,
              status: row.status === '下架' ? '上架' : '下架'
            })
          }
        }
      ],
      formAttrs: {
        'label-width': '100px'
      },
      form: [
        {
          $type: 'input',
          $id: 'name',
          label: '组件名',
          $el: {
            placeholder: '请输入'
          },
          rules: [
            {
              required: true,
              message: '请输入组件名',
              trigger: 'blur'
            }
          ]
        },
        {
          $type: 'select',
          $id: 'type',
          label: '分类',
          $el: {
            placeholder: '请选择'
          },
          $options: [],
          rules: [
            {
              required: true,
              message: '请选择分类',
              trigger: 'blur'
            }
          ]
        },
        {
          $type: 'input',
          $id: 'version',
          label: '版本',
          $el: {
            placeholder: '请输入版本号'
          },
          rules: [
            {
              required: true,
              message: '请输入版本',
              trigger: 'blur'
            }
          ]
        },
        {
          $type: 'input',
          $id: 'language',
          label: '开发语言',
          $el: {
            placeholder: '请输入开发语言'
          },
          rules: [
            {
              required: true,
              message: '请输入开发语言',
              trigger: 'blur'
            }
          ]
        },
        {
          $type: 'select',
          $id: 'status',
          label: '状态',
          $options: [],
          $el: {
            placeholder: '请选择'
          },
          rules: [
            {
              required: true,
              message: '请选择状态',
              trigger: 'blur'
            }
          ]
        }
      ],
      operationAttrs: {
        width: '300px',
        fixed: 'right'
      },
      beforeSearch: () => {
        this.url = '/api/search'
        return Promise.resolve()
      }
    }
  },

  methods: {
    tableColumnClassName({row, column}) {
      if (column.property === 'status' && row.status === '上架') return 'up'
      return ''
    },
    onCustomButtonsClick(fn, parameter) {
      if (!fn) return

      this.customButtonsLoading = true

      fn(parameter)
        .then(flag => {
          if (flag === false) return
          this.getList()
        })
        .catch(e => {})
        .finally(e => {
          this.customButtonsLoading = false
        })
    },
    async getConfig() {
      let data = await this.$axios.$get(`/api/getConfig`)
      let searchFormType = this.searchForm.find(i => i.$id === 'type')
      let searchFormStatus = this.searchForm.find(i => i.$id === 'status')
      let formType = this.form.find(i => i.$id === 'type')
      let formStatus = this.form.find(i => i.$id === 'status')

      data.typeList.forEach(i => {
        let obj = {label: i, value: i}
        searchFormType.$options.push(obj)
        formType.$options.push(obj)
      })
      data.statusList.forEach(i => {
        let obj = {label: i, value: i}
        searchFormStatus.$options.push(obj)
        formStatus.$options.push(obj)
      })
    },
    onEdit(data, row) {
      data.id = row.id
      console.log(data, row)
      return this.$axios.post('/api/update', data)
    },
    onNew(data, row) {
      console.log(data, row)
      return this.$axios.post('/api/create', data)
    },
    onDelete(selected) {
      return this.$axios.post('/api/delete', {
        data: selected.map(v => v.id)
      })
    }
  },

  mounted() {
    this.getConfig()
  }
}
</script>
<style lang="stylus">
tr {
  td.up {
    color: lime;
  }
}
</style>
