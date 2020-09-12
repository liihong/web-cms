<template>
  <div class="gd-map">
    <div id="container" class="amap"></div>
  </div>
</template>
<script>
import MapLoader from './AMap.js'
import AMapUI from 'AMapUI'
export default {
  name: 'Amap',
  props: ['markers'],
  data() {
    return {
      map: null
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      let that = this
      MapLoader().then(
        AMap => {
          //加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
          AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
            let map = new AMap.Map('container', {
              zoom: 16
            })
            var positionPicker = new PositionPicker({
              mode: 'dragMap', //设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
              map: map //依赖地图对象
            })

            positionPicker.start(map.getBounds().getSouthWest())
            //TODO:事件绑定、结果处理等
            positionPicker.on('success', function(positionResult) {
              that.$emit('getPosition', positionResult)
            })
            that.map = map
          })
        },
        e => {
          console.log('地图加载失败', e)
        }
      )
    }
  },
  watch: {
    markers() {
      this.initMap()
    }
  }
}
</script>
<style>
.amap {
  width: 100%;
  height: calc(100vh - 60px);
}
.amap-simple-marker-position-point {
  background-color: #7267e9 !important;
}
</style>
