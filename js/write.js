//var map=new qq.maps.Geolocation('BYKBZ-USGC6-6DLS3-EBN6U-SV3RF-HSB27','day');
var title='';
var content='';
var lat=0;
var lng=0;
var city='';
var site='';
var weather='';
var img='';
var detailed='';	//街道详细地址
var cond_code=100;	//天气代码
mui.plusReady(function() {
    plus.geolocation.getCurrentPosition(translatePoint,function(e){
        mui.toast("异常:" + e.message);
    });
});
function translatePoint(r){
    lng = r.coords.longitude;
    lat = r.coords.latitude;
	city=r.address.city;
	console.log(r);
	//和风天气API
	$.ajax({
		url:'https://free-api.heweather.com/s6/weather/now?location='+city+'&key=42b8b629e839425ea43ab261709c38d0',
		success:function(data){
			weather=data.HeWeather6[0].now.cond_txt;
			cond_code=data.HeWeather6[0].now.cond_code;
			console.log(data);
		}
	});
	//腾讯地图API
  	$.ajax({
		url:"https://apis.map.qq.com/ws/geocoder/v1/?location="+lat+","+lng+"&key=BYKBZ-USGC6-6DLS3-EBN6U-SV3RF-HSB27&get_poi=1&poi_options=radius=2000;page_size=20;page_index=1;policy=2&output=jsonp",
		dataType:"jsonp",
		success:function(res){
			console.log(res);
			res=res.result;
			detailed=res.address;
			if(res.formatted_addresses.recommend){
				$('.location').html(res.formatted_addresses.recommend);
				site=res.formatted_addresses.recommend;
			}else if(res.pois[0]){
				$('.location').html(res.pois[0].title);
				site=res.formatted_addresses.recommend;
			}else{
				$('.location').html(res.address);
				site=res.formatted_addresses.recommend;
			}
			
		}
	})
}
		
$('.noscrollbars').css('height',$(window).height()-$('.title').height()-$('header').height()-180);//46 是margin的高
$('.location').click(function(e){
	$('.locationList').css({
		left:0
	});
	console.log('xxx');
	var html='';
	var pois=[];
	for(var i=1;i<=3;i++){
		$.ajax({
			url:"https://apis.map.qq.com/ws/geocoder/v1/?location="+lat+","+lng+"&key=BYKBZ-USGC6-6DLS3-EBN6U-SV3RF-HSB27&get_poi=1&poi_options=radius=2000;page_size=20;page_index="+i+";policy=2&output=jsonp",
			dataType:"jsonp",
			async:false,
			success:function(res){
				for(var j=0;j<res.result.pois.length;j++){
					html+=`
						<li class="mui-table-view-cell mui-media">
				            <div class="mui-media-body">
				                <span>${res.result.pois[j].title}</span>
				                <p class='mui-ellipsis'>${res.result.pois[j].address}</p>
				            </div>
				    </li> 
					`	
				}
				$('.locationList').append(html);
				html="";
			}
		})
	}
});
$('.locationList').delegate('li','click',function(e){
	console.log(this.children[0].children[0].textContent);
	site=this.children[0].children[0].textContent;
	detailed=this.children[0].children[1].textContent;
	console.log(detailed);
	$('.location').html(this.children[0].children[0].textContent);
	$('.locationList').css('left','100%');
})

//图片上传
// 初始化Web Uploader
var uploader = WebUploader.create({

    // 选完文件后，是否自动上传。
    auto: false,
	multiple:true,
    // swf文件路径
    swf:'',
	thumb:{
		allowMagnify:true,
		width:800,
		height:800
	},
	compress:false,
    // 文件接收服务端。
    server: 'http://zhaohs.cn/data/uploadImg.php',
	threads:1,
    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: '#imgUp',

    // 只允许选择图片文件。
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
});
// 当有文件添加进来的时候
$list=$('#fileList');
var fileCount=0;
var width=0;
$('#fileList').on('click','.file-item>span',function(){
	console.log($(this).parent().attr('id'));
	uploader.removeFile($(this).parent().attr('id'),true);
	$(this).parent().remove();
})
uploader.on( 'fileQueued', function( file ) {
	fileCount++;
    var $li = $(
            '<div id="' + file.id + '" class="file-item thumbnail mui-control-item">' +'<span class="close"></span>'+
                '<img>' +
                '<div class="info">' + file.name + '</div>' +
            '</div>'
            ),
        $img = $li.find('img');

    // $list为容器jQuery实例
    $list.css('width',(width+=130)+'px');
    $list.css('height',108+'px');
    $list.prepend( $li );
    $('#fileList>div').FlyZommImg();
    console.log(uploader.getStats());

    // 创建缩略图
    // 如果为非图片文件，可以不用调用此方法。
    // thumbnailWidth x thumbnailHeight 为 100 x 100
    uploader.makeThumb( file, function( error, src ) {
        if ( error ) {
            $img.replaceWith('<span>不能预览</span>');
            return;
        }

        $img.attr( 'src', src );
    });
});
//提交
function sub(){
	title=$('#title').val();
	content=$("#content").val();
	if(title==""){
		title="【"+new Date().toLocaleDateString().replace(/\//ig,'-')+"】";
	}
	if(content==""){
		alert('请输入日记内容');
		return;
	}
	uploader.upload();
	if(uploader.getStats().queueNum==0){
		$.ajax({
				type:'post',
				url:'http://zhaohs.cn/data/account/day.php',
				data:{
					title:title,
					content:content,
					site:site,
					weather:weather,
					img:'',
					city:city,
					detailed:detailed,
					cond_code:cond_code
				},
				success:function(data){
					console.log(data);
					mui.back();
				}
			});
	}else{
		uploader.on( 'uploadSuccess', function( file,response ) {
			img+=response._raw+',';
			if(uploader.getStats().queueNum==0){
				img=img.substring(0, img.length - 1);;
				$.ajax({
					type:'post',
					url:'http://zhaohs.cn/data/account/day.php',
					data:{
						title:title,
						content:content,
						site:site,
						weather:weather,
						img:img,
						city:city,
						detailed:detailed,
						cond_code:cond_code
					},
					success:function(data){
						console.log(data);
						mui.back();
					}
				});
			}
	    	
		});
	}
	
}
