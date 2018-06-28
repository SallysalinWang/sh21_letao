/**
 * Created by Administrator on 2018/6/28.
 */

$(function(){
  var currentPage = 1;
  var pageSize = 5;
  render();
  function render(){
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        var htmlStr = template('tmp',info);
        $('tbody').html(htmlStr);

       $('#paginator').bootstrapPaginator({
         bootstrapMajorVersion:3,
         totalPages:Math.ceil(info.total / info.size),
         currentPage:info.page,
         onPageClicked(a,b,c,page){
           currentPage = page;
           render();
         }

       })
      }
    })
  }

// 2、 点击添加分类按钮，显示模态框
  $('#addBtn').click(function(){
    $('#secondModal').modal('show');
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        var htmlStr = template('dropTmp',info);
        $('.dropdown-menu').html(htmlStr);


      }
    })
  });

// 3、 给dropdown-menu注册事件委托，让a可以被点击

  $('.dropdown-menu').on('click','a',function(){
    var txt = $(this).text();
    $("#dropText").text(txt);
    //获取id，设置 name = "categoryId" 的input 框
    var id = $(this).data('id');
    $('[name = "catagoryId"]').val(id);

    $('#form').data('bootstrapValidator').updateStatus("categoryId","VALID");

  });

//  4、进行jquery-fileupload 实例化，里面配置图片上传后的回调函数
  $('#fileupload').fileupload({
    dataType:'json',
    done:function(e,data){
      console.log(data.result.picAddr);
      var picUrl = data.result.picAddr;
      //设置图片地址给图片
      $('#imgBox img').attr('src',picUrl);

      $('[name = "brandLogo"]').val(picUrl);

      //手动将表单校验状态设置成 VALID
      $('#form').data('bootstrapValidator').updateStatus("brandLogo","VALID");

    }
  });
  //5、通过表单校验插件实现表单校验功能
  $('#form').bootstrapValidator({
    //指定不校验的类型，默认为[':disabled'.':hidden',':not(:visible)'],可以不设置，
    //默认不校验隐藏域的input，我们需要重置exclude为[],恢复对隐藏域的校验
    excluded:1,
    feedbackIcons:{
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    fields:{
      categoryId:{
        validators:{
          notEmpty:{
            message:'请选择一级分类'
          }
        }
      },
      brandName:{
        validators:{
          notEmpty:{
            message:"请输入二级分类名称"
          }
        }
      },
      brandName:{
        validators:{
          notEmpty:{
            message:'请输入二级分类名称'
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:'请上传图片'
          }
        }
      }
    }
  });

//  6、注册表单校验成功事件，阻止默认提交，通过ajax提交
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    $.ajax({
      type:'post',
      url:'/category/addSecondCategory',
      data:$('#form').serialize(),
      dataType:'json',
      success:function(info){
        console.log(info);
        if(info.success){
          $('#secondModal').modal('hide');
          //重置表单
          $('#form').data('bootstrapValidator').resetForm(true);
          currentPage =1;
          render();

          $('#dropText').text("请选择一级分类");
          $('#imgBox img').attr('src',"images/none.png");

        }
      }
    })
  })


})