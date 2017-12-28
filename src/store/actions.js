import * as types from './mutation-types.js'

export const set_playList = function({commit},list){
	commit(types.SET_PLAYLIST, list)
}

// export const set_currentSongLink = function({commit},song){
// 	commit(types.SET_CURRENT_SONG_LiNK, song)
// }
