const DomNodeCollection = require('./dom_node_collection');


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
