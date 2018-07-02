/**
 * Created by Administrator on 2018/6/30.
 */
$(function(){
  var currentPage = 1;
  var pageSize = 2;
  //根据从搜索框中的传过来的数据，进行渲染页面
  function render(callback){
    //$('.lt_product').html('<div class = "loading"></div>');

    //  三个必传的参数
    var params = {};
    params.proName=$('.search_input').val();
    params.page = currentPage;
    params.pageSize = pageSize;

    var $current = $('.lt_sort .current');
    if($current.length >0){
      //  说明有高亮的，需要排序
      var sortName = $current.data('type');
      var sortValue = $current.find('i').hasClass("fa-angle-down") ? 2:1;//排序的值
      params[sortName] = sortValue;
    }
    //console.log(params);


    //  模拟网络延迟
    setTimeout(function(){
      $.ajax({
        type:'get',
        url:'/product/queryProduct',
        data:params,
        dataType:'json',
        success:function(info){
          //console.log(info);
          callback && callback(info);



        }
      })
    },500)

  };
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down : {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        callback :function(){//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          console.log("下拉刷新，发送ajax请求，重新获取数据渲染页面");
          currentPage = 1;
          render(function(info){
            console.log(info);
            var htmlStr = template('product_tmp',info);
            $('.lt_product').html(htmlStr);
          //  下拉刷新页面渲染完成后，需要关闭下拉刷新的功能
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();

          //  回到当前页的顶部再次上拉刷新时，需要重新启用上拉刷新功能
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
          })

        }
      },
      up:{

        callback :function(){//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          console.log("上拉加载更多");
          currentPage++;

          render(function(info){
            if(info.data.length ===0){
              //如果没有数据了，需要结束上拉加载，显示没有更多内容了
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
            }
            else{
              var htmlStr = template('product_tmp',info);
              $('.lt_product').append(htmlStr);
              //上拉加载页面渲染完成后，正常关闭上拉刷新功能
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
            }

          })

        }
      }
    }
  });


  //mui中认为click事件有300ms的延迟，通过tap来绑定事件更合适
  $('.lt_product').on('tap','a',function(){
    var id = $(this).data('id');
    location.href= "product.html?productId="+id;
  })

  var key = getSearch("key");
  $(".search_input").val(key);



  $('.search_btn').click(function(){
    //搜索成功，需要更新历史记录
    var key = $('.search_input').val();
    if(key === ""){
      mui.toast('请输入搜索关键字');
      return;
    }
    //之前是使用render来重新渲染页面，现在只需要调用一次下拉刷新，
    // 就可以实现重新渲染页面的功能
    console.log(  mui('.mui-scroll-wrapper').pullRefresh());
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();


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
  $('.lt_sort a[data-type]').on('tap',function(){
    if($(this).hasClass('current')){
      $(this).find('i').toggleClass("fa-angle-down").toggleClass("fa-angle-up");

    }else{
      $(this).addClass("current").siblings().removeClass("current");

    }
    //通过下拉加载来重新渲染页面
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  })


})