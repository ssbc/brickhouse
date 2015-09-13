(function prelude(content, deps, entry) {
  var cache = {}

  function load (file) {
    var d = deps[file]
    if(cache[file]) return cache[file]
    if(!d) return require(file)
    var fn = content[d[0]] //the actual module
    var module = {exports: {}, parent: file !== entry}
    fn(
      function (m) {
        //console.error('require', m, d[1][m])
        if(!d[1][m]) return require(m)
        else         return load (d[1][m])
      },
      module,
      module.exports,
      file.substring(file.lastIndexOf('/')),
      file
    )
    return cache[file] = module.exports
  }

  return load(entry)
})({
"2FR1o2sSxRaSREWp4EXlcuz46iuY1ZvazxGj1c3CHmw=":
function (require, module, exports, __dirname, __filename) {
var split = require('browser-split')
var ClassList = require('class-list')
require('html-element')

function context () {

  var cleanupFuncs = []

  function h() {
    var args = [].slice.call(arguments), e = null
    function item (l) {
      var r
      function parseClass (string) {
        var m = split(string, /([\.#]?[a-zA-Z0-9_:-]+)/)
        if(/^\.|#/.test(m[1]))
          e = document.createElement('div')
        forEach(m, function (v) {
          var s = v.substring(1,v.length)
          if(!v) return
          if(!e)
            e = document.createElement(v)
          else if (v[0] === '.')
            ClassList(e).add(s)
          else if (v[0] === '#')
            e.setAttribute('id', s)
        })
      }

      if(l == null)
        ;
      else if('string' === typeof l) {
        if(!e)
          parseClass(l)
        else
          e.appendChild(r = document.createTextNode(l))
      }
      else if('number' === typeof l
        || 'boolean' === typeof l
        || l instanceof Date
        || l instanceof RegExp ) {
          e.appendChild(r = document.createTextNode(l.toString()))
      }
      //there might be a better way to handle this...
      else if (isArray(l))
        forEach(l, item)
      else if(isNode(l))
        e.appendChild(r = l)
      else if(l instanceof Text)
        e.appendChild(r = l)
      else if ('object' === typeof l) {
        for (var k in l) {
          if('function' === typeof l[k]) {
            if(/^on\w+/.test(k)) {
              (function (k, l) { // capture k, l in the closure
                if (e.addEventListener){
                  e.addEventListener(k.substring(2), l[k], false)
                  cleanupFuncs.push(function(){
                    e.removeEventListener(k.substring(2), l[k], false)
                  })
                }else{
                  e.attachEvent(k, l[k])
                  cleanupFuncs.push(function(){
                    e.detachEvent(k, l[k])
                  })
                }
              })(k, l)
            } else {
              // observable
              e[k] = l[k]()
              cleanupFuncs.push(l[k](function (v) {
                e[k] = v
              }))
            }
          }
          else if(k === 'style') {
            if('string' === typeof l[k]) {
              e.style.cssText = l[k]
            }else{
              for (var s in l[k]) (function(s, v) {
                if('function' === typeof v) {
                  // observable
                  e.style.setProperty(s, v())
                  cleanupFuncs.push(v(function (val) {
                    e.style.setProperty(s, val)
                  }))
                } else
                  e.style.setProperty(s, l[k][s])
              })(s, l[k][s])
            }
          } else if (k.substr(0, 5) === "data-") {
            e.setAttribute(k, l[k])
          } else {
            e[k] = l[k]
          }
        }
      } else if ('function' === typeof l) {
        //assume it's an observable!
        var v = l()
        e.appendChild(r = isNode(v) ? v : document.createTextNode(v))

        cleanupFuncs.push(l(function (v) {
          if(isNode(v) && r.parentElement)
            r.parentElement.replaceChild(v, r), r = v
          else
            r.textContent = v
        }))
      }

      return r
    }
    while(args.length)
      item(args.shift())

    return e
  }

  h.cleanup = function () {
    for (var i = 0; i < cleanupFuncs.length; i++){
      cleanupFuncs[i]()
    }
    cleanupFuncs.length = 0
  }

  return h
}

var h = module.exports = context()
h.context = context

function isNode (el) {
  return el && el.nodeName && el.nodeType
}

function isText (el) {
  return el && el.nodeName === '#text' && el.nodeType == 3
}

function forEach (arr, fn) {
  if (arr.forEach) return arr.forEach(fn)
  for (var i = 0; i < arr.length; i++) fn(arr[i], i)
}

function isArray (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]'
}

},
"8zMGV0j0ID5bUIeT7r+MYLl5+yL8YL4u69uOLDWc1Bg=":
function (require, module, exports, __dirname, __filename) {

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},
"Wv1CKXCRlKONURP9WKcvNBVf+p0WhAs0UjGiWqI0GYs=":
function (require, module, exports, __dirname, __filename) {
// contains, add, remove, toggle
var indexof = require('indexof')

module.exports = ClassList

function ClassList(elem) {
    var cl = elem.classList

    if (cl) {
        return cl
    }

    var classList = {
        add: add
        , remove: remove
        , contains: contains
        , toggle: toggle
        , toString: $toString
        , length: 0
        , item: item
    }

    return classList

    function add(token) {
        var list = getTokens()
        if (indexof(list, token) > -1) {
            return
        }
        list.push(token)
        setTokens(list)
    }

    function remove(token) {
        var list = getTokens()
            , index = indexof(list, token)

        if (index === -1) {
            return
        }

        list.splice(index, 1)
        setTokens(list)
    }

    function contains(token) {
        return indexof(getTokens(), token) > -1
    }

    function toggle(token) {
        if (contains(token)) {
            remove(token)
            return false
        } else {
            add(token)
            return true
        }
    }

    function $toString() {
        return elem.className
    }

    function item(index) {
        var tokens = getTokens()
        return tokens[index] || null
    }

    function getTokens() {
        var className = elem.className

        return filter(className.split(" "), isTruthy)
    }

    function setTokens(list) {
        var length = list.length

        elem.className = list.join(" ")
        classList.length = length

        for (var i = 0; i < list.length; i++) {
            classList[i] = list[i]
        }

        delete list[length]
    }
}

function filter (arr, fn) {
    var ret = []
    for (var i = 0; i < arr.length; i++) {
        if (fn(arr[i])) ret.push(arr[i])
    }
    return ret
}

function isTruthy(value) {
    return !!value
}

},
"njPVWP6KlLu/yEvCtar5jUrL1jZ5ntcII2376XKnf7o=":
function (require, module, exports, __dirname, __filename) {

var h = require('hyperscript')

document.body.appendChild(h('h1', 'home app'))
document.body.appendChild(h('p',
    'this is just the simplest possible thing',
    'to test that the supporting stuff all works.',
    'this is the app which would be responsible for the first app.',
    'and would do stuff like manage the other apps, or window management stuff'
  )
)


},
"rvU3L3UyAELTHd/kyDxMcm2nWGNW9EP3603AbvvAaZI=":
function (require, module, exports, __dirname, __filename) {
global.Document = Document
global.Node     = Node
global.Element  = Element
global.Comment  = Comment
global.Text     = Text
global.document = new Document()

var ClassList = require('class-list')

function Document() {}

Document.prototype.createTextNode = function(v) {
    var n = new Text();
    n.textContent = v;
    n.nodeName = '#text'
    n.nodeType = 3
    return n;
}

Document.prototype.createElement = function(nodeName) {
    var el = new Element();
    el.nodeName = nodeName;
    return el;
}

Document.prototype.createComment = function(data) {
    var el = new Comment()
    el.data = data
    return el;
}


function Node () {}

Text.prototype = new Node()

Element.prototype = new Node()

Comment.prototype = new Node()


function Style (el) {
  this.el = el;
  this.styles = [];
}

Style.prototype.setProperty = function (n,v) {
    this.el._setProperty(this.styles, {name: n, value:v});
}

Style.prototype.getProperty = function(n) {    
    return this.el._getProperty(this.styles, n);
}

Style.prototype.__defineGetter__('cssText', function () {
    var stylified = '';
    this.styles.forEach(function(s){
      stylified+=s.name+':'+s.value+';';
    })
    return stylified;
})

Style.prototype.__defineSetter__('cssText', function (v) {
    this.styles.length = 0

    // parse cssText and set style attributes
    v.split(';').forEach(function(part){
      var splitPoint = part.indexOf(':')
      if (splitPoint){
        var key = part.slice(0, splitPoint).trim()
        var value = part.slice(splitPoint+1).trim()
        this.setProperty(key, value)
      }
    }, this)
})

function Attribute(name, value){  
  if (name) {
    this.name = name;
    this.value = value ? value : '';
  }  
}


function Element() {
    var self = this;

    this.style = new Style(this)
    this.classList = ClassList(this);
    this.childNodes = [];
    this.attributes = [];
    this.dataset = {};
    this.className = '';

    this._setProperty = function(arr, obj, key, val) {
      var p = self._getProperty(arr, key);      
      if (p) {
        p.value = val;
        return;
      }
      arr.push('function' === typeof obj ? new obj(key.toLowerCase(),val) : obj);
    }

    this._getProperty = function(arr, key) {
      if (!key) return;
      key = key.toLowerCase();
      for (var i=0;i<arr.length;i++) {
        if (key == arr[i].name) return arr[i];
      }
    }
}

Element.prototype.nodeType = 1;

Element.prototype.appendChild = function(child) {
    child.parentElement = this;
    this.childNodes.push(child);
    return child;
}

Element.prototype.setAttribute = function (n, v) {
  if (n == 'style'){
    this.style.cssText = v
  } else {
    this._setProperty(this.attributes, Attribute, n, v);
  }
}

Element.prototype.getAttribute = function(n) {
  if (n == 'style'){
    return this.style.cssText
  } else {
    return this._getProperty(this.attributes, n);
  }
}

Element.prototype.replaceChild = function(newChild, oldChild) {
    var self = this;
    var replaced = false;
    this.childNodes.forEach(function(child, index){
        if (child === oldChild) {
            self.childNodes[index] = newChild;
            replaced = true;
        }
    });
    if (replaced) return oldChild;
}

Element.prototype.removeChild = function(rChild) {
    var self = this;
    var removed = true;
    this.childNodes.forEach(function(child, index){
        if (child === rChild) {
            delete self.childNodes[index];
            removed = true;
        }
    })
    if (removed) return rChild;
}

Element.prototype.insertBefore = function(newChild, existingChild) {
    var self = this;
    this.childNodes.forEach(function(child, index){      
      if (child === existingChild) {
        index === 0 ?  self.childNodes.unshift(newChild)
                    :  self.childNodes.splice(index, 0, newChild);
      }  
    })
    return newChild;
}

Element.prototype.__defineGetter__('innerHTML', function () {
    // regurgitate set innerHTML
    var s = this.childNodes.html || ''
    this.childNodes.forEach(function (e) {
      s += (e.outerHTML || e.textContent)
    })
    return s
})

Element.prototype.__defineSetter__('innerHTML', function (v) {
    //only handle this simple case that doesn't need parsing
    //this case is useful... parsing is hard and will need added deps!
    this.childNodes.length = 0

    // hack to preserve set innerHTML - no parsing just regurgitation
    this.childNodes.html = v
})


Element.prototype.__defineGetter__('outerHTML', function () {
  var a = [],  self = this;
  
  function _stringify(arr) {
    var attr = [], value;        
    arr.forEach(function(a){
      value = ('style' != a.name) ? a.value : self.style.cssText;
      attr.push(a.name+'='+'\"'+escapeAttribute(value)+'\"');
    })
    return attr.length ? ' '+attr.join(" ") : '';
  }

  function _dataify(data) {      
    var attr = [], value;  
    Object.keys(data).forEach(function(name){
      attr.push('data-'+name+'='+'\"'+escapeAttribute(data[name])+'\"');
    })
    return attr.length ? ' '+attr.join(" ") : '';
  }

   function _propertify() {
    var props = [];
    for (var key in self) {            
      _isProperty(key) && props.push({name: key, value:self[key]});
    }    
    // special className case, if className property is define while 'class' attribute is not then
    // include class attribute in output
    self.className.length && !self.getAttribute('class') && props.push({name:'class', value: self.className})   
    return props ? _stringify(props) : '';
  }

  function _isProperty(key) {          
      var types = ['string','boolean','number']      
      for (var i=0; i<=types.length;i++) {        
        if (self.hasOwnProperty(key) && 
            types[i] === typeof self[key] &&
            key !== 'nodeName' &&
            key !== 'nodeType' &&
            key !== 'className'
            ) return true;
      }      
  }

  a.push('<'+this.nodeName + _propertify() + _stringify(this.attributes) + _dataify(this.dataset) +'>')

  a.push(this.innerHTML)

  a.push('</'+this.nodeName+'>')

  return a.join('')
})

Element.prototype.__defineGetter__('textContent', function () {
  var s = ''
  this.childNodes.forEach(function (e) {
    s += e.textContent
  })
  return s
})

Element.prototype.addEventListener = function(t, l) {}

function escapeHTML(s) {
  return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
}

function escapeAttribute(s) {
  return escapeHTML(s).replace(/"/g, '&quot;')
}

function Text(){}

Text.prototype.nodeType = 3;

Text.prototype.nodeName = '#text';

Text.prototype.__defineGetter__('textContent', function() {
  return escapeHTML(this.value || '');
})

Text.prototype.__defineSetter__('textContent', function(v) {
  this.value = v
})


function Comment(){}

Comment.prototype.nodeType = 8;

Comment.prototype.nodeName = '#comment';

Comment.prototype.__defineGetter__('data', function() {
  return this.value
})

Comment.prototype.__defineSetter__('data', function(v) {
  this.value = v
})

Comment.prototype.__defineGetter__('outerHTML', function() {
  return '<!--' + escapeHTML(this.value || '') + '-->'
})

},
"wOoDDqivqVK8yNeMmiIYZ39w2874eqqRg4HhGOEiCVw=":
function (require, module, exports, __dirname, __filename) {
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},

}
,
{
  "index.js": [
    "njPVWP6KlLu/yEvCtar5jUrL1jZ5ntcII2376XKnf7o=",
    {
      "hyperscript": "node_modules/hyperscript/index.js"
    }
  ],
  "node_modules/browser-split/index.js": [
    "wOoDDqivqVK8yNeMmiIYZ39w2874eqqRg4HhGOEiCVw=",
    {}
  ],
  "node_modules/class-list/index.js": [
    "Wv1CKXCRlKONURP9WKcvNBVf+p0WhAs0UjGiWqI0GYs=",
    {
      "indexof": "node_modules/indexof/index.js"
    }
  ],
  "node_modules/html-element/index.js": [
    "rvU3L3UyAELTHd/kyDxMcm2nWGNW9EP3603AbvvAaZI=",
    {
      "class-list": "node_modules/class-list/index.js"
    }
  ],
  "node_modules/hyperscript/index.js": [
    "2FR1o2sSxRaSREWp4EXlcuz46iuY1ZvazxGj1c3CHmw=",
    {
      "browser-split": "node_modules/browser-split/index.js",
      "class-list": "node_modules/class-list/index.js",
      "html-element": "node_modules/html-element/index.js"
    }
  ],
  "node_modules/indexof/index.js": [
    "8zMGV0j0ID5bUIeT7r+MYLl5+yL8YL4u69uOLDWc1Bg=",
    {}
  ]
},
"index.js")