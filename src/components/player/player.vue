<template>
  <transition name="sliderUpHideRight">
    <div class="player">
      
      <div class="filterbg" :style="{backgroundImage : 'url(' + this.currentSongMeg.picture + ')', backgroundSize : 'cover', backgroundPosition : 'center center'}"></div>
      
      <div class="player-content">
        
        <div class="content-header">
          <i class="icon icon-back"></i>
          <div class="header-top">
            <p class="song-name">{{currentSongMeg.title}}</p>
            <p class="singer">{{currentSongMeg.author}}</p>
          </div>
          <i class="icon icon-share"></i>
        </div>
        
        <transition name="fade">
          <div class="cd-wrapper" v-show="cdShow" @click="isShowCD(false)">
            <div class="swith-line">
              <div class="triger" :class="playing ? '' : 'pause'"></div>
            </div>
            <div class="cd animate" :class="[playing ? 'play' : 'pause']">
              <div class="cd-bg"></div>
              <img :src="currentSongMeg.picture" alt="歌曲cd封面" class="cover-img">
            </div>
          </div>
        </transition>
        
        <transition name="fade">
          <div class="lyric" v-show="!cdShow" @click="isShowCD(true)">
            <div class="volume-wrapper">
              <div class="volume">
                <i class="rangeicon icon-volume-medium"></i>
                <div class="range">
                  <range range-type="volume" ball-width="12" current-color="rgba(255,255,255,0.8)" @percentChange="onVolumeBarChange"></range>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <div class="song-tools">
          <i class="icon icon-like" :class="getFavoriteIcon(currentSongMeg)" @click.stop="toggleFavorite(currentSongMeg)"></i>
          <i class="icon icon-download"></i>
          <i class="icon icon-msg"></i>
          <i class="icon icon-search"></i>
        </div>
        
        <div class="progress-wrapper">
          <div class="progress-box">
            <span class="current-time">{{format(currentTime)}}</span>
            <div class="progress-range">
              <range :percent="percent" @percentChange="onProgressBarChange"></range>
            </div>
            <span class="duration">{{format(duration)}}</span>
          </div>
        </div>

        <div class="content-footer">
          <div class="icon-btn">
            <i class="icon-mode" :class="musicPlayType" @click.stop="setPlayType"></i>
          </div>
          <div class="icon-btn">
            <i class="icon icon-prevdetail" @click.stop="prev"></i>
          </div>
          <div class="icon-btn">
            <i class="icon playPause" :class="playCls" @click.stop="toggle"></i>
          </div>
          <div class="icon-btn">
            <i class="icon icon-nextdetail" @click.stop="next"></i>
          </div>
          <div class="icon-btn">
            <i class="icon icon-list-music" @click="musicListShow"></i>
          </div>
        </div>

      </div>
      <!-- 音频 -->
      <audio id="myaudio" :src="currentSongLink" ref="audio" @timeupdate="updateTime" @canplay="ready" @ended="end"></audio>
    </div>


  </transition>
</template>

<script>
  import Range from 'components/range/range.vue'
  import {mapGetters,mapMutations,mapActions} from 'vuex'
  import axios from 'axios'
  import {shuffle} from 'common/js/util.js';
  import {modeMixin} from 'common/js/mixin'
  const url1 = 'https://www.yingshangyan.com/api/music/getPlay';
  export default {
    mixins: [modeMixin],
    name: 'player',
    data(){
      return {
        songReady:false,
        currentTime:0,
        duration:0,
        cdShow:true,
      }
    },
    computed:{
      percent(){
        return this.currentTime / this.duration
      },
      playCls(){
        return this.playing ? 'icon-pause-detail' : 'icon-playdetail'
      },
      ...mapGetters([
        'playList',
        'sequenceList',
        'playing',
        'mode',
        'currentIndex',
        'currentSongLink',
        'currentSongMeg',
        'favoriteList'
      ]),
      musicPlayType(){
        return this.mode === 0 ? 'icon-music-shunxu' : this.mode === 1 ? 'icon-music-danqu1' : 'icon-music-random'
      }
    },
    methods:{
      ...mapActions([
        'saveFavoriteList',
        'deleteFavoriteList'
      ]),
      ...mapMutations({
        setMusicListShow:'SET_SHOW_LIST',
        setPlayingState:'SET_PLAYING_STATE',
        setCurrentIndex:'SET_CURRENT_INDEX',
        setMode:'SET_PLAY_MODE',
        setCurrentSongLink:'SET_CURRENT_SONG_LINK',
        setScrollTop:'SET_SCROLL_TOP',
        setFavoriteList:'SET_FAVORITE_LIST',
        setPlayList:'SET_PLAYLIST'
      }),
      musicListShow(){
        let scrollTop = (this.currentIndex + 1 - 3) * 42
        console.log(scrollTop)
        this.setScrollTop(scrollTop)
        this.setMusicListShow(true)
      },
      isShowCD (flag) {
        this.cdShow = flag
      },
      toggle(){
        this.playing ? this.setPlayingState(false) : this.setPlayingState(true)
      },
      updateTime(e){
        this.currentTime = e.target.currentTime
      },
      ready(){
        this.duration = this.$refs.audio.duration
      },
      end(){
        if(this.mode === 1){
          this.$refs.audio.currentTime = 0;
          this.$refs.audio.play()
        }else{
          this.next();
        }
      },
      onProgressBarChange(percent){
        this.$refs.audio.currentTime = this.$refs.audio.duration * percent
      },
      onVolumeBarChange(percent){
        this.$refs.audio.volume = percent
      },
      
      prev(){
        let index = this.currentIndex - 1;
        if(index === -1){
          index = this.playList.length - 1;
        }
        this.getCurrentSong(index);
        this.setCurrentIndex(index);
      },
      next(){
        let index = this.currentIndex + 1;
        if(index === this.playList.length){
          index = 0;
        }
        this.getCurrentSong(index);
        this.setCurrentIndex(index);
      },
      getCurrentSong(index){
        //请求当前的歌曲链接
        let songid = this.playList[index].song_id
        new Promise((resolve, reject) => {
          axios.get(url1+'?songid='+songid).then((res) => {
            resolve(res.data)
          })
        }).then(result => {
          console.log(result.data.file_link);
          this.setCurrentSongLink(result.data.file_link)
        })
      },
      //收藏歌曲
      toggleFavorite(song){
        if(this.isFavorite(song)){
          this.deleteFavoriteList(song)
        }else{
          this.saveFavoriteList(song);
        }
      },
      getFavoriteIcon(song){
        if(this.isFavorite(song)){
          return 'collection-color collectionAni'
        }
        return ''
      },
      isFavorite(song){
        const index = this.favoriteList.findIndex((item)=>{
          return item.song_id == song.song_id
        })
        return index > -1
      },
      format(interval){
        interval = interval | 0;
        const minute = this._pad(interval/60 | 0);
        const second = this._pad(interval % 60);
        return `${minute}:${second}`;      
      },
      _pad(num,n=2){
        let len = num.toString().length;
        while(len<n){
          num = '0' + num;
          len ++;
        }
        return num;
      },
      _isEmpty(obj){
        for (var name in obj){
          return false;
        }
        return true;
      }
    },
    mounted(){
      // console.log(this.playList[this.currentIndex])
      // this.$refs.audio.setAttribute('src', this.playList[this.currentIndex])
    },
    components:{
      Range
    },
    watch:{
      currentSongLink(newSong,oldSong){
        if(oldSong == newSong){
          return 
        }
        setTimeout(()=>{
          this.$refs.audio.play();
          this.setPlayingState(true)
        },20)
      },
      playing(newPlaying){
        let audio = this.$refs.audio;
        this.$nextTick(() => {
          newPlaying ? audio.play():audio.pause();
        })
      },
      currentSongMeg(newSongMeg){
        if(this._isEmpty(newSongMeg)){
          this.setCurrentSongLink('http://www.047x.cn/servier/images/music.mp3')
        }else{
          this.getCurrentSong(this.currentIndex)
        }
      }
    }
    
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/mixin'
  @import '~common/stylus/variable'
  
  //动画
  .fade-enter-active, .fade-leave-active 
    transition: opacity .2s
  .fade-enter, .fade-leave-to 
    opacity: 0
  .sliderUpHideRight-enter-to,&.sliderUpHideRight-leave-to
    transition: all 0.3s
  .sliderUpHideRight-enter
    transform:translate3d(0,100%,0)
    opacity: 0
  .sliderUpHideRight-leave-to
    transform:translate3d(100%,0,0)
    opacity: 0
  // CD旋转动画
  @keyframes goRotate{
    0%{
      transform: rotate(0)
    }
    50%{
      transform: rotate(180deg)
    }
    100%{
      transform: rotate(360deg)
    }
  }
  // 收藏动画
  @keyframes collectionAni{
    0%{
      transform: scale(1)
    }
    30%{
      transform: scale(1.6)
    }
    80%{
      transform: scale(0.6)
    }
    100%{
      transform: scale(1)
    }
  }
  // 
  .player
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    z-index: 10
    background: #aaa
    // 歌曲背景
    .filterbg
      position:absolute
      top:0
      left: 0
      bottom: 0
      right: 0
      z-index: -1
      filter: blur(30px)
      transition: all .5s
    // 播放器主体
    .player-content
      position:absolute
      top:0
      left: 0
      bottom: 0
      right: 0
      z-index: 1
      background: rgba(0,0,0,.15)
      .content-header
        position:absolute
        top:0
        left: 0
        right: 0
        height:10vh
        display:flex
        align-items: center
        padding-top:1vh
        box-sizing:border-box
        .icon
          flex:50px 0 0
          font-size:24px
          height:8vh
          line-height:8vh
          display:flex
          justify-content:center
        .icon-share
          font-size:32px
        .header-top
          flex:1
          display:flex
          flex-direction:column
          justify-content: space-around
          overflow:hidden
          p
            padding:4px 0
            no-wrap()
          .song-name
            font-size:14px
          .singer
            font-size:12px
      // cd主体
      .cd-wrapper
        position:absolute
        top:10vh
        left: 0
        bottom: 30vh
        right: 0
        z-index: 1
        overflow:hidden
        .swith-line
          width:80%
          height:1px
          background-image: linear-gradient(270deg,hsla(0,0%,100%,0),hsla(0,0%,100%,.6),hsla(0,0%,100%,0))
          margin:0 auto
          .triger
            position: absolute
            top: -14px
            left: 50%
            transform: translate3d(-16px,0,0)
            width: 90px
            height: 140px
            background-image: url(../../assets/images/swith.png)
            background-size: cover
            transform-origin: 14px 16px
            transition: all .3s
            z-index: 5
            &.pause
              transform: translate3d(-16px,0,0) rotateZ(-30deg)
        .cd
          width:44vh
          height:44vh
          position:relative
          top:70px
          margin:auto
          &.animate
            animation: goRotate 16s linear infinite 0.1s
          &.play
            animation-play-state:running
          &.pause
            animation-play-state:paused
          .cd-bg
            width: 44vh
            height: 44vh
            background: url(../../assets/images/cd-mine.png)
            background-size:cover
            position:absolute
            top:0
            left:50%
            margin-left:-22vh
            z-index:3
          .cover-img
            width:28vh
            height:28vh
            background: url(../../assets/images/album.jpg)
            background-size:cover
            display:block
            position:absolute
            top:8vh
            left:50%
            transform:translate3d(-50%,0,0)
            z-index:2
      .lyric
        position:absolute
        top:10vh
        left: 0
        bottom: 30vh
        right: 0
        z-index: 1
        overflow:hidden
        .volume-wrapper
          width:100%
          height:10vh
          display:flex
          flex-direction:row
          align-items:center
          .volume
            display:flex
            flex-direction:row
            align-items:center
            width:90%
            margin:auto
            .range
              flex:1
            .rangeicon
              font-size:14px
              margin-right:10px


      // 下载工具栏
      .song-tools
        width:70vw
        position:absolute
        left: 50%
        bottom: 20vh
        transform: translate3d(-50%,0,0)
        height: 40px
        z-index: 1
        overflow:hidden
        display:flex
        justify-content:space-around
        align-items:center
        i
          width: 40px
          line-height: 40px
          text-align: center
          font-size:20px
          color:rgba(255,255,255,0.8)
          &.collection-color
            color:$primarycolor
          &.collectionAni
            animation: collectionAni .4s ease-in 0.1s
      // 进度条
      .progress-wrapper
        position:absolute
        left: 0
        bottom: 12vh
        right: 0
        height:6vh
        z-index: 1
        .progress-box
          width:90%
          height:100%
          margin:0 auto
          display:flex
          align-items:center
          font-size:12px
          .progress-range
            cursor:pointer
            flex:1
          .current-time
            margin-right:10px
          .duration
            margin-left:10px
            
      // 底部控制条
      .content-footer
        position:absolute
        left: 0
        bottom: 0
        right: 0
        height:12vh
        z-index: 1
        display:flex
        background-image: linear-gradient(0deg,rgba(0,0,0,.8),rgba(0,0,0,.4),transparent,transparent)
        .icon-btn
          flex:1
          display:flex
          flex-direction:row
          justify-content:center
          align-items:center
          font-size:28px
          .icon
            cursor:pointer
            font-size:28px
          .playPause
            font-size:46px
          .icon-mode,.icon-list-music
            font-size:20px

</style>
