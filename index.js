// HTML5 Node Element
// Easy Node Object
// 提供HTML标签元素处理与数据对象之间的互操作支持。

export default {
	create,
	append,
	replace,
	select,
	remove,

	show,
	hide,
	toggle,

	gets,
	sets,

	bind,
	entity,
	action,
	element,

	query
}

// 这个临时标签用于解析HTML字符串
const TEMP = document.createElement("div");

/**
 * HTML字符串创建标签元素实例
 * @param {String} html HTML字符串
 * @return {Element} 创建的单个/多个标签元素
 */
function create(html) {
	// 创建元素
	TEMP.innerHTML = html;
	let element;
	if (TEMP.childElementCount == 1) {
		element = TEMP.children[0];
		element.remove();
	} else
	if (TEMP.childElementCount > 1) {
		element = new Array();
		do {
			element.push(TEMP.children[0]);
			TEMP.children[0].remove();
		} while (TEMP.childElementCount > 0);
	}
	return element;

	// DocumentFragment
}

/**
 * 创建并添加标签元素
 * @param {Element} element 标签元素
 * @param {String} html HTML字符串
 * @return {Element} 创建的单个/多个标签元素
 */
function append(element, html) {
	if (arguments.length == 1) {
		// append(html);
		html = element;
		element = document.body;
	} else
	if (arguments.length == 2) {
		// append(element,html);
		element = select(element);
	} else {
		return null;
	}
	if (element) {
		if (html.trim) {
			html = create(html);
		}
		if (Array.isArray(html)) {
			for (let i = 0; i < html.length; i++) {
				element.appendChild(html[i]);
			}
		} else {
			element.appendChild(html);
		}
		return html;
	}
	return null;
}

/**
 * 创建并替换为标签元素
 * @param {Element} element 标签元素
 * @param {String} html HTML字符串
 * @return {Element} 创建的单个/多个标签元素
 */
function replace(element, html) {
	if (arguments.length == 2) {
		element = select(element);
	} else {
		return null;
	}
	if (element) {
		if (html.trim) {
			html = create(html);
		}
		if (element.parentElement) {
			if (Array.isArray(html)) {
				let item;
				for (let i = 0; i < html.length; i++) {
					item = html[i];
					if (element.className) {
						item.className += " " + element.className;
					}
					if (element.style.cssText) {
						item.style.cssText += element.style.cssText;
					}
				}
				element.replaceWith(html);
			} else {
				if (element.className) {
					html.className += " " + element.className;
				}
				if (element.style.cssText) {
					html.style.cssText += element.style.cssText;
				}
				element.parentElement.replaceChild(html, element);
			}
		}
		return html;
	}
	return null;
}

/**
 * 在指定范围内/整个文档查找
 * @param {Element} element 标签元素
 * @param {String} selector 筛选字符
 * @return {Element} 匹配的单个/多个标签元素
 */
function select(element, selector) {
	if (arguments.length == 1) {
		// 仅指定1个参数
		// select(element/selector);
		if (element.trim) {
			element = document.querySelectorAll(element);
			if (element.length == 0) {
				return null;
			}
			if (element.length == 1) {
				return element[0];
			}
			return Array.from(element);
		} else
		if (element.nodeType) {
			return element;
		}
	} else
	if (arguments.length == 2) {
		// 指定了2个参数
		// select(element, selector);
		if (element.trim) {
			element = document.querySelectorAll(element);
			if (element.length == 0) {
				return null;
			}
		} else
		if (element.nodeType) {
			element = element.querySelectorAll(selector);
			if (element.length == 0) {
				return null;
			}
			if (element.length == 1) {
				return element[0];
			}
			return Array.from(element);
		} else
		if (Array.isArray(element)) {
			if (element.length == 0) {
				return null;
			}
		}
		// element[]
		let nodes, items = new Array();
		for (let i = 0; i < element.length; i++) {
			nodes = element[i].querySelectorAll(selector);
			for (let n = 0; n < nodes.length; n++) {
				items.push(nodes[n]);
			}
		}
		if (items.length == 0) {
			return null;
		}
		if (items.length == 1) {
			return items[0];
		}
		return items;
	}
}

/**
 * 从文档移除
 * @param {Element} element 标签元素
 * @param {String} selector 筛选字符
 * @return {Element} 移除的单个/多个标签元素
 */
function remove(element, selector) {
	if (arguments.length == 1) {
		element = select(element);
	} else
	if (arguments.length == 2) {
		element = select(element, selector);
	} else {
		return;
	}
	if (element) {
		if (Array.isArray(element)) {
			for (let i = 0; i < element.length; i++) {
				element[i].remove();
			}
		} else {
			element.remove();
		}
	}
	return element;
}

/**
 * 隐藏单个/多个元素
 * @param {Element} element 标签元素
 * @param {String} selector 筛选字符
 * @return {Element} 隐藏的单个/多个标签元素
 */
function hide(element, selector) {
	if (arguments.length == 1) {
		element = select(element);
	} else
	if (arguments.length == 2) {
		element = select(element, selector);
	} else {
		return;
	}
	if (element) {
		if (Array.isArray(element)) {
			let e;
			for (let i = 0; i < element.length; i++) {
				e = element[i];
				if (e.hidden) {} else {
					e.hidden = true;
					e.__DISPLAY = e.style.display
					e.style.display = "none";
				}
			}
		} else {
			if (element.hidden) {} else {
				element.hidden = true;
				element.__DISPLAY = element.style.display;
				// display:flex 导致 hidden 属性失效而不会隐藏
				element.style.display = "none";
			}
		}
	}
	return element;
}

/**
 * 显示单个/多个元素
 * @param {Element} element 标签元素
 * @param {String} selector 筛选字符
 * @return {Element} 显示的单个/多个标签元素
 */
function show(element, selector) {
	if (arguments.length == 1) {
		element = select(element);
	} else
	if (arguments.length == 2) {
		element = select(element, selector);
	} else {
		return;
	}
	if (element) {
		if (Array.isArray(element)) {
			let e;
			for (let i = 0; i < element.length; i++) {
				e = element[i];
				if (e.hidden) {
					e.hidden = false;
					e.style.display = e.__DISPLAY;
				}
			}
		} else
		if (element.hidden) {
			element.hidden = false;
			element.style.display = element.__DISPLAY;
		}
	}
	return element;
}

/**
 * 切换指定元素显示，同级其余元素隐藏；
 * 如果指定样式类名，则当前原始添加样式类，其余元素移除样式类
 * @param {Element} element 标签元素
 * @param {String} selector 筛选字符
 * @param {String} applyClass 添加类名称，必须同时提供otherClass参数
 * @param {String} otherClass 移除类名称，必须同时提供applyClass参数
 * @return {Element} 显示的单个/多个标签元素
 */
function toggle(element, selector, applyClass, otherClass) {
	if (arguments.length == 1) {
		// toggle(element)
		element = select(element);
	} else
	if (arguments.length == 2) {
		// toggle(element,selector)
		element = select(element, selector);
	} else
	if (arguments.length == 3) {
		// toggle(element,applyClass,otherClass)
		element = select(element);
		otherClass = applyClass;
		applyClass = selector;
	} else
	if (arguments.length == 4) {
		// toggle(element,selector,applyClass,otherClass)
		element = select(element, selector);
	} else {
		return;
	}
	if (element) {
		const parent = element.parentElement;
		if (applyClass) {
			for (let i = 0; i < parent.children.length; i++) {
				if (element == parent.children[i]) {
					parent.children[i].classList.remove(otherClass);
					parent.children[i].classList.add(applyClass);
				} else {
					parent.children[i].classList.remove(applyClass);
					parent.children[i].classList.add(otherClass);
				}
			}
		} else {
			for (let i = 0; i < parent.children.length; i++) {
				if (element == parent.children[i]) {
					show(parent.children[i]);
				} else {
					hide(parent.children[i]);
				}
			}
		}
	}
	return element;
}

// 默认转换函数
function defaultConverter(element, parameter, name) {}

/**
 * 从指定元素获取值以JSON对象返回{name:value}
 * @param {Element} element 标签元素
 * @param {String} selector 筛选字符
 * @param {Function} converter 转换
 * @return {Object} {name1:value1,name2:value2,...}
 */
function gets(element, selector, converter = defaultConverter) {
	if (arguments.length == 1) {
		// gets(element)
		element = select(element);
	} else
	if (arguments.length == 2) {
		// gets(element,selector)
		// gets(element,converter)
		if (selector.trim) {
			element = select(element, selector);
		} else {
			element = select(element);
			converter = selector;
		}
	} else
	if (arguments.length == 3) {
		// gets(element,selector,converter)
		element = select(element, selector);
	} else {
		return;
	}
	if (element) {
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
 * 从指定JSON对象设置元素值，以name属性作为标识
 * @param {Element} element 标签元素
 * @param {String} selector 筛选字符
 * @param {Object} parameter 数据对象
 * @param {Function} converter 数据转换
 * @return {Element} 设置的单个/多个标签元素
 */
function sets(element, selector, parameter, converter = defaultConverter) {
	if (arguments.length == 2) {
		// sets(element,parameter)
		element = select(element);
		parameter = selector;
	} else
	if (arguments.length == 3) {
		// sets(element,selector,parameter)
		// sets(element,parameter,converter)
		if (selector.trim) {
			element = select(element, selector);
		} else {
			element = select(element);
			converter = parameter;
			parameter = selector;
		}
	} else
	if (arguments.length == 4) {
		// sets(element,selector,parameter,converter)
		element = select(element, selector);
	} else {
		return;
	}
	if (element) {
		if (parameter) {
			if (Array.isArray(parameter)) {
				// Object[] -> Element.children
				let i = 0;
				// 利用ENO_SET记录并判定是否首次
				if (element.__ENO_SETS) {} else {
					element.__ENO_SETS = {};
					// before...<template>...after
					// 只有<template>模板具有content属性
					// 记录模板前后已有标签元素数量
					// before数量包括模板本身
					for (; i < element.childElementCount; i++) {
						if (element.children[i].content) {
							element.__ENO_SETS.template = element.children[i];
							element.__ENO_SETS.before = ++i;
							element.__ENO_SETS.after = element.childElementCount - i;
							break;
						}
					}
				}

				if (element.__ENO_SETS.template) {
					// 已定义模板
					if (parameter.length) {
						let node, n;
						// 构造填充元素
						for (i = 0; i < parameter.length; i++) {
							if (element.__ENO_SETS.before + i < element.childElementCount - element.__ENO_SETS.after) {
								// 重用已有元素
								for (n = 0; n < element.__ENO_SETS.template.content.childElementCount; n++) {
									node = element.children[element.__ENO_SETS.before + i + n];
									set(node, parameter[i], converter);
									node.userData = parameter[i];
								}
							} else {
								// 克隆新的元素(DocumentFragment)
								// node = element.template.content.cloneNode(true);
								node = document.importNode(element.__ENO_SETS.template.content, true);
								for (n = 0; n < node.childElementCount; n++) {
									set(node.children.item(n), parameter[i], converter);
									node.children.item(n).userData = parameter[i];
								}
								element.insertBefore(node, element.children[element.__ENO_SETS.before + i * node.childElementCount]);
							}
						}
						// 移除多余元素
						n = i * element.__ENO_SETS.template.content.childElementCount;
						i = element.__ENO_SETS.before + element.__ENO_SETS.after;
						while (element.childElementCount > i + n) {
							element.children[element.__ENO_SETS.before + n].remove();
						}
						return element;
					} else {
						// 移除多余元素
						i = element.__ENO_SETS.before + element.__ENO_SETS.after;
						while (element.childElementCount > i) {
							element.children[element.childElementCount - element.__ENO_SETS.after - 1].remove();
						}
						return element;
					}
				} else {
					// 未使用模板
					if (parameter.length) {
						let node;
						// 构造填充元素
						for (i = 0; i < parameter.length; i++) {
							if (i < element.childElementCount) {
								// 重用已有元素
								node = element.children[i];
							} else if (node) {
								// 克隆新的元素
								node = element.appendChild(node.cloneNode(true));
							} else {
								// 干不了
								// 此情形出现于没有任何子标签元素
								continue;
							}
							set(node, parameter[i], converter);
							node.userData = parameter[i];
							node.hidden = false;
						}
						// 移除多余元素
						while (element.childElementCount > i) {
							element.children[i].remove();
						}
						return element;
					} else {
						// 移除多余元素，保留模板
						element.children[0].userData = null;
						element.children[0].hidden = true;
						while (element.childElementCount > 1) {
							element.children[1].remove();
						}
						return element;
					}
				}
			} else {
				// Object -> Element
				if (Array.isArray(element)) {
					for (let i = 0; i < element.length; i++) {
						set(element[i], parameter, converter);
						element[i].userData = parameter;
					}
				} else {
					set(element, parameter, converter);
					element.userData = parameter;
				}
				return element;
			}
		} else {
			// null / undefine -> Element
			if (element.__ENO_SETS) {
				if (element.__ENO_SETS.template) {
					const i = element.__ENO_SETS.before + element.__ENO_SETS.after;
					while (element.childElementCount > i) {
						element.children[element.childElementCount - element.__ENO_SETS.after - 1].remove();
					}
				} else {
					element.children[0].userData = null;
					element.children[0].hidden = true;
					while (element.childElementCount > 1) {
						element.children[1].remove();
					}
				}
			} else {
				if (Array.isArray(element)) {
					for (let i = 0; i < element.length; i++) {
						set(element[i], null, converter);
						element[i].userData = null;
					}
				} else {
					set(element, null, converter);
					element.userData = null;
				}
			}
			return element;
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
 * 绑定事件
 * @param {Element} element 标签元素
 * @param {String} selector 筛选字符
 * @param {String} eventName 事件名称
 * @param {Function} listener 事件处理
 * @example bind(element,eventName,listener);
 * @example bind(element,selector,eventName,listener);
 * @return {Element} 绑定事件的标签元素
 */
function bind(element, selector, eventName, listener) {
	if (arguments.length == 3) {
		// bind(element,eventName,listener);
		element = select(element);
		listener = eventName;
		eventName = selector;
	} else
	if (arguments.length == 4) {
		// bind(element,selector,eventName,listener);
		element = select(element, selector);
	} else {
		return;
	}
	if (element) {
		if (Array.isArray(element)) {
			for (let i = 0; i < element.length; i++) {
				element[i].addEventListener(eventName, listener);
			}
		} else {
			element.addEventListener(eventName, listener);
		}
	}
	return element;
}

/**
 * 根据事件或元素获取由sets关联的实体对象
 * @example entity(event);
 * @example entity(element);
 * @example entity(element,selector);
 * @return {Object} 标签元素关联的数据对象
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
 * @return {Element} 标签元素关联的数据对象
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
 * 读取 URL 中的 Query String 参数值
 * @param {String} name 参数名
 * @return {String} 参数值
 */
function query(url, name) {
	if (arguments.length == 1) {
		// query(name)
		name = url;
		// window.location.search 返回从问号?开始的URL查询部分
		// ?name1=value1&name2=value2
		url = window.location.search;
	} else
	if (arguments.length == 2) {
		// query(url, name)
		let index = url.indexOf("?");
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