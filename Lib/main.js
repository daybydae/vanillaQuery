const DomNodeCollection = require('./dom_node_collection');


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
