# eno
易用、简洁、轻量且高效的HTML操作库。

[joyzl eno](http://eno.joyzl.com)

## 安装
``` cmd
npm install @joyzl/eno
```

``` javascript
import eno from '@joyzl/eno';
```

## 使用

### eno.sets()

eno.sets() 将数据对象（通常为JSON实例）设置到HTML标签显示。

参数形式：
* eno.sets(element, parameter);
* eno.sets(selector, parameter);
* eno.sets(element, selector, parameter);
* eno.sets(element, parameter, converter);
* eno.sets(element, selector, parameter, converter);

参数含义：
* element 元素实例/元素查找范围；
* selector 选择器字符串；
* parameter 数据对象/数据对象数组；
* converter 转换函数 function(element, parameter, name){}；

转换函数参数含义：
* element 元素实例；
* parameter 对象实例；
* name 情形值；

#### 单个对象设置到HTML显示

将单个数据对象（例如从服务器获取的JSON对象）设置到HTML元素以显示数据。

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

#### 多个对象设置到HTML显示

将多个数据对象（例如从服务器获取的JSON对象数组）设置到HTML元素以显示数据；
此时eno将自动克隆创建对应数量的HTML元素以对应多项数据。

首先建立HTML标签元素如下所示：
```html
<div id="users">
	<div>
		<span name="realname"></span>
		<span name="birthday"></span>
	</div>
</div>
```

将数据对象设置到HTML标签元素。
```javascript
let users = [{
		realname: "小明",
		birthday: "1992-5-27"
	},
	{
		realname: "小王",
		birthday: "1993-8-16"
	}
];
eno.sets("#users", users);
```

数据对象的字段值将根据HTML标签元素指定的name属性插入到标签中；
此时eno将 "#users" DIV 的子元素作为模板，自动克隆以显示多项数据。
```html
<div id="users">
	<div>
		<span name="realname">小明</span>
		<span name="birthday">1992-5-27</span>
	</div>
	<div>
		<span name="realname">小王</span>
		<span name="birthday">1993-8-16</span>
	</div>
</div>
```

在相同元素实例多次执行eno.sets方法时，eno将自动维护对应的数量的子元素，以保持正确的显示；
如果传入的对象数组为[]或null这将清除所有子元素，eno会通过隐藏以保留原始模板。

#### 多个对象设置到HTML显示并指定模板

通过模板&lt;template&gt;显示多个对象到HTML中具有更好的灵活性，eno将保留模板标签之外的HTML。
```html
<div id="users">
	<div>
		<span>用户列表</span>
	</div>
	<template>
		<div>
			<span name="realname"></span>
			<span name="birthday"></span>
		</div>
	</template>
</div>
```

执行eno.sets("#users",users)将得到如下HTML实例：
```html
<div id="users">
	<div>
		<span>用户列表</span>
	</div>
	<template>
		<div>
			<span name="realname"></span>
			<span name="birthday"></span>
		</div>
	</template>
	<div>
		<span name="realname">小明</span>
		<span name="birthday">1992-5-27</span>
	</div>
	<div>
		<span name="realname">小王</span>
		<span name="birthday">1993-8-16</span>
	</div>
</div>
```
eno根据"#users"中的&lt;template&gt;创建对应数量的HTML元素显示数据，
并保留其它HTML标签（也保留&lt;template&gt;本身，因为此标签不会被显示）。

#### 在HTML指示对象字段

将对象通过HTML显示时，eno通过标签的"name"属性值确定对象字段（区分大小写）；
属性值支持点语法分隔多级字段，例如："department.name"；

eno确定对象字段后将根据标签类型执行默认的值设置：
* input标签设置为value属性值；
* img标签设置为src属性值；
* 其它标签设置为内部文本(innerText)；

```html
<div id="users">
	<template>
		<div>
			<img name="avatar"/>
			<span name="realname"></span>
			<span name="birthday"></span>
			<span name="department.name"></span>
		</div>
	</template>
</div>
```
```javascript
let users = [{
		realname: "小明",
		birthday: "1992-5-27",
		avatar: "okjniybu.png",
		department: {
			name: "A部"
		}
	},
	{
		realname: "小王",
		birthday: "1993-8-16",
		avatar: "likjudde.png",
		department: {
			name: "B部"
		}
	}
];
eno.sets("#users", users);
```

#### 自定义对象字段与HTML显示方式

如果默认行为无法满足显示需求，例如根据状态字段更改颜色，
可通过"case"属性值和自定义转换函数执行特殊处理；
```html
<div id="users">
	<template>
		<div>
			<img case="url"/>
			<span name="realname"></span>
			<span name="birthday"></span>
			<span name="department.name"></span>
		</div>
	</template>
</div>
```
转换函数将在遇到的每一个"case"属性时触发，并传入三个参数
分别为element表示"case"所在的元素实例，
parameter表示当前数据对象，
name指示"case"的值；
```javascript
let users = [...];
eno.sets("#users", users, function(element, parameter, name){
	if(name=="url"){
		element.src = "http://joyzl.net/" + parameter.avatar;
	}
});
```
通过转换函数可以执行任何需要的自定义处理；
但须注意的是，每个模板实例中的多个"case"都将调用转换函数，
如果同时指定"name"属性，将在调用转换函数后执行默认行为。

### eno.gets()

从HTML元素获取用户数据以形成JSON对象实例。
与eno.sets方法的行为正好相反，将从HTML中具有"name"属性的标签提取数据。

参数形式：
* eno.gets(element);
* eno.gets(selector);
* eno.gets(element, converter);
* eno.gets(selector, converter);
* eno.gets(element, selector, converter);

参数含义：
* element 元素实例；
* selector 选择器字符串；
* converter 转换函数 function(element, parameter, name){}；

转换函数参数含义：
* element 元素实例；
* parameter 对象实例；
* name 情形值；

#### 从HTML中提取数据

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
// values 实例字段如下
// {
//		realname: "小明",
//		birthday: "1992-5-27"
// }
```
eno.gets将普通标签获取内部普通文本内容(innetText)。

#### 从表单中提取数据

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
// values 实例字段如下
// {
//		realname: "小张",
//		birthday: "1982-10-30"
// }
```
eno.gets将表单标签获取控件值内容(control.value)。

#### 自定义数据提取方式

与eno.sets方法相同，eno.gets也支持同样参数的数据转换函数用于自定义提取方式。
```javascript
let values = eno.gets(element, function(element, parameter, name){
	if(name=="url"){
		parameter.avatar = element.src.replace("http://joyzl.net/","");
	}
});
// values 实例字段如下
// {
//		realname: "小张",
//		birthday: "1982-10-30",
//		avatar: "okjniybu.png"
// }
```

### eno.create()

eno.create() 用于将字符串形式的HTML标签创建为HTML实例。

参数形式：
* eno.create(html);

参数含义：
* html 字符串；

```javascript
let element = eno.create("<div><a href='http://www.joyzl.com'>joyzl</a></div>");
```

注意：此时创建的标签实例未插入文档中，因此不会在浏览器网页呈现。

### eno.append()

eno.append() 用于将字符串形式的HTML标签创建为HTML实例，并插入文档指定的位置尾部。

参数形式：
* eno.append(element, html);
* eno.append(selector, html);

参数含义：
* element 元素实例；
* selector 选择器字符串；
* html 字符串；

```javascript
// 添加到<body>中尾部
let element1 = eno.append("<div><a href='http://www.joyzl.com'>joyzl</a></div>");

// 添加到指定元素中尾部
let parent = document.getElementById("main");
let element2 = eno.append(parent, "<div><a href='http://www.joyzl.com'>joyzl</a></div>");
```

### eno.replace()

eno.replace() 用于将字符串形式的HTML标签创建为HTML实例，并替换指定的元素。

参数形式：
* eno.replace(element, html);
* eno.replace(selector, html);

参数含义：
* element 元素实例；
* selector 选择器字符串；
* html 字符串；

```javascript
let element = document.getElementById("customer-define");
element = eno.replace(element, "<div><a href='http://www.joyzl.com'>joyzl</a></div>");
```

### eno.select()

eno.select() 用于在文档或指定范围查找元素。

参数形式：
* eno.select(selector);
* eno.select(element, selector);

参数含义：
* element 元素实例；
* selector 选择器字符串；

```javascript
// 在整个文档中查找
let element = eno.select("#id");

// 在指定元素中查找
element = eno.select(element, "div");
```

支持标准的CSS选择器字符串，如果匹配多个元素将以数组返回结果集，仅匹配单个时仅返回匹配的元素实例。 

### eno.remove()

eno.remove() 用于移除文档中的指定元素。

参数形式：
* eno.remove(element);
* eno.remove(selector);
* eno.remove(element, selector);

参数含义：
* element 元素实例；
* selector 选择器字符串；

### eno.hide()

eno.hide() 用于隐藏元素。

参数形式：
* eno.hide(element);
* eno.hide(selector);
* eno.hide(element, selector);

参数含义：
* element 元素实例；
* selector 选择器字符串；

### eno.show()

eno.show() 用于显示元素。

参数形式：
* eno.show(element);
* eno.show(selector);
* eno.show(element, selector);

参数含义：
* element 元素实例；
* selector 选择器字符串；

### eno.toggle()

eno.toggle() 用于切换元素显示或样式类。
调用此方法仅指定元素或选择器参数，指定或匹配的元素将显示，其余同级元素全部隐藏；
如果指定了样式类参数(applyClass, otherClass)，则匹配的元素将应用applyClass，其余同级元素应用otherClass样式类。

参数形式：
* eno.toggle(element);
* eno.toggle(selector);
* eno.toggle(element, selector);
* eno.toggle(element, applyClass, otherClass);
* eno.toggle(element, selector, applyClass, otherClass);

参数含义：
* element 元素实例；
* selector 选择器字符串；
* applyClass 当前元素应用的样式类；
* otherClass 其它元素应用的样式类；

此功能可用于层叠卡片显示切换或选中项高亮。



### eno.bind()

eno.bind() 用于绑定元素的事件。

参数形式：
* eno.bind(element, eventName, listener);
* eno.bind(selector, eventName, listener);
* eno.bind(element, selector, eventName, listener);

参数含义：
* element 元素实例；
* selector 选择器字符串；
* eventName 事件名称 "click"、"submit" ...；
* listener 事件处理函数 function(event){}；

处理函数参数含义：
* this 元素实例；
* event 事件实例；

此方法的事件绑定与DOM API并无任何差异，其行为与Element.addEventListener()完全相同。

#### eno.sets()的事件处理

对于通过eno.sets()方法生成并填充值的元素，如果要监听每个元素的事件，
可通过eno.bind()配合eno.entity()和eno.element()方法优化事件处理，而无须为每个子元素绑定事件；

具体方法如下：
+ 容器绑定所需事件；
+ 在处理函数中通过eno.element()获取目标元素实例；
+ 在处理函数中通过eno.entity()获取目标对象实例；

示例代码：
```javascript
const element = eno.append(`
<div id="users">
	<div>
		<span>用户列表</span>
	</div>
	<template>
		<div>
			<span name="realname"></span>
			<span name="birthday"></span>
		</div>
	</template>
</div>
`);
eno.bind(element,"click",function(event){
	// 获取数据对象实例
	eno.entity(event)
	
	// 获取元素对象实例
	eno.element(event);
});
eno.sets(element,data);
```

### eno.entity()

eno.entity() 用于获取通过eno.sets()方法填充元素的数据对象。

参数形式：
* eno.entity(event);
* eno.entity(element);
* eno.entity(element, selector);

参数含义：
* event 事件实例；
* element 元素实例；
* selector 选择器字符串；

### eno.element()

eno.element() 用于获取通过eno.sets()方法填充元素的实例。

参数形式：
* eno.element(event);

参数含义：
* event 事件实例；

### eno.query()

eno.query() 用于获取指定URL或当前URL中的查询字符串参数。

参数形式：
* eno.query();
* eno.query(url);
* eno.query(name);
* eno.query(url, name);

参数含义：
* url 字符串，如果未指定则默认当前页面URL；
* name 参数名字符串，区分大小写；


```javascript
// 从当前URL获取参数
let token = eno.query("token");

// 从指定URL获取参数
let url = "http://www.joyzl.net/test?name=value";
let value = eno.query(url, "name");
```
