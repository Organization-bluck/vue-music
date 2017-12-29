
import * as types from './mutation-types.js'

const mutations = {
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  }, 
  [types.SET_PLAYLIST](state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_SHOW_LIST](state, flag) {
    state.isShowMusicList = flag
  },
  [types.SET_CURRENT_SONG_LINK](state, song) {
    state.currentSongLink = song
  },
  [types.SET_SCROLL_TOP](state, song) {
    state.scrolltop = song
  },
  [types.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list
  }
  
}

export default mutations
