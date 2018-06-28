/**
 * Created by Administrator on 2018/6/26.
 */
$(function(){

  var currentPage = 1;
  var pageSize = 5;
  var currentId ;
  var isDelete;
//  一进入页面，发送ajax请求，从后台获取数据，通过模板引擎进行渲染
  render();
  function render(){
    //通过ajax请求，获取后台数据
    $.ajax({
      type:"get",
      url:'/user/queryUser',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:"json",
      success:function(info){
        console.log(info);
        var htmlStr = template('tmp',info);
        $('tbody').html(htmlStr);

        //添加分页按钮
        $('#pagenator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          totalPages:Math.ceil(info.total / info.size),
          currrentPage:info.page,
          onPageClicked(a,b,c,page){
            console.log(page);
            currentPage = page;
            render();

          }


        })

      //  点击启用、禁用按钮，进行状态切换
      //  通过事件委托
        $('tbody').on('click','.btn',function(){
          $('#userModal').modal('show');
          currentId = $(this).parent().data('id');
          isDelete = $(this).hasClass('btn-danger') ? 0 :1;

        });
        $('#submitBtn').click(function(){
          console.log("currentId" +"," +currentId);
          console.log("isDelete"+"," + isDelete);
          $.ajax({
            type:"post",
            url:"/user/updateUser",
            data:{
                id:currentId,
                isDelete:isDelete
            },
            dataType:'json',
            success:function(info){
              console.log(info);
            //  关闭模态框
              $('#userModal').modal('hide');
              render();
            }
          })

        })

      }
    })
  }


});