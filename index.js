// 提供HTML标签元素处理与数据对象之间的互操作支持。
// 用于简化 HTMLElement 与 JS JSON/Object 之间的互操作。

export default {
	create,
	append,
	replace,
	selects,
	select,
	remove,

	show,
	hide,
	toggle,

	get,
	gets,
	set,
	sets,

	bind,
	entity,
	element,

	query
}

// 这个临时标签用于解析HTML字符串
const TEMPLATE = document.createElement("template");

/**
 * HTML字符串创建标签元素实例
 * @example eno.create(html);
 * @param {String|HTMLElement} html 要创建为标签元素实例的HTML字符串
 * @return {HTMLElement|HTMLElement[]|null} 创建的单个或多个标签元素
 */
function create(html) {
	// DocumentFragment
	// 插入文档即便多个标签也仅触发一次重渲染
	// 插入后实例为空集合
	// Element.innerHTML

	if (html) {
		if (html.trim) {
			// 创建新元素
			TEMPLATE.innerHTML = html;
			if (TEMPLATE.content.childElementCount == 1) {
				return TEMPLATE.content.firstElementChild;
			} else
			if (TEMPLATE.content.childElementCount > 1) {
				return Array.from(TEMPLATE.content.children);
			}
		} else
		if (html.tagName) {
			// 已为元素实例
			// 添加到临时集合以便渲染
			TEMPLATE.innerHTML = "";
			TEMPLATE.appendChild(html);
			return html;
		} else
		if (html instanceof DocumentFragment) {
			// 已为元素实例
			// 添加到临时集合以便渲染
			TEMPLATE.innerHTML = "";
			TEMPLATE.appendChild(html);
			return Array.from(TEMPLATE.content.children);
		}
	}
	return null;
}

/**
 * 创建并添加标签元素
 * @param {HTMLElement} element 父标签元素
 * @param {String} selector 选择器字符串
 * @param {HTMLElement|String} html 要添加的标签元素实例或HTML字符串
 * @return {HTMLElement|HTMLElement[]|null} 创建的单个/多个标签元素/null
 * @example eno.append(html); //添加到文档尾部
 * @example eno.append(element,html); // 添加到指定标签尾部
 * @example eno.append(element,selector,html); // 添加到指定标签中匹配选择器的标签尾部
 */
function append(element, selector, html) {
	if (arguments.length == 1) {
		// append(html);
		html = create(element);
		element = document.body;
	} else
	if (arguments.length == 2) {
		// append(element,selector); 无效
		// append(element,html);
		// append(selector,html);
		element = select(element);
		html = create(selector);
	} else
	if (arguments.length == 3) {
		// append(element,selector,html)
		element = select(element, selector);
		html = create(html);
	} else {
		return null;
	}

	if (element && html) {
		element.appendChild(TEMPLATE.content);
		return html;
	}
	return null;
}

/**
 * 创建并替换为标签元素
 * @param {HTMLElement} element 目标标签元素
 * @param {String} selector 选择器字符串
 * @param {HTMLElement|String} html 用于替换的标签元素或HTML字符串
 * @return {HTMLElement|HTMLElement[]|null} 创建的单个/多个标签元素/null
 * @example eno.replace(element,html);
 * @example eno.replace(element,selector,html);
 */
function replace(element, selector, html) {
	if (arguments.length == 2) {
		// replace(element,html);
		// replace(selector,html);
		element = select(element);
		html = create(selector);
	} else
	if (arguments.length == 3) {
		// replace(element,selector,html);
		element = select(element, selector);
		html = create(html);
	} else {
		return null;
	}

	if (element && html) {
		// 转移属性
		if (Array.isArray(html)) {
			for (let i = 0; i < html.length; i++) {
				// TODO 需要测试验证
				html[i].classList.add(element.classList);
				if (element.style.cssText) {
					html[i].style.cssText += element.style.cssText;
				}
			}
		} else {
			// TODO 需要测试验证
			html.classList.add(element.classList);
			if (element.style.cssText) {
				html.style.cssText += element.style.cssText;
			}
		}
		element.replaceWith(TEMPLATE.content);
		return html;
	}
	return null;
}

/**
 * 在指定范围内/整个文档查找标签元素
 * @example eno.select(selector);
 * @example eno.select(element,selector);
 * @param {HTMLElement} element 要在其中查找的父标签元素
 * @param {String} selector 选择器字符串
 * @return {HTMLElement|null} 匹配的单个标签元素，如果匹配多个仅返回第一个
 */
function select(element, selector) {
	if (arguments.length == 1) {
		// 仅指定1个参数
		// select(element);
		// select(selector);
		if (element.tagName) {
			return element;
		} else
		if (element.trim) {
			return document.querySelector(element);
		} else
		if (element.length) {
			// NodeList,HTMLCollection
			return element[0];
		}
	} else
	if (arguments.length == 2) {
		// 指定了2个参数
		// select(element, selector);
		if (element.tagName) {
			return element.querySelector(selector);
		} else
		if (element.trim) {
			element = document.querySelector(element);
			if (element) {
				return element.querySelector(selector);
			}
		}
		// 不支持element参数为数组或集合
		// 应用场景极少且让程序难以理解
	}
	return null;
}

/**
 * 在指定范围内/整个文档查找标签元素
 * @example eno.selects(selector);
 * @example eno.selects(element,selector);
 * @param {HTMLElement} element 要在其中查找的父标签元素
 * @param {String} selector 选择器字符串
 * @return {HTMLElement[]|null} 匹配的多个标签元素，仅匹配一个也返回数组
 */
function selects(element, selector) {
	if (arguments.length == 1) {
		// 仅指定1个参数
		// selects(selector);
		if (element.tagName) {
			// 仅提供元素参数
			return [element];
		} else
		if (element.trim) {
			// 仅提供字符串参数
			element = document.querySelectorAll(element);
			if (element.length > 0) {
				return Array.from(element);
			}
		} else
		if (element.length) {
			// NodeList,HTMLCollection
			return Array.from(element);
		}
	} else
	if (arguments.length == 2) {
		// 指定了2个参数
		// select(element, selector);
		if (element.tagName) {
			element = element.querySelectorAll(selector);
			if (element.length > 0) {
				return Array.from(element);
			}
		} else
		if (element.trim) {
			element = document.querySelector(element);
			if (element) {
				element = element.querySelectorAll(selector);
				if (element.length > 0) {
					return Array.from(element);
				}
			}
		}
		// 不支持element参数为数组或集合
		// 应用场景极少且让程序难以理解
	}
	return null;
}

/**
 * 从文档移除标签元素
 * @param {HTMLElement} element 要在其中查找的父标签元素
 * @param {String} selector 选择器字符串
 */
function remove(element, selector) {
	if (arguments.length == 1) {
		element = selects(element);
	} else
	if (arguments.length == 2) {
		element = selects(element, selector);
	} else {
		return;
	}

	if (element && element.length) {
		for (let i = 0; i < element.length; i++) {
			element[i].remove();
		}
	}
}

/**
 * 隐藏标签元素
 * @param {HTMLElement} element 要在其中查找的父标签元素
 * @param {String} selector 选择器字符串
 */
function hide(element, selector) {
	if (arguments.length == 1) {
		element = selects(element);
	} else
	if (arguments.length == 2) {
		element = selects(element, selector);
	} else {
		return;
	}

	if (element && element.length) {
		for (let i = 0; i < element.length; i++) {
			hideElement(element[i]);
		}
	}
}

/**
 * 显示标签元素
 * @param {HTMLElement} element 要在其中查找的父标签元素
 * @param {String} selector 选择器字符串
 */
function show(element, selector) {
	if (arguments.length == 1) {
		element = selects(element);
	} else
	if (arguments.length == 2) {
		element = selects(element, selector);
	} else {
		return;
	}

	if (element && element.length) {
		for (let i = 0; i < element.length; i++) {
			showElement(element[i]);
		}
	}
}

function hideElement(element) {
	if (element.hidden) {
		if (element.__ENO_DISPLAY !== undefined) {
			return;
		}
	} else {
		element.hidden = true;
	}
	// display:flex 导致 hidden 属性失效而不会隐藏
	element.__ENO_DISPLAY = element.style.display;
	element.style.display = "none";
}

function showElement(element) {
	if (element.hidden) {
		element.hidden = false;
		if (element.__ENO_DISPLAY !== undefined) {
			element.style.display = element.__ENO_DISPLAY;
		}
	}
}

/**
 * 切换指定元素显示，同级其余元素隐藏；
 * 如果指定样式类名，则当前元素添加样式类，其余元素移除样式类，样式类名区分大小写
 * @param {HTMLElement} element 要在其中查找的父标签元素
 * @param {String} selector 选择器字符串
 * @param {String} applyClass 添加类名称，必须同时提供otherClass参数，可指定""/null表示无具体类名
 * @param {String} otherClass 移除类名称，必须同时提供applyClass参数，可指定""/null表示无具体类名
 * @return {HTMLElement|HTMLElement[]|null} 显示的单个/多个标签元素
 */
function toggle(element, selector, applyClass, otherClass) {
	if (arguments.length == 1) {
		// toggle(element)
		element = selects(element);
		if (element) {
			toggleElements(element);
			return element;
		}
	} else
	if (arguments.length == 2) {
		// toggle(element,selector)
		// toggle(element,applyClass) 无效
		element = selects(element, selector);
		if (element) {
			toggleElements(element);
			return element;
		}
	} else
	if (arguments.length == 3) {
		// toggle(element,selector,applyClass) 无效
		// toggle(element,applyClass,otherClass)
		element = selects(element);
		if (element) {
			toggleClasses(element, selector, applyClass);
			return element;
		}
	} else
	if (arguments.length == 4) {
		// toggle(element,selector,applyClass,otherClass)
		element = selects(element, selector);
		if (element) {
			toggleClasses(element, applyClass, otherClass);
			return element;
		}
	}
	return null;
}

function toggleElement(element) {
	const parent = element.parentElement;
	for (let i = 0; i < parent.children.length; i++) {
		if (element !== parent.children[i]) {
			hideElement(parent.children[i]);
		}
	}
	showElement(element);
}

function toggleElements(elements) {
	// 这些元素可能不在同级
	let element, parent, i;
	for (let e = 0; e < elements.length; e++) {
		element = elements[e];
		if (element.parentElement !== parent) {
			parent = element.parentElement;
			for (i = 0; i < parent.children.length; i++) {
				if (element !== parent.children[i]) {
					hideElement(parent.children[i]);
				}
			}
		}
		showElement(element);
	}
}

function toggleClass(element, apply, other) {
	const parent = element.parentElement;
	for (let i = 0; i < parent.children.length; i++) {
		if (element !== parent.children[i]) {
			parent.children[i].classList.remove(apply);
			parent.children[i].classList.add(other);
		}
	}
	element.classList.remove(other);
	element.classList.add(apply);
}

function toggleClasses(elements, apply, other) {
	// 这些元素可能不在同级
	let element, parent, i;
	for (let e = 0; e < elements.length; e++) {
		element = elements[e];
		if (element.parentElement !== parent) {
			parent = element.parentElement;
			for (i = 0; i < parent.children.length; i++) {
				if (element !== parent.children[i]) {
					parent.children[i].classList.remove(apply);
					parent.children[i].classList.add(other);
				}
			}
		}
		element.classList.remove(other);
		element.classList.add(apply);
	}
}

// 默认转换函数
function defaultConverter(element, entity, name) {}

/**
 * 从指定元素获取值以实体对象返回
 * @param {HTMLElement} element 要在其中查找的父标签元素
 * @param {String} selector 选择器字符串
 * @param {Function} converter 转换方法
 * @return {Object} 包含数据的实体对象实例
 */
function get(element, selector, converter = defaultConverter) {
	if (arguments.length == 1) {
		// get(element)
		// get(selector)
		element = select(element);
	} else
	if (arguments.length == 2) {
		// get(element,selector)
		// get(element,converter)
		if (selector instanceof Function) {
			element = select(element);
			converter = selector;
		} else {
			element = select(element, selector);
		}
	} else
	if (arguments.length == 3) {
		// get(element,selector,converter)
		element = select(element, selector);
	} else {
		return null;
	}

	if (element) {
		let entity = {};
		getEntity(element, entity, converter);
		return entity;
	}
	return null;
}

/**
 * 从指定元素获取值以JSON对象返回
 * @param {HTMLElement} element 要在其中查找的父标签元素
 * @param {String} selector 选择器字符串
 * @param {Function} converter 转换方法
 * @return {Object[]} 包含数据的实体对象实例
 */
function gets(element, selector, converter = defaultConverter) {
	if (arguments.length == 1) {
		// gets(element)
		// gets(selector)
		element = selects(element);
	} else
	if (arguments.length == 2) {
		// gets(element,selector)
		// gets(element,converter)
		if (selector instanceof Function) {
			element = selects(element);
			converter = selector;
		} else {
			element = selects(element, selector);
		}
	} else
	if (arguments.length == 3) {
		// gets(element,selector,converter)
		element = selects(element, selector);
	} else {
		return null;
	}

	if (element) {
		let entity, entities = new Array();
		for (let i = 0; i < element.length; i++) {
			entity = {};
			getEntity(element[i], entity, converter);
			entities.push(entity);
		}
		return entities;
	}
	return null;
}

/**
 * 实体对象设置到标签元素显示，以name属性作为标识
 * @param {HTMLElement} element 要在其中查找的父标签元素
 * @param {String} selector 选择器字符串
 * @param {Object} entity 数据实体对象
 * @param {Function} converter 数据转换方法
 * @return {HTMLElement} 设置或创建的标签元素
 */
function set(element, selector, entity, converter = defaultConverter) {
	// 仅对单个标签元素目标
	// 多个标签元素目标难以理解

	if (arguments.length == 2) {
		// set(element,entity)
		// set(selector,entity)
		element = select(element);
		entity = selector;
	} else
	if (arguments.length == 3) {
		// set(element,selector,entity)
		// set(element,entity,converter)
		if (entity instanceof Function) {
			element = select(element);
			converter = entity;
			entity = selector;
		} else {
			element = select(element, selector);
		}
	} else
	if (arguments.length == 4) {
		// set(element,selector,entity,converter)
		element = select(element, selector);
	} else {
		return null;
	}

	if (element) {
		// Object -> Element
		if (Array.isArray(entity)) {
			entity = entity[0];
		}

		setEntity(element, entity, converter);
		element.__ENO_ENTITY = entity;
		return element;
	}
}

/**
 * 实体对象设置到标签元素显示，以name属性作为标识
 * @param {HTMLElement} element 要在其中查找的父标签元素
 * @param {String} selector 选择器字符串
 * @param {Object} entity 数据实体对象
 * @param {Function} converter 数据转换方法
 * @return {HTMLElement} 设置或创建的标签元素
 */
function sets(element, selector, entity, converter = defaultConverter) {
	// 仅对单个标签元素目标
	// 多个标签元素目标难以理解
	// entity为数组时返回数组

	if (arguments.length == 2) {
		// sets(element,entity)
		// sets(selector,entity)
		element = select(element);
		entity = selector;
	} else
	if (arguments.length == 3) {
		// sets(element,selector,entity)
		// sets(element,entity,converter)
		if (entity instanceof Function) {
			element = select(element);
			converter = entity;
			entity = selector;
		} else {
			element = select(element, selector);
		}
	} else
	if (arguments.length == 4) {
		// sets(element,selector,entity,converter)
		element = select(element, selector);
	} else {
		return null;
	}

	if (element) {
		// Object[] -> Element.children
		let i = 0;
		// 利用ENO_SET缓存模板并判定是否首次
		if (element.__ENO_SETS === undefined) {
			if (element.childElementCount) {
				element.__ENO_SETS = {};
				// 查找模块和位置
				// before...<template>...after
				// 只有<template>模板具有content属性
				// 记录模板前后已有标签元素数量
				// before数量包括模板本身
				for (i = 0; i < element.childElementCount; i++) {
					if (element.children[i].content) {
						element.__ENO_SETS.fragment = element.children[i].content;
						element.__ENO_SETS.before = ++i;
						element.__ENO_SETS.after = element.childElementCount - i;
						break;
					}
				}
				// 未定义模板<template>
				// 子元素视为模板
				if (element.__ENO_SETS.fragment === undefined) {
					element.__ENO_SETS.fragment = new DocumentFragment();
					while (element.childElementCount > 0) {
						element.__ENO_SETS.fragment.appendChild(element.children[0]);
					}
					element.__ENO_SETS.before = 0;
					element.__ENO_SETS.after = 0;
				}
			} else {
				// 没有可用模板
				return null;
			}
		}
		if (entity) {
			if (!Array.isArray(entity)) {
				entity = [entity];
			}

			let node, n;
			// 构造填充元素
			for (i = 0; i < entity.length; i++) {
				if (element.__ENO_SETS.before + i < element.childElementCount - element.__ENO_SETS.after) {
					// 重用已有元素
					for (n = 0; n < element.__ENO_SETS.fragment.childElementCount; n++) {
						node = element.children[element.__ENO_SETS.before + i + n];
						setEntity(node, entity[i], converter);
						node.__ENO_ENTITY = entity[i];
					}
				} else {
					// 克隆新的元素(DocumentFragment)
					node = element.__ENO_SETS.fragment.cloneNode(true);
					for (n = 0; n < node.childElementCount; n++) {
						setEntity(node.children[n], entity[i], converter);
						node.children[n].__ENO_ENTITY = entity[i];
					}
					element.insertBefore(node, element.children[element.__ENO_SETS.before + i * node.childElementCount]);
				}
			}
			// 移除多余元素
			n = i * element.__ENO_SETS.fragment.childElementCount;
			i = element.__ENO_SETS.before + element.__ENO_SETS.after;
			while (element.childElementCount > i + n) {
				element.children[element.__ENO_SETS.before + n].remove();
			}
		} else {
			// null / undefine -> Element
			i = element.__ENO_SETS.before + element.__ENO_SETS.after;
			while (element.childElementCount > i) {
				element.children[element.childElementCount - element.__ENO_SETS.after - 1].remove();
			}
		}
		return element;
	}
}

/**
 * 获取实体从标签元素
 * <input name="AAA" value="123"/>
 * <span name="AAA">123</span>
 * <img name="AAA" src="123"/>
 * <i case="AAA"></i>
 */
function getEntity(element, entity, converter) {
	let name = element.getAttribute("case");
	if (name && name.length) {
		converter(element, entity, name);
	}
	name = element.getAttribute("name");
	if (name && name.length) {
		if (element.type) {
			// 所有控件具有type属性
			// 所有控件具有disabled属性
			// <select> <textarea> 没有checked属性，其余均有
			if (!element.disabled) {
				if (element.type === "number" || element.type === "range") {
					if (!isNaN(element.valueAsNumber)) {
						setValue(entity, name, element.valueAsNumber);
					}
				} else
				if (element.type === "checkbox" || element.type === "radio") {
					if (element.checked) {
						setValue(entity, name, element.value);
					}
				} else {
					if (element.value) {
						setValue(entity, name, element.value);
					}
				}
			}
		} else
		if (element.src) {
			// img
			setValue(entity, name, element.src);
		} else {
			setValue(entity, name, element.innerText);
		}
	}
	if (element.childElementCount) {
		for (let i = 0; i < element.children.length; i++) {
			getEntity(element.children[i], entity, converter);
		}
	}
}

/**
 * 设置实体到标签元素
 * <input name="AAA" value="123"/>
 * <span name="AAA">123</span>
 * <img name="AAA" src="123"/>
 * <i case="AAA"></i>
 */
function setEntity(element, entity, converter) {
	let name = element.getAttribute("case");
	if (name && name.length) {
		converter(element, entity, name);
	}
	name = element.getAttribute("name");
	if (name && name.length) {
		if (element.type) {
			// 所有控件具有type属性
			if (element.type === "checkbox" || element.type === "radio") {
				// Radio / Check
				element.checked = element.value == getValue(entity, name);
			} else {
				// OTHER
				element.value = text(getValue(entity, name));
			}
		} else
		if (element.src !== undefined) {
			// <img />
			if (element.__ENO_SRC === undefined) {
				// 记录默认图像
				element.__ENO_SRC = element.src;
			}
			element.src = text(getValue(entity, name));
			if (element.src.length == 0) {
				element.src = element.__ENO_SRC;
			}
		} else {
			if (element.__ENO_TEXT === undefined) {
				// 原始内容作为默认值
				element.__ENO_TEXT = element.innerText;
				// 是否已有title
				// 如果用于已设置title则不在自动设置
				element.__ENO_TITLE = element.title ? false : true;
			}
			element.innerText = text(getValue(entity, name));
			if (element.innerText.length == 0) {
				element.innerText = element.__ENO_TEXT;
			}
			if (element.__ENO_TITLE) {
				// 设置title实现文本提示
				element.title = element.innerText;
			}
		}
	}
	if (element.childElementCount) {
		for (let i = 0; i < element.children.length; i++) {
			setEntity(element.children[i], entity, converter);
		}
	}
}

/**
 * 根据名称获取实体对象值
 * @param {Object} entity 要获取值的实体对象
 * @param {Object} name 字段名称 "Device.Type.Text" 区分大小写
 * @returns {Object} 获取的值
 */
function getValue(entity, name) {
	name = name.split(".");
	for (let i = 0; i < name.length; i++) {
		if (entity) {
			if (Array.isArray(entity)) {
				const items = new Array();
				for (let a = 0; a < entity.length; a++) {
					if (entity[a]) {
						items.push(entity[a][name[i]]);
					}
				}
				entity = items;
			} else {
				entity = entity[name[i]];
			}
		} else {
			break;
		}
	}
	return entity;
}

/**
 * 根据名称设置实体对象值
 * @param {Object} entity 要设置值的实体对象
 * @param {Object} name 字段名称 "Device.Type.Text" 区分大小写
 * @param {Object} value 要设置的值
 */
function setValue(entity, name, value) {
	name = name.split(".");
	let i = 0;
	for (; i < name.length - 1; i++) {
		if (entity[name[i]]) {
			entity = entity[name[i]];
		} else {
			entity = entity[name[i]] = {};
		}
	}
	// 点语法最后的名称
	name = name[i];
	// 相同name多次出现应数组化
	if (entity[name] === undefined) {
		entity[name] = value;
	} else {
		if (Array.isArray(entity[name])) {
			entity[name].push(value);
		} else {
			entity[name] = [entity[name], value];
		}
	}
}

/**
 * 转换为字符串值
 * @param {any} value
 */
function text(value) {
	if (Array.isArray(value)) {
		// 数组值合并（逗号分割）
		return value.join(',');
	}
	if (value !== undefined && value !== null) {
		return value.toString();
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
		// bind(selector,eventName,listener);
		element = selects(element);
		listener = eventName;
		eventName = selector;
	} else
	if (arguments.length == 4) {
		// bind(element,selector,eventName,listener);
		element = selects(element, selector);
	} else {
		return null;
	}

	if (element && element.length) {
		for (let i = 0; i < element.length; i++) {
			element[i].addEventListener(eventName, listener);
		}
		return element;
	}
	return null;
}

/**
 * 根据事件或标签元素获取由eno.sets()对应的实体对象
 * @param {Event|HTMLElement} e 事件或标签元素
 * @param {String} selector 选择器字符串
 * @return {Object} 标签元素对应的实体对象
 * @example entity(event);
 * @example entity(element);
 * @example entity(element,selector);
 */
function entity(e, selector) {
	if (arguments.length == 1) {
		// entity(event);
		if (e.target) {
			e = e.target;
		} else
		if (e.srcElement) {
			e = e.srcElement;
		} else {
			e = select(e);
		}
	} else
	if (arguments.length == 2) {
		// entity(element,selector);
		e = select(e, selector);
	} else {
		return null;
	}

	while (e) {
		if (e.__ENO_ENTITY) {
			return e.__ENO_ENTITY;
		} else {
			e = e.parentElement;
		}
	}
	return null;
}

/**
 * 根据事件或标签元素获取由eno.sets()对应标签元素
 * @param {Event|HTMLElement} e 事件或标签元素
 * @return {HTMLElement} 实体对象对应的标签元素
 */
function element(e) {
	if (e) {
		if (e.target) {
			e = e.target;
		} else
		if (e.srcElement) {
			e = e.srcElement;
		} else {
			e = select(e);
		}

		while (e) {
			if (e.userData) {
				return e;
			} else {
				e = e.parentElement;
			}
		}
	}
	return null;
}

function target(event, name, value) {
	if (arguments.length == 1) {
		// target(event);
		return event.target || event.srcElement;
	} else
	if (arguments.length == 2) {
		// target(event, name);
		let element = event.target || event.srcElement;
		while (element && element !== event.currentTarget) {
			if (element.hasAttribute(name)) {
				return element;
			}
			element = element.parentElement;
		}
	} else
	if (arguments.length == 3) {
		// target(event, name, value);
		let element = event.target || event.srcElement;
		while (element && element !== event.currentTarget) {
			if (element.getAttribute(name) == value) {
				return element;
			}
			element = element.parentElement;
		}
	}
	return null;
}

/**
 * 获取 URL 中的 Query String 指定名称的参数值或包含所有参数的实体对象
 * @param {String} url URL
 * @param {String} name 参数名
 * @return {String} 参数值
 * @example eno.query(url);
 * @example eno.query(name);
 * @example eno.query(url,name);
 */
function query(url, name) {
	if (arguments.length == 0) {
		// query()
		// window.location.search 返回从问号?开始的URL查询部分
		url = window.location.search;
	} else
	if (arguments.length == 1) {
		// query(url)
		// query(name)
		if (url.startsWith("http://") || url.startsWith("https://")) {
			let index = url.indexOf("?");
			if (index > 0) {
				url = url.substring(index);
			} else {
				return null;
			}
		} else {
			name = url;
			// window.location.search 返回从问号?开始的URL查询部分
			url = window.location.search;
		}
	} else
	if (arguments.length == 2) {
		// query(url, name)
		let index = url.indexOf("?");
		if (index > 0) {
			url = url.substring(index);
		} else {
			return null;
		}
	} else {
		return null;
	}

	if (url) {
		if (name) {
			// 查找指定参数值
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
		} else {
			// 获取所有参数值
			// ?name1=value1&name2=value2
			let start = 1;
			let index = 1;
			let name, parameter = {};
			while (index >= 0 && index < url.length) {
				start = url.indexOf("=", index);
				if (start >= 0) {
					name = url.substring(start, index);
					start = ++index;

					index = url.indexOf("&", index);
					if (index >= 0) {
						parameter[name] = url.substring(start, index);
						start = ++index;
					} else {
						parameter[name] = url.substring(start);
						break;
					}
				} else {
					break;
				}
			}
			return parameter;
		}
	}
	return null;
}