!function(e) {
    function t(r) {
        if (n[r]) return n[r].exports;
        var o = n[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return e[r].call(o.exports, o, o.exports, t), o.l = !0, o.exports;
    }
    var n = {};
    t.m = e, t.c = n, t.d = function(e, n, r) {
        t.o(e, n) || Object.defineProperty(e, n, {
            configurable: !1,
            enumerable: !0,
            get: r
        });
    }, t.n = function(e) {
        var n = e && e.__esModule ? function() {
            return e.default;
        } : function() {
            return e;
        };
        return t.d(n, "a", n), n;
    }, t.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }, t.p = "/Users/ningchen/apache/git/github/webpack/dist", t(t.s = 0);
}([ function(e, t, n) {
    "use strict";
    function r(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }
    function o(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t;
    }
    function u(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var c = n(1), i = n.n(c), a = n(2), f = n.n(a), l = n(3), p = n(4), s = (n.n(p), 
    function() {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
                Object.defineProperty(e, r.key, r);
            }
        }
        return function(t, n, r) {
            return n && e(t.prototype, n), r && e(t, r), t;
        };
    }()), b = function(e) {
        function t() {
            return r(this, t), o(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments));
        }
        return u(t, e), s(t, [ {
            key: "componentDidMount",
            value: function() {
                console.log(Object(l.a)()), console.log(Object(l.b)());
            }
        }, {
            key: "render",
            value: function() {
                return i.a.createElement("h1", null, "不是吧");
            }
        } ]), t;
    }(i.a.Component);
    f.a.render(i.a.createElement(b, null), document.getElementById("container"));
}, function(e, t) {
    e.exports = React;
}, function(e, t) {
    e.exports = ReactDOM;
}, function(e, t, n) {
    "use strict";
    function r() {
        return "2017";
    }
    t.b = r, t.a = function() {
        return new Date().getTime();
    };
}, function(e, t) {} ]);