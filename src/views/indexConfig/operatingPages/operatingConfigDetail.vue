<template>
  <detail v-bind:operation_pages_id="operation_pages_id" listUrl="/indexConfig/operatingConfigList"></detail>
</template>
<script>
  import detail from '../components/detail.vue'
  export default {
    components: { detail },
    data () {
      return {
        operation_pages_id: ''
      }
    },
    created () {
      this.operation_pages_id = this.$route.query.operation_pages_id
    },
    methods: {
    }
  }
</script>
