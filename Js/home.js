var map = new BMap.Map("baidumap");// 创建地图实例
map.enableScrollWheelZoom(true);//开启鼠标滚轮缩放

map.addControl(new BMap.ScaleControl());//一个比例尺控件和
map.addControl(new BMap.GeolocationControl());
map.addControl(new BMap.NavigationControl());//平移缩放
map.addControl(new BMap.OverviewMapControl());//一个缩略图控件


// map.centerAndZoom第二个参数是地图缩放级别，最大为19，最小为0
//map.centerAndZoom方法创建地图
// 第一个参数可以是根据之前创建好的一个点为中心，创建出地图，也可以根据城市地区的中文名称创建地图。
map.centerAndZoom('扬州', 15);
var point = new BMap.Point(119.433,32.394);  //创建点
var marker = new BMap.Marker(point);        // 创建标注
map.addOverlay(marker);                     // 将标注添加到地图中


var stCtrl = new BMap.PanoramaControl(); //构造全景控件
stCtrl.setOffset(new BMap.Size(20, 20));
map.addControl(stCtrl);//添加全景控件

//鹰眼

var opt01 ={anchor: BMAP_ANCHOR_BOTTOM_RIGHT};
var overView=new BMap.OverviewMapControl(opt01);
map.addControl(overView);

var opts1 = {
    width : 100,     // 信息窗口宽度
    height: 60,     // 信息窗口高度
    title : "别点了" , // 信息窗口标题
    enableMessage:true,//设置允许信息窗发送短息
}
var infoWindow = new BMap.InfoWindow("这是我家，扬州", opts1);  // 创建信息窗口对象
marker.addEventListener("click", function(){
    map.openInfoWindow(infoWindow,point); //开启信息窗口
});

//地图定位中心点，以及缩放级别
// map.centerAndZoom(new BMap.Point(119.433,32.394), 15);
map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
//如下示例，为根据关键字检索POI：
function poisearch(regin){
    var local = new BMap.LocalSearch(map, {
        renderOptions: {map: map}
    });
    local.search(regin.toString());}

//逆地址解析
var geoc = new BMap.Geocoder();
map.addEventListener("click", function(e){
    var pt = e.point;

    //创建标注点
    var marker = new BMap.Marker(e.point);
    map.addOverlay(marker);

    //创建移除标注点函数
    var removeMarker = function(e,ee,marker){
        map.removeOverlay(marker);
    }
    //创建右键菜单
    var markerMenu=new BMap.ContextMenu();
    markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(marker)));
    marker.addContextMenu(markerMenu);


    geoc.getLocation(pt, function(rs){
        var addComp = rs.addressComponents;
        var div1 = document.getElementById("textDiv");
        var div2 = document.getElementById("jing");
        div1.textContent ="当前地图点击位置："+addComp.province + " " + addComp.city + " " + addComp.district + " " + addComp.street + " " + addComp.streetNumber;
        div2.textContent ="点击点的经纬度：" + e.point.lng + ", " + e.point.lat;
    });
});


//公交出行
function chuxing(start,end){
    var map = new BMap.Map("baidumap");
    var transit = new BMap.DrivingRoute(map, {renderOptions: {map: map, panel: "r-result", enableDragging : true //起终点可进行拖拽
        }
    });
    transit.search(start.toString(),end.toString());}
//步行规划
function walk(start,end){
    var map = new BMap.Map("baidumap");
    var walking = new BMap.WalkingRoute(map, {renderOptions:{map: map, panel: "r-result",autoViewport: true}});
    walking.search(start.toString(),end.toString());}

//驾车路线
function car(start,end){
    var map = new BMap.Map("baidumap");
    var driving = new BMap.DrivingRoute(map, {renderOptions: {map: map, panel: "r-result", autoViewport: true}});
    driving.search(start.toString(),end.toString());}

//路况信息
var Trafficstatus=true;
var traffic = new BMap.TrafficLayer();        // 创建交通流量图层实例
function nowRoad(){
    if(Trafficstatus){
        map.addTileLayer(traffic);                    // 将图层添加到地图上
        Trafficstatus=!Trafficstatus;
    }else{
        map.removeTileLayer(traffic);                // 将图层移除
        Trafficstatus=!Trafficstatus;
    }
}


//测距
var myDis = new BMapLib.DistanceTool(map);   //测距插件

// 添加带有定位的导航控件
var navigationControl = new BMap.NavigationControl({
    // 靠左上角位置
    anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
    // LARGE类型
    type: BMAP_NAVIGATION_CONTROL_LARGE,
    // 启用显示定位
    enableGeolocation: true
});

// 添加定位控件
function locationNow(){
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
        }
        else {
            alert('定位失败，请确认浏览器已允许网站获取定位权限');
        }
    });
}



