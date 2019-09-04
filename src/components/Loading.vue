<template>
  <div
    v-show="loading"
    class="loading"
  >
    <div class="wrapper center">
      <a-spin>
        <a-icon
          slot="indicator"
          type="loading"
          style="font-size: 30px"
          spin
        />
      </a-spin>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Loading',
    props: {
      loading: {
        type: [Boolean, String],
        default: false
      }
    }
  }
</script>

<style scoped>

</style>
