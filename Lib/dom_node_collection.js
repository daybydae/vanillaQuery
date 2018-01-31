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
