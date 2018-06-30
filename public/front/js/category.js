/**
 * Created by Administrator on 2018/6/30.
 */
$(function(){
    //一进入页面，通过ajax请求一级分类的数据，通过模板引擎渲染左侧列表
    $.ajax({
      type:'get',
      url:'/category/queryTopCategory',
      dataType:'json',
      success:function(info){
        console.log(info);
        var htmlStr = template('tmp',info);
        $('.lt_category_left ul').html(htmlStr);
      //  应该根据第一个一级分类的id，进行渲染二级分类
        renderSecondById(info.rows[0].id);

      }
    });

  $('.lt_category_left').on('click','a',function(){
    var id = $(this).data('id');
    renderSecondById(id);
  //  r让当前点击的a 加上current，让其他的a移除current
    $(this).addClass('current').parent().siblings().find('a').removeClass('current');


  });
//  发送ajax请求，请求对应的二级分类数据，进行二级分类渲染
function renderSecondById(id){
  $.ajax({
    type:'get',
    url:'/category/querySecondCategory',
    data:{
      id:id
    },
    dataType:'json',
    success:function(info){
      console.log(info);
      var htmlStr = template('secTmp',info);
      $('.lt_category_right ul').html(htmlStr);
    }
  })
}

})