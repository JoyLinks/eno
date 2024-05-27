# eno
提供HTML标签与数据对象之间的互操作支持。

## 安装
``` cmd
npm install @joyzl/eno
```

``` javascript
import eno from `eno`;
```

## 使用

### sets
将数据对象（例如从服务器获取的JSON对象）设置到HTML元素以显示数据。

首先建立HTML标签元素如下所示：
```html
<div id="user">
	<span name="realname"></span>
	<span name="birthday"></span>
</div>
```

将数据对象设置到HTML标签元素。
```javascript
let user = {
	realname:"小明",
	birthday:"1992-5-27"
};
let div = document.getElementById("user");
eno.sets(div, user);
```

数据对象的字段值将根据HTML标签元素指定的name属性插入到标签中。
```html
<div id="user">
	<span name="realname">小明</span>
	<span name="birthday">1992-5-27</span>
</div>
```

### gets

