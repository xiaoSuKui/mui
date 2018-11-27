var map=new qq.maps.Geolocation('BYKBZ-USGC6-6DLS3-EBN6U-SV3RF-HSB27','day');
var lat=0;
var lng=0;
var city='';
var loca='';
console.log($(window).height());
console.log($('header').height());
console.log($('.title').height());
$('.noscrollbars').css('height',$(window).height()-$('.title').height()-$('header').height()-46);//46 是margin的高
map.getLocation(
	function(res){
		lat=res.lat;
		lng=res.lng;
		city=res.city;
		
	},
	function(res){
		console.log(res);
	},{failTipFlag:true});
	console.log($('.location'));
$('.location').click(function(e){
	$('.locationList').css({
		left:0
	});
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
	loca=this.children[0].children[1].textContent+'·'+city+'·'+this.children[0].children[0].textContent;
	$('.location').html(this.children[0].children[0].textContent);
	$('.locationList').css('left','100%');
})
