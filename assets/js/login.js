$(function() {
    //从layui中提取form表单模块
    const { form, layer } = layui

    //1.点击链接进行表单切换
    $('.link a').click(function() {
        $('.layui-form').toggle()
    })

    //2.校验表单项
    form.verify({
        pass: [
            /^\w{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        samPass: function(value) { //value表示表单的值
            if (value !== $('#pass').val()) {
                return '两次密码输入不一致'
            }
        }
    });
    //3.实现注册功能
    $('.reg-form').submit(function(e) {
        e.preventDefault()

        //发送ajax请求
        axios.post('api/reguser', $(this).serialize())
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('注册失败!')
                }
                //跳转登录
                layer.msg('注册成功!')
                $('.login-form a').click()
            })

    })

    //4.实现登录功能
    $('.login-form').submit(function(e) {
        e.preventDefault()
        axios.post('/api/login', $(this).serialize())
            .then(res => {
                console.log(res);
                //校验请求
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                } //登录成功后,首先把token(个人身份令牌)保存本地存储
                localStorage.setItem('token', res.token);
                //提示登录成功
                layer.msg('登录成功');
                //跳转到首页
                location.href = './index.html'
            })
    })


})