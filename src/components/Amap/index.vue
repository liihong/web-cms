<template>
  <div class="gd-map">
    <div>
    <button @click="initMap">搜索</button>
    <p>{{address}}</p>
    <hr>
    <div class="amap-page-container">
      <div class="search-box" v-if="toSearch">
        <input  
          v-model="searchKey"
          type="search"  
          id="search">
        <button @click="searchByHand">搜索</button>
        <div class="tip-box" id="searchTip"></div>
      </div>
    </div>
    <ul>
      <li v-for="item in result" :key="item.id">{{item.name}}</li>
    </ul>
  </div>
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
      map: null,
      poiPicker:null
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
              map: map, //依赖地图对象
              input: 'search', //输入框id
              placeSearchOptions: {
                map: map,
                pageSize: 10
              },//地点搜索配置
              suggestContainer:'searchTip',//输入提示显示DOM
              searchResultsContainer:'searchTip'//搜索结果显示DOM
            })

            positionPicker.start(map.getBounds().getSouthWest())
            //TODO:事件绑定、结果处理等
            positionPicker.on('success', function(positionResult) {
              that.$emit('getPosition', positionResult)
            })
          
            that.poiPicker=positionPicker;
            //监听poi选中信息
            positionPicker.on('poiPicked', function(poiResult) {
              let source = poiResult.source;
              let poi = poiResult.item;
              if (source !== 'search') {
                  positionPicker.searchByKeyword(poi.name);
              } else {
                positionPicker.clearSearchResults();
                that.center=[poiResult.item.location.lng,poiResult.item.location.lat];
                that.address=poi.name;
                that.searchKey="";
                that.toSearch=false;
              }
            });
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
