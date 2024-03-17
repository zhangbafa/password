<template>
  <div>
    <div class="top">
      <div style="padding-right: 10px">
        <a-space>
          <a-button 
          size="medium"
          type="primary"
          @click="handleCreate">
            <template #icon>
              <icon-plus-circle />
            </template>
            <template #default>
              新增
            </template>
            </a-button>
          <a-divider direction="vertical" v-if="selectAll && category=='home'"/>
          <a-button 
                    status="danger"
                    @click="handleCancelDelete"
                    type="outline"
                    size="medium"
                    shape="round"
                    v-if="selectAll">
                    
                    <template #default>
                      取消删除
                    </template>
                  </a-button>
          <a-button type="primary"
                    status="danger"
                    shape="round"
                    size="medium"
                    @click="handleDelete"
                    v-if="selectAll">
                    
                   
                    <template #icon>
                      <icon-delete />
            </template>
            <template #default>删除所选</template>
          </a-button>
          
        </a-space>
      </div>
      <div>
        <a-space>
        <a-input-search round
        v-if="category!=='recycle'"
        @press-enter="handlerSearch"
        @clear="handlerSearch"
        @search="handlerSearch"
        :style="{ width: '210px' }"
        placeholder="请输入平台或账号搜索"
        search-button
        v-model="keyword"
        allow-clear
        shape="round"
        size="large">
        <template #button-icon>
          <icon-search/>
        </template>
        <!-- <template #button-default>
          搜索
        </template> -->
      </a-input-search>
    </a-space>
      </div>
      
    </div>
    <a-table 
     :loading="loading"
     :columns="columns"
     :data="data.list"
     row-key="id"
     size="large"

     :row-selection="rowSelection"
     :pagination="pagination"
     @page-change="onPageChange"
     @selection-change="handlerSelectionChange"
     v-model:selected-keys="selectedKeys"
            >
            <template #platform="{ record }">
              <span :class={collect:record.collect} class="bold">
                {{ record.platform }}
              </span>
            </template>
            
            <template #collect="{ record }" v-if="category!=='recycle'">
              <a-space @click="handlerCollect(record)" style="cursor: pointer;padding:5px;">
                <icon-star-fill size="20" v-if="record.collect==1" :style="{color:'rgb(var(--primary-5))'}"  :class="{scaleSpring:record.collect>=0}"/>
                <icon-star size="20" v-else :class="{scaleSpring:record.collect>=0}"/>
              </a-space>
            </template>
      <template #optional="{ record }" v-if="category!=='recycle'">
        <a-space >
          <a-button style="font-size:12px;" @click="handleCopyPassword(record)" size="small" shape="round" type="outline">
            <template #icon>
              <icon-copy/> 
            </template>
            <template #default>复制该密码</template>
          </a-button>
          <a-button 
            @click="handlerEdit(record)" 
            type="primary" size="small" shape="round"
            style="font-size:12px;"
            >
            <template #icon>
              <icon-edit />
            </template>
            <template #default>编辑</template>
          </a-button>
        </a-space>
      </template>

    </a-table>
    <a-modal v-model:visible="visible"
             @ok="handleOk"
             @cancel="handleCancel"
             width="380px"
             :simple="false"
             title-align="start">
      <template #title>
        操作
      </template>
      <strong style="font-size: 16px">是否确认删除</strong>
      <div class="delete-tips">删除后，可在回收站中选择恢复</div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive,watch } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { Message } from '@arco-design/web-vue'
import useLoading  from '../../hooks/loading.js'
import { readonly } from 'vue';
import { shallowRef } from 'vue';
const { loading, setLoading } = useLoading(true);

const show = ref(true)
const data = reactive({ list: null })
const category = ref('')
const route = useRoute()
category.value = route.meta.type 
// console.log(`route:${route.meta.type}`)
const cateid = ref('')
const basePagination = {
    current: 1,
    pageSize: 10,
    meta: route.meta.type
  };
  const pagination = reactive({
    ...basePagination,
  });


const type = route.meta.type
const fetchData =  async (
    params = { current: 1, pageSize: 10,meta:type}
  ) => {
    setLoading(true);
    try {
      const response  = await  window.mpwd.list(params)
        data.list = response.list
        pagination.current = params.current;
        pagination.total = response.total;
      // console.log(ewa)
      
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData()
  const keyword = ref("")
  const handlerSearch = () => {
      fetchData(Object.assign(basePagination,{keyword:keyword.value}));
  };

const onPageChange = (current) => {
  console.log(current)
  const a={ ...pagination, current }
  console.log(a)
    fetchData({ ...pagination, current });
  };
const columns = [{
  title: '平台',
  slotName: 'platform',
  width: 220,
  ellipsis: true,
  tooltip: true,
}, {
  title: '账号',
  dataIndex: 'account',
  ellipsis: true,
  tooltip: true,
  width: 230
},
{
  title: '收藏',
  slotName: 'collect',
  width: 80
}, {
  title: '操作',
  slotName: 'optional',
  // width: 160
}];

const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
});

// 复制密码
const handleCopyPassword = async (record) => {
  const checkPassword = await window.mpwd.auth()
  if(!checkPassword){
    Message.error("请先设置主密码")
    return
  }
  const password = await window.mpwd.encryptPassword(record.hash_password)
  if(password.code==200){
    navigator.clipboard.writeText(password.data)
    Message.success(password.message)
  }else{
    Message.error(password.message)
  }
}

// 全选
const selectAll = ref(false)
const selectedKeys = shallowRef([])
const handlerSelectionChange = (rows) => {
  rows.length > 0 ? selectAll.value = true : selectAll.value = false
  selectedKeys.value = rows
}
const visible = ref(false)
const handleOk = async () => {
    const response = await window.mpwd.delete(selectedKeys.value)
    if(response.code===200){
      fetchData()
      Message.info(response.message)
    }
  };
const handleCancel = () => {
  Message.info("取消删除")
}
const handleDelete = async () => {
  visible.value = true
}
const handleCancelDelete = () => { 
  selectAll.value = false 
  selectedKeys.value = []
}

const router = useRouter()
const handleCreate = async () => {
  const checkPassword = await window.mpwd.auth()
  if(!checkPassword){
    Message.info("请先设置主密码")
    return false
  }
  router.push({
    name: 'passwordcreate'
  })
  
}

const handlerEdit = async  (record) => {
  const checkPassword = await window.mpwd.auth()
  if(!checkPassword){
    Message.info("请先设置主密码")
    return false
  }
  
  router.push({
    name:'passwordcreate',
    query:{
      id: record.id
    }
  })
}

const disabled = ref(false)
const handlerCollect = async (record)=>{
  let collect = record.collect==1?0:1
  const response = await window.mpwd.collect({collect:collect,id:record.id})
  if(response.changes===1){
    disabled.value = true
    const message = collect==1?'收藏成功':'取消成功'
    Message.success(message)
    record.collect = !record.collect
  }
  
}
</script>


<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 3px 0;
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

.bold{
  /* text-transform: uppercase; */
}
.collect{
  color: rgb(var(--arcoblue-6));
}
.delete-tips{
  color: var(--color-neutral-6);
  font-size: 12px;
}
</style>