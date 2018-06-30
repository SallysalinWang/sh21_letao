/**
 * Created by Administrator on 2018/6/30.
 */
$(function(){
  // 数据初始化, 准备假数据
  // var arr = [ "耐克", "阿迪", "阿迪王", "耐克王" ];
  // var str = JSON.stringify( arr );
  // localStorage.setItem( "search_list", str );

  //功能1：搜索历史记录渲染功能
  render();
  function getHistory(){
    var history = localStorage.getItem('search_list')||'[]';
    console.log(history);
    var arr = JSON.parse(history)
    return arr;
  }
  //getHistory();
//  读取历史记录，进行页面渲染
  function render(){
    var arr = getHistory();
    var htmlStr = template('history_tmp',{arr:arr});
    $('.lt_history').html(htmlStr);
  }

//  功能2：清空历史记录
  $('.lt_history').on('click','.icon_empty',function(){
  //  添加确认框
    mui.confirm('你是否要清空全部的历史记录?',"温馨提示",["取消","确认"],function(e){
      //console.log(e);
      if(e.index === 1){
        localStorage.removeItem('search_list');
        render();
      }
    }
    )
  });

//  功能3：删除一条记录
  $('.lt_history').on('click',".icon_delete",function(){
    var that = this;
    mui.confirm("你确定要删除该条历史记录么？",'温馨提示',["取消","确认"],function(e){
      //console.log(e);
      if(e.index === 1){
        var index = $(that).data("index");
        var arr = getHistory();
        arr.splice(index,1);

        localStorage.setItem("search_list",JSON.stringify(arr));
        render();
      }
    })
  });

//  功能4：添加搜索记录功能
  $('.search_btn').click(function(){
    var key = $('.search_input').val();
    if(key === ''){
      mui.toast('请输入搜索关键字');
      return;
    }
    var arr  = getHistory();
    var index = arr.indexOf(key);
    if(index > -1){
      //将重复的该项删除
      arr.splice(index,1);
    }
    if(arr.length >= 10){
      //删除最后一项
      arr.pop();
    }
    //添加到数组的最前面
    arr.unshift(key);
    //存储到本地历史中
    localStorage.setItem("search_list",JSON.stringify(arr));
    //重新渲染
    render();

  //  清空搜索框
    $('.search_input').val("");
  //  进行页面跳转
    location.href= "searchList.html?key="+key;
  })
})