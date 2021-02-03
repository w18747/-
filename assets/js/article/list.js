$(function() {
    const { form, laypage } = layui

    getCatelist()

    function getCatelist() {
        //1.2发送请求
        axios.get('/my/article/cates').then(res => {
            //1.3判断失败
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }
            //1.4遍历数组,渲染下拉组件的选项
            res.data.forEach(item => {
                $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`)
            });
            //1.5 坑:动态创建的表单元素响需要手动创建
            form.render('select')
        })
    }

    //2.定义一个查询对象
    const query = {
        pagenum: 1, //表示当前的页码值
        pagesize: 2, //表示每一页显示的数据条数
        cate_id: '',
        state: ''
    }

    //3.发送请求,来获取文章列表数据
    renderTable()

    function renderTable() {
        //3.1 发送请求
        axios.get('/my/article/list', { params: query }).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }

            template.defaults.imports.dateFormat = function(date) {
                return moment(date).format('YYYY-MM-DD  HH:mm:ss ');
            }



            //3.2 模板引擎
            const htmlStr = template('tpl', res)
            $('tbody').html(htmlStr)

            //3.3渲染分页器
            randerPage(res.total)
        })
    }

    //4.把服务端获取的数据,渲染成分页器
    function randerPage(total) {
        laypage.render({
            elem: 'pagination', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: query.pagesize, //每页显示的数量
            limits: [2, 3, 4, 5], //每数据的条数
            curr: query.pagenum, //当前的页码值
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //分页器的排版布局
            //切换分页的回调函数
            jump: function(obj, first) {
                // obj包含了当前分页的所有参数,比如:
                console.log(obj.curr); //得到当前页,以便向服务端请求对应页的数据
                console.log(obj.limit); //得到的每页显示的条数
                //4.2 修改查询对象的参数
                query.pagenum = obj.curr
                query.pagesize = obj.limit

                //首次不执行
                if (!first) {
                    //4.3非首次进入页面,需要重新渲染表格数据
                    renderTable()
                }
            }
        })
    }

    //5.表单筛选功能
    $('.layui-form').submit(function(e) {
        e.preventDefault()

        ///5.1获取下拉选择框的分类id和状态this.seralize()
        const cate_id = $('#cate-sel').val()
        const state = $('#state').val()
        console.log(cate_id, state);

        //5.2把获取到的值重新赋值给query对象
        query.cate_id = cate_id
        query.state = state

        //在提交之前去修改页码值
        query.pagenum = 1


        //5.3重新调用renderTable()
        renderTable()
    })

    //6.点击删除按钮,删除当前的文章
    $(document).on('click', '.del-btn', function() {
        //6.1获取当前自定义属性值
        const id = $(this).data('id')
        console.log(id);
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            // 6.2 发送请求到服务器,删除这条分类
            axios.get(`/my/article/delete/${id}`).then(res => {
                if (res.status !== 0) {
                    return layer.msg('删除失败!')
                } else {
                    layer.msg('删除成功！')
                };
                //7.填坑处理:当前页只要一条数据且不处在第一页的时候,那么我们点击了删除按钮之后,应该去手动更新上一页的数据
                if ($('.del-btn').length == 1 && query.pagenum !== 1) {
                    //当前页码减一
                    query.pagenum--
                }
                //6.5重新渲染
                layer.close(index);
                renderTable()
            })
        })
    })

    //7.点击编辑按钮跳转到文章的编辑页面
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id')
        location.href = `./edit.html?id=${id}`
        window.parent.$('.layui-this').next().find('a').click()
    })
































})