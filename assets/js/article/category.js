$(function() {
    // 定义弹出层的编号
    let index
    const { form } = layui
    //1.从服务器获取文章列表数据,并渲染到页面
    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            console.log(res);
            //判断请求失败
            if (res.status !== 0) {
                return layer.msg('获取分类列表失败!')
            }
            //1.4 请求成功TODO
            //使用模板引擎渲染页面:1.引入插件 2.准备模板 3 调用一个模板函数
            const htmlStr = template('tpl', res)
            $('tbody').html(htmlStr)
        })
    }

    getCateList()

    //2.点击添加按钮,添加一个文章分类
    $('.add-btn').click(function() {
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('.add-form-container').html(),
            area: ['500px', '250px']
        });
    })

    //3.监听添加表单的提交事件    坑:注意这个表单点击之后再去添加的,后创建的元素统一使用事件委托

    $(document).on('submit', '.add-form', function(e) {
        e.preventDefault()

        //3.1发送请求,把表单数据提交到服务器中
        axios.post('/my/article/addcates', $(this).serialize())
            .then(res => {
                console.log(res);
                //3.2 判断失败
                if (res.status !== 0) {
                    return layer.msg('添加文章失败!')
                }
                layer.msg('添加文章成功!')
                layer.close(index)
                getCateList()
            })
    })

    //4.点击编辑按钮,弹出编辑框
    $(document).on('click', '.edit-btn', function() {
        index = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('.edit-form-container').html(),
            area: ['500px', '250px']
        });
        //4.2获取自定义属性的值
        const id = $(this).data('id');
        //4.3 发送请求，获取当前的分类数据
        axios.get(`/my/article/cates/${id}`).then(res => {
            console.log(res);
            //判断是否失败
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }

            //4.4给编辑表单进行赋值
            form.val('edit-form', res.data)

        })
    })

    //5.监听表单的提交事件
    $(document).on('submit', '.edit-form', function(e) {
        e.preventDefault();
        //5.1 发送请求到服务器，提交表单
        //发送请求,把表单数据提交到服务器中
        axios.post('/my/article/updatecate', $(this).serialize())
            .then(res => {
                console.log(res);
                //判断失败
                if (res.status !== 0) {
                    return layer.msg('更新失败!')
                }
                layer.msg('更新成功!')
                layer.close(index)
                getCateList()
            })
    })



    $(document).on('click', '.del-btn', function() {
        const id = $(this).data('id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            axios.get(`/my/article/deletecate/${id}`).then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('删除文章分类失败!')
                } else {
                    layer.msg('删除文章类别成功！')
                }
                layer.close(index);
                getCateList()
            })
        })

    })
















})