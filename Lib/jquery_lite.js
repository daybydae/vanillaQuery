/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DomNodeCollection = __webpack_require__(1);


window.vQ = function(selector){
  const queue = [];
  if (selector instanceof HTMLElement) {
    return new DomNodeCollection([selector]);
  } else if (typeof selector === 'function') {
    queue.push(selector);
    if (document.readyState === 'complete') {
      queue.forEach( fx => {
        fx();
      });
    }
    return new DomNodeCollection(document);
  } else if (typeof selector === 'string') {
    let array = Array.from(document.querySelectorAll(selector));
    return new DomNodeCollection(array);
  }
};

vQ.extend = (...otherObjs) => {
  return Object.assign(...otherObjs);
};

vQ.ajax = (options) => {
  const request = new XMLHttpRequest();

  const defaults = {
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    url: '',
    success: () => {},
    error: () => {},
    data: {}
  };

  options = vQ.extend(defaults, options);
  options.method = options.method.toUpperCase();

  request.open(options.method, options.url);

  request.onload = (e) => {
    if (request.status === 200) {
      options.success(JSON.parse(request.response));
    } else {
      options.error(JSON.parse(request.response));
    }
  };

  request.send(JSON.stringify(options.data));
  return request;
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(nodes) {
    this.nodes = nodes;
  }

  attr(key, val) {
    if (typeof val === "string") {
      this.nodes.forEach( (node) => {
        node.setAttribute(key, val);
      });
    } else {
      return this.nodes[0].getAttribute(key);
    }
  }

  addClass(string) {
    this.nodes.forEach( (el) => {
      if (el.className.length === 0) {
        el.className += string;
      } else {
        el.className = [el.className, string].join(" ");
      }
    });
  }

  removeClass(string) {
    this.nodes.forEach( (node) => {
      let words = node.className.split(' ');
      if (words.includes(string)) {
        let index = words.indexOf(string);
        words.splice(index,1);
        node.className = words.join(' ');
      }
    });
  }



  html(string) {
    if (typeof string === 'string') {
      this.nodes.forEach( (node) => {
        node.innerHTML = string;
      });
    } else if (this.nodes.length > 0) {
      return this.nodes[0].innerHTML;
    }
  }

  empty() {
    this.nodes.forEach( (el) => {
      el.innerHTML = '';
    });
  }

  append(arg) {

    if (typeof arg === 'string'){
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].innerHTML += arg;
      }
    } else if (arg instanceof HTMLElement) {
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].innerHTML += arg;
      }
    } else {
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = 0; j < arg.nodes.length; j++) {
          this.nodes[i].innerHTML += arg.nodes[j].outerHTML;
        }
      }
    }
  }

  children() {
    let result = [];

    for (let i = 0; i < this.nodes.length; i++) {
      result = result.concat(this.nodes[i].children);
    }

    return new DOMNodeCollection(result);
  }

  parent(){
    let result = [];

    for (let i = 0; i < this.nodes.length; i++) {
      result = result.concat(this.nodes[i].parentElement);
    }

    return new DOMNodeCollection(result);
  }

  find(selector){
    let result = [];

    for (let i = 0; i < this.nodes.length; i++) {
      result.push(this.nodes[i].querySelectorAll(selector));
    }

    return new DOMNodeCollection(result);
  }

  remove() {
    this.nodes.forEach( (node) => {

      let domNode = new DOMNodeCollection([node]);
      let parent = domNode.parent();

      parent.empty();

    });

    return this;

  }

  on(event, cb){
    this.nodes.forEach( (node) => {
      node.cb = cb;
      node.addEventListener(event, node.cb);
    });
    return this;
  }

  off(event){
    this.nodes.forEach( (node) => {
      node.removeEventListener(event, node.cb);
    });
    return this;
  }

}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);