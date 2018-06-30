/**
 * Created by Administrator on 2018/6/30.
 */
$(function(){
  var key = getSearch("key");
  $(".search_input").val(key);
  render();
  function render(){
    $('.lt_product').html('<div class = "loading"></div>');

  //  三个必传的参数
    var params = {};
    params.proName=$('.search_input').val();
    params.page = 1;
    params.pageSize = 100;

    var $current = $('.lt_sort .current');
    if($current.length >0){
    //  说明有高亮的，需要排序
      var sortName = $current.data('type');
      var sortValue = $current.find('i').hasClass("fa-angle-down") ? 2:1;//排序的值
      params[sortName] = sortValue;
    }
    console.log(params);


  //  模拟网络延迟
    setTimeout(function(){
      $.ajax({
        type:'get',
        url:'/product/queryProduct',
        data:params,
        dataType:'json',
        success:function(info){
          console.log(info);
          var htmlStr = template('product_tmp',info);
          $('.lt_product').html(htmlStr);
        }
      })
    },500)

  }

  $('.search_btn').click(function(){
    var key = $('.search_input').val();
    if(key === ""){
      mui.toast('请输入搜索关键字');
      return;
    }
    render();

    var history = localStorage.getItem("search_list") || "[]";
    var arr = JSON.parse(history);
    var index = arr.indexOf(key);
    if(index > -1){
      arr.splice(index,1);
    }
    if(arr.length >=10){
      arr.pop();
    }
    arr.unshift(key);
    localStorage.setItem("search_list",JSON.stringify(arr));
    $('.search_input').val("");

  });

//  添加排序功能
  $('.lt_sort a[data-type]').click(function(){
    if($(this).hasClass('current')){
      $(this).find('i').toggleClass("fa-angle-down").toggleClass("fa-angle-up");

    }else{
      $(this).addClass("current").siblings().removeClass("current");

    }
    render();
  })


})