<template>
  <div class="progress-bar" ref="progressBar" @click.stop.prevent="progressClick">
  	<div class="progress" ref="progress"></div>
  	<div class="progress-ball" ref="progressBtn"
      @touchstart.prevent="progressTouchStart"
      @touchmove.prevent="progressTouchMove"
      @touchend="progressTouchEnd"      
    >
    </div>
  </div>
</template>

<script>

  export default {
    name: 'rang',
    props:{
    	percent:{
    		type:Number,
    		default:0
    	},
      rangeType:{
        type:String,
        default:'progress'
      },
      ballWidth:{
        type:String,
        default:'16'
      },
      currentColor:{
        type:String,
        default:'#c62f2f'
      }
    },
    data(){
      return {
        volume: 0.9,
      }
    },
    created(){
	    this.touch = {};
	  },
    mounted(){
      if(this.rangeType === 'volume'){
        this.$refs.progressBtn.style.width = `${this.ballWidth}px`
        this.$refs.progressBtn.style.height = `${this.ballWidth}px`
        this.$refs.progressBtn.style.top = `-${this.ballWidth / 2 - 1}px`
        this.$refs.progress.style.background = this.currentColor
      }
    },
    methods:{
    	progressTouchStart(e){
    		this.touch.initiated = true;
    		this.touch.startX = e.touches[0].pageX;
    		this.touch.left = this.$refs.progress.clientWidth;	//当前的进度值
    	},
    	progressTouchMove(e){
    		if(!this.touch.initiated){return false}
    		let deltaX = e.touches[0].pageX - this.touch.startX;
    		let offsetWidth = Math.min(this.$refs.progressBar.clientWidth - this.ballWidth,Math.max(0,this.touch.left + deltaX))
    		this._offset(offsetWidth);
    	},
    	progressTouchEnd(e){
    		this.touch.initiated = false;
    		this._triggerPercent();
    	},
    	progressClick(e){
    		let rect = this.$refs.progressBar.getBoundingClientRect();
		    let offsetWidth = e.pageX - rect.left - 10;
		    this._offset(offsetWidth);
		    this._triggerPercent();
    	},
    	_offset(offsetWidth){
    		this.$refs.progress.style.width = `${offsetWidth}px`
    		this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
    	},
    	_triggerPercent(){
    		let barWidth = this.$refs.progressBar.clientWidth - this.ballWidth;
    		let percent = this.$refs.progress.clientWidth / barWidth;
    		this.$emit('percentChange',percent)
    	}
    },
    watch:{
    	percent(newPercent){
    		if(newPercent >= 0 && !this.touch.initiated){
    			let barWidth = this.$refs.progressBar.clientWidth - this.ballWidth
    			let offsetWidth = newPercent * barWidth
    			this._offset(offsetWidth)
    		}
    	}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/mixin'
		.progress-bar
			position:relative
			height:2px
			border-radius:50%
			background-color:rgba(245,245,245,0.3)
			.progress
				width:0
				height:100%
				background-color:#c62f2f
			.progress-ball
				width:16px
				height:16px
				position:absolute
				left:0
				top:-7px
				border-radius:50%
				background-color:#fff
  
</style>
