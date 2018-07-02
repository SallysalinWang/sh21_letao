/**
 * Created by Administrator on 2018/7/2.
 */
$(function(){
  //一进入页面，获取产品的Id，根据id获取数据渲染产品页面
  var productId = getSearch("productId");
  $.ajax({
    type:'get',
    url:'/product/queryProductDetail',
    data:{
      id:productId
    },
    dataType:'json',
    success:function(info){
      console.log(info);
      var htmlStr = template('proTmp',info);
      $('.lt_main .mui-scroll').html(htmlStr);

      //  mui框架会默认初始化当前页面的图片轮播组件；若轮播组件内容为js动态生成时（比如通过ajax动态获取的信息），则需要在动态生成完整DOM (包含mui-slider下所有DOM结构) 后，手动调用图片轮播的初始化方法:
      //获得slider插件对象
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval:4000//自动轮播周期，若为0则不自动播放，默认为0；
      });

    //  mui在mui.init()中会自动初始化基本控件,
      // 但是 动态添加的Numbox组件需要手动初始化
      mui(".mui-numbox").numbox()
    }

  });

//  用户选择尺码功能
  $('.lt_main').on('click','.lt_pro_size span',function(){
    $(this).addClass('current').siblings().removeClass('current');
  })

//  用户选择商品加入购物车的功能
//  1、点击按钮，给按钮添加点击事件
//  2、获取用户选 择的尺码和数量（用户能选）
//  3、发送ajax请求，加入购物车
  $('#addCart').click(function(){
    var size = $('.lt_pro_size span.current').text();
    var num = $('.mui-numbox-input').val();
    if(!size){
      mui.toast('请选择尺码！');
      return;
    }
    //console.log(size,num);
    $.ajax({
      type:'post',
      url:'/cart/addCart',
      data:{
        size:size,
        num:num,
        productId:productId
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        if(info.success){
        //  用户已登录，添加购物车成功
        //  弹出确认框，
          mui.confirm('添加成功','温馨提示',["去购物车","继续浏览"],function(e){
            console.log(e);
            if(e.index === 0){
              //前往购物车
              location.href = "cart.html"
            }
          })
        }
        if(info.error===400){
          //跳转到 登录页，将来登陆成功需要再跳转回来，需要将当前的url传递过去
          location.href = "login.html?retUrl=" + location.href;
        }
      }
    })

  })




})