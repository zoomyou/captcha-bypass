<template>
  <div v-bind:style="{width: widthData, height: heightData}" class="act-form">
    <!-- iframe 测试 -->
    <!-- <iframe :src="src" height="100%" width="100%"></iframe> -->

    <img src="@/assets/logo.png" @load="getStyle"/>
  </div>
</template>

<script>

export default {
  data () {
    return {
      widthData: '',
      heightData: '',
      src: ''
    }
  },

  methods:{
    getStyle(event){
      let w = event.target.width
      let h = event.target.height
      this.widthData = w + "px"
      this.heightData = h + "px"
      console.log("width and height are " + w + "," + h)
    }
  }
  
  
  
}
</script>


<style scoped>
.act-form{
  /* height: 100%;
  width: 100%; */
}

</style>