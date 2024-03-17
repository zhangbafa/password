<template>
  <div>
    <div class="top" v-if="selectedKeys.length>0">
      <div style="padding-right: 10px">
        <a-space>
          <a-button 
                    status="danger"
                    @click="handleCancelDelete"
                    type="outline"
                    size="medium"
                    shape="round"
                    v-if="selectAll">取消删除</a-button>
                    <a-divider direction="vertical" v-if="selectAll"/>
          <a-button type="primary"
                    status="danger"
                    shape="round"
                    size="medium"
                    @click="handlePermanentlyDelete"
                    v-if="selectAll">
                    <template #icon>
                      <icon-delete />
                    </template>
                    <template #default>
                      彻底删除
                    </template>
                    
                  </a-button>
        </a-space>
      </div>
    </div>
    <a-table 
             :loading="loading"
             :columns="columns"
             :data="data.list"
             row-key="id"
             :row-selection="rowSelection"
             :pagination="pagination"
             @page-change="onPageChange"
             @selection-change="handlerSelectionChange"
             v-model:selected-keys="selectedKeys"
            >
      <template #optional="{ record }">
        <a-space >
          <a-button @click="handleRestore(record)" type="primary" status="primary">恢复</a-button>
        </a-space>

      </template>

    </a-table>

    <a-modal v-model:visible="visible"
             @ok="handleOk"
             @cancel="handleCancel"
             width="280px"
             title-align="start">
      <template #title>
        操作
      </template>
      <b>是否确认删除</b>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, shallowRef } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { Message } from '@arco-design/web-vue'
import useLoading  from '../../hooks/loading.js'
const { loading, setLoading } = useLoading(true);

const show = ref(true)
const data = reactive({ list: null })
const category = ref('')
const route = useRoute()
category.value = route.meta.type ??
console.log(`route:${route.meta.type}`)
const basePagination = {
    current: 1,
    pageSize: 10,
    meta: route.meta.type
  };
  const pagination = reactive({
    ...basePagination,
  });
 
const type = route.meta.type
const fetchData = async (
    params = { current: 1, pageSize: 10,meta:type }
  ) => {
    setLoading(true);
    console.log(params)
    try {
      const response = await window.mpwd.list(params)
      data.list = response.list
      pagination.current = params.current;
      pagination.total = response.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData()
  const keyword = ref("")
  const handlerSearch = () => {
    if(keyword.value){
      fetchData(Object.assign(basePagination,{keyword:keyword.value}));
    }
  };

const onPageChange = (current) => {
  console.log(current)
  const a={ ...pagination, current }
  console.log(a)
    fetchData({ ...pagination, current });
  };
const columns = [{
  title: '平台',
  dataIndex: 'platform',
}, {
  title: '账号',
  dataIndex: 'account',
}, {
  title: '操作',
  slotName: 'optional',
  width: '100'
}];

const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
});


// 全选
const selectAll = ref(false)
const selectedKeys = shallowRef([])
const handlerSelectionChange = (rows) => {
  rows.length > 0 ? selectAll.value = true : selectAll.value = false
  selectedKeys.value = rows
}
const visible = ref(false)

const handleCancel = () => {
  Message.info("取消删除")
}
const handlePermanentlyDelete = async () => {
  visible.value = true
}
const handleCancelDelete = () => { 
  selectAll.value = false 
  selectedKeys.value = []
}

const handleOk = async () => {
    const response = await window.mpwd.permanentlyDelete(selectedKeys.value)
    console.log(response)
    if(response.changes>=1){
      fetchData()
      Message.info(response.message)
    }
};

const handleRestore = async (record) => {
    const response = await window.mpwd.restore({id:record.id})
    console.log(response)
    if(response.changes===1){
      fetchData()
      Message.info('恢复成功')
    }
};
</script>


<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.scaleSpring {
  animation: scaleSpring 0.8s;
}
@keyframes scaleSpring {
  0% {
    opacity: .5;
    transform: scale(.5);
  }
  80% {
      opacity: .8;
      transform: scale(1.1);
  }
  100% {
      opacity: 1;
      transform: scale(1);
  }
}

</style>