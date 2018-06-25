/**
 * Created by Administrator on 2018/6/25.
 */
$(function(){
  $('#form').bootstrapValidator({
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',//校验成功
      invalid: 'glyphicon glyphicon-remove',//校验失败
      validating: 'glyphicon glyphicon-refresh'//校验中
    },
    fields: {
      //校验用户名，对应name表单的name属性
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2到6位之间'
          },
          callback:{
            message:"用户名不存在，请重输！"
          }


        }
      },
      password:{
        validators: {
          //不能为空
          notEmpty: {
            message: '密码不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '用户名长度必须在6到12位之间'
          },
          callback:{
            message:"密码错误，请重输！！"
          }


        }
      }
    }

  });

//  使用submit进行提交，表单进行校验时，会在提交时，进行校验
//  如果用户输入正确，会进行跳转，需要使用ajax进行阻止此次默认行为
//  如果用户输入错误，需要提示用户输入有误

  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    console.log("阻止了默认提交行为");
    $.ajax({
      type:"post",
      url:"/employee/employeeLogin",
      data:$('#form').serialize(),
      dataType:"json",
      success:function(info){
        console.log(info);
        if(info.success){
          location.href = "index.html";
        }
        if(info.error === 1000){
          $('#form').data('bootstrapValidator').updateStatus("username","INVALID","callback");
        }
        if(info.error === 1001){
          $('#form').data('bootstrapValidator').updateStatus("password","INVALID","callback");
        }
      }
    })
  })
});

//重置表单时，不仅需要重置表单，还要重置表单校验状态
$('[type = "reset"]').on('click',function(){
  $('#form').data('bootstrapValidator').resetForm();
})