<template>
	<div class="musiclist">
		<transition name="sideUp">
			<div class="content" v-show="isShowMusicList">
				<div class="title">
					<div class="play-type" @click.stop="setPlayType">
						<i :class="musicPlayType"></i>
						<span>{{typeName}}</span>
						<span>({{sequenceList.length}})</span>
					</div>
					<div class="right">
						<div class="collect">
							<i class="icon-add-project"></i>
							<span>收藏</span>
						</div>
						<div class="delete">
							<i class="icon-delete"></i>
							<span>清空</span>
						</div>
					</div>
					<div class="border-1px"></div>
				</div>
				<ul class="container" ref="musiclistContent">
					<li class="list" v-for="(item, index) in sequenceList" :data-index="index" @click.stop="playIndex(index)">
						<div class="border-1px"></div>
						<i class="playingicon icon-volume-medium" v-show="index === currentIndex"></i>
						<span class="name">{{item.title}}</span>
						<span class="singer"> - {{item.author}}</span>
						<i class="close"></i>
						<div class="border-1px"></div>
					</li>
					
				</ul>
			</div>
			
		</transition>
		<transition name="fade">
			<div class="mask" v-show="isShowMusicList" @click.stop="hideMusicList" @touchmove.prevent>
			</div>
		</transition>
	</div>
</template>

<script>
	import {mapGetters,mapMutations,mapActions} from 'vuex'
	import axios from 'axios'
	import {modeMixin} from 'common/js/mixin'
	const url1 = 'https://www.yingshangyan.com/api/music/getPlay';
	export default {
		mixins: [modeMixin],
		data () {
			return {

			}
		},
		methods: {
			...mapMutations({
				setMusicListShow:'SET_SHOW_LIST',
				setMode:'SET_PLAY_MODE',
				setCurrentIndex:'SET_CURRENT_INDEX',
				setCurrentSongLink:'SET_CURRENT_SONG_LINK'
			}),
			...mapActions([
				'selectItem'
			]),
			hideMusicList(){
				this.setMusicListShow(false)
			},
			
			playIndex(index){
				if(index === this.currentIndex){
					return
				}
				this.selectItem({
					list:this.sequenceList,
					index
				})
				this.getCurrentSong(index)
				this.setMusicListShow(false)
			},
			getCurrentSong(index){
        //请求当前的歌曲链接
        let songid = this.sequenceList[index].song_id
        new Promise((resolve, reject) => {
          axios.get(url1+'?songid='+songid).then((res) => {
            resolve(res.data)
          })
        }).then(result => {
          this.setCurrentSongLink(result.data.file_link)
        })
      },
		},
		// methods: {
		// 	hideMusicList () {
		// 		store.dispatch({
		// 			type: 'hideMusicList'
		// 		})
		// 	},
		// 	playIndex (index) {
		// 		store.dispatch({
		// 			type: 'play_Index',
		// 			index: index
		// 		})
		// 		store.dispatch({
		// 			type: 'hideMusicList'
		// 		})
		// 	},
		// 	setPlayType () {
		// 		store.dispatch('set_PlayType')
		// 	}
		// },
		computed: {
			...mapGetters([
				'isShowMusicList',
				'mode',
				'playList',
				'sequenceList',
				'currentIndex'
			]),
		// 	isShowMusicList () {
		// 		return this.$store.getters.getIsShowMusicList
		// 	},
		// 	musiclist () {
		// 		return this.$store.getters.getMusicList
		// 	},
		// 	getCurrentIndex () {
		// 		return this.$store.getters.getCurrentIndex
		// 	},
		// 	getScrollTop () {
		// 		return this.$store.getters.getScrollTop
		// 	},
			
			typeName(){
				return this.mode === 0 ? '列表循环' : this.mode === 1 ? '单曲循环' : '随机播放'
			},
			musicPlayType(){
				return this.mode === 0 ? 'icon-music-shunxu' : this.mode === 1 ? 'icon-music-danqu1' : 'icon-music-random'
			}

		},
		// mounted () {
		// 	store.dispatch({
		// 		type: 'set_RefScrollMusicList',
		// 		refs: this.$refs.musiclistContent
		// 	})
		// }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable.styl"
	@import "~common/stylus/mixin.styl"
	.musiclist
		.content
			position:fixed
			height:314px
			background:#fff
			bottom:0
			left:0
			right:0
			z-index:103
			&.sideUp-enter-to,&.sideUp-leave-to
				transition: transform 0.3s
			&.sideUp-enter,&.sideUp-leave-to
				transform:translate3d(0,100%,0)
			.title
				width:100%
				position:relative
				height:50px
				font-size:0
				.play-type,.collect,.delete
					display:inline-block
					width:auto
					height:100%
					line-height:50px
					padding:0 15px
					&:active
						background:$list_active
				.play-type
					height:100%
					i
						color:#666
						font-size:18px
						display:inline-block
						width:20px
						height:20px
						vertical-align:middle
					span
						color:#666
						vertical-align:middle
						font-size:14px
						margin:0 2px
				.right
					float:right
					height:100%
					line-height:50px
					.collect,.delete
						font-size:12px
						color:#666
						i
							font-size:18px
							vertical-align:middle
						span
							vertical-align:middle
							font-size:14px
							font-weight:300
				.border-1px
					border-1px($border_1px)
			.container
				height:264px
				overflow:auto
				-webkit-overflow-scrolling:touch
				box-sizing:border-box
				padding: 6px 0
				.list
					height:42px
					line-height:42px
					padding:0 15px
					//font-weight:400
					font-size:14px
					color:#666
					overflow:hidden
					.playingicon
						font-size: 14px
						vertical-align: middle
						color:$primarycolor
					&:active
						background:$list_active
					.border-1px
						border-1px($border_1px)
		.mask
			position:fixed
			top:0
			left:0
			bottom:0
			right:0
			z-index:100
			opacity:1
			background:$maskBackground
			&.fade-enter-to,&.fade-leave-to
				transition: opacity 0.3s
			&.fade-enter,&.fade-leave-to
				opacity:0
</style>
