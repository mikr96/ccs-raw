!(function(t) {
  function i(t, n, r, a, e) {
    (this._listener = n),
      (this._isOnce = r),
      (this.context = a),
      (this._signal = t),
      (this._priority = e || 0);
  }
  function a(t, n) {
    if ("function" != typeof t)
      throw Error(
        "listener is a required param of {fn}() and should be a Function.".replace(
          "{fn}",
          n
        )
      );
  }
  function n() {
    (this._bindings = []), (this._prevParams = null);
    var t = this;
    this.dispatch = function() {
      n.prototype.dispatch.apply(t, arguments);
    };
  }
  n.prototype = {
    VERSION: "1.0.0",
    memorize: !(i.prototype = {
      active: !0,
      params: null,
      execute: function(t) {
        var n;
        return (
          this.active &&
            this._listener &&
            ((t = this.params ? this.params.concat(t) : t),
            (n = this._listener.apply(this.context, t)),
            this._isOnce && this.detach()),
          n
        );
      },
      detach: function() {
        return this.isBound()
          ? this._signal.remove(this._listener, this.context)
          : null;
      },
      isBound: function() {
        return !!this._signal && !!this._listener;
      },
      isOnce: function() {
        return this._isOnce;
      },
      getListener: function() {
        return this._listener;
      },
      getSignal: function() {
        return this._signal;
      },
      _destroy: function() {
        delete this._signal, delete this._listener, delete this.context;
      },
      toString: function() {
        return (
          "[SignalBinding isOnce:" +
          this._isOnce +
          ", isBound:" +
          this.isBound() +
          ", active:" +
          this.active +
          "]"
        );
      }
    }),
    _shouldPropagate: !0,
    active: !0,
    _registerListener: function(t, n, r, a) {
      var e = this._indexOfListener(t, r);
      if (-1 !== e) {
        if ((t = this._bindings[e]).isOnce() !== n)
          throw Error(
            "You cannot add" +
              (n ? "" : "Once") +
              "() then add" +
              (n ? "Once" : "") +
              "() the same listener without removing the relationship first."
          );
      } else (t = new i(this, t, n, r, a)), this._addBinding(t);
      return (
        this.memorize && this._prevParams && t.execute(this._prevParams), t
      );
    },
    _addBinding: function(t) {
      for (
        var n = this._bindings.length;
        --n, this._bindings[n] && t._priority <= this._bindings[n]._priority;

      );
      this._bindings.splice(n + 1, 0, t);
    },
    _indexOfListener: function(t, n) {
      for (var r, a = this._bindings.length; a--; )
        if ((r = this._bindings[a])._listener === t && r.context === n)
          return a;
      return -1;
    },
    has: function(t, n) {
      return -1 !== this._indexOfListener(t, n);
    },
    add: function(t, n, r) {
      return a(t, "add"), this._registerListener(t, !1, n, r);
    },
    addOnce: function(t, n, r) {
      return a(t, "addOnce"), this._registerListener(t, !0, n, r);
    },
    remove: function(t, n) {
      a(t, "remove");
      var r = this._indexOfListener(t, n);
      return (
        -1 !== r && (this._bindings[r]._destroy(), this._bindings.splice(r, 1)),
        t
      );
    },
    removeAll: function() {
      for (var t = this._bindings.length; t--; ) this._bindings[t]._destroy();
      this._bindings.length = 0;
    },
    getNumListeners: function() {
      return this._bindings.length;
    },
    halt: function() {
      this._shouldPropagate = !1;
    },
    dispatch: function(t) {
      if (this.active) {
        var n,
          r = Array.prototype.slice.call(arguments),
          a = this._bindings.length;
        if ((this.memorize && (this._prevParams = r), a))
          for (
            n = this._bindings.slice(), this._shouldPropagate = !0;
            n[--a] && this._shouldPropagate && !1 !== n[a].execute(r);

          );
      }
    },
    forget: function() {
      this._prevParams = null;
    },
    dispose: function() {
      this.removeAll(), delete this._bindings, delete this._prevParams;
    },
    toString: function() {
      return (
        "[Signal active:" +
        this.active +
        " numListeners:" +
        this.getNumListeners() +
        "]"
      );
    }
  };
  var r = n;
  (r.Signal = n),
    "function" == typeof define && define.amd
      ? define(function() {
          return r;
        })
      : "undefined" != typeof module && module.exports
      ? (module.exports = r)
      : (t.signals = r);
})(this),
  (function() {
    var t = function(s) {
      function d(t, n) {
        if (t.indexOf) return t.indexOf(n);
        for (var r = t.length; r--; ) if (t[r] === n) return r;
        return -1;
      }
      function n(t, n) {
        var r = d(t, n);
        -1 !== r && t.splice(r, 1);
      }
      function r(t, n) {
        return "[object " + n + "]" === Object.prototype.toString.call(t);
      }
      function l(t) {
        return r(t, "RegExp");
      }
      function o(t) {
        return r(t, "Array");
      }
      function c(t) {
        return "function" == typeof t;
      }
      function u(t) {
        return null === t || "null" === t
          ? null
          : "true" === t ||
              ("false" !== t &&
                (t === i || "undefined" === t
                  ? i
                  : "" === t || isNaN(t)
                  ? t
                  : parseFloat(t)));
      }
      function h(t, n) {
        for (
          var r,
            a,
            e,
            i,
            s = (t || "").replace("?", "").split("&"),
            d = -1,
            l = {};
          (a = s[++d]);

        )
          (r = a.indexOf("=")),
            (i = a.substring(0, r)),
            (e = decodeURIComponent(a.substring(r + 1))),
            !1 !== n && (e = u(e)),
            i in l ? (o(l[i]) ? l[i].push(e) : (l[i] = [l[i], e])) : (l[i] = e);
        return l;
      }
      function t() {
        (this.bypassed = new s.Signal()),
          (this.routed = new s.Signal()),
          (this._routes = []),
          (this._prevRoutes = []),
          (this._piped = []),
          this.resetState();
      }
      function e(t, n, r, a) {
        var e = l(t),
          i = a.patternLexer;
        (this._router = a),
          (this._pattern = t),
          (this._paramsIds = e ? null : i.getParamIds(t)),
          (this._optionalParamsIds = e ? null : i.getOptionalParamsIds(t)),
          (this._matchRegexp = e ? t : i.compilePattern(t, a.ignoreCase)),
          (this.matched = new s.Signal()),
          (this.switched = new s.Signal()),
          n && this.matched.add(n),
          (this._priority = r || 0);
      }
      var a, b, i;
      return (
        (b = "" === /t(.+)?/.exec("t")[1]),
        (t.prototype = {
          greedy: !1,
          greedyEnabled: !0,
          ignoreCase: !0,
          ignoreState: !1,
          shouldTypecast: !1,
          normalizeFn: null,
          resetState: function() {
            (this._prevRoutes.length = 0),
              (this._prevMatchedRequest = null),
              (this._prevBypassedRequest = null);
          },
          create: function() {
            return new t();
          },
          addRoute: function(t, n, r) {
            var a = new e(t, n, r, this);
            return this._sortedInsert(a), a;
          },
          removeRoute: function(t) {
            n(this._routes, t), t._destroy();
          },
          removeAllRoutes: function() {
            for (var t = this.getNumRoutes(); t--; ) this._routes[t]._destroy();
            this._routes.length = 0;
          },
          parse: function(t, n) {
            if (
              ((t = t || ""),
              (n = n || []),
              this.ignoreState ||
                (t !== this._prevMatchedRequest &&
                  t !== this._prevBypassedRequest))
            ) {
              var r,
                a = this._getMatchedRoutes(t),
                e = 0,
                i = a.length;
              if (i)
                for (
                  this._prevMatchedRequest = t,
                    this._notifyPrevRoutes(a, t),
                    this._prevRoutes = a;
                  e < i;

                )
                  (r = a[e]).route.matched.dispatch.apply(
                    r.route.matched,
                    n.concat(r.params)
                  ),
                    (r.isFirst = !e),
                    this.routed.dispatch.apply(this.routed, n.concat([t, r])),
                    (e += 1);
              else
                (this._prevBypassedRequest = t),
                  this.bypassed.dispatch.apply(this.bypassed, n.concat([t]));
              this._pipeParse(t, n);
            }
          },
          _notifyPrevRoutes: function(t, n) {
            for (var r, a = 0; (r = this._prevRoutes[a++]); )
              r.route.switched &&
                this._didSwitch(r.route, t) &&
                r.route.switched.dispatch(n);
          },
          _didSwitch: function(t, n) {
            for (var r, a = 0; (r = n[a++]); ) if (r.route === t) return !1;
            return !0;
          },
          _pipeParse: function(t, n) {
            for (var r, a = 0; (r = this._piped[a++]); ) r.parse(t, n);
          },
          getNumRoutes: function() {
            return this._routes.length;
          },
          _sortedInsert: function(t) {
            for (
              var n = this._routes, r = n.length;
              n[--r] && t._priority <= n[r]._priority;

            );
            n.splice(r + 1, 0, t);
          },
          _getMatchedRoutes: function(t) {
            for (
              var n, r = [], a = this._routes, e = a.length;
              (n = a[--e]) &&
              ((!r.length || this.greedy || n.greedy) &&
                n.match(t) &&
                r.push({ route: n, params: n._getParamsArray(t) }),
              this.greedyEnabled || !r.length);

            );
            return r;
          },
          pipe: function(t) {
            this._piped.push(t);
          },
          unpipe: function(t) {
            n(this._piped, t);
          },
          toString: function() {
            return "[crossroads numRoutes:" + this.getNumRoutes() + "]";
          }
        }),
        ((a = new t()).VERSION = "0.12.2"),
        (a.NORM_AS_ARRAY = function(t, n) {
          return [n.vals_];
        }),
        (a.NORM_AS_OBJECT = function(t, n) {
          return [n];
        }),
        (e.prototype = {
          greedy: !1,
          rules: void 0,
          match: function(t) {
            return (
              (t = t || ""),
              this._matchRegexp.test(t) && this._validateParams(t)
            );
          },
          _validateParams: function(t) {
            var n,
              r = this.rules,
              a = this._getParamsObject(t);
            for (n in r)
              if (
                "normalize_" !== n &&
                r.hasOwnProperty(n) &&
                !this._isValidParam(t, n, a)
              )
                return !1;
            return !0;
          },
          _isValidParam: function(t, n, r) {
            var a = this.rules[n],
              e = r[n],
              i = !1,
              s = 0 === n.indexOf("?");
            return (
              null == e &&
              this._optionalParamsIds &&
              -1 !== d(this._optionalParamsIds, n)
                ? (i = !0)
                : l(a)
                ? (s && (e = r[n + "_"]), (i = a.test(e)))
                : o(a)
                ? (s && (e = r[n + "_"]), (i = this._isValidArrayRule(a, e)))
                : c(a) && (i = a(e, t, r)),
              i
            );
          },
          _isValidArrayRule: function(t, n) {
            if (!this._router.ignoreCase) return -1 !== d(t, n);
            "string" == typeof n && (n = n.toLowerCase());
            for (var r, a = t.length; a--; )
              if (("string" == typeof (r = t[a]) ? r.toLowerCase() : r) === n)
                return !0;
            return !1;
          },
          _getParamsObject: function(t) {
            for (
              var n,
                r,
                a = this._router.shouldTypecast,
                e = this._router.patternLexer.getParamValues(
                  t,
                  this._matchRegexp,
                  a
                ),
                i = {},
                s = e.length;
              s--;

            )
              (r = e[s]),
                this._paramsIds &&
                  (0 === (n = this._paramsIds[s]).indexOf("?") &&
                    r &&
                    ((r = h((i[n + "_"] = r), a)), (e[s] = r)),
                  b &&
                    "" === r &&
                    -1 !== d(this._optionalParamsIds, n) &&
                    ((r = void 0), (e[s] = r)),
                  (i[n] = r)),
                (i[s] = r);
            return (i.request_ = a ? u(t) : t), (i.vals_ = e), i;
          },
          _getParamsArray: function(t) {
            var n = this.rules ? this.rules.normalize_ : null;
            return (n = n || this._router.normalizeFn) && c(n)
              ? n(t, this._getParamsObject(t))
              : this._getParamsObject(t).vals_;
          },
          interpolate: function(t) {
            var n = this._router.patternLexer.interpolate(this._pattern, t);
            if (!this._validateParams(n))
              throw new Error(
                "Generated string doesn't validate against `Route.rules`."
              );
            return n;
          },
          dispose: function() {
            this._router.removeRoute(this);
          },
          _destroy: function() {
            this.matched.dispose(),
              this.switched.dispose(),
              (this.matched = this.switched = this._pattern = this._matchRegexp = null);
          },
          toString: function() {
            return (
              '[Route pattern:"' +
              this._pattern +
              '", numListeners:' +
              this.matched.getNumListeners() +
              "]"
            );
          }
        }),
        (t.prototype.patternLexer = (function() {
          function n(t, n) {
            var r,
              a = [];
            for (t.lastIndex = 0; (r = t.exec(n)); ) a.push(r[1]);
            return a;
          }
          function r(t, n, r) {
            var a, e;
            for (e in l)
              l.hasOwnProperty(e) && ((a = l[e]), (t = t.replace(a[n], a[r])));
            return t;
          }
          var a = /[\\.+*?\^$\[\](){}\/'#]/g,
            e = /^\/|\/$/g,
            i = /\/$/g,
            s = /(?:\{|:)([^}:]+)(?:\}|:)/g,
            l = {
              OS: {
                rgx: /([:}]|\w(?=\/))\/?(:|(?:\{\?))/g,
                save: "$1{{id}}$2",
                res: "\\/?"
              },
              RS: { rgx: /([:}])\/?(\{)/g, save: "$1{{id}}$2", res: "\\/" },
              RQ: { rgx: /\{\?([^}]+)\}/g, res: "\\?([^#]+)" },
              OQ: { rgx: /:\?([^:]+):/g, res: "(?:\\?([^#]*))?" },
              OR: { rgx: /:([^:]+)\*:/g, res: "(.*)?" },
              RR: { rgx: /\{([^}]+)\*\}/g, res: "(.+)" },
              RP: { rgx: /\{([^}]+)\}/g, res: "([^\\/?]+)" },
              OP: { rgx: /:([^:]+):/g, res: "([^\\/?]+)?/?" }
            },
            d = 1;
          return (
            (function() {
              var t, n;
              for (t in l)
                l.hasOwnProperty(t) &&
                  (((n = l[t]).id = "__CR_" + t + "__"),
                  (n.save =
                    "save" in n ? n.save.replace("{{id}}", n.id) : n.id),
                  (n.rRestore = new RegExp(n.id, "g")));
            })(),
            {
              strict: function() {
                d = 2;
              },
              loose: function() {
                d = 1;
              },
              legacy: function() {
                d = 3;
              },
              getParamIds: function(t) {
                return n(s, t);
              },
              getOptionalParamsIds: function(t) {
                return n(l.OP.rgx, t);
              },
              getParamValues: function(t, n, r) {
                var a = n.exec(t);
                return (
                  a &&
                    (a.shift(),
                    r &&
                      (a = (function(t) {
                        for (var n = t.length, r = []; n--; ) r[n] = u(t[n]);
                        return r;
                      })(a))),
                  a
                );
              },
              compilePattern: function(t, n) {
                return (
                  (t = t || "") &&
                    (1 === d
                      ? (t = t.replace(e, ""))
                      : 3 === d && (t = t.replace(i, "")),
                    (t = r(
                      (t = (t = r(t, "rgx", "save")).replace(a, "\\$&")),
                      "rRestore",
                      "res"
                    )),
                    1 === d && (t = "\\/?" + t)),
                  2 !== d && (t += "\\/?"),
                  new RegExp("^" + t + "$", n ? "i" : "")
                );
              },
              interpolate: function(t, d) {
                if (((d = d || {}), "string" != typeof t))
                  throw new Error("Route pattern should be a string.");
                return (
                  l.OS.trail ||
                    (l.OS.trail = new RegExp("(?:" + l.OS.id + ")+$")),
                  t
                    .replace(l.OS.rgx, l.OS.save)
                    .replace(s, function(t, n) {
                      var r;
                      if (
                        ((n = "?" === n.substr(0, 1) ? n.substr(1) : n),
                        null != d[n])
                      ) {
                        if ("object" == typeof d[n]) {
                          var a,
                            e = [];
                          for (var i in d[n])
                            if (o((a = d[n][i])))
                              for (var s in a)
                                "[]" == i.slice(-2)
                                  ? e.push(
                                      encodeURI(i.slice(0, -2)) +
                                        "[]=" +
                                        encodeURI(a[s])
                                    )
                                  : e.push(encodeURI(i + "=" + a[s]));
                            else e.push(encodeURI(i + "=" + a));
                          r = "?" + e.join("&");
                        } else r = String(d[n]);
                        if (-1 === t.indexOf("*") && -1 !== r.indexOf("/"))
                          throw new Error(
                            'Invalid value "' + r + '" for segment "' + t + '".'
                          );
                      } else {
                        if (-1 !== t.indexOf("{"))
                          throw new Error("The segment " + t + " is required.");
                        r = "";
                      }
                      return r;
                    })
                    .replace(l.OS.trail, "")
                    .replace(l.OS.rRestore, "/")
                );
              }
            }
          );
        })()),
        a
      );
    };
    "function" == typeof define && define.amd
      ? define(["signals"], t)
      : "undefined" != typeof module && module.exports
      ? (module.exports = t(require("signals")))
      : (window.crossroads = t(window.signals));
  })(),
  (function() {
    var t = function(f) {
      return (function(a) {
        var e,
          i,
          s,
          d,
          l,
          t = a.document,
          n = (a.history, f.Signal),
          r = /#(.*)$/,
          o = /(\?.*)|(\#.*)/,
          c = /^\#/,
          u = "onhashchange" in a && 7 !== t.documentMode;
        location.protocol;
        function h(t) {
          return String(t || "").replace(/\W/g, "\\$&");
        }
        function b(t) {
          if (!t) return "";
          var n = new RegExp(
            "^" + h(e.prependHash) + "|" + h(e.appendHash) + "$",
            "g"
          );
          return t.replace(n, "");
        }
        function p() {
          var t = r.exec(e.getURL()),
            n = (t && t[1]) || "";
          try {
            return e.raw ? n : decodeURIComponent(n);
          } catch (t) {
            return n;
          }
        }
        function v(t, n) {
          if (i !== t) {
            var r = i;
            (i = t), e.changed.dispatch(b(t), b(r));
          }
        }
        function m(t) {
          var n = (t = Array.prototype.slice.call(arguments)).join(e.separator);
          return (n = n ? e.prependHash + n.replace(c, "") + e.appendHash : n);
        }
        function g(t) {
          return (t = encodeURI(t));
        }
        return (
          ((e = {
            VERSION: "1.2.0",
            raw: !(l = function() {
              var t = p();
              t !== i && v(t);
            }),
            appendHash: "",
            prependHash: "/",
            separator: "/",
            changed: new n(),
            stopped: new n(),
            initialized: new n(),
            init: function() {
              var t, n, r;
              d ||
                ((i = p()),
                u
                  ? ((n = "hashchange"),
                    (r = l),
                    (t = a).addEventListener
                      ? t.addEventListener(n, r, !1)
                      : t.attachEvent && t.attachEvent("on" + n, r))
                  : (s = setInterval(l, 25)),
                (d = !0),
                e.initialized.dispatch(b(i)));
            },
            stop: function() {
              var t, n, r;
              d &&
                (u
                  ? ((n = "hashchange"),
                    (r = l),
                    (t = a).removeEventListener
                      ? t.removeEventListener(n, r, !1)
                      : t.detachEvent && t.detachEvent("on" + n, r))
                  : (clearInterval(s), (s = null)),
                (d = !1),
                e.stopped.dispatch(b(i)));
            },
            isActive: function() {
              return d;
            },
            getURL: function() {
              return a.location.href;
            },
            getBaseURL: function() {
              return e.getURL().replace(o, "");
            },
            setHash: function(t) {
              (t = m.apply(null, arguments)) !== i &&
                (v(t),
                t === i && (e.raw || (t = g(t)), (a.location.hash = "#" + t)));
            },
            replaceHash: function(t) {
              (t = m.apply(null, arguments)) !== i &&
                (v(t),
                t === i && (e.raw || (t = g(t)), a.location.replace("#" + t)));
            },
            getHash: function() {
              return b(i);
            },
            getHashAsArray: function() {
              return e.getHash().split(e.separator);
            },
            dispose: function() {
              e.stop(),
                e.initialized.dispose(),
                e.stopped.dispose(),
                e.changed.dispose(),
                (e = a.hasher = null);
            },
            toString: function() {
              return (
                '[hasher version="' +
                e.VERSION +
                '" hash="' +
                e.getHash() +
                '"]'
              );
            }
          }).initialized.memorize = !0),
          e
        );
      })(window);
    };
    "function" == typeof define && define.amd
      ? define(["signals"], t)
      : "object" == typeof exports
      ? (module.exports = t(require("signals")))
      : (window.hasher = t(window.signals));
  })(),
  (this.Template = this.Template || {}),
  (this.Template.templates = this.Template.templates || {}),
  (this.Template.templates.home = Handlebars.template({
    compiler: [7, ">= 4.0.0"],
    main: function(t, n, r, a, e) {
      var i,
        s = t.lambda;
      return (
        '<div class="block-header">\r\n  <div class="row">\r\n    <div class="col-lg-5 col-md-8 col-sm-12">\r\n      <h2>Dashboard</h2>\r\n    </div>\r\n    <div class="col-lg-7 col-md-4 col-sm-12 text-right">\r\n      <ul class="breadcrumb justify-content-end">\r\n        <li class="breadcrumb-item"><a href="index.html"><i class="icon-home"></i></a></li>\r\n        <li class="breadcrumb-item active">Dashboard</li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n\r\n<div class="row clearfix">\r\n  <div class="col-lg-4 col-md-6 col-sm-6">\r\n    <div class="card text-center">\r\n      <div class="header">\r\n        <h2>Pengguna</h2>\r\n      </div>\r\n      <div class="body pt-0">\r\n        <div class="row">\r\n          <div class="col-12 m-b-15">\r\n            <h1><i class="icon-user"></i></h1>\r\n          </div>\r\n          <div class="col-lg-6 col-md-6 col-sm-6">\r\n            <h4 class="font-22 text-col-green font-weight-bold">\r\n              <small class="font-12 text-col-dark d-block m-b-10">Supervisor</small>\r\n              ' +
        (null !=
        (i = s(
          null != (i = null != n ? n.totalProfiles : n) ? i.supervisor : i,
          n
        ))
          ? i
          : "") +
        '\r\n            </h4>\r\n          </div>\r\n          <div class="col-lg-6 col-md-6 col-sm-6">\r\n            <h4 class="font-22 text-col-blue font-weight-bold">\r\n              <small class="font-12 text-col-dark d-block m-b-10">Operator</small>\r\n              ' +
        (null !=
        (i = s(
          null != (i = null != n ? n.totalProfiles : n) ? i.operator : i,
          n
        ))
          ? i
          : "") +
        '\r\n            </h4>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class="col-lg-8 col-md-12 col-sm-12">\r\n    <div class="card overflowhidden">\r\n      <div class="header">\r\n        <h2>Analysis</h2>\r\n        <ul class="header-dropdown">\r\n          <li> <a href="javascript:void(0);" data-toggle="cardloading" data-loading-effect="pulse"><i\r\n                class="icon-refresh"></i></a></li>\r\n          <li><a href="javascript:void(0);" class="full-screen"><i class="icon-size-fullscreen"></i></a></li>\r\n          <li class="dropdown">\r\n            <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button"\r\n              aria-haspopup="true" aria-expanded="false"></a>\r\n            <ul class="dropdown-menu dropdown-menu-right animated bounceIn">\r\n              <li><a href="javascript:void(0);">Action</a></li>\r\n              <li><a href="javascript:void(0);">Another Action</a></li>\r\n              <li><a href="javascript:void(0);">Something else</a></li>\r\n            </ul>\r\n          </li>\r\n        </ul>\r\n      </div>\r\n      <div class="body">\r\n        <div class="row text-center">\r\n          <div class="col-4">\r\n            <h4>2598 <span class="font-13 d-block mt-2">Kuala Lumpur</span></h4>\r\n          </div>\r\n          <div class="col-4 border-left border-right">\r\n            <h4>8547 <span class="font-13 d-block mt-2">Sarawak</span></h4>\r\n          </div>\r\n          <div class="col-4">\r\n            <h4>2707 <span class="font-13 d-block mt-2">Sabah</span></h4>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class="sparkline" data-type="bar" data-offset="90" data-width="97%" data-height="50px" data-bar-Width="10"\r\n        data-bar-Spacing="10" data-bar-Color="#7cb5ec">\r\n        4,8,0,3,1,8,5,4,0,5,4,3,2,1,5,6,7,8,4,5,8,0,3</div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<div class="row clearfix">\r\n  <div class="col-lg-8 col-md-12">\r\n    <div class="card Sales_Overview">\r\n      <div class="header">\r\n        <h2>Kajiselidik keseluruhan</h2>\r\n        <ul class="header-dropdown">\r\n          <li> <a href="javascript:void(0);" data-toggle="cardloading" data-loading-effect="pulse"><i\r\n                class="icon-refresh"></i></a></li>\r\n          <li class="dropdown">\r\n            <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button"\r\n              aria-haspopup="true" aria-expanded="false"></a>\r\n            <ul class="dropdown-menu dropdown-menu-right animated bounceIn">\r\n              <li><a href="javascript:void(0);">Action</a></li>\r\n              <li><a href="javascript:void(0);">Another Action</a></li>\r\n              <li><a href="javascript:void(0);">Something else</a></li>\r\n            </ul>\r\n          </li>\r\n        </ul>\r\n      </div>\r\n      <div class="body">\r\n        <div id="Sales_Overview" class="ct-chart"></div>\r\n        <div class="body xl-slategray text-center">\r\n          <div class="row clearfix">\r\n            <div class="col-lg-4 col-md-4">\r\n              <h2 class="font700">150K</h2>\r\n              <small>17% <i class="fa fa-level-up text-success"></i>\r\n                Sasaran</small>\r\n            </div>\r\n            <div class="col-lg-4 col-md-4">\r\n              <h2 class="font700">80K</h2>\r\n              <small>18% <i class="fa fa-level-down text-danger"></i>\r\n                Survey Berjaya</small>\r\n            </div>\r\n            <div class="col-lg-4 col-md-4">\r\n              <h2 class="font700">9K</h2>\r\n              <small>18% <i class="fa fa-level-up text-success"></i>\r\n                Fixed Sample</small>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class="col-lg-4 col-md-12">\r\n    <div class="card">\r\n      <div class="header">\r\n        <h2 class="text-center">Info Sasaran</h2>\r\n      </div>\r\n      <div class="body">\r\n        <div class="row text-center">\r\n          <div class="col-6 border-right border-bottom pb-4 pt-4">\r\n            <div id="Traffic1" class="carousel vert slide" data-ride="carousel" data-interval="3000">\r\n              <div class="carousel-inner">\r\n                <div class="carousel-item active">\r\n                  <label class="mb-0">Jumlah Sasaran</label>\r\n                  <h4 class="font-30 font-weight-bold text-primary">150,545</h4>\r\n                </div>\r\n                <div class="carousel-item">\r\n                  <label class="mb-0">Sasaran Baru</label>\r\n                  <h4 class="font-30 font-weight-bold text-success">7,326</h4>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class="col-6 border-bottom pb-4 pt-4">\r\n            <div id="Traffic1" class="carousel vert slide" data-ride="carousel" data-interval="3000">\r\n              <div class="carousel-inner">\r\n                <div class="carousel-item active">\r\n                  <label class="mb-0">Tidak Wujud</label>\r\n                  <h4 class="font-30 font-weight-bold text-warning">5,042</h4>\r\n                </div>\r\n                <div class="carousel-item">\r\n                  <label class="mb-0">Tiada Nombor</label>\r\n                  <h4 class="font-30 font-weight-bold text-danger">73,148</h4>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class="header">\r\n        <h2 class="text-center">Completed</h2>\r\n      </div>\r\n      <div class="body">\r\n        <div class="form-group">\r\n          <label class="d-block">Positive Sentiment <span class="float-right">77%</span></label>\r\n          <div class="progress">\r\n            <div class="progress-bar progress-bar-success" role="progressbar" role="progressbar" aria-valuenow="77"\r\n              aria-valuemin="0" aria-valuemax="100" style="width: 77%;"></div>\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label class="d-block">Komen Infrastuctur <span class="float-right">50%</span></label>\r\n          <div class="progress">\r\n            <div class="progress-bar progress-bar-success" role="progressbar" role="progressbar" aria-valuenow="50"\r\n              aria-valuemin="0" aria-valuemax="100" style="width: 50%;"></div>\r\n          </div>\r\n        </div>\r\n        <div class="form-group">\r\n          <label class="d-block">Komen Umum <span class="float-right">23%</span></label>\r\n          <div class="progress">\r\n            <div class="progress-bar progress-bar-success" role="progressbar" role="progressbar" aria-valuenow="23"\r\n              aria-valuemin="0" aria-valuemax="100" style="width: 23%;"></div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n'
      );
    },
    useData: !0
  })),
  (this.Template.templates.homeOperator = Handlebars.template({
    compiler: [7, ">= 4.0.0"],
    main: function(t, n, r, a, e) {
      return '<div class="block-header">\r\n      <div class="row">\r\n          <div class="col-lg-5 col-md-8 col-sm-12">\r\n              <h2>Survey</h2>\r\n          </div>\r\n          <div class="col-lg-7 col-md-4 col-sm-12 text-right">\r\n              <ul class="breadcrumb justify-content-end">\r\n                  <li class="breadcrumb-item"><a href="index.html"><i class="icon-home"></i></a></li>\r\n                  <li class="breadcrumb-item">Operator</li>\r\n                  <li class="breadcrumb-item active">Survey</li>\r\n              </ul>\r\n          </div>\r\n      </div>\r\n  </div>\r\n\r\n  <div class="row clearfix">\r\n      <div class="col-lg-8 col-md-12">\r\n          <div class="card w_profile">\r\n              <div class="body" style="padding-top: 30px; padding-bottom: 30px">\r\n                  <div class="row">\r\n                      <div class="col-lg-4 col-md-4 col-12">\r\n                          <div class="profile-image float-md-right"> <img src="../assets/images/user.png" alt=""> </div>\r\n                      </div>\r\n                      <div class="col-lg-8 col-md-8 col-12">\r\n                          <h4 class="m-t-0 m-b-0"><strong>Nur Hafizah</strong> binti Ahmad Zabidi</h4>\r\n\r\n                          <p>No 65, Kampung Kuala Pari Hilir, Jalan Mohd Rashid, 31450 Ipoh, Perak</p>\r\n\r\n                          <div class="row">\r\n                              <div class="col-4">\r\n                                  <h5>Perempuan</h5>\r\n                                  <small>Jantina</small>\r\n                              </div>\r\n                              <div class="col-4">\r\n                                  <h5>Melayu</h5>\r\n                                  <small>Bangsa</small>\r\n                              </div>\r\n                              <div class="col-4">\r\n                                  <h5>IPOH</h5>\r\n                                  <small>Lokasi</small>\r\n                              </div>\r\n                          </div>\r\n                          <div class="m-t-15">\r\n                              <button class="btn btn-primary js-sweetalert" data-type="ajax-loader">Mula Survey</button>\r\n                              <button class="btn btn-success">Reset Caller</button>\r\n                          </div>\r\n                      </div>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n          <div class="card">\r\n              <h5 class="card-header">Pembuka Kata</h5>\r\n              <div class="card-body">\r\n                  <h5 class="card-title">Pastikan anda tidak tinggikan suara</h5>\r\n                  <p class="card-text">Selamat pagi/petang Nur Hafizah haraf maaf kerana menggangu. Saya (Nama Operator) ingin membuat.......</p>\r\n\r\n              </div>\r\n          </div>\r\n      </div>\r\n\r\n      <div class="col-lg-4 col-md-12">\r\n          <div class="card member-card">\r\n              <div class="header bg-info">\r\n                  <h4 class="m-t-5 text-light"><strong>Operator</strong></h4>\r\n              </div>\r\n              <div class="member-img">\r\n                  <a href="javascript:void(0);"><img src="../assets/images/lg/avatar2.jpg" class="rounded-circle" alt="profile-image"></a>\r\n              </div>\r\n              <div class="body">\r\n                  <div class="col-12">\r\n                      <h4 class="m-t-5"><strong>Abdullah Hassan</strong></h4>\r\n                      <p class="text-muted">13 / 03 / 2019 <br> Lokasi CCS</p>\r\n                  </div>\r\n                  <hr>\r\n                  <div class="row">\r\n                      <div class="col-4">\r\n                          <h5>40</h5>\r\n                          <small>Survey Berjaya</small>\r\n                      </div>\r\n                      <div class="col-4">\r\n                          <h5>NB205</h5>\r\n                          <small>Caller ID</small>\r\n                      </div>\r\n                      <div class="col-4">\r\n                          <h5>656</h5>\r\n                          <small>Jumlah Survey</small>\r\n                      </div>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n      </div>\r\n  </div>\r\n\r\n\r\n\r\n  <div class="row clearfix">\r\n      <div class="col-lg-8 col-md-12">\r\n\r\n          <div class="card">\r\n              <div class="header">\r\n                  <h2>Nombor Telefon</h2>\r\n              </div>\r\n              <div class="body">\r\n                  <div class="table-responsive">\r\n                      <table class="table table-hover m-b-0 c_list">\r\n                          <thead>\r\n                          <tr>\r\n                              <th>\r\n                                  <label class="fancy-checkbox">\r\n                                      <input class="select-all" type="checkbox" name="checkbox">\r\n                                      <span></span>\r\n                                  </label>\r\n                              </th>\r\n                              <th>Phone</th>\r\n                              <th>Tindakan</th>\r\n                              <th>Status</th>\r\n                          </tr>\r\n                          </thead>\r\n                          <tbody>\r\n                          <tr>\r\n                              <td style="width: 50px;">\r\n                                  <label class="fancy-checkbox">\r\n                                      <input class="checkbox-tick" type="checkbox" name="checkbox">\r\n                                      <span></span>\r\n                                  </label>\r\n                              </td>\r\n\r\n                              <td>\r\n                                  <span class="phone"><i class="fa fa-phone m-r-10"></i>0132542424</span>\r\n                              </td>\r\n                              <td>\r\n\r\n                                  <button type="button" class="btn btn-info" title="Edit"><i class="icon-call-out"></i></button>\r\n                                  <button type="button" data-type="confirm" class="btn btn-danger js-sweetalert" title="Delete"><i class="fa fa-refresh"></i></button>\r\n                              </td>\r\n                              <td>\r\n                                  <select class="custom-select" v-model="category" id="inputGroupSelectCategory" required>\r\n                                      <option selected value="" disabled>Pilih...</option>\r\n                                      <option value="salahno">Salah Nombor</option>\r\n                                      <option value="takwujud">Tidak Wujud</option>\r\n                                      <option value="hubungikemudian">Hubungi Kemudian</option>\r\n                                      <option value="takminat">Tidak Berminat</option>\r\n                                  </select>\r\n                              </td>\r\n                          </tr>\r\n                          <tr>\r\n                              <td style="width: 50px;">\r\n                                  <label class="fancy-checkbox">\r\n                                      <input class="checkbox-tick" type="checkbox" name="checkbox">\r\n                                      <span></span>\r\n                                  </label>\r\n                              </td>\r\n\r\n                              <td>\r\n                                  <span class="phone"><i class="fa fa-phone m-r-10"></i>0104853475</span>\r\n                              </td>\r\n                              <td>\r\n\r\n                                  <button type="button" class="btn btn-info" title="Edit"><i class="icon-call-out"></i></button>\r\n                                  <button type="button" data-type="confirm" class="btn btn-danger js-sweetalert" title="Delete"><i class="fa fa-refresh"></i></button>\r\n                              </td>\r\n                              <td>\r\n                                  <select class="custom-select" v-model="category" id="inputGroupSelectCategory" required>\r\n                                      <option selected value="" disabled>Pilih...</option>\r\n                                      <option value="salahno">Salah Nombor</option>\r\n                                      <option value="takwujud">Tidak Wujud</option>\r\n                                      <option value="hubungikemudian">Hubungi Kemudian</option>\r\n                                      <option value="takminat">Tidak Berminat</option>\r\n                                  </select>\r\n                              </td>\r\n                          </tr>\r\n                          <tr>\r\n                              <td style="width: 50px;">\r\n                                  <label class="fancy-checkbox">\r\n                                      <input class="checkbox-tick" type="checkbox" name="checkbox">\r\n                                      <span></span>\r\n                                  </label>\r\n                              </td>\r\n\r\n                              <td>\r\n                                  <span class="phone"><i class="fa fa-phone m-r-10"></i>0192587414</span>\r\n                              </td>\r\n                              <td>\r\n\r\n                                  <button type="button" class="btn btn-info" title="Edit"><i class="icon-call-out"></i></button>\r\n                                  <button type="button" data-type="confirm" class="btn btn-danger js-sweetalert" title="Delete"><i class="fa fa-refresh"></i></button>\r\n                              </td>\r\n                              <td>\r\n                                  <select class="custom-select" v-model="category" id="inputGroupSelectCategory" required>\r\n                                      <option selected value="" disabled>Pilih...</option>\r\n                                      <option value="salahno">Salah Nombor</option>\r\n                                      <option value="takwujud">Tidak Wujud</option>\r\n                                      <option value="hubungikemudian">Hubungi Kemudian</option>\r\n                                      <option value="takminat">Tidak Berminat</option>\r\n                                  </select>\r\n                              </td>\r\n                          </tr>\r\n\r\n                          </tbody>\r\n                      </table>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n\r\n\r\n\r\n\r\n          <div class="card">\r\n              <div class="header">\r\n                  <div class="input-group mb-3">\r\n                      <div class="input-group-prepend">\r\n                          <label class="input-group-text" for="inputGroupSelectCategory">Kategori Soalan</label>\r\n                      </div>\r\n                      <select class="custom-select" v-model="category" id="inputGroupSelectCategory" required>\r\n                          <option selected value="" disabled>Pilih...</option>\r\n                          <option value="umum">Umum</option>\r\n                          <option value="feedback">Feedback</option>\r\n                          <option value="keberkesanan">Keberkesanan</option>\r\n                      </select>\r\n                  </div>\r\n              </div>\r\n              <div class="body">\r\n                  <div class="table-responsive">\r\n                      <table class="table table-hover m-b-0 c_list">\r\n                          <thead>\r\n                          <tr>\r\n                              <th>Soalan</th>\r\n                              <th>Ya</th>\r\n                              <th>Tidak</th>\r\n                              <th>Tak Pasti</th>\r\n                          </tr>\r\n                          </thead>\r\n                          <tbody>\r\n                          <tr>\r\n                              <td>\r\n                                  <p class="c_name">Soalan 1 </p>\r\n                              </td>\r\n                              <td>\r\n                                  <div class="fancy-radio">\r\n                                      <label><input name="pilih" value="ya" type="radio" ><span><i></i>Ya</span></label>\r\n\r\n                                  </div>\r\n                              </td>\r\n                              <td>\r\n                                  <div class="fancy-radio">\r\n                                      <label><input name="pilih" value="tidak" type="radio" ><span><i></i>Tidak</span></label>\r\n\r\n                                  </div>\r\n                              </td>\r\n                              <td>\r\n                                  <div class="fancy-radio">\r\n                                      <label><input name="pilih" value="takpasti" type="radio" checked><span><i></i>Tak Pasti</span></label>\r\n\r\n                                  </div>\r\n                              </td>\r\n                          </tr>\r\n                          <tr>\r\n                              <td>\r\n                                  <p class="c_name">Soalan 2 </p>\r\n                              </td>\r\n                              <td>\r\n                                  <div class="fancy-radio">\r\n                                      <label><input name="pilih2" value="ya" type="radio" ><span><i></i>Ya</span></label>\r\n\r\n                                  </div>\r\n                              </td>\r\n                              <td>\r\n                                  <div class="fancy-radio">\r\n                                      <label><input name="pilih2" value="tidak" type="radio" ><span><i></i>Tidak</span></label>\r\n\r\n                                  </div>\r\n                              </td>\r\n                              <td>\r\n                                  <div class="fancy-radio">\r\n                                      <label><input name="pilih2" value="takpasti" type="radio" checked><span><i></i>Tak Pasti</span></label>\r\n\r\n                                  </div>\r\n                              </td>\r\n                          </tr>\r\n                          <tr>\r\n                              <td>\r\n                                  <p class="c_name">Soalan 3 </p>\r\n                              </td>\r\n                              <td>\r\n                                  <div class="fancy-radio">\r\n                                      <label><input name="pilih3" value="ya" type="radio"><span><i></i>Ya</span></label>\r\n\r\n                                  </div>\r\n                              </td>\r\n                              <td>\r\n                                  <div class="fancy-radio">\r\n                                      <label><input name="pilih3" value="tidak" type="radio"><span><i></i>Tidak</span></label>\r\n\r\n                                  </div>\r\n                              </td>\r\n                              <td>\r\n                                  <div class="fancy-radio">\r\n                                      <label><input name="pilih3" value="takpasti" type="radio" checked><span><i></i>Tak Pasti</span></label>\r\n\r\n                                  </div>\r\n                              </td>\r\n                          </tr>\r\n                          <tr>\r\n                          </tbody>\r\n                      </table>\r\n                  </div>\r\n\r\n              </div>\r\n          </div>\r\n      </div>\r\n      <div class="col-lg-4 col-md-12">\r\n          <div class="card">\r\n              <div class="header">\r\n                  <h2>Comments <small>Komen yang diterima daripada pemanggil.</small></h2>\r\n              </div>\r\n              <div class="body">\r\n                  <h6>Jenis Komen</h6>\r\n                  <div class="input-group mb-3">\r\n                      <div class="input-group-prepend">\r\n                          <label class="input-group-text" for="inputGroupSelect01">Options</label>\r\n                      </div>\r\n                      <select class="custom-select" id="inputGroupSelect01">\r\n                          <option selected>Pilihan...</option>\r\n                          <option value="1">Info</option>\r\n                          <option value="2">Wakil Rakyat</option>\r\n                          <option value="3">Lain-Lain</option>\r\n                      </select>\r\n                  </div>\r\n                  <div class="input-group">\r\n                      <div class="input-group-prepend">\r\n                          <span class="input-group-text">Komen</span>\r\n                      </div>\r\n                      <textarea class="form-control" aria-label="Komen"></textarea>\r\n                  </div>\r\n\r\n              </div>\r\n          </div>\r\n          <div class="card">\r\n              <div class="header">\r\n                  <h2>Terima kasih kerana membantu kajiselidik ini. Adakah tuan/puan berminat untuk menyumbang kepada pembangunan negeri?</h2>\r\n              </div>\r\n              <div class="body">\r\n                  <div class="fancy-radio">\r\n                      <label><input name="kawalan" value="ya" type="radio" ><span><i></i>Ya</span></label>\r\n                      <label><input name="kawalan" value="ya" type="radio" ><span><i></i>Tidak</span></label>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n          <div class="card">\r\n              <div class="body">\r\n              <h6>Pastikan semua info di atas ada tepat</h6>\r\n                  <button type="button" class="btn btn-success">Submit</button>\r\n                  <button type="button" data-type="confirm" class="btn btn-danger js-sweetalert" title="Delete">Reset</button>\r\n              </div>\r\n          </div>\r\n      </div>\r\n  </div>';
    },
    useData: !0
  })),
  (this.Template.templates.recordRegion = Handlebars.template({
    compiler: [7, ">= 4.0.0"],
    main: function(t, n, r, a, e) {
      return '<div class="block-header">\r\n  <div class="row">\r\n    <div class="col-lg-5 col-md-8 col-sm-12">\r\n      <h2>Tetapan Kawasan</h2>\r\n    </div>\r\n    <div class="col-lg-7 col-md-4 col-sm-12 text-right">\r\n      <ul class="breadcrumb justify-content-end">\r\n        <li class="breadcrumb-item"><a href="index.html"><i class="icon-home"></i></a></li>\r\n        <li class="breadcrumb-item">Record Operator</li>\r\n        <li class="breadcrumb-item active">Tetapan Kawasan</li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<div class="col-md-12">\r\n  <div class="card">\r\n    <div class="header">\r\n      <h2>Senarai Kawasan untuk Operator</h2>\r\n    </div>\r\n\r\n    <div class="btn-group" role="group">\r\n      <button id="btnGroupDrop1" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"\r\n        aria-haspopup="true" aria-expanded="false">\r\n        Pilih Kawasan\r\n      </button>\r\n      <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">\r\n        <a class="dropdown-item" href="javascript:void(0);">Selayang</a>\r\n        <a class="dropdown-item" href="javascript:void(0);">Sibu</a>\r\n        <a class="dropdown-item" href="javascript:void(0);">Batu Muda</a>\r\n        <a class="dropdown-item" href="javascript:void(0);">Kota Damansara</a>\r\n        <a class="dropdown-item" href="javascript:void(0);">Sri Gombak</a>\r\n      </div>\r\n    </div>\r\n\r\n\r\n\r\n    <div class="body">\r\n      <div class="table-responsive">\r\n        <table class="table table-hover m-b-0 c_list">\r\n          <thead>\r\n            <tr>\r\n              <th>\r\n                <label class="fancy-checkbox">\r\n                  <input class="select-all" type="checkbox" name="checkbox">\r\n                  <span></span>\r\n                </label>\r\n              </th>\r\n              <th>Name</th>\r\n              <th>Call Centre</th>\r\n              <th>Kawasan Sasaran</th>\r\n              <th>Action</th>\r\n            </tr>\r\n          </thead>\r\n          <tbody>\r\n            <tr>\r\n              <td style="width: 50px;">\r\n                <label class="fancy-checkbox">\r\n                  <input class="checkbox-tick" type="checkbox" name="checkbox">\r\n                  <span></span>\r\n                </label>\r\n              </td>\r\n              <td>\r\n                <p class="c_name">Nama Operator <span class="badge badge-default m-l-10 hidden-sm-down">username</span>\r\n                </p>\r\n              </td>\r\n              <td>\r\n                <span class="phone"><i class="fa fa-phone m-r-10"></i>CCS One</span>\r\n              </td>\r\n              <td>\r\n                <address><i class="fa fa-map-marker"></i>Selayang</address>\r\n              </td>\r\n              <td>\r\n                <button type="button" class="btn btn-info" title="Edit"><i class="fa fa-edit"></i></button>\r\n                <button type="button" data-type="confirm" class="btn btn-danger js-sweetalert" title="Delete"><i\r\n                    class="fa fa-trash-o"></i></button>\r\n              </td>\r\n            </tr>\r\n            <tr>\r\n              <td>\r\n                <label class="fancy-checkbox">\r\n                  <input class="checkbox-tick" type="checkbox" name="checkbox">\r\n                  <span></span>\r\n                </label>\r\n              </td>\r\n              <td>\r\n                <p class="c_name">Nuraidah Husin <span class="badge badge-info m-l-10 hidden-sm-down">nana19</span></p>\r\n              </td>\r\n              <td>\r\n                <span class="phone"><i class="fa fa-phone m-r-10"></i>CCS Two</span>\r\n              </td>\r\n              <td>\r\n                <address><i class="fa fa-map-marker"></i>Kota Damansara</address>\r\n              </td>\r\n              <td>\r\n                <button type="button" class="btn btn-info" title="Edit"><i class="fa fa-edit"></i></button>\r\n                <button type="button" data-type="confirm" class="btn btn-danger js-sweetalert" title="Delete"><i\r\n                    class="fa fa-trash-o"></i></button>\r\n              </td>\r\n            </tr>\r\n            <tr>\r\n              <td>\r\n                <label class="fancy-checkbox">\r\n                  <input class="checkbox-tick" type="checkbox" name="checkbox">\r\n                  <span></span>\r\n                </label>\r\n              </td>\r\n              <td>\r\n                <p class="c_name">Farid Hamid <span class="badge badge-info m-l-10 hidden-sm-down">farid</span></p>\r\n              </td>\r\n              <td>\r\n                <span class="phone"><i class="fa fa-phone m-r-10"></i>CCS One</span>\r\n              </td>\r\n              <td>\r\n                <address><i class="fa fa-map-marker"></i>Selayang</address>\r\n              </td>\r\n              <td>\r\n                <button type="button" class="btn btn-info" title="Edit"><i class="fa fa-edit"></i></button>\r\n                <button type="button" data-type="confirm" class="btn btn-danger js-sweetalert" title="Delete"><i\r\n                    class="fa fa-trash-o"></i></button>\r\n              </td>\r\n            </tr>\r\n            <tr>\r\n              <td>\r\n                <label class="fancy-checkbox">\r\n                  <input class="checkbox-tick" type="checkbox" name="checkbox">\r\n                  <span></span>\r\n                </label>\r\n              </td>\r\n              <td>\r\n                <p class="c_name">Fatimah Ahmad<span class="badge badge-default m-l-10 hidden-sm-down">tinaisme</span>\r\n                </p>\r\n              </td>\r\n              <td>\r\n                <span class="phone"><i class="fa fa-phone m-r-10"></i>CCS Two</span>\r\n              </td>\r\n              <td>\r\n                <address><i class="fa fa-map-marker"></i>Kota Damansara</address>\r\n              </td>\r\n              <td>\r\n                <button type="button" class="btn btn-info" title="Edit"><i class="fa fa-edit"></i></button>\r\n                <button type="button" data-type="confirm" class="btn btn-danger js-sweetalert" title="Delete"><i\r\n                    class="fa fa-trash-o"></i></button>\r\n              </td>\r\n            </tr>\r\n          </tbody>\r\n        </table>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n';
    },
    useData: !0
  })),
  (this.Template.templates.recordStatistics = Handlebars.template({
    compiler: [7, ">= 4.0.0"],
    main: function(t, n, r, a, e) {
      return '            <div class="block-header">\r\n                <div class="row">\r\n                    <div class="col-lg-5 col-md-8 col-sm-12">\r\n                        <h2>Statistik Operator</h2>\r\n                    </div>\r\n                    <div class="col-lg-7 col-md-4 col-sm-12 text-right">\r\n                        <ul class="breadcrumb justify-content-end">\r\n                            <li class="breadcrumb-item"><a href="index.html"><i class="icon-home"></i></a></li>\r\n                            <li class="breadcrumb-item">Record Operator</li>\r\n                            <li class="breadcrumb-item active">Statistik</li>\r\n                        </ul>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class="clearfix">\r\n                <div class="col-md-12">\r\n                    <div class="card">\r\n                        <div class="header">\r\n                        <h2>Performance Operator<small>Note for admin here</small> </h2>\r\n                        </div>\r\n                        <div class="body">\r\n                            <div class="row clearfix">\r\n                                <div class="col-lg-3 col-md-12">\r\n                                    <label>Pilihan Kawasan</label>\r\n                                    <div>\r\n                                    <div class="btn-group">\r\n                                        <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\r\n                                            Semua Kawasan\r\n                                        </button>\r\n                                        <div class="dropdown-menu">\r\n                                            <a class="dropdown-item" href="#">Selayang</a>\r\n                                            <a class="dropdown-item" href="#">Sri Gombak</a>\r\n                                            <a class="dropdown-item" href="#">Sibu</a>\r\n                                            <div class="dropdown-divider"></div>\r\n                                            <a class="dropdown-item" href="#">Semua kawasan</a>\r\n                                        </div>\r\n                                    </div>\r\n                                    </div>\r\n                                </div>\r\n                                <div class="col-lg-3 col-md-12">\r\n                                    <label>Range</label>\r\n                                    <div class="input-daterange input-group" data-provide="datepicker">\r\n                                        <input type="text" class="input-sm form-control" name="start">\r\n                                        <span class="input-group-addon range-to">to</span>\r\n                                        <input type="text" class="input-sm form-control" name="end">\r\n                                    </div>\r\n                                </div>\r\n                                <div class="col-lg-3 col-md-12">\r\n                                    <div class="body">\r\n                                        <div>\r\n\r\n                                        <button type="button" class="btn btn-primary">Reset</button>\r\n                                        <button type="button" class="btn btn-success">Carian</button>\r\n\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n\r\n                            </div>\r\n                        </div>\r\n\r\n                    </div>\r\n\r\n                </div>\r\n            </div>\r\n            <div class="col-lg-12">\r\n                <div class="card">\r\n\r\n\r\n                    <div class="body">\r\n                        <div class="table-responsive">\r\n                            <table class="table table-bordered table-striped table-hover dataTable js-exportable">\r\n                                <thead>\r\n                                <tr>\r\n                                    <th>Nama Pengguna</th>\r\n                                    <th>Jumlah Kajian Berjaya</th>\r\n                                    <th>Jumlah Panggilan</th>\r\n                                    <th>Jumlah Sesi</th>\r\n                                    <th>Purata Sesi</th>\r\n                                    <th>Sessi Terlama</th>\r\n                                </tr>\r\n                                </thead>\r\n                                <tbody>\r\n                                <tr>\r\n                                    <td>Tiger Nixon</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Tiger Nixon</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Tiger Nixon</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <<td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                <tr>\r\n                                    <td>Ramlah Husin</td>\r\n                                    <td>39</td>\r\n                                    <td>150</td>\r\n                                    <td>18:41:19</td>\r\n                                    <td>00:07:28</td>\r\n                                    <td>01:22:58</td>\r\n                                </tr>\r\n                                </tbody>\r\n                                <tfoot>\r\n                                <tr>\r\n                                    <th>Nama Pengguna</th>\r\n                                    <th>Jumlah Kajian Berjaya</th>\r\n                                    <th>Jumlah Panggilan</th>\r\n                                    <th>Jumlah Sesi</th>\r\n                                    <th>Purata Sesi</th>\r\n                                    <th>Sessi Terlama</th>\r\n                                </tr>\r\n                                </tfoot>\r\n                            </table>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>';
    },
    useData: !0
  })),
  (this.Template.templates.result = Handlebars.template({
    compiler: [7, ">= 4.0.0"],
    main: function(t, n, r, a, e) {
      return '<div class="block-header">\r\n  <div class="row">\r\n    <div class="col-lg-5 col-md-8 col-sm-12">\r\n      <h2>Carta</h2>\r\n    </div>\r\n    <div class="col-lg-7 col-md-4 col-sm-12 text-right">\r\n      <ul class="breadcrumb justify-content-end">\r\n        <li class="breadcrumb-item"><a href="index.html"><i class="icon-home"></i></a></li>\r\n        <li class="breadcrumb-item">Result</li>\r\n        <li class="breadcrumb-item active">Chart</li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</div>\r\n<div class="row clearfix">\r\n  <div class="col-lg-6 col-md-12">\r\n    <div class="card">\r\n      <div class="header">\r\n        <h2>Simple Pie Chart</h2>\r\n      </div>\r\n      <div class="body">\r\n        <div id="pie-chart" class="ct-chart"></div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n';
    },
    useData: !0
  })),
  (this.Template.templates.soalanSet = Handlebars.template({
    1: function(t, n, r, a, e) {
      var i,
        s,
        d = null != n ? n : t.nullContext || {},
        l = r.helperMissing,
        o = "function",
        c = t.escapeExpression;
      return (
        '              <tr style="text-align: center">\r\n                <td>' +
        c(
          typeof (s = null != (s = r.id || (null != n ? n.id : n)) ? s : l) ===
            o
            ? s.call(d, { name: "id", hash: {}, data: e })
            : s
        ) +
        "</td>\r\n                <td>" +
        c(
          typeof (s =
            null != (s = r.name || (null != n ? n.name : n)) ? s : l) === o
            ? s.call(d, { name: "name", hash: {}, data: e })
            : s
        ) +
        "</td>\r\n                <td>" +
        c(
          typeof (s =
            null != (s = r.date || (null != n ? n.date : n)) ? s : l) === o
            ? s.call(d, { name: "date", hash: {}, data: e })
            : s
        ) +
        "</td>\r\n                <td>" +
        c(
          t.lambda(null != (i = null != n ? n.questions : n) ? i.length : i, n)
        ) +
        "</td>\r\n                <td>" +
        c(
          typeof (s =
            null != (s = r.category || (null != n ? n.category : n))
              ? s
              : l) === o
            ? s.call(d, { name: "category", hash: {}, data: e })
            : s
        ) +
        '</td>\r\n                <td><label class="badge">Active</label></td>\r\n                <td>\r\n                  <button @click="viewQuestionsModal(i)" class="btn btn-success btn-sm">View Set\r\n                  </button>\r\n                </td>\r\n                <td>\r\n                  <button @click="editSetModal(i)" class="btn btn-info btn-sm"><i class="icon-pencil"></i></button>\r\n                </td>\r\n                <td>\r\n                  <button @click="deleteSet(i)" class="btn btn-danger btn-sm"><i class="icon-trash"></i></button>\r\n                </td>\r\n              </tr>\r\n'
      );
    },
    compiler: [7, ">= 4.0.0"],
    main: function(t, n, r, a, e) {
      var i;
      return (
        '<div class="block-header">\r\n  <div class="row">\r\n    <div class="col-lg-5 col-md-8 col-sm-12">\r\n      <h2>List of Questions</h2>\r\n    </div>\r\n    <div class="col-lg-7 col-md-4 col-sm-12 text-right">\r\n      <ul class="breadcrumb justify-content-end">\r\n        <li class="breadcrumb-item"><a href="index.html"><i class="icon-home"></i></a></li>\r\n        <li class="breadcrumb-item">Questions</li>\r\n        <li class="breadcrumb-item active">List of Questions</li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<div class="col-md-12">\r\n  <div class="card">\r\n    <div class="header">\r\n      <h2>List of Questions</h2>\r\n    </div>\r\n    <div class="body">\r\n      <div>\r\n        <button class="btn btn-primary">Add New Question</button>\r\n      </div>\r\n      <div class="table-responsive">\r\n        <table class="table center-aligned-table">\r\n          <thead>\r\n            <tr style="text-align: center">\r\n              <th>Set #</th>\r\n              <th>Set Name</th>\r\n              <th>Date created</th>\r\n              <th>No. of Questions</th>\r\n              <th>Category</th>\r\n              <th>Status</th>\r\n              <th></th>\r\n              <th></th>\r\n              <th></th>\r\n            </tr>\r\n          </thead>\r\n          <tbody>\r\n' +
        (null !=
        (i = r.each.call(
          null != n ? n : t.nullContext || {},
          null != n ? n.data : n,
          {
            name: "each",
            hash: {},
            fn: t.program(1, e, 0),
            inverse: t.noop,
            data: e
          }
        ))
          ? i
          : "") +
        "          </tbody>\r\n        </table>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"
      );
    },
    useData: !0
  })),
  (this.Template.templates.userAdmin = Handlebars.template({
    compiler: [7, ">= 4.0.0"],
    main: function(t, n, r, a, e) {
      return '<div class="block-header">\r\n  <div class="row">\r\n    <div class="col-lg-5 col-md-8 col-sm-12">\r\n      <h2>Admin</h2>\r\n    </div>\r\n    <div class="col-lg-7 col-md-4 col-sm-12 text-right">\r\n      <ul class="breadcrumb justify-content-end">\r\n        <li class="breadcrumb-item"><a href="index.html"><i class="icon-home"></i></a></li>\r\n        <li class="breadcrumb-item">Tetapan</li>\r\n        <li class="breadcrumb-item active">Admin</li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<div class="row clearfix">\r\n  <div class="col-lg-12">\r\n    <div class="card">\r\n      <div class="header">\r\n        <h2>Senarai Admin</h2>\r\n      </div>\r\n      <div class="body">\r\n        <button id="addToTable" class="btn btn-primary m-b-15" type="button">\r\n          <i class="icon wb-plus" aria-hidden="true"></i> Tambah Admin\r\n        </button>\r\n        <div class="table-responsive">\r\n          <table class="table table-bordered table-hover table-striped" id="addrowExample">\r\n            <thead>\r\n              <tr>\r\n                <th>Nama</th>\r\n                <th>Username</th>\r\n                <th>Password</th>\r\n                <th>Actions</th>\r\n              </tr>\r\n            </thead>\r\n            <tbody>\r\n\r\n              <tr class="gradeA">\r\n                <td>Mohd Matril</td>\r\n                <td>mmatril</td>\r\n                <td>Sid321ney</td>\r\n                <td class="actions">\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing m-r-5 button-save"\r\n                    data-toggle="tooltip" data-original-title="Save" hidden><i class="icon-drawer"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing button-discard"\r\n                    data-toggle="tooltip" data-original-title="Discard" hidden><i class="icon-close"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default m-r-5 button-edit"\r\n                    data-toggle="tooltip" data-original-title="Edit"><i class="icon-pencil"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default button-remove"\r\n                    data-toggle="tooltip" data-original-title="Remove"><i class="icon-trash"\r\n                      aria-hidden="true"></i></button>\r\n                </td>\r\n              </tr>\r\n              <tr class="gradeA">\r\n                <td>Sukinah Mansore</td>\r\n                <td>eppyjomblo</td>\r\n                <td>pergi342</td>\r\n                <td class="actions">\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing m-r-5 button-save"\r\n                    data-toggle="tooltip" data-original-title="Save" hidden><i class="icon-drawer"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing button-discard"\r\n                    data-toggle="tooltip" data-original-title="Discard" hidden><i class="icon-close"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default m-r-5 button-edit"\r\n                    data-toggle="tooltip" data-original-title="Edit"><i class="icon-pencil"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default button-remove"\r\n                    data-toggle="tooltip" data-original-title="Remove"><i class="icon-trash"\r\n                      aria-hidden="true"></i></button>\r\n                </td>\r\n              </tr>\r\n              <tr class="gradeA">\r\n                <td>Prescott Junior</td>\r\n                <td>precicily</td>\r\n                <td>kolkol98765</td>\r\n                <td class="actions">\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing m-r-5 button-save"\r\n                    data-toggle="tooltip" data-original-title="Save" hidden><i class="icon-drawer"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing button-discard"\r\n                    data-toggle="tooltip" data-original-title="Discard" hidden><i class="icon-close"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default m-r-5 button-edit"\r\n                    data-toggle="tooltip" data-original-title="Edit"><i class="icon-pencil"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default button-remove"\r\n                    data-toggle="tooltip" data-original-title="Remove"><i class="icon-trash"\r\n                      aria-hidden="true"></i></button>\r\n                </td>\r\n              </tr>\r\n              <tr class="gradeA">\r\n                <td>Garvin Bala</td>\r\n                <td>garvin</td>\r\n                <td>sanpolo45678</td>\r\n                <td class="actions">\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing m-r-5 button-save"\r\n                    data-toggle="tooltip" data-original-title="Save" hidden><i class="icon-drawer"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing button-discard"\r\n                    data-toggle="tooltip" data-original-title="Discard" hidden><i class="icon-close"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default m-r-5 button-edit"\r\n                    data-toggle="tooltip" data-original-title="Edit"><i class="icon-pencil"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default button-remove"\r\n                    data-toggle="tooltip" data-original-title="Remove"><i class="icon-trash"\r\n                      aria-hidden="true"></i></button>\r\n                </td>\r\n              </tr>\r\n              <tr class="gradeA">\r\n                <td>Mariah Sudin</td>\r\n                <td>jelly1982</td>\r\n                <td>d0987654321</td>\r\n                <td class="actions">\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing m-r-5 button-save"\r\n                    data-toggle="tooltip" data-original-title="Save" hidden><i class="icon-drawer"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing button-discard"\r\n                    data-toggle="tooltip" data-original-title="Discard" hidden><i class="icon-close"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default m-r-5 button-edit"\r\n                    data-toggle="tooltip" data-original-title="Edit"><i class="icon-pencil"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default button-remove"\r\n                    data-toggle="tooltip" data-original-title="Remove"><i class="icon-trash"\r\n                      aria-hidden="true"></i></button>\r\n                </td>\r\n              </tr>\r\n            </tbody>\r\n            <tfoot>\r\n              <tr>\r\n                <th>Nama</th>\r\n                <th>Username</th>\r\n                <th>Password</th>\r\n                <th>Actions</th>\r\n              </tr>\r\n            </tfoot>\r\n          </table>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n';
    },
    useData: !0
  })),
  (this.Template.templates.userOperator = Handlebars.template({
    1: function(t, n, r, a, e) {
      var i,
        s = null != n ? n : t.nullContext || {},
        d = r.helperMissing,
        l = "function",
        o = t.escapeExpression;
      return (
        '                                                                <tr class="gradeA">\r\n                                                                        <td>' +
        o(
          typeof (i =
            null != (i = r.fullname || (null != n ? n.fullname : n))
              ? i
              : d) === l
            ? i.call(s, { name: "fullname", hash: {}, data: e })
            : i
        ) +
        "</td>\r\n                                                                        <td>" +
        o(
          typeof (i =
            null != (i = r.username || (null != n ? n.username : n))
              ? i
              : d) === l
            ? i.call(s, { name: "username", hash: {}, data: e })
            : i
        ) +
        "</td>\r\n                                                                        <td>" +
        o(
          typeof (i =
            null != (i = r.age || (null != n ? n.age : n)) ? i : d) === l
            ? i.call(s, { name: "age", hash: {}, data: e })
            : i
        ) +
        "</td>\r\n                                                                        <td>" +
        o(
          typeof (i =
            null != (i = r.gender || (null != n ? n.gender : n)) ? i : d) === l
            ? i.call(s, { name: "gender", hash: {}, data: e })
            : i
        ) +
        "</td>\r\n                                                                        <td>" +
        o(
          typeof (i =
            null != (i = r.race || (null != n ? n.race : n)) ? i : d) === l
            ? i.call(s, { name: "race", hash: {}, data: e })
            : i
        ) +
        "</td>\r\n                                                                        <td>" +
        o(
          typeof (i =
            null != (i = r.laptop_id || (null != n ? n.laptop_id : n))
              ? i
              : d) === l
            ? i.call(s, { name: "laptop_id", hash: {}, data: e })
            : i
        ) +
        "</td>\r\n                                                                        <td>" +
        o(
          typeof (i =
            null != (i = r.region || (null != n ? n.region : n)) ? i : d) === l
            ? i.call(s, { name: "region", hash: {}, data: e })
            : i
        ) +
        '</td>\r\n                                                                        <td class="actions">\r\n                                                                                <button class="btn btn-sm btn-icon btn-pure btn-default on-editing m-r-5 button-save"\r\n                                                                                        data-toggle="tooltip"\r\n                                                                                        data-original-title="Save"\r\n                                                                                        hidden><i class="icon-drawer"\r\n                                                                                                aria-hidden="true"></i></button>\r\n                                                                                <button class="btn btn-sm btn-icon btn-pure btn-default on-editing button-discard"\r\n                                                                                        data-toggle="tooltip"\r\n                                                                                        data-original-title="Discard"\r\n                                                                                        hidden><i class="icon-close"\r\n                                                                                                aria-hidden="true"></i></button>\r\n                                                                                <button class="btn btn-sm btn-icon btn-pure btn-default on-default m-r-5 button-edit"\r\n                                                                                        data-toggle="tooltip"\r\n                                                                                        data-original-title="Edit"><i\r\n                                                                                                class="icon-pencil"\r\n                                                                                                aria-hidden="true"></i></button>\r\n                                                                                <button class="btn btn-sm btn-icon btn-pure btn-default on-default button-remove"\r\n                                                                                        data-toggle="tooltip"\r\n                                                                                        data-original-title="Remove"><i\r\n                                                                                                class="icon-trash"\r\n                                                                                                aria-hidden="true"></i></button>\r\n                                                                        </td>\r\n                                                                </tr>\r\n'
      );
    },
    compiler: [7, ">= 4.0.0"],
    main: function(t, n, r, a, e) {
      var i;
      return (
        '<div class="block-header">\r\n        <div class="row">\r\n                <div class="col-lg-5 col-md-8 col-sm-12">\r\n                        <h2>Operator</h2>\r\n                </div>\r\n                <div class="col-lg-7 col-md-4 col-sm-12 text-right">\r\n                        <ul class="breadcrumb justify-content-end">\r\n                                <li class="breadcrumb-item"><a href="index.html"><i class="icon-home"></i></a></li>\r\n                                <li class="breadcrumb-item">Tetapan</li>\r\n                                <li class="breadcrumb-item active">Operator</li>\r\n                        </ul>\r\n                </div>\r\n        </div>\r\n</div>\r\n\r\n<div class="row clearfix">\r\n        <div class="col-lg-12">\r\n                <div class="card">\r\n                        <div class="header">\r\n                                <h2>Senarai Operator</h2>\r\n                        </div>\r\n                        <div class="body">\r\n                                <button id="addToTable" class="btn btn-primary m-b-15" type="button">\r\n                                        <i class="icon wb-plus" aria-hidden="true"></i> Tambah Operator\r\n                                </button>\r\n                                <div class="table-responsive">\r\n                                        <table class="table table-bordered table-hover table-striped"\r\n                                                id="addrowExample">\r\n                                                <thead>\r\n                                                        <tr>\r\n                                                                <th>Full Name</th>\r\n                                                                <th>Username</th>\r\n                                                                <th>Age</th>\r\n                                                                <th>Gender</th>\r\n                                                                <th>Race</th>\r\n                                                                <th>Laptop ID</th>\r\n                                                                <th>Region</th>\r\n                                                                <th>Actions</th>\r\n                                                        </tr>\r\n                                                </thead>\r\n                                                <tbody>\r\n' +
        (null !=
        (i = r.each.call(
          null != n ? n : t.nullContext || {},
          null != n ? n.res : n,
          {
            name: "each",
            hash: {},
            fn: t.program(1, e, 0),
            inverse: t.noop,
            data: e
          }
        ))
          ? i
          : "") +
        "                                                </tbody>\r\n                                                <tfoot>\r\n                                                        <tr>\r\n                                                                <th>Full Name</th>\r\n                                                                <th>Username</th>\r\n                                                                <th>Age</th>\r\n                                                                <th>Gender</th>\r\n                                                                <th>Race</th>\r\n                                                                <th>Laptop ID</th>\r\n                                                                <th>Region</th>\r\n                                                                <th>Actions</th>\r\n                                                        </tr>\r\n                                                </tfoot>\r\n                                        </table>\r\n                                </div>\r\n                        </div>\r\n                </div>\r\n        </div>\r\n</div>\r\n"
      );
    },
    useData: !0
  })),
  (this.Template.templates.userSupervisor = Handlebars.template({
    compiler: [7, ">= 4.0.0"],
    main: function(t, n, r, a, e) {
      return '<div class="block-header">\r\n  <div class="row">\r\n    <div class="col-lg-5 col-md-8 col-sm-12">\r\n      <h2>Supervisor</h2>\r\n    </div>\r\n    <div class="col-lg-7 col-md-4 col-sm-12 text-right">\r\n      <ul class="breadcrumb justify-content-end">\r\n        <li class="breadcrumb-item"><a href="index.html"><i class="icon-home"></i></a></li>\r\n        <li class="breadcrumb-item">Tetapan</li>\r\n        <li class="breadcrumb-item active">Supervisor</li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<div class="row clearfix">\r\n  <div class="col-lg-12">\r\n    <div class="card">\r\n      <div class="header">\r\n        <h2>Senarai Supervisor</h2>\r\n      </div>\r\n      <div class="body">\r\n        <button id="addToTable" class="btn btn-primary m-b-15" type="button">\r\n          <i class="icon wb-plus" aria-hidden="true"></i> Tambah Supervisor\r\n        </button>\r\n        <div class="table-responsive">\r\n          <table class="table table-bordered table-hover table-striped" id="addrowExample">\r\n            <thead>\r\n              <tr>\r\n                <th>Nama</th>\r\n                <th>Username</th>\r\n                <th>Password</th>\r\n                <th>Actions</th>\r\n              </tr>\r\n            </thead>\r\n            <tbody>\r\n\r\n              <tr class="gradeA">\r\n                <td>Mohd Matril</td>\r\n                <td>mmatril</td>\r\n                <td>Sid321ney</td>\r\n                <td class="actions">\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing m-r-5 button-save"\r\n                    data-toggle="tooltip" data-original-title="Save" hidden><i class="icon-drawer"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing button-discard"\r\n                    data-toggle="tooltip" data-original-title="Discard" hidden><i class="icon-close"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default m-r-5 button-edit"\r\n                    data-toggle="tooltip" data-original-title="Edit"><i class="icon-pencil"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default button-remove"\r\n                    data-toggle="tooltip" data-original-title="Remove"><i class="icon-trash"\r\n                      aria-hidden="true"></i></button>\r\n                </td>\r\n              </tr>\r\n              <tr class="gradeA">\r\n                <td>Sukinah Mansore</td>\r\n                <td>eppyjomblo</td>\r\n                <td>pergi342</td>\r\n                <td class="actions">\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing m-r-5 button-save"\r\n                    data-toggle="tooltip" data-original-title="Save" hidden><i class="icon-drawer"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing button-discard"\r\n                    data-toggle="tooltip" data-original-title="Discard" hidden><i class="icon-close"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default m-r-5 button-edit"\r\n                    data-toggle="tooltip" data-original-title="Edit"><i class="icon-pencil"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default button-remove"\r\n                    data-toggle="tooltip" data-original-title="Remove"><i class="icon-trash"\r\n                      aria-hidden="true"></i></button>\r\n                </td>\r\n              </tr>\r\n              <tr class="gradeA">\r\n                <td>Prescott Junior</td>\r\n                <td>precicily</td>\r\n                <td>kolkol98765</td>\r\n                <td class="actions">\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing m-r-5 button-save"\r\n                    data-toggle="tooltip" data-original-title="Save" hidden><i class="icon-drawer"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-editing button-discard"\r\n                    data-toggle="tooltip" data-original-title="Discard" hidden><i class="icon-close"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default m-r-5 button-edit"\r\n                    data-toggle="tooltip" data-original-title="Edit"><i class="icon-pencil"\r\n                      aria-hidden="true"></i></button>\r\n                  <button class="btn btn-sm btn-icon btn-pure btn-default on-default button-remove"\r\n                    data-toggle="tooltip" data-original-title="Remove"><i class="icon-trash"\r\n                      aria-hidden="true"></i></button>\r\n                </td>\r\n              </tr>\r\n            </tbody>\r\n            <tfoot>\r\n              <tr>\r\n                <th>Nama</th>\r\n                <th>Username</th>\r\n                <th>Password</th>\r\n                <th>Actions</th>\r\n              </tr>\r\n            </tfoot>\r\n          </table>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n';
    },
    useData: !0
  }));
