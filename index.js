// HTML5 Node Element
// Easy Node Object
// 提供HTML标签与数据对象之间的互操作支持。

export default {
	create,
	remove,

	select,
	selects,

	toggle,
	show,
	hide,

	gets,
	sets,
}

/**
 * 显示单个/多个元素
 * @param {Element} element
 */
function show(element) {
	if (element) {
		if (element.length) {
			for (let i = 0; i < element.length; i++) {
				show(element[i]);
			}
		} else {
			if (element.nodeType) {
				element.hidden = false;
			} else {
				show(selects(element));
			}
		}
	}
}
/**
 * 隐藏单个/多个元素
 * @param {Element} element
 */
function hide(element) {
	if (element) {
		if (element.length) {
			for (let i = 0; i < element.length; i++) {
				hide(element[i]);
			}
		} else {
			if (element.nodeType) {
				element.hidden = true;
			} else {
				hide(selects(element));
			}
		}
	}
}
/**
 * 切换指定元素显示，其余元素隐藏
 * @param {Object} parent 父级
 * @param {Object} element 要显示的元素
 */
function toggle(parent, element) {
	if (parent && element) {
		if (parent.nodeType) {} else {
			parent = select(parent);
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
	}
}

/**
 * 在指定元素内/整个文档查找标签
 * @param {Element} elements 元素内
 * @param {String} selectors 选择器
 */
function select(elements, selectors) {
	// 仅指定1个参数
	if (arguments.length == 1) {
		// select(selectors);
		selectors = elements;
		return document.querySelector(selectors);
	}
	// 指定了2个参数
	if (arguments.length >= 2) {
		// select(elements, selectors);
		if (elements.length) {
			let element;
			for (let i = 0; i < elements.length; i++) {
				element = elements[index].querySelector(selectors);
				if (element) {
					return element;
				}
			}
			return null;
		} else {
			return elements.querySelector(selectors);
		}
	}
}

/**
 * 在指定元素内/整个文档查找标签
 * @param {Element} elements 元素内
 * @param {String} selectors 选择器
 */
function selects(elements, selectors) {
	// 仅指定1个参数
	if (arguments.length == 1) {
		// select(selectors);
		selectors = elements;
		return document.querySelectorAll(selectors);
	}
	// 指定了2个参数
	if (arguments.length >= 2) {
		// select(elements, selectors);
		let nodes, items = new Array();
		if (elements.length) {
			for (let i = 0; i < elements.length; i++) {
				nodes = elements[index].querySelectorAll(selectors);
				if (nodes && nodes.length) {
					for (let i = 0; i < nodes.length; ++i) {
						items.push(nodes[i]);
					}
				}
			}
		} else {
			nodes = elements.querySelectorAll(selectors);
			if (nodes && nodes.length) {
				for (let i = 0; i < nodes.length; ++i) {
					items.push(nodes[i]);
				}
			}
		}
		return items;
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
	if (element.length) {
		for (let i = 0; i < element.length; i++) {
			element[i].remove();
		}
	} else {
		if (element.remove) element.remove();
	}
}

// 默认转换函数
function defaultConverter(element, parameter, name) {}

/**
 * 从指定元素获取值以JSON对象返回{name:value}
 * @param {Element} elements 元素
 * @param {Function} converter 转换
 * @returns {Object} {name1:value1,name2:value2,...}
 */
function gets(elements, converter = defaultConverter) {
	if (Array.isArray(elements)) {
		let parameter = {},
			parameters = new Array();
		for (let i = 0; i < elements.length; i++) {
			get(elements[i], parameter, converter);
			if (Object.keys(parameter).length) {
				parameters.push(parameter);
				parameter = {};
			}
		}
		return parameters;
	} else {
		let parameter = {};
		get(elements, parameter, converter);
		return parameter;
	}
}
/**
 * 从指定JSON设置元素值，以name属性作为标识
 * @param {Element} elements 元素
 * @param {Object} parameters 对象
 * @param {Function} converter 转换
 * @returns {Element} elements
 */
function sets(elements, parameters, converter = defaultConverter) {
	if (elements) {
		if (elements.length) {
			if (parameters) {
				let i = 0;
				if (parameters.length) {
					let element;
					for (; i < parameters.length; i++) {
						if (i < elements.length) {
							// 重用已有元素
							element = elements[i];
						} else if (element) {
							// 克隆新的元素
							element = element.parentElement.appendChild(element.cloneNode(true));
						} else {
							// 干不了
							continue;
						}
						element.userData = parameters[i];
						set(element, parameters[i], converter);
						element.hidden = false;
					}
				} else {
					element.userData = parameters;
					set(elements[0], parameters, converter);
					i++;
				}
				// 移除多余元素
				for (; i < elements.length; i++) {
					elements[i].remove();
				}
			} else {
				// 保留模板
				elements[0].hidden = true;
				// 移除多余元素
				for (let i = 1; i < elements.length; i++) {
					elements[i].remove();
				}
			}
		} else {
			if (parameters.length) {
				return sets(elements.children, parameters, converter);
			} else {
				element.userData = parameters;
				return set(elements, parameters, converter);
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
			get(element.children[i], parameter);
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
	if (o) {
		if (Array.isArray(o)) {
			// 数组值合并（逗号分割）
			return o.join(',');
		} else {
			return o.toString();
		}
	} else {
		return "";
	}
}