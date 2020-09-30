# @ithinkdt/jt-web

bom 3d模型的 jt数据在web端的展示工具

## how to install

#### For TypeScript such as Angular Vue React

install

```
npm i @ithinkdt/jt-web --save-dev
```

Import

```
import jt-web from '@ithinkdt/jt-web';
```

## How to use

#### html

```
// 这里的 id 固定 JT_WEB, class 固定 siemens-app-container
<div class="siemens-app-container" id="JT_WEB"></div>
```

#### js
##### 初始化 （渲染配置）

```
const jt_web = jt_web({
    // 数据
    data: {
        title: '测试产品',  // 模型组件名称
        psId: '122',  // 模型组件ID
        "units": 5,  // 应该是单位
        bboxMax: [12, 13, 14], // 模型最大坐标
        bboxMIn: [1, 2, 3], // 模型最小坐标 （两种应该可以求出模型的大小）
        mat64: '' ,  // 具体的数据信息
        modelId: '11', // 模型Id
        version: '1.2.2', // 版本
        xform: [1,0,0,0,-1,0,0,0,1,223, 134, 122], // 12个数， 后三个是坐标， 前九个应该和旋转有关
        children: [],  // 他的子集
    },
    // 相机的配置属性
    cameraPos:  { pos: [], rot: [], tgt: [] },  // 默认就传空
    // 抛出的事件
    actions: {
        // 顶部左上角的展示
        displayStructureView: () => {
            console.log('展示nav')
        },
        // 模型上的点击零件的事件， 抛出psId
        selectionChange: (e) => {
            console.log(e)
        }
    },
    // 位置 (解释待定)
    points: [
         {"pos":[500, 700, 1200], "color":"#ff0000"},
          {"pos":[1200, 680, 1250], "color":"#dd0000"},
          {"pos":[1400, 660, 1260], "color":"#aa0000"},
          {"pos":[1600, 660, 1260], "color":"#990000"},
          {"pos":[1800, 660, 1260], "color":"#770000"},
          {"pos":[2000, 650, 1260], "color":"#550000"},
          {"pos":[2200, 650, 1260], "color":"#330000"},
          {"pos":[2400, 640, 1250], "color":"#110000"},
          {"pos":[2600, 630, 1240], "color":"#001100"},
          {"pos":[2800, 620, 1230], "color":"#003300"}
    ]

})
```