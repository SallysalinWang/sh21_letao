/**
 * Created by Administrator on 2018/6/29.
 */

$(function(){
  var currentPage = 1;
  var pageSize = 2;
  var picArr = [];
  render();
  //封装页面渲染功能
  function render(){
    $.ajax({
      type:'get',
      url:'/product/queryProductDetailList',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        //console.log(info);
        var htmlStr = template('tmp',info);
        $('tbody').html(htmlStr);
        //分页功能
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:info.page,
          //控件的大小
          size:'mini',
          //配置每个按钮的显示文字
          //type:决定了按钮的功能类型，page，就是普通页面，next，prev、 last、first
          //page：点击该按钮，跳转到哪一页
          //current：表示当前是第几页
          itemTexts:function(type, page, current){
              switch (type){
                case "first":
                  return "首页";
                case "prev":
                  return "上一页";
                case "next":
                  return "下一页";
                case "last":
                  return "尾页";
                case "page":
                  return page;
              }

          },
          tooltipTitles:function( type, page, current){
            switch (type){
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "前往"+ page +"页";
            }
          },
          //使用bootstrap的提示框
          useBootstrapTooltip:true,
          totalPages:Math.ceil(info.total / info.size),
          onPageClicked:function(a,b,c,page){
            currentPage = page;
            render();
          }
        })

      }
    })
  };
//  点击添加商品按钮，显示模态框
  $('#addBtn').click(function(){
      $('#proModal').modal('show');
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      dataType:'json',
      success:function(info){
        //console.log(info);
        var htmlStr1 = template('dropTmp',info);
        $('.dropdown-menu').html(htmlStr1);

      }
    })
  });

//  通过事件委托，给每个a添加点击事件
  $('.dropdown-menu').on('click','a',function(){
  //  设置文本
    var txt = $(this).text();
    $('#dropText').text(txt);

  //  将点击的a的id存储到隐藏域中
    var id = $(this).data('id');
    //console.log(id);
    $('[name = "brandId"]').val(id);
  //  手动设置隐藏域的校验状态
  //  $('#form').data("bootstrapValidator").updateStatus("brandId","VALID");
  });
//  进行图片上传初始化
  $('#fileupload').fileupload({
    dataType :'json',
    done:function(e,data){
      console.log(data.result);
      var picUrl = data.result.picAddr;
      picArr.unshift(data.result);
    //      根据图片地址，进行图片预览
      $('#imgBox').prepend('<img src="' + picUrl + '" width="100" height="100">');
      //如果图片个数多于3张，就进行删除
      if(picArr.length > 3){
          //个数多于三张，删除最先添加的那一张
          picArr.pop();
      //  图片结构也要删除最后一张图片
        $('#imgBox img:last-of-type').remove();

        //如果图片上传张数等于3，说明图片上传容量已经满了
        //需要手动添加校验状

        //console.log(picArr);

      }
      //console.log(picArr.length);
      if(picArr.length === 3){

        $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID');

      }
    }
  });

//  通过表单校验插件，进行表单校验
  $('#form').bootstrapValidator({

    // 需要对隐藏域进行校验, 所以配置一下
    excluded: [],
    // 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      //校验用户名，对应name表单的name属性
      brandId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择二级分类'
          }

        }
      },
      proName:{
        validators: {
          //不能为空
          notEmpty: {
            message:'请输入商品名称'
          }

        }
      },
      proDesc:{
          validators: {
            //不能为空
            notEmpty: {
              message:'请输入商品描述'
            }

          }
      },
      num:{
        validators:{
          notEmpty:{
            message:"请输入商品库存"
          },
          regexp: {
            regexp:/^[1-9]\d *$/,
            message: '商品库存必须是非零开头的数字'
          }
        }

      },
      size:{
        validators:{
          notEmpty:{
            message:"请输入商品尺码"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '商品尺码必须是 xx-xx 的格式, 例如 32-40'
          }
        }
      },
      oldPrice:{
        validators:{
          notEmpty:{
            message:"请输入商品原价"
          }

        }
      },
      price:{
        validators:{
          notEmpty:{
            message:"请输入商品现价"
          }
        }
      },
      picStatus:{
        validators:{
          notEmpty:{
            message:"请上传 3 张图片"
          }
        }
      }

    }
  });

  //注册表单校验成功事件，阻止默认的提交，通过AJAX提交
  $('#form').on('success.form.bv',function(e){
    //console.log(111);
    e.preventDefault();
    console.log($('#form').serialize());
    var paramsStr = $('#form').serialize();

    //  需要拼接上图片的地址和名称
    paramsStr += "&picAddr1=" + picArr[0].picAddr + "&picName1=" + picArr[0].picName;
    paramsStr += "&picAddr2=" + picArr[1].picAddr + "&picName2=" + picArr[1].picName;
    paramsStr += "&picAddr3=" + picArr[2].picAddr + "&picName3=" + picArr[2].picName;
    //console.log(paramsStr);
    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data:paramsStr,
      dataType:'json',
      success:function(info){
        console.log(info);
        if(info.success){
          $('#proModal').modal('hide');
          $('#form').data('bootstrapValidator').resetForm(true);
          currentPage =1;
          render();

          $('#dropText').text('请选择二级分类');
          $('#imgBox img').remove();
        }


      }
    })
  });



})