<template>
  <div id="app">
    <button @click="showViewer('1')">展示</button>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      list1: [
        'http://dn-p-tystore.qbox.me/p/chapter/attachment/e_bTeg-weA/EgfWEtftEBfs4BfuEg6uelu_JHH3HUD6I7HMet148BDq5uyiKgem4C2.jpg',
        'http://hbimg.b0.upaiyun.com/145298c2adcc1757b19d9849370d79bb88edaada5a796-wN5jaf_fw658',
        'http://www.jf258.com/uploads/2014-09-29/012939994.jpg',
        'http://img31.51tietu.net/pic/2016-120719/20161207194943n3oqafqlsde117165.jpg',
        'http://pic1.win4000.com/wallpaper/3/58f4672ad3c5c.jpg'
      ]
    };
  },
  methods: {
    showViewer(index) {
      this.$PreviewPic({
        zIndex: 2000,
        index: 2,
        list: this['list' + index],
        onClose: (i) => {
          console.log(i)
        },
        onSelect: (i) => {
          console.log(i)
        }
      })
    }
  }
};
</script>

<style>
</style>
