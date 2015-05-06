let compiler = require('../dist/compiler'),
    parser = require('../dist/parser');

function runSuites(suites) {
  let container = document.querySelector('#output');
  suites.forEach(suite => {
    let suiteContainer = document.createElement('div');
    let header = document.createElement('h2');
    header.appendChild(document.createTextNode(suite.name));
    suiteContainer.appendChild(header);
    container.appendChild(suiteContainer);
    suite.tests.forEach(test => {
      let html = test.template;
      let ast = parser.parse(html);
      let compiledTemplate = compiler.compile(ast, 'abc');
      if (test.description === 'Exists in an attribute with an else') {
        console.log(compiledTemplate);
      }
      let tl;
      eval(`tl = ${compiledTemplate};`);
      let out = tl.render(test.context);
      let res;
      setTimeout(() => {
        res = compareNodes(out, test.expectedDom);
        if (!res) {
          let div = document.createElement('div');
          div.appendChild(out);
          let expectedDiv = document.createElement('div');
          expectedDiv.appendChild(test.expectedDom);
          test.fail = `Expected ${div.innerHTML} to equal ${expectedDiv.innerHTML}`;
        }
        suiteContainer.appendChild(createTestOutput(test, res));
      }, 0);
    });
  });
}

function createTestOutput(test, res) {
  let li = document.createElement('li');
  let desc = document.createElement('p');
  desc.innerHTML = test.description;
  li.appendChild(desc);
  if (test.fail) {
    li.appendChild(document.createTextNode(test.fail))
  } else {
    li.classList.add('pass');
  }
  return li;
}

// Compare DOM nodes for equality
function compareNodes(a, b) {
  let aChildren = a.childNodes || [];
  let bChildren = b.childNodes || [];
  let aAttributes = a.attributes || [];
  let bAttributes = b.attributes || [];
  let childrenMatch = true;
  if (a.nodeType !== b.nodeType) {
    return false;
  }
  if (a.nodeType === 3 && a.data !== b.data) {
    // Compare text node values
    return false;
  }
  if ((aChildren.length !== bChildren.length) ||
      (aAttributes.length !== bAttributes.length)) {
    return false;
  }
  if (!compareAttrs(aAttributes, bAttributes)) {
    return false;
  }

  for (var i=0, len=aChildren.length; i<len; i++) {
    childrenMatch = compareNodes(aChildren[i], bChildren[i]);
  }
  return childrenMatch;
}

// Compare the attributes of two nodes for equality
function compareAttrs(a, b) {
  var attr, attrName;
  for (var i=0, len=a.length; i<len; i++) {
    attr = a[0];
    attrName = attr.name;
    if (!b[attrName] || b[attrName].value !== attr.value) {
      return false;
    }
  }
  return true;
}

module.exports = {
  runSuites: runSuites
};