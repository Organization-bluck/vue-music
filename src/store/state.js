
const playMode = {
	sequence:0,
	loop:1,
	random:2
}
const state = {
	playing:false,
	playList:[],
	sequenceList:[],
	mode:playMode.loop,
	currentIndex:0,
	isShowMusicList:false,
	currentSongLink:''
	
}
export default state
