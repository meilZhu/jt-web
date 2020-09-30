import * as $ from './libs/js/jquery-2.1.4.min.js';
import './libs/js/jquery.plugin.CommandBar.js';
import './libs/js/jquery.plugin.Dropdown.js';
import './libs/js/jquery.plugin.Dialog.js';
import './libs/js/jquery.plugin.TextField.js';
import './libs/js/jquery.plugin.Spinner.js';
import './libs/js/fabric.plugin.MessageBanner.js';
import * as PLMVisWeb from './libs/js/plmvisweb.js';
import './libs/js/JT2GoOfficeApp.Controls.js';
import "./libs/js/JT2GoOfficeApp.BrowserContainer.js";
import "./libs/js/JT2GoOfficeApp.ViewerWrapper.js";
import "./libs/js/JT2GoOfficeApp.DataHandler.js";
import "./libs/js/JT2GoOfficeApp.Resizer.js";
import "./libs/js/JT2GoOfficeApp.ObjectFactory.js";
import "./libs/js/JT2GoOfficeApp.start.js";
import "./libs/js/PLMVisWeb.init.js";
import './index.scss';


// 页面基础盒子内容
import * as HTMLContent from  "./app/container";
// import MODEL from './app/model';

const containerID = 'JT_WEB';
var mpPointGroup, mpPoint;
var markGroup;

class JTWeb {
    constructor(data) {
        this.data = data;
        mpPoint = data.points || [];
        // 设置内容
        this.setHtml(containerID, HTMLContent);

        // 设置相机位置
        this.setCamera(data.cameraPos)

        // 设置点击事件
        setTimeout(() => {
            JT2GoOfficeApp.start(data.data);
            // this.divRender(4)
            // this.click();
            $("#mpButton").on("click", this.loadMPoint);
            $("#markButton").on("click", () => { this.displayMark()});
            $("#structureButton").on("click", data.actions.displayStructureView);


            // 设置选中的模型
            viewerManager.viewer.registerSelectionEvent((e) => { this.onSelectionChange(e) });

        });
    }

    // 设置html内容
    setHtml(elId, HTML) {
        let el = document.getElementById(`${elId}`);
        el.innerHTML = HTML;
    }

    // 设置相机位置
    setCamera(pos) {
        window.initialCameraInfo = pos;
    }

    // 设置选中的模型
    onSelectionChange(psIds) {
        let ids = [];

        psIds.forEach(it => {
            ids.push(it.split(":")[1])
        })

        this.data.actions.selectionChange(ids);
    }

    loadMPoint() {
        if (mpPointGroup == null) {
            // $.ajax({
            //     url: 'data/mp_point.json',
            //     type: 'get',
            //     dataType: 'json',
            //     success: function (ary) {
            var group = new PLMVisWeb.THREE.Group();
            for (var i in mpPoint) {
                var data = mpPoint[i]
                var geometry = new PLMVisWeb.THREE.BoxGeometry(80, 30, 30);
                var material = new PLMVisWeb.THREE.MeshBasicMaterial({ color: data.color });
                var cube = new PLMVisWeb.THREE.Mesh(geometry, material);
                cube.position.set(data.pos[0], data.pos[1], data.pos[2]);
                group.add(cube);
            }
            viewerManager.viewer._scene.add(group);
            mpPointGroup = group;
            viewerManager.viewer.draw();
            //     }
            // });
        } else {
            mpPointGroup.visible = !mpPointGroup.visible;
            viewerManager.viewer.draw();
        }
    }

    displayMark() {
        if (markGroup == null) {

            var THREE = PLMVisWeb.THREE;
            // 点阵
            var PARTICLE_SIZE = 300;

            var group = new THREE.Group();

            var positions = new Float32Array([
                300, 835, 585,
                220, 835, 585,
                250, 835, 530,
                250, 835, 640,
            ]);

            var geometry = new THREE.BufferGeometry();
            geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
            //geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
            //geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );


            //var spriteMap = new THREE.TextureLoader().load( 'textures/sprites/disc.png' );
            var material = new THREE.PointsMaterial({ color: 0xFF0000, size: 30 });

            window.points = new THREE.Points(geometry, material);


            group.add(points);


            var spriteMap = new THREE.TextureLoader().load('assets/images/jt/mark.jpg', function (texture) {
                viewerManager.viewer.draw()
            });
            var material = new THREE.SpriteMaterial({ map: spriteMap });
            var sprite = new THREE.Sprite(material);
            sprite.position.set(500, 700, 580)
            sprite.scale.set(200, 200, 1)
            group.add(sprite);

            var material = new THREE.SpriteMaterial({ map: spriteMap });
            var sprite = new THREE.Sprite(material);
            sprite.position.set(500, 700, 280)
            sprite.scale.set(200, 200, 1)
            group.add(sprite);

            var material = new THREE.SpriteMaterial({ map: spriteMap });
            var sprite = new THREE.Sprite(material);
            sprite.position.set(300, 700, 800)
            sprite.scale.set(200, 200, 1)
            group.add(sprite);

            var material = new THREE.SpriteMaterial({ map: spriteMap });
            var sprite = new THREE.Sprite(material);
            sprite.position.set(0, 700, 580)
            sprite.scale.set(200, 200, 1)
            group.add(sprite);


            var material = new THREE.LineBasicMaterial({
                color: 0x00ff00,
                linewidth: 5
            });

            var geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3(300, 835, 585),
                new THREE.Vector3(400, 700, 580)
            );
            var line = new THREE.Line(geometry, material);
            group.add(line);

            var geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3(220, 835, 585),
                new THREE.Vector3(0, 700, 580)
            );
            var line = new THREE.Line(geometry, material);
            group.add(line);

            var geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3(250, 835, 530),
                new THREE.Vector3(400, 700, 280)
            );
            var line = new THREE.Line(geometry, material);
            group.add(line);

            var geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3(250, 835, 640),
                new THREE.Vector3(400, 700, 800)
            );
            var line = new THREE.Line(geometry, material);
            group.add(line);


            viewerManager.viewer._scene.add(group);
            markGroup = group;
            viewerManager.viewer.draw();
        } else {
            markGroup.visible = !markGroup.visible;
            viewerManager.viewer.draw();
        }
        
        if (markGroup.visible) {
            var cameraInfo = { 
                "pos": [258.87829863244326, -875.584139750911, 354.03820545591174],
                "rot": [0.5043430639200209, 0.5063229896693854, -0.49685579843571887, 0.49235091100639333], 
                "tgt": [263.24621155490564, 807.6279015444633, 390.15118380008056] 
            }

            this.cameraRotate(viewerManager.viewer.getCameraOrientationInfo(), cameraInfo, 1000);
        }
    }

    cameraRotate(from, to, time = 2000) {
        let count = 0;
        let rotateTimes = time / 50;

        let t = setInterval(() => {
            count++;

            let newCamera = { pos: [], rot: [], tgt: [] };
           // 设置pos步骤
            for(let i=0; i<from.pos.length; i++) {
                newCamera.pos[i] = from.pos[i] + ((to.pos[i] - from.pos[i]) / rotateTimes * count);
            }

            for(let j=0; j<from.rot.length; j++) {
                newCamera.rot[j] = from.rot[j] + ((to.rot[j] - from.rot[j]) / rotateTimes * count);
            }

            for(let l=0; l<from.tgt.length; l++) {
                newCamera.tgt[l] = from.tgt[l] + ((to.tgt[l] - from.tgt[l]) / rotateTimes * count);
            }

            viewerManager.viewer.setCameraOrientationInfo(newCamera);
            

            if(count >= rotateTimes){
                clearInterval(t);
            }

        }, rotateTimes)

    }

//    dataURIToBlob(imgName, dataURI, callback) {
//         var binStr = atob(dataURI.split(',')[1]),
//             len = binStr.length,
//             arr = new Uint8Array(len);

//         for (var i = 0; i < len; i++) {
//             arr[i] = binStr.charCodeAt(i);
//         }

//         this.callback(imgName, new Blob([arr]));
//     }

//     callback(imgName, blob) {
//         var triggerDownload = $("<a>").attr("href", URL.createObjectURL(blob)).attr("download", imgName).appendTo("body").on("click", function () {
//             if (navigator.msSaveBlob) {
//                 return navigator.msSaveBlob(blob, imgName);
//             }
//         });
//         triggerDownload[0].click();
//         triggerDownload.remove();
//     };


//     click() {
//         $("#btn").on("click", () => {
//             alert("ahaha")
//             var getPixelRatio = function (context) { // 获取设备的PixelRatio
//                 var backingStore = context.backingStorePixelRatio ||
//                     context.webkitBackingStorePixelRatio ||
//                     context.mozBackingStorePixelRatio ||
//                     context.msBackingStorePixelRatio ||
//                     context.oBackingStorePixelRatio ||
//                     context.backingStorePixelRatio || 0.5;
//                 return (window.devicePixelRatio || 0.5) / backingStore;
//             };
//             //生成的图片名称
//             var imgName = "cs.jpg";
//             var shareContent = document.getElementById("imgDiv");
//             var width = shareContent.offsetWidth;
//             var height = shareContent.offsetHeight;
//             var canvas = document.createElement("canvas");
//             var context = canvas.getContext('2d');
//             var scale = getPixelRatio(context); //将canvas的容器扩大PixelRatio倍，再将画布缩放，将图像放大PixelRatio倍。
//             canvas.width = width * scale;
//             canvas.height = height * scale;
//             canvas.style.width = width + 'px';
//             canvas.style.height = height + 'px';
//             context.scale(scale, scale);
            

//             var opts = {
//                 scale: scale,
//                 canvas: canvas,
//                 width: width,
//                 height: height,
//                 dpi: window.devicePixelRatio
//             };
//             console.log(opts)
//             let self = this;
//             html2canvas(shareContent, opts).then(function (canvas) {
                
//                 context.imageSmoothingEnabled = false;
//                 context.webkitImageSmoothingEnabled = false;
//                 context.msImageSmoothingEnabled = false;
//                 context.imageSmoothingEnabled = false;
//                 var dataUrl = canvas.toDataURL('image/jpeg', 1.0);
//                 self.dataURIToBlob(imgName, dataUrl, self.callback);
//             });
//         });
//     }





//     divRender(num) {
//         var THREE = PLMVisWeb.THREE;
//         var distance;
//         var point;
//         for(var i=0;i<=7;i++) {
//             if (i != num-1) {
                
//                 //计算出两物体连线的中间点
//                 point=new THREE.Vector3(0, 350, 585);
                
//                 var position=point;
//                 var windowPosition=this.transPosition(position);
//                 var left=windowPosition.x;
//                 var top=windowPosition.y;

//                 var newDiv = document.createElement("div");
//                 newDiv.id="c"+i;
//                 newDiv.innerHTML=`
//                     <h1>这是测试内容</h1>
//                     <p>这是上课开始思考思考</p>
//                 `;
//                 newDiv.style.position='absolute';
//                 newDiv.style.left = left+'px';
//                 newDiv.style.top=top + 'px';
//                 document.getElementById("tap").appendChild(newDiv);
//             }
//         }
//     }

//     //去除Div
//     clearDiv(num) {
//         for(var i=0;i<=7;i++){
//             if (i != num-1) {
//                 document.getElementById('c'+i).remove();
//             }
//         }
//     }

//     //可以把 new THREE.Vector3(position.x,position.y,position.z)的坐标转化为屏幕的x,y坐标
//     transPosition(position){
//         var THREE = PLMVisWeb.THREE;       
//         let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

//         var THREE = PLMVisWeb.THREE;
//         let world_vector = new THREE.Vector3(position.x,position.y,position.z);
//         let vector =world_vector.project(camera);
//         let halfWidth = window.innerWidth / 2,
//             halfHeight = window.innerHeight / 2;
//         console.log(vector, {
//             x: Math.round(vector.x * halfWidth + halfWidth),
//             y: Math.round(-vector.y * halfHeight / 3 + halfHeight)
//         })

//         return {
//             x: Math.round(vector.x * halfWidth + halfWidth),
//             y: Math.round(-vector.y * halfHeight / 3 + halfHeight)
//         };
//     }
    
}

const jt_web = (data) => new JTWeb(data);

if (window) {
  window.jt_web = jt_web;
}

export default jt_web;

define(function () { 'use strict';
    return jt_web;
});