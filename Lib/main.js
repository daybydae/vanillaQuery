const DomNodeCollection = require('./dom_node_collection');


window.$l = function(selector){
  if (selector instanceof HTMLElement) {
    return new DomNodeCollection([selector]);
  } else {
    let array = Array.from(document.querySelectorAll(selector));
    return new DomNodeCollection(array);
  }
};
