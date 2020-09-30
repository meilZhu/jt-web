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

const jt_web = jt_web({
    // 数据
    data: {
        title: '测试产品',  // 模型组件名称
        psId: '122',  // 模型组件ID
        "units": 5,  
    }
})