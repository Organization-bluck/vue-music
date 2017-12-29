import {mapGetters,mapMutations,mapActions} from 'vuex';
import {shuffle} from 'common/js/util.js';

export const modeMixin = {
	computed:{
		...mapGetters([
			'playList',
      'sequenceList',
      'playing',
      'mode',
      'currentIndex',
      'currentSongLink',
      'currentSongMeg',
      'favoriteList'
		])
	},
	methods:{
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
		setPlayType(){
	    let mode = (this.mode + 1)%3;
	    this.setMode(mode);
	    let list = null;
	    if(mode === 2){
	      list = shuffle(this.sequenceList)
	    }else{
	      list = this.sequenceList;
	    }
	    this.resetCurrentIndex(list); 
	    this.setPlayList(list);
	  },
	  //切换模式重置currentindex 防止歌曲错乱
	  resetCurrentIndex(list){　　
	    let index = list.findIndex((item) => {
	      return item.song_id === this.currentSongMeg.song_id
	    })
	    this.setCurrentIndex(index);
	  },
	}
}
