<template>
  <list :operation_pages_id="operation_pages_id" detailUrl="/indexConfig/operatingConfigDetail"></list>
</template>

<script>
  import list from '../components/list.vue'
  export default {
    name: 'unlineBusinessList',
    data () {
      return {
        operation_pages_id: ''
      }
    },
    components: { list },
    created () {
      this.operation_pages_id = this.$route.query.operation_pages_id
    }
  }
</script>
