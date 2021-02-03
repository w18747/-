$(function() {
    const { form } = layui

    //定义一个全局的变量
    let state = ''

    //1.从服务器获取文章的分类列表
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
    //2.初始化富文本编辑器
    initEditor()

    //3.先获取要裁剪的图片
    const $image = $('#image')

    //4.初始化裁剪区
    $image.cropper({
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    });

    //5.为选择框按钮绑定点击事件
    $('#choose-btn').click(function() {
        console.log(123);

        //自动触发文件框的点击事件
        $('#file').click()
    })

    //6.给文件选择框绑定change事件
    $('#file').change(function() {
        //6.1把文件转换成blob格式的url
        const imgUrl = URL.createObjectURL(this.files[0]);
        //6.2替换掉裁剪区的图片
        $image.cropper('replace', imgUrl)
    })

    //7. 监听表单的提交事件(点击发布或存为草稿)
    $('.publish-form').submit(function(e) {
        e.preventDefault()

        //7.1 获取表单中所有的内容=>new FormData(原生表单元素)
        const fd = new FormData(this)

        //formdata相关方法:append()set()get()forEach()
        //7.2 检测formdata中的数据是否获取成功
        fd.forEach(item => {
            console.log(item);
        })

        //7.3向fd中新增一条state数据
        fd.append('state', state)

        //7.4 获取裁剪封面图片的二进制数据
        $image.cropper('getCroppedCanvas', {
            //指定裁剪后图片的宽高
            width: 400,
            height: 280
        }).toBlob(blod => {
            //7.5 把获取图片的数据添加到formdata中
            console.log(blod);
            fd.append('cover_img', blod)


            publishArticle(fd)
        })


    })

    //8.点击发布和存为草稿来改变state状态值
    $('.last-row button').click(function() {
        //8.1 获取自定义属性的值
        state = $(this).data('state')
        console.log(state);

    })

    //9.在外层封装一个发布到文章到服务器的函数,参数就是组装好的formdata数据
    function publishArticle(fd) {
        axios.post('/my/article/add', fd).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('发表失败!')
            }
            layer.msg('发表成功!')

            //TODO跳转到文章列表
            location.href = './list.html'

            // window.parent.$('.layui-this').prev().addClass('layui-this').siblings().removeClass('layui-this')
            window.parent.$('.layui-this').prev().find('a').click()
        })
    }








})