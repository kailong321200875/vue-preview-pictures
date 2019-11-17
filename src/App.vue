<template>
  <div id="app">
    <button @click="showViewer('1')">图集1</button>
    <button @click="showViewer('2')">图集2</button>
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
      ],
      list2: [
        'http://uploads.xuexila.com/allimg/1612/804-161206153303.jpg',
        'http://dik.img.kttpdq.com/pic/2/1111/70283902b35b3cb2.jpg',
        'http://p.qpic.cn/dnfbbspic/0/dnfbbs_dnfbbs_dnf_gamebbs_qq_com_forum_201910_17_082503ztpxsgizux3qwxsk.jpg/0',
        'http://www.07073.com/uploads/150413/17598486_144058_1.jpg'
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
      });
    }
  }
};
</script>

<style>
</style>
