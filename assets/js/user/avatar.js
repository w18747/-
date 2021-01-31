$(function() {
    //1.获取要裁剪的图片
    const $image = $('#image')

    //2.初始化裁剪区域 cropper()
    $image.cropper({
        //指定的长宽比
        aspectRatio: 1,
        corp: function(event) {
            //裁剪事件
            console.log(event.detail.x);
            console.log(event.detail.y);
        },
        //指定预览区,提供选择器
        preview: '.img-preview'

    })

    //3.点击上传按钮，上传图片
    $('#upload-btn').click(function() {
        $('#file').click()
    })

    //4.监听文件框状态改变事件 change:file,checjbox,select
    $('#file').change(function() {
        //4.1获取用户上传的文件列表
        console.log(this.files); //伪数组

        //判断用户是否上传
        if (this.files.length == 0) return



        //把文件转成url地址的形式
        const imgUrl = URL.createObjectURL(this.files[0])

        //替换裁剪区的图片
        $image.cropper('replace', imgUrl)
    })

    //5.点击确定，上传图片到服务器
    $('#save-btn').click(function() {
        //5.1 获取裁剪后图片的base64格式
        const dataURL = $image.cropper('getCroppedCanvas', { width: 100, height: 100 }).toDataURL('image/jpeg')

        //5.2手动构建查询参数
        const search = new URLSearchParams();
        //使用append方法
        search.append('avatar', dataURL)

        //5.3发送请求，发送到服务器
        axios.post('/my/update/avatar', search).then(res => {
            console.log(res);

            //5.4判断失败
            if (res.status !== 0) {
                return layer.msg('上传失败!')
            }
            layer.msg('上传成功!')

            window.parent.getUserInfo()
        })
    })
})