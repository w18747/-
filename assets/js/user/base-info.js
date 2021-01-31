// 基本资料功能
$(function() {
    const { layer, form } = layui
    //1.页面一加载获取用户信息
    function initUserInfo() {
        axios.get('/my/userinfo').then(res => {
            //校验请求失败
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }
            const { data } = res
            //给表单赋值
            //注意edit-userinfo是表单lay-filter属性的值
            //data对象中的属性名和表单name值一 一对应
            form.val('edit-userinfo', data)
        })
    }

    initUserInfo()

    //2.表单验证
    form.verify({
        nick: [
            /^\S{1,7}$/,
            '昵称长度必须在1~6个字符之间'
        ]
    })

    //3.提交修改
    $('.base-info-form').submit(function(e) {
        e.preventDefault()

        //发送ajax请求
        axios.post('/my/userinfo', $(this).serialize())
            .then(res => {
                console.log(res);
                //校验失败
                if (res.status !== 0) {
                    return layer.msg('修改信息失败!')
                }
                layer.msg('修改信息成功')

                //更新用户信息
                window.parent.getUserInfo()

            })
    })

    //4.重置功能
    $('#reset-btn').click(function(e) {
        e.preventDefault()
        initUserInfo()
    })


})