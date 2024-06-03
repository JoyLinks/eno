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
	realname: "小明",
	birthday: "1992-5-27"
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
从HTML元素获取JSON对象以获得用户数据。
与sets方法的功能正好相反。

假设有以下HTML实例：
```html
<div id="user">
	<span name="realname">小明</span>
	<span name="birthday">1992-5-27</span>
</div>
```

执行gets方法获取数据对象：
```javascript
let values = eno.gets(element);
//{
//	realname: "小明",
//	birthday: "1992-5-27"
//}
```

获取表单输入值，gets将识别传入参数是否表单。
```html
<form>
	<input type="text" name="user" value="小张"/>
	<input type="text" name="birthday" value="1982-10-30"/>
</form>
```

执行gets方法获取form数据对象：
```javascript
let values = eno.gets(element);
//{
//	realname: "小张",
//	birthday: "1982-10-30"
//}
```


### query
获取指定URL或当前URL中的查询字符串参数。

```javascript
// 从指定URL获取参数
let url = "http://www.joyzl.net/test?name=value";
let value = eno.query(url, "name");

// 从当前URL获取参数
let token = eno.query("token");
```

### select
获取符合指定选择器字符串的第一个元素。

在整个文档实例范围中查找：
```javascript
let element = eno.select("#user");
```

在指定元素实例范围中查找：
```javascript
let form = eno.select("form");
let user = eno.select(form, "#user");
```


### selects
获取符合指定选择器字符串的所有元素。


在整个文档实例范围中查找：
```javascript
let elements = eno.selects("#user");
```


在指定元素实例范围中查找：
```javascript
let forms = eno.selects("form");
let users = eno.selects(form, "#user");
```
