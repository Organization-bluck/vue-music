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
            this.setSequenceList(res.data.data)
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
        this.setCurrentSongLink(result.data.file_link)
        // this.setCurrentSongLink('https://www.yingshangyan.com/static/theme/default/img/%E6%B5%B7%E9%98%94%E5%A4%A9%E7%A9%BA.mp3')
      })

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
      ]),
      ...mapMutations({
        setCurrentSongLink:'SET_CURRENT_SONG_LINK',
        setSequenceList:'SET_SEQUENCE_LIST'
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
