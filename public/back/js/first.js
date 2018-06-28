/**
 * Created by Administrator on 2018/6/28.
 */
;$(function(){
  var currentPage = 1;
  var pageSize = 2;
  render();
  function render(){

    $.ajax({
      type:"get",
      url:"/category/queryTopCategoryPaging",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        //console.log(info);
        var htmlStr = template('tmp',info);
        $('tbody').html(htmlStr);

      //  添加分页功能，给分页按钮添加功能
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:info.page,
          totalPages:Math.ceil(info.total / info.size),
          onPageClicked:function(a,b,c ,page){
              currentPage = page;
              render();
          }
        })
      }
    })
  }

  $('#addBtn').click(function(){
    $('#addModal').modal('show');
  });
  //通过表单校验插件，实现表单校验功能
  $('#form').bootstrapValidator({
    feedbackIcons:{
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    fields: {
      categoryName: {
        // 配置校验规则
        validators: {
          // 非空校验
          notEmpty: {
            message: "一级分类名称不能为空"
          }
        }
      }
    }
  });

//  注册表单校验成功事件，阻止默认成功的提交，通过ajax进行提交
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    $.ajax({
      type:'post',
      url:'/category/addTopCategory',
      data:$('#form').serialize(),
      dataType:'json',
      success:function(info){
        console.log(info);
        if(info.success){
          $('#addModal').modal('hide');
          currentPage = 1;
          render();

          $('#form').data('bootstrapValidator').resetForm(true);

        }
      }
    })
  })


});
