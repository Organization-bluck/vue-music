import * as types from './mutation-types.js'
import {saveFavorite, deleteFavorite} from 'common/js/cache'
import {shuffle} from 'common/js/util.js';

export const set_playList = function({commit},list){
	commit(types.SET_PLAYLIST, list)
}

// export const set_currentSongLink = function({commit},song){
// 	commit(types.SET_CURRENT_SONG_LiNK, song)
// }
function findIndex(list,song){
  return list.findIndex((item) => {
    return item.song_id === song.song_id;
  })
}

export const selectItem = function({commit,state},{list,index}){
	//commit(types.SET_SEQUENCE_LIST, list);
	if(state.mode === 2){
		let randomList = shuffle(list);
		commit(types.SET_PLAYLIST, randomList)
		index = findIndex(randomList, list[index])
	}else{
		commit(types.SET_PLAYLIST, list)
	}
	commit(types.SET_CURRENT_INDEX, index)
	commit(types.SET_PLAYING_STATE, true)
}

export const deleteItem = function({commit,state},item){
	let sequenceList = state.sequenceList;
	let currentIndex = state.currentIndex;
	let index = findIndex(sequenceList,item)
	if(index<currentIndex){
		currentIndex -= 1
		commit(types.SET_CURRENT_INDEX, currentIndex)
	}
	sequenceList.splice(index,1);
	commit(types.SET_SEQUENCE_LIST, sequenceList);
}

export const saveFavoriteList = function({commit},song){
	commit('SET_FAVORITE_LIST',saveFavorite(song))
}

export const deleteFavoriteList = function({commit},song){
	commit('SET_FAVORITE_LIST',deleteFavorite(song))
}
