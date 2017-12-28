<template>
  <div id="app">
    <!-- 音乐播放详情  显示cd页 -->
    <player></player>

    <!-- 底部列表页 -->
    <music-list></music-list>
  </div>
</template>

<script>
  import Player from 'components/player/player.vue'
  import MusicList from 'components/musiclist/musiclist.vue'
  import {mapActions,mapGetters,mapMutations} from 'vuex'
  import axios from 'axios'
  export default {
    name: 'app',
    created(){
      let url = 'https://www.yingshangyan.com/api/music/getList';
      let url1 = 'https://www.yingshangyan.com/api/music/getPlay';

      new Promise((resolve, reject) => {
          axios.get(url).then((res) => {
            let songid = res.data.data[this.currentIndex].song_id
            this.set_playList(res.data.data)
            resolve(songid)
          })
      }).then(result => {
          console.log(result)
          return new Promise((resolve, reject) => {
            axios.get(url1+'?songid='+result).then((res) => {
              resolve(res.data)
            })
          })
      }).then(result => {
        console.log(result.data.file_link);
        this.setCurrentSongLink('https://www.yingshangyan.com/static/theme/default/img/%E6%B5%B7%E9%98%94%E5%A4%A9%E7%A9%BA.mp3')
      })

      // this.$axios.get(url).then((res) => {
      //   if(res.data.code === 200){
      //     this.set_playList(res.data.data)
      //     let songid = res.data.data[0].song_id
      //     this.$axios.get(url1,{
      //       params:{
      //         songid
      //       }
      //     }).then((res) => {
      //       console.log(res.data.data.file_link)
      //       this.set_currentSong(res.data.data.file_link);
      //     })
      //   }
      // })


      // axios.get(url).then((res) => {
      //   let id = res.data.id
      //   axios.get(url1,{
      //     params:{
      //       id
      //     }
      //   }).then((res) => {
      //     console.log(res.data)
      //   })
      // })

      // new Promise((resolve, reject) => {
      //     axios.get(url).then((res) => {
      //       let id = res.data.id
      //       resolve(id)
      //     })
      // }).then(result => {
      //     console.log(result)
      //     return new Promise((resolve, reject) => {
      //       axios.get(url1,{
      //         params:{
      //           id:result
      //         }
      //       }).then((res) => {
      //         resolve(res.data)
      //       })
      //     })
      // }).then(result => {
      //     console.log(result)
      // })


    },
    data(){
      return {
        cursong:'',
        img:''
      }
    },
    computed:{
      ...mapGetters([
        'currentIndex'
      ])
    },
    methods:{
      ...mapActions([
        'set_playList',
        'set_currentSongLink'
      ]),
      ...mapMutations({
        setCurrentSongLink:'SET_CURRENT_SONG_LINK'
      })
    },
    components:{
      Player,
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  
</style>
