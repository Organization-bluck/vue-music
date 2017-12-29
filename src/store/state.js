import {loadFavorite} from 'common/js/cache'


const playMode = {
	sequence:0,
	loop:1,
	random:2
}
const state = {
	playing:false,
	playList:[],
	sequenceList:[],
	mode:playMode.sequence,
	currentIndex:0,
	isShowMusicList:false,
	currentSongLink:'http://www.047x.cn/servier/images/music.mp3',
	scrolltop:0,
	favoriteList:loadFavorite()
	
}
export default state
