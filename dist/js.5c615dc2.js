// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"assets/js/mediaPlayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* Creamos un objeto MediaPlayer */
function MediaPlayer(config) {
  this.media = config.el;
  this.plugins = config.plugins || [];

  this._initPlugins();
}
/* Función que inicializa los plugins */


MediaPlayer.prototype._initPlugins = function () {
  /* Creamos un objeto que tiene la función play, pause y dos propiedades virtuales */
  const player = {
    play: () => this.play,
    pause: () => this.pause,
    media: this.media,

    /*Podemos crear una propiedad virtual con get*/
    get muted() {
      return this.media.muted;
    },

    /*Podemos crear una propiedad virtual con set*/
    set muted(value) {
      this.media.muted = value;
    }

  };
  /*Se le aplicara una función a cada plugin. Lo que hacemos es ejecutar cada plugin.*/

  this.plugins.forEach(plugin => {
    /* Tenemos que llamar un método específico
    En este caso a plugin le pasamos como parámetro el video = this.media */
    plugin.run(this.media);
  });
};

MediaPlayer.prototype.togglePlay = function () {
  if (this.media.paused) {
    this.play();
  } else {
    this.pause();
  }
};

MediaPlayer.prototype.play = function () {
  this.media.play();
};

MediaPlayer.prototype.pause = function () {
  this.media.pause();
};

MediaPlayer.prototype.mute = function () {
  this.media.muted = true;
};

MediaPlayer.prototype.unmute = function () {
  this.media.muted = false;
};

var _default = MediaPlayer;
exports.default = _default;
},{}],"assets/js/plugins/AutoPlay.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* Creemos una función vacía */
function AutoPlay() {}
/* Le agregamos al objeto Autoplay la función run a su prototype */


AutoPlay.prototype.run = function (player) {
  if (!player.muted) {
    player.muted = true;
  }

  player.play();
};
/* Declaramos que vamos a exportar la función AutoPlay */


var _default = AutoPlay;
exports.default = _default;
},{}],"assets/js/plugins/AutoPause.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class AutoPause {
  constructor() {
    this.threshold = 0.25;
    /* Utilizamos bind para que el this no haga referencia a handleInterseccion si no al this de la clase */

    this.handleInterseccion = this.handleInterseccion.bind(this);
    /* Utilizamos bind para que el this no haga referencia a handleVisibilityChange si no al this de la clase */

    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  run(player) {
    /* Instanciamos parámetro con this.player para que otras funciones tambien puedan usarlo*/
    this.player = player;
    /* POnemos un observador y definimos un límite para mirar, Cuando pase el threshold se ejecutará handleInterseccion */

    const observer = new IntersectionObserver(this.handleInterseccion, {
      threshold: this.threshold
    });
    observer.observe(player);
    /* Se ejecuta esta función en el Media player y ejecutará la función handleVisibilityChange cuando
    la visibilidad cambie
    */

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  handleVisibilityChange() {
    // console.log(document.visibilityState)
    if (document.visibilityState === 'hidden') {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  handleInterseccion(entries) {
    const entry = entries[0];
    console.log(entry.intersectionRatio);

    if (this.threshold <= entry.intersectionRatio) {
      this.player.play();
    } else {
      this.player.pause();
    } // this.player.pause()
    // this.player.play()

  }

}

; // function AutoPause(){}
// AutoPause.prototype.run = function (player){
//     const observer = new IntersectionObserver(this.handleInterseccion, {
//     threshold : 0.25 })
//     observer.observe(player.media)
// };
// AutoPause.prototype.handleInterseccion = function(entries){
//     const entry = entries[0]
//     console.log(entry)
// };

var _default = AutoPause;
exports.default = _default;
},{}],"assets/js/index.js":[function(require,module,exports) {
"use strict";

var _mediaPlayer = _interopRequireDefault(require("./mediaPlayer.js"));

var _AutoPlay = _interopRequireDefault(require("./plugins/AutoPlay.js"));

var _AutoPause = _interopRequireDefault(require("./plugins/AutoPause.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Importamos dos módulos el MediaPlayer y Autoplay

/* guardamos en una variable la etiqueta video */
const video = document.querySelector("video");
/* Creamos una clase player que es como la de MediaPlayer, le pasamos dos parámetros
(1) el media, en este caso 
(2) un objeto AutoPlay
y le paso como parámetro un objeto */

const player = new _mediaPlayer.default({
  el: video,
  plugins: [new _AutoPlay.default(), new _AutoPause.default()]
});
const playButton = document.querySelector('#playButton');

playButton.onclick = () => player.togglePlay();

const muteButton = document.querySelector('#muteButton');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

muteButton.onclick = () => {
  if (player.media.muted) {
    player.unmute();
    console.log('hola');
  } else {
    player.mute();
  }
};
},{"./mediaPlayer.js":"assets/js/mediaPlayer.js","./plugins/AutoPlay.js":"assets/js/plugins/AutoPlay.js","./plugins/AutoPause.js":"assets/js/plugins/AutoPause.js","/mnt/c/Users/paqui/desktop/primer semestre/Cursos en platzi/Curso Profesional de javascript/sw.js":[["sw.js","sw.js"],"sw.js.map","sw.js"]}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54916" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","assets/js/index.js"], null)
//# sourceMappingURL=/js.5c615dc2.js.map