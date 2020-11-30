### 鑫蜂维产品引流组件

参数|类型|是否必须|描述
---|:--:|---:|---
current|string|是|传入你当前的产品（不会展示当前的产品）
current： '橘猫企训'｜'鑫营销'｜'鑫支出'｜'鑫资产'｜'云社区'

demo
```js
import XfwProducts from '@/components/XfwProducts'

return (
  <XfwProducts current="鑫营销">
    // 点击内容根据不同的项目自定义
    <span>
      鑫蜂维其他产品
    </span>
  </XfwProducts>
)
```