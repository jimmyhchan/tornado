'use strict';

let nativeSlice = Array.prototype.slice;

let visitTornadoBodyChildren = function(node, visit) {
  let extraArgs = nativeSlice.call(arguments, 2);
  if (node[1].params) {
    visit.apply(null, [['params'].concat(node[1].params)].concat(extraArgs));
  }
  if (node[1].body) {
    visit.apply(null, [['body'].concat(node[1].body)].concat(extraArgs));
  }
  if (node[1].bodies) {
    visit.apply(null, [['bodies'].concat(node[1].bodies)].concat(extraArgs));
  }
};

let visitTornadoPartialChildren = function(node, visit) {
  let extraArgs = nativeSlice.call(arguments, 2);
  if (node[1].params) {
    visit.apply(null, [['params'].concat(node[1].params)].concat(extraArgs));
  }
};

let visitHtmlElementChildren = function(node, visit) {
  let extraArgs = nativeSlice.call(arguments, 2);
  if (node[1].tag_info.attributes) {
    visit.apply(null, [['htmlAttributes'].concat(node[1].tag_info.attributes)].concat(extraArgs));
  }
  if (node[1].tag_contents) {
    visit.apply(null, [['htmlTagContents'].concat(node[1].tag_contents)].concat(extraArgs));
  }
};

let visitHtmlAttributeRHSs = function(node, visit) {
  let extraArgs = nativeSlice.call(arguments, 2);
  if (node[1].value) {
    visit.apply(null, [['htmlAttrRhs'].concat(node[1].value)].concat(extraArgs));
  }
};

/**
 * there's a contract of ['name', arrayOfChildren...] created above
 */
let visitChildren = function(node, visit) {
  let extraArgs = nativeSlice.call(arguments, 2);
  // first item is the current type
  let type = node[0];
  // item 1-n are the children
  let children = node.slice(1);
  let len = children.length;
  children.forEach(function(child, i) {
    child.idx = i;
    child.parentType = type;
    if (i === 0) {
      child.first = true;
    } else if (i === len - 1) {
      child.last = true;
    }
    visit.apply(null, [child].concat(extraArgs));
  });
};

let visitorKeys = {
  // Current Top level stuff
  TEMPLATE: visitChildren,
  TORNADO_BODY: visitTornadoBodyChildren,
  TORNADO_PARTIAL: visitTornadoPartialChildren,
  HTML_ELEMENT: visitHtmlElementChildren,
  HTML_ATTRIBUTE: visitHtmlAttributeRHSs,
  // meta stuff
  body: visitChildren,
  bodies: visitChildren,
  params: visitChildren,

  htmlAttributes: visitChildren,
  htmlTagContents: visitChildren,
  htmlAttrRhs: visitChildren
    // values containers TBD
    //
    // TORNADO_REFERENCE:
    // TORNADO_COMMENT
    // HTML_COMMENT
    // PLAIN_TEXT
    //
  // param: visitParam,
  // reference: visitChildren,
  // '@': visitSection,
  // '#': visitSection,
  // '?': visitSection,
  // '^': visitSection,
  // '+': visitSection,
  // '<': visitSection,
  // partial: visitSection,
  // '%': visitSection
  // filter
  // key
  // special
  // format
  // literal
  // path
  // buffer
  // comment
  // raw
  // context

};

export default visitorKeys;
