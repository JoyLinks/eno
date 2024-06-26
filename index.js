// HTML5 Node Element
// Easy Node Object
// 提供HTML标签与数据对象之间的互操作支持。

export default {
	create,
	remove,

	select,
	selects,
	query,
	on,

	show,
	hide,
	stack,
	toggle,

	gets,
	sets,
	entity,
	action,
	element,

	date,
	time,
	datetime
}

/**
 * 显示单个/多个元素
 * @param {Element} element
 */
function show(element) {
	if (element) {
		if (element.trim) {
			show(selects(element));
		} else
		if (element.length) {
			for (let i = 0; i < element.length; i++) {
				show(element[i]);
			}
		} else
		if (element.nodeType) {
			element.hidden = false;
		}
	}
}
/**
 * 隐藏单个/多个元素
 * @param {Element} element
 */
function hide(element) {
	if (element) {
		if (element.trim) {
			hide(selects(element));
		} else
		if (element.length) {
			for (let i = 0; i < element.length; i++) {
				hide(element[i]);
			}
		} else
		if (element.nodeType) {
			element.hidden = true;
		}
	}
}
/**
 * 切换指定元素显示，其余元素隐藏
 * @param {Object} parent 父级
 * @param {Object} element 当前元素
 * @param {String} className 类名称
 */
function toggle(parent, element, className) {
	if (arguments.length == 1) {
		// toggle(element);
		element = parent;
		if (element.trim) {
			element = select(element);
		}
		if (element.hidden) {
			element.hidden = false;
		} else {
			element.hidden = true;
		}
	} else
	if (arguments.length == 2) {
		// toggle(parent,element);
		if (parent.trim) {
			parent = select(parent);
		}
		if (element.trim) {
			element = select(element);
		}
		if (element.parentElement != parent) {
			parent.appendChild(element);
		}
		for (let i = 0; i < parent.children.length; i++) {
			if (element == parent.children[i]) {
				parent.children[i].hidden = false;
			} else {
				parent.children[i].hidden = true;
			}
		}
	} else
	if (arguments.length == 3) {
		// toggle(parent,element,className);

	}
}

function stack(parent, element, className) {
	// 单选 增加class/移除其它
	// 多选 增加class
	// 增加 class
	// 移除 class
}

/**
 * 在指定元素内/整个文档查找标签
 * @param {Element} element 元素内
 * @param {String} selector 选择器
 */
function select(element, selector) {
	// 仅指定1个参数
	if (arguments.length == 1) {
		// select(selector);
		selector = element;
		return document.querySelector(selector);
	}
	// 指定了2个参数
	if (arguments.length >= 2) {
		// select(element, selector);
		if (element) {
			if (element.trim) {
				element = document.querySelectorAll(element);
			}
			if (element.nodeType) {
				return element.querySelector(selector);
			} else
			if (Array.isArray(element)) {
				let node;
				for (let i = 0; i < elements.length; i++) {
					node = elements[i].querySelector(selector);
					if (node) {
						return node;
					}
				}
			}
			return null;
		} else {
			return document.querySelector(selector);
		}
	}
}

/**
 * 在指定元素内/整个文档查找标签
 * @param {Element} element 元素内
 * @param {String} selector 选择器
 * @returns {NodeList} 元素集合/空集合
 */
function selects(element, selector) {
	// 仅指定1个参数
	if (arguments.length == 1) {
		// select(selector);
		selector = element;
		return document.querySelectorAll(selector);
	}
	// 指定了2个参数
	if (arguments.length >= 2) {
		// select(element, selector);
		let nodes, items = new Array();
		if (element.trim) {
			element = document.querySelectorAll(element);
		}
		if (Array.isArray(element)) {
			for (let i = 0; i < element.length; i++) {
				nodes = element[i].querySelectorAll(selector);
				if (nodes && nodes.length) {
					for (let i = 0; i < nodes.length; ++i) {
						items.push(nodes[i]);
					}
				}
			}
		} else {
			nodes = element.querySelectorAll(selector);
			if (nodes && nodes.length) {
				for (let i = 0; i < nodes.length; ++i) {
					items.push(nodes[i]);
				}
			}
		}
		return items;
	}
}

/**
 * 绑定事件
 * @param {Element} element
 * @param {String} selector
 * @param {String} evt
 * @param {Function} listener
 */
function on(element, selector, evt, listener) {
	if (arguments.length == 3) {
		// on(element/selector, evt, listener);
		listener = evt;
		evt = selector;
		if (element.trim) {
			element = selects(element);
		}
	} else
	if (arguments.length == 4) {
		// on(element, selector, evt, listener);
		element = selects(element, selector);
	} else {
		return;
	}

	if (Array.isArray(element)) {
		for (let i = 0; i < element.length; i++) {
			element[i].addEventListener(evt, listener);
		}
	} else {
		element.addEventListener(evt, listener);
	}
}

// 这个临时标签用于解析HTML字符串
const TEMP = document.createElement("div");

/**
 * 字符串创建HTML元素；
 * A仅创建；
 * B创建并添加到末尾：append；
 * C创建并替换已有元素：replace；
 * @param {String} parent
 * @param {String} html 字符串形式的HTML内容
 * @param {String} place append/replace
 * @return {Element} 单个/多个元素
 */
function create(parent, html, place) {
	if (arguments.length == 0) {
		// create();
		return null;
	} else
	if (arguments.length == 1) {
		// create(html);
		html = parent;
		parent = null;
	} else
	if (arguments.length == 2) {
		// create(parent,html);
		place = 'append';
		if (parent) {
			if (parent.nodeType) {} else {
				parent = select(parent);
			}
		} else {
			parent = document.body;
		}
	} else
	if (arguments.length == 3) {
		// create(parent,html,place);
		if (parent) {
			if (parent.nodeType) {} else {
				parent = select(parent);
			}
		} else {
			parent = document.body;
		}
	}

	// 创建元素
	TEMP.innerHTML = html;
	let element;
	if (TEMP.childElementCount == 1) {
		element = TEMP.children[0];
		element.remove();
	} else
	if (TEMP.childElementCount > 1) {
		element = new Array();
		for (let i = 0; i < TEMP.childElementCount; ++i) {
			element.push(TEMP.children[i]);
			TEMP.children[i].remove();
		}
	} else {
		return null;
	}

	// 添加元素到文档
	if (parent) {
		if ("append" === place) {
			if (element.length) {
				for (let i = 0; i < element.length; i++) {
					parent.appendChild(element[i]);
				}
			} else {
				parent.appendChild(element);
			}
		} else
		if ("replace" === place) {
			if (parent.parentElement) {
				if (element.length) {
					// 待验证
					parent.parentElement.replaceWith(element);
				} else {
					parent.parentElement.replaceChild(parent, element);
				}
			}
		} else {
			console.error("eno.create 不明确的参数" + place);
		}
	}
	return element;
}

/**
 * 从文档移除一个或多个元素
 * @param {Element} element 元素/元素数组
 */
function remove(element) {
	if (element) {
		if (element.trim) {
			// remove("p");
			element = selects(element);
		}
		if (element.tagName) {
			// remove(document.getElementById("test"));
			element.remove();
		} else
		if (element.length) {
			// remove(["p","span"]);
			// remove(document.getElementByTagName("div"));
			for (let i = 0; i < element.length; i++) {
				remove(element[i]);
			}
		}
	}
}

/**
 * 读取 URL 中的 Query String 参数值
 * @param {String} name 参数名
 */
function query(url, name) {
	if (arguments.length == 1) {
		// getQueryString(name)
		name = url;
		// window.location.search 返回从问号?开始的URL查询部分
		// ?name1=value1&name2=value2
		url = window.location.search;
	}
	if (arguments.length == 2) {
		// getQueryString(url, name)
		let index = url.indexof("?");
		if (index > 0) {
			url = url.substring(index);
		} else {
			return null;
		}
	}

	if (url) {
		let start = url.indexOf(name);
		if (start >= 0) {
			start += name.length;
			if (url.charAt(start) == '=') {
				start++;
				let end = url.indexOf('&', start);
				if (end >= 0) {
					return url.substring(start, end);
				}
				return url.substring(start);
			}
		}
	}
	return null;
}

// 默认转换函数
function defaultConverter(element, parameter, name) {}

/**
 * 从指定元素获取值以JSON对象返回{name:value}
 * @param {Element} element 元素
 * @param {Function} converter 转换
 * @returns {Object} {name1:value1,name2:value2,...}
 */
function gets(element, converter = defaultConverter) {
	if (element) {
		if (element.trim) {
			element = selects(element);
		}
		if (Array.isArray(element)) {
			let parameter = {},
				parameters = new Array();
			for (let i = 0; i < element.length; i++) {
				get(element[i], parameter, converter);
				if (Object.keys(parameter).length) {
					parameters.push(parameter);
					parameter = {};
				}
			}
			return parameters;
		} else {
			let parameter = {};
			get(element, parameter, converter);
			return parameter;
		}
	}
}
/**
 * 从指定JSON设置元素值，以name属性作为标识
 * @param {Element} element 元素
 * @param {Object} parameter 对象
 * @param {Function} converter 转换
 * @returns {Element} element
 */
function sets(element, parameter, converter = defaultConverter) {
	if (element) {
		if (element.trim) {
			// 元素选择字符串
			element = selects(element);
			if (element.length == 0) {
				return null;
			} else
			if (element.length == 1) {
				element = element[0];
			} else {
				// 多个匹配元素
			}
		}

		if (parameter) {
			if (Array.isArray(parameter)) {
				// if (element.nodeType) {
				// 	if (element.childElementCount) {
				// 		element = element.children;
				// 	} else {
				// 		// ???
				// 		return null;
				// 	}
				// }

				let i = 0;
				// 利用ENO_SET记录并判定是否首次
				if (element.ENO_SETS) {
					element.ENO_SETS = element.ENO_SETS + 1;
				} else {
					element.ENO_SETS = 1;
					// ...<template>...
					for (; i < element.children.length; i++) {
						// 只有<template>模板具有content属性
						if (element.children[i].content) {
							element.template = element.children[i];
							element.a = ++i;
							element.b = element.children.length - i;
							break;
						}
					}
				}

				if (element.template) {
					// 已定义模板
					if (parameter.length) { // [a,b]
						let node, n;
						// 构造填充元素
						for (i = 0; i < parameter.length; i++) {
							if (element.a + i < element.children.length - element.b) {
								// 重用已有元素
								for (n = 0; n < element.template.content.childElementCount; n++) {
									node = element.children[element.a + i + n];
									node.userData = parameter[i];
									set(node, parameter[i], converter);
									node.hidden = false;
								}
							} else {
								// 克隆新的元素(DocumentFragment)
								node = element.template.content.cloneNode(true);
								for (n = 0; n < node.childElementCount; n++) {
									node.children.item(n).userData = parameter[i];
									set(node.children.item(n), parameter[i], converter);
									node.children.item(n).hidden = false;
								}
								element.insertBefore(node, element.children[element.a + i * node.childElementCount]);
							}
						}
						// 移除多余元素
						n = i * element.template.content.childElementCount;
						i = element.a + element.b;
						while (element.children.length > i + n) {
							element.children[element.a + n].remove();
						}
						return element;
					} else { // []
						// 移除多余元素
						i = element.a + element.b;
						while (element.length > i) {
							element[element.a + 1].remove();
						}
						return element;
					}
				} else {
					// 未使用模板
					if (parameter.length) { // [a,b]
						let node;
						// 构造填充元素
						for (i = 0; i < parameter.length; i++) {
							if (i < element.children.length) {
								// 重用已有元素
								node = element.children[i];
							} else if (node) {
								// 克隆新的元素
								node = element.appendChild(node.cloneNode(true));
							} else {
								// 干不了
								continue;
							}
							node.userData = parameter[i];
							set(node, parameter[i], converter);
							node.hidden = false;
						}
						// 移除多余元素
						while (element.children.length > i) {
							element.children[i].remove();
						}
						return element;
					} else { // []
						if (element.children.length) {
							// 保留模板
							element.children[0].hidden = true;
							// 移除多余元素
							while (element.children.length > 1) {
								element.children[1].remove();
							}
						}
						return element;
					}
				}
			} else { // Object
				if (element.nodeType) {
					element.userData = parameter;
					set(element, parameter, converter);
					return element;
				}
				if (element.length) {
					for (let node, i = 0; i < element.length; i++) {
						node = element[i];
						node.userData = parameter;
						set(node, parameter, converter);
					}
					return element;
				}
			}
		} else { // null / undefine
			if (element.nodeType) {
				element.userData = null;
				set(element, null, converter);
				return element;
			}
			if (element.length) {
				// 保留模板
				element[0].hidden = true;
				// 移除多余元素
				while (element.length > 1) {
					element[1].remove();
				}
				return element;
			}
		}
	}
}
/**
 * 获取元素值
 * <input name="AAA" value="123"/>
 * <span name="AAA">123</span>
 * <img name="AAA" src="123"/>
 * <i case="AAA"></i>
 */
function get(element, parameter, converter) {
	let name = element.getAttribute("case");
	if (name && name.length) {
		converter(element, parameter, name);
	}
	name = element.getAttribute("name");
	if (name && name.length) {
		if (element.form) {
			valu(parameter, name, element.value);
		} else
		if (element.src) {
			valu(parameter, name, element.src);
		} else {
			valu(parameter, name, element.innerText);
		}
	}
	if (element.childElementCount) {
		for (let i = 0; i < element.children.length; i++) {
			get(element.children[i], parameter, converter);
		}
	}
}
/**
 * 设置元素值
 * <input name="AAA" value="123"/>
 * <span name="AAA">123</span>
 * <img name="AAA" src="123"/>
 * <i case="AAA"></i>
 */
function set(element, parameter, converter) {
	let name = element.getAttribute("case");
	if (name && name.length) {
		converter(element, parameter, name);
	}
	name = element.getAttribute("name");
	if (name && name.length) {
		if (element.form) {
			element.value = text(vale(parameter, name));
		} else
		if (element.src) {
			element.src = text(vale(parameter, name));
		} else {
			element.innerText = text(vale(parameter, name));
		}
	}
	if (element.childElementCount) {
		for (let i = 0; i < element.children.length; i++) {
			set(element.children[i], parameter, converter);
		}
	}
}
/**
 * 根据名称获取对象值
 * @param {Object} o 对象
 * @param {Object} name 名称 "Device.Type.Text"
 * @returns {Object} value 值
 */
function vale(o, name) {
	name = name.split(".");
	for (let i = 0; i < name.length; i++) {
		if (o) {
			if (Array.isArray(o)) {
				const items = new Array();
				for (let a = 0; a < o.length; a++) {
					if (o[a]) {
						items.push(o[a][name[i]]);
					}
				}
				o = items;
			} else {
				o = o[name[i]];
			}
		} else {
			break;
		}
	}
	return o;
}
/**
 * 根据名称设置对象值
 * @param {Object} o
 * @param {Object} name "Device.Type.Text"
 * @param {Object} value
 */
function valu(o, name, value) {
	name = name.split(".");
	let i = 0;
	for (; i < name.length - 1; i++) {
		if (o) {
			if (o[name[i]]) {
				o = o[name[i]];
			} else {
				o = o[name[i]] = {};
			}
		}
	}
	o[name[i]] = value;
	return o;
}
/**
 * 转换为字符串值
 * @param {Object} o
 */
function text(o) {
	if (Array.isArray(o)) {
		// 数组值合并（逗号分割）
		return o.join(',');
	}
	if (o != undefined) {
		return o.toString();
	}
	return "";
}
/**
 * 根据事件或元素获取由sets关联的实体对象
 */
function entity(e, selector) {
	if (arguments.length == 1) {
		// entity(event);
		if (e.nodeType) {
			e = e;
		} else
		if (e && e.target) {
			e = e.target;
		} else
		if (e && e.srcElement) {
			e = e.srcElement;
		}
	} else
	if (arguments.length == 2) {
		// entity(element,selector);
		e = select(e, selector);
	}

	while (e) {
		if (e.userData) {
			return e.userData;
		} else {
			e = e.parentElement;
		}
	}
	return null;
}
/**
 * 根据事件或元素获取属性指定的动作
 * @param {Event} e
 * @param {String} a
 */
function action(e, a) {
	if (e.target) {
		e = e.target;
	} else
	if (e.srcElement) {
		e = e.srcElement;
	}

	while (e) {
		if (e.hasAttribute(a)) {
			return true;
		} else {
			e = e.parentElement;
		}
	}
	return false;
}
/**
 * 根据事件获取绑定实体的元素
 * @param {Event} e
 */
function element(e) {
	if (e && e.target) {
		e = e.target;
	} else
	if (e && e.srcElement) {
		e = e.srcElement;
	}

	while (e) {
		if (e.userData) {
			return e;
		} else {
			e = e.parentElement;
		}
	}
	return null;
}

/**
 * 2024-6-24
 */
function date() {
	const now = new Date();
	const year = now.getFullYear();
	const month = (now.getMonth() + 1 /*月份从0开始，需要加1*/ ).toString().padStart(2, '0');
	const day = (now.getDate()).toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
}

/**
 * 10:28:12
 */
function time() {
	const now = new Date();
	const hours = now.getHours();
	const minutes = now.getMinutes();
	const seconds = now.getSeconds();
	return `${hours}:${minutes}:${seconds}`;
}
/**
 * 2024-6-24 10:28:12
 */
function datetime() {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1 /*月份从0开始，需要加1*/ ;
	const day = now.getDate();
	const hours = now.getHours();
	const minutes = now.getMinutes();
	const seconds = now.getSeconds();
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}