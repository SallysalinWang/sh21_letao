/**
 * Created by Administrator on 2018/6/30.
 */
$(function(){
  mui('.mui-scroll-wrapper').scroll({
    deceleration:0.0005,
    indicators:false //设置不显示滚动条
  });
  //获得slider插件对象
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval:4000//自动轮播周期，若为0则不自动播放，默认为0；
  });


});
function getSearch(name){
  var search = location.search;
  //console.log(search);
  //对中文解码
  search = decodeURI(search);
  search = search.slice(1);
  //console.log(search);
  var arr = search.split('&');
  var obj = {};
  arr.forEach(function(v,i){
    var key = v.split('=')[0];
    var value =v.split("=")[1];
    //console.log(key,value);
    obj[key] = value;
  });
  return obj[name];
}