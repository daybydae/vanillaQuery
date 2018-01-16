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


window.$l = function(selector){
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

// $l.extend = (base, ...otherObjs) => {
//   otherObjs.forEach( obj => {
//     for (const prop in obj) {
//       base[prop] = obj[prop];
//     }
//   });
//   return base;
// };

$l.extend = (...otherObjs) => {
  return Object.assign(...otherObjs);
};

$l.ajax = (options) => {
  const xhr = new XMLHttpRequest();

  defaults = {
    method: 'GET',
    contentType: 'HTML',
    url: '',
    success: () => {},
    error: () => {},
    data: {}
  };

  const result = $l.extend(defaults, options);
  xhr.open(result.method, result.url);
  xhr.onload = () => {
    console.log(xhr.status);
    console.log(xhr.responseType);
    console.log(xhr.response);
  };

  const optionalData = result.data;
  xhr.send(optionalData);
  return xhr;
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
        // el.className = "";
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
      //DOMNodeCollection
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

      // node.parentNode.removeChild(node);
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