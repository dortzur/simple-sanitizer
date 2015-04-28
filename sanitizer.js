// if the module has no dependencies, the above pattern can be simplified to
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.sanitizer = factory();
    }
}(this, function () {


    'use strict';

    function _lowercase(string) {
        return isString(string) ? string.toLowerCase() : string;
    }

    function isArrayLike(obj) {
        if (obj == null || isWindow(obj)) {
            return false;
        }

        var length = obj.length;

        if (obj.nodeType === NODE_TYPE_ELEMENT && length) {
            return true;
        }

        return isString(obj) || isArray(obj) || length === 0 ||
            typeof length === 'number' && length > 0 && (length - 1) in obj;
    }

    function _noop() {
    }

    function _forEach(obj, iterator, context) {
        var key, length;
        if (obj) {
            if (isFunction(obj)) {
                for (key in obj) {
                    // Need to check if hasOwnProperty exists,
                    // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
                    if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }
            } else if (isArray(obj) || isArrayLike(obj)) {
                var isPrimitive = typeof obj !== 'object';
                for (key = 0, length = obj.length; key < length; key++) {
                    if (isPrimitive || key in obj) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }
            } else if (obj.forEach && obj.forEach !== forEach) {
                obj.forEach(iterator, context, obj);
            } else {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }
            }
        }
        return obj;
    }

    function _extend() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;

            // Skip the boolean and the target
            target = arguments[i] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }

        // Extend jQuery itself if only one argument is passed
        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) )) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    }

    function _bind(self, fn) {
        var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
        if (isFunction(fn) && !(fn instanceof RegExp)) {
            return curryArgs.length
                ? function () {
                return arguments.length
                    ? fn.apply(self, concat(curryArgs, arguments, 0))
                    : fn.apply(self, curryArgs);
            }
                : function () {
                return arguments.length
                    ? fn.apply(self, arguments)
                    : fn.call(self);
            };
        } else {
            // in IE, native methods are not functions so they cannot be bound (note: they don't need to be)
            return fn;
        }
    }

    /**
     * @ngdoc function
     * @name angular.isUndefined
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is undefined.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is undefined.
     */
    function isUndefined(value) {
        return typeof value === 'undefined';
    }


    /**
     * @ngdoc function
     * @name angular.isDefined
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is defined.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is defined.
     */
    function isDefined(value) {
        return typeof value !== 'undefined';
    }


    /**
     * @ngdoc function
     * @name angular.isObject
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
     * considered to be objects. Note that JavaScript arrays are objects.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is an `Object` but not `null`.
     */
    function isObject(value) {
        // http://jsperf.com/isobject4
        return value !== null && typeof value === 'object';
    }


    /**
     * @ngdoc function
     * @name angular.isString
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is a `String`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `String`.
     */
    function isString(value) {
        return typeof value === 'string';
    }


    /**
     * @ngdoc function
     * @name angular.isNumber
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is a `Number`.
     *
     * This includes the "special" numbers `NaN`, `+Infinity` and `-Infinity`.
     *
     * If you wish to exclude these then you can use the native
     * [`isFinite'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
     * method.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `Number`.
     */
    function isNumber(value) {
        return typeof value === 'number';
    }


    /**
     * @ngdoc function
     * @name angular.isDate
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a value is a date.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `Date`.
     */
    function isDate(value) {
        return toString.call(value) === '[object Date]';
    }


    /**
     * @ngdoc function
     * @name angular.isArray
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is an `Array`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is an `Array`.
     */
    var isArray = Array.isArray;

    /**
     * @ngdoc function
     * @name angular.isFunction
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is a `Function`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `Function`.
     */
    function isFunction(value) {
        return typeof value === 'function';
    }


    /**
     * Determines if a value is a regular expression object.
     *
     * @private
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `RegExp`.
     */
    function isRegExp(value) {
        return toString.call(value) === '[object RegExp]';
    }


    /**
     * Checks if `obj` is a window object.
     *
     * @private
     * @param {*} obj Object to check
     * @returns {boolean} True if `obj` is a window obj.
     */
    function isWindow(obj) {
        return obj && obj.window === obj;
    }


    function isScope(obj) {
        return obj && obj.$evalAsync && obj.$watch;
    }


    function isFile(obj) {
        return toString.call(obj) === '[object File]';
    }


    function isFormData(obj) {
        return toString.call(obj) === '[object FormData]';
    }


    function isBlob(obj) {
        return toString.call(obj) === '[object Blob]';
    }


    function isBoolean(value) {
        return typeof value === 'boolean';
    }


    function isPromiseLike(obj) {
        return obj && isFunction(obj.then);
    }


    var TYPED_ARRAY_REGEXP = /^\[object (Uint8(Clamped)?)|(Uint16)|(Uint32)|(Int8)|(Int16)|(Int32)|(Float(32)|(64))Array\]$/;

    function isTypedArray(value) {
        return TYPED_ARRAY_REGEXP.test(toString.call(value));
    }


    var trim = function (value) {
        return isString(value) ? value.trim() : value;
    };

// Copied from:
// http://docs.closure-library.googlecode.com/git/local_closure_goog_string_string.js.source.html#line1021
// Prereq: s is a string.
    var escapeForRegexp = function (s) {
        return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
            replace(/\x08/g, '\\x08');
    };


    /**
     * @ngdoc function
     * @name angular.isElement
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is a DOM element (or wrapped jQuery element).
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a DOM element (or wrapped jQuery element).
     */
    function isElement(node) {
        return !!(node &&
        (node.nodeName  // we are a direct element
        || (node.prop && node.attr && node.find)));  // we have an on and find method part of jQuery API
    }

    function msieversion() {
        if(typeof window =="undefined") return false;
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0)      // If Internet Explorer, return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));

        return false;
    }

    var msie = msieversion();

    /**
     * @description
     * Private service to sanitize uris for links and images. Used by $compile and $sanitize.
     */


    'use strict';
// NOTE:  The usage of window and document instead of $window and $document here is
// deliberate.  This service depends on the specific behavior of anchor nodes created by the
// browser (resolving and parsing URLs) that is unlikely to be provided by mock objects and
// cause us to break tests.  In addition, when the browser resolves a URL for XHR, it
// doesn't know about mocked locations and resolves URLs to the real document - which is
// exactly the behavior needed here.  There is little value is mocking these out for this
// service.

        var urlParsingNode = document.createElement("a");
        var originUrl = urlResolve(window.location.href);



    /**
     *
     * Implementation Notes for non-IE browsers
     * ----------------------------------------
     * Assigning a URL to the href property of an anchor DOM node, even one attached to the DOM,
     * results both in the normalizing and parsing of the URL.  Normalizing means that a relative
     * URL will be resolved into an absolute URL in the context of the application document.
     * Parsing means that the anchor node's host, hostname, protocol, port, pathname and related
     * properties are all populated to reflect the normalized URL.  This approach has wide
     * compatibility - Safari 1+, Mozilla 1+, Opera 7+,e etc.  See
     * http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
     *
     * Implementation Notes for IE
     * ---------------------------
     * IE >= 8 and <= 10 normalizes the URL when assigned to the anchor node similar to the other
     * browsers.  However, the parsed components will not be set if the URL assigned did not specify
     * them.  (e.g. if you assign a.href = "foo", then a.protocol, a.host, etc. will be empty.)  We
     * work around that by performing the parsing in a 2nd step by taking a previously normalized
     * URL (e.g. by assigning to a.href) and assigning it a.href again.  This correctly populates the
     * properties such as protocol, hostname, port, etc.
     *
     * IE7 does not normalize the URL when assigned to an anchor node.  (Apparently, it does, if one
     * uses the inner HTML approach to assign the URL as part of an HTML snippet -
     * http://stackoverflow.com/a/472729)  However, setting img[src] does normalize the URL.
     * Unfortunately, setting img[src] to something like "javascript:foo" on IE throws an exception.
     * Since the primary usage for normalizing URLs is to sanitize such URLs, we can't use that
     * method and IE < 8 is unsupported.
     *
     * References:
     *   http://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
     *   http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
     *   http://url.spec.whatwg.org/#urlutils
     *   https://github.com/angular/angular.js/pull/2902
     *   http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
     *
     * @kind function
     * @param {string} url The URL to be parsed.
     * @description Normalizes and parses a URL.
     * @returns {object} Returns the normalized URL as a dictionary.
     *
     *   | member name   | Description    |
     *   |---------------|----------------|
     *   | href          | A normalized version of the provided URL if it was not an absolute URL |
     *   | protocol      | The protocol including the trailing colon                              |
     *   | host          | The host and port (if the port is non-default) of the normalizedUrl    |
     *   | search        | The search params, minus the question mark                             |
     *   | hash          | The hash string, minus the hash symbol
     *   | hostname      | The hostname
     *   | port          | The port, without ":"
     *   | pathname      | The pathname, beginning with "/"
     *
     */
    function urlResolve(url) {
        var href = url;

        if (msie) {
            // Normalize before parse.  Refer Implementation Notes on why this is
            // done in two steps on IE.
            urlParsingNode.setAttribute("href", href);
            href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/')
                ? urlParsingNode.pathname
                : '/' + urlParsingNode.pathname
        };
    }

    /**
     * Parse a request URL and determine whether this is a same-origin request as the application document.
     *
     * @param {string|object} requestUrl The url of the request as a string that will be resolved
     * or a parsed URL object.
     * @returns {boolean} Whether the request is for the same origin as the application document.
     */
    function urlIsSameOrigin(requestUrl) {
        var parsed = (isString(requestUrl)) ? urlResolve(requestUrl) : requestUrl;
        return (parsed.protocol === originUrl.protocol &&
        parsed.host === originUrl.host);
    }

    function $$SanitizeUriProvider() {
        var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/,
            imgSrcSanitizationWhitelist = /^\s*((https?|ftp|file|blob):|data:image\/)/;

        /**
         * @description
         * Retrieves or overrides the default regular expression that is used for whitelisting of safe
         * urls during a[href] sanitization.
         *
         * The sanitization is a security measure aimed at prevent XSS attacks via html links.
         *
         * Any url about to be assigned to a[href] via data-binding is first normalized and turned into
         * an absolute url. Afterwards, the url is matched against the `aHrefSanitizationWhitelist`
         * regular expression. If a match is found, the original url is written into the dom. Otherwise,
         * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
         *
         * @param {RegExp=} regexp New regexp to whitelist urls with.
         * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
         *    chaining otherwise.
         */
        this.aHrefSanitizationWhitelist = function (regexp) {
            if (isDefined(regexp)) {
                aHrefSanitizationWhitelist = regexp;
                return this;
            }
            return aHrefSanitizationWhitelist;
        };


        /**
         * @description
         * Retrieves or overrides the default regular expression that is used for whitelisting of safe
         * urls during img[src] sanitization.
         *
         * The sanitization is a security measure aimed at prevent XSS attacks via html links.
         *
         * Any url about to be assigned to img[src] via data-binding is first normalized and turned into
         * an absolute url. Afterwards, the url is matched against the `imgSrcSanitizationWhitelist`
         * regular expression. If a match is found, the original url is written into the dom. Otherwise,
         * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
         *
         * @param {RegExp=} regexp New regexp to whitelist urls with.
         * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
         *    chaining otherwise.
         */
        this.imgSrcSanitizationWhitelist = function (regexp) {
            if (isDefined(regexp)) {
                imgSrcSanitizationWhitelist = regexp;
                return this;
            }
            return imgSrcSanitizationWhitelist;
        };


        this.sanitizeUri = function (uri, isImage) {
            var regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
            var normalizedVal;
            normalizedVal = urlResolve(uri).href;
            if (normalizedVal !== '' && !normalizedVal.match(regex)) {
                return 'unsafe:' + normalizedVal;
            }
            return uri;
        }


    }

    var $$sanitizeUri = new $$SanitizeUriProvider().sanitizeUri;

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *     Any commits to this file should be reviewed with security in mind.  *
     *   Changes to this file can potentially create security vulnerabilities. *
     *          An approval from 2 Core members with history of modifying      *
     *                         this file is required.                          *
     *                                                                         *
     *  Does the change somehow allow for arbitrary javascript to be executed? *
     *    Or allows for someone to change the prototype of built-in objects?   *
     *     Or gives undesired access to variables likes document or window?    *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    /**
     * @ngdoc module
     * @name ngSanitize
     * @description
     *
     * # ngSanitize
     *
     * The `ngSanitize` module provides functionality to sanitize HTML.
     *
     *
     * <div doc-module-components="ngSanitize"></div>
     *
     * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
     */

    /*
     * HTML Parser By Misko Hevery (misko@hevery.com)
     * based on:  HTML Parser By John Resig (ejohn.org)
     * Original code by Erik Arvidsson, Mozilla Public License
     * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
     *
     * // Use like so:
     * htmlParser(htmlString, {
     *     start: function(tag, attrs, unary) {},
     *     end: function(tag) {},
     *     chars: function(text) {},
     *     comment: function(text) {}
     * });
     *
     */


    /**
     * @ngdoc service
     * @name $sanitize
     * @kind function
     *
     * @description
     *   The input is sanitized by parsing the HTML into tokens. All safe tokens (from a whitelist) are
     *   then serialized back to properly escaped html string. This means that no unsafe input can make
     *   it into the returned string, however, since our parser is more strict than a typical browser
     *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
     *   browser, won't make it through the sanitizer. The input may also contain SVG markup.
     *   The whitelist is configured using the functions `aHrefSanitizationWhitelist` and
     *   `imgSrcSanitizationWhitelist` of {@link ng.$compileProvider `$compileProvider`}.
     *
     * @param {string} html HTML input.
     * @returns {string} Sanitized HTML.
     *
     * @example
     <example module="sanitizeExample" deps="angular-sanitize.js">
     <file name="index.html">
     <script>
     angular.module('sanitizeExample', ['ngSanitize'])
     .controller('ExampleController', ['$scope', '$sce', function($scope, $sce) {
             $scope.snippet =
               '<p style="color:blue">an html\n' +
               '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
               'snippet</p>';
             $scope.deliberatelyTrustDangerousSnippet = function() {
               return $sce.trustAsHtml($scope.snippet);
             };
           }]);
     </script>
     <div ng-controller="ExampleController">
     Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
     <table>
     <tr>
     <td>Directive</td>
     <td>How</td>
     <td>Source</td>
     <td>Rendered</td>
     </tr>
     <tr id="bind-html-with-sanitize">
     <td>ng-bind-html</td>
     <td>Automatically uses $sanitize</td>
     <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
     <td><div ng-bind-html="snippet"></div></td>
     </tr>
     <tr id="bind-html-with-trust">
     <td>ng-bind-html</td>
     <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
     <td>
     <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
     &lt;/div&gt;</pre>
     </td>
     <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
     </tr>
     <tr id="bind-default">
     <td>ng-bind</td>
     <td>Automatically escapes</td>
     <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
     <td><div ng-bind="snippet"></div></td>
     </tr>
     </table>
     </div>
     </file>
     <file name="protractor.js" type="protractor">
     it('should sanitize the html snippet by default', function() {
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
     });

     it('should inline raw snippet if bound to a trusted value', function() {
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).
         toBe("<p style=\"color:blue\">an html\n" +
              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
              "snippet</p>");
     });

     it('should escape snippet without any filter', function() {
       expect(element(by.css('#bind-default div')).getInnerHtml()).
         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
              "snippet&lt;/p&gt;");
     });

     it('should update', function() {
       element(by.model('snippet')).clear();
       element(by.model('snippet')).sendKeys('new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('new <b>text</b>');
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).toBe(
         'new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-default div')).getInnerHtml()).toBe(
         "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
     });
     </file>
     </example>
     */
    function $SanitizeProvider() {


        this.sanitizeHTML = function (html) {
            var buf = [];
            htmlParser(html, htmlSanitizeWriter(buf, function (uri, isImage) {
                return !/^unsafe/.test($$sanitizeUri(uri, isImage));
            }));
            return buf.join('');
        }

    }

    function sanitizeText(chars) {
        var buf = [];
        var writer = htmlSanitizeWriter(buf, _noop);
        writer.chars(chars);
        return buf.join('');
    }


// Regular Expressions for parsing tags and attributes
    var START_TAG_REGEXP =
            /^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/,
        END_TAG_REGEXP = /^<\/\s*([\w:-]+)[^>]*>/,
        ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
        BEGIN_TAG_REGEXP = /^</,
        BEGING_END_TAGE_REGEXP = /^<\//,
        COMMENT_REGEXP = /<!--(.*?)-->/g,
        DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
        CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
        SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
// Match everything outside of normal chars and " (quote character)
        NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;


// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements

// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
    var voidElements = makeMap("area,br,col,hr,img,wbr");

// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
    var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
        optionalEndTagInlineElements = makeMap("rp,rt"),
        optionalEndTagElements = _extend({},
            optionalEndTagInlineElements,
            optionalEndTagBlockElements);

// Safe Block Elements - HTML5
    var blockElements = _extend({}, optionalEndTagBlockElements, makeMap("address,article," +
        "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
        "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));

// Inline Elements - HTML5
    var inlineElements = _extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
        "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
        "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));

// SVG Elements
// https://wiki.whatwg.org/wiki/Sanitization_rules#svg_Elements
// Note: the elements animate,animateColor,animateMotion,animateTransform,set are intentionally omitted.
// They can potentially allow for arbitrary javascript to be executed. See #11290
    var svgElements = makeMap("circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph," +
        "hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline," +
        "radialGradient,rect,stop,svg,switch,text,title,tspan,use");

// Special Elements (can contain anything)
    var specialElements = makeMap("script,style");

    var validElements = _extend({},
        voidElements,
        blockElements,
        inlineElements,
        optionalEndTagElements,
        svgElements);

//Attributes that have href and hence need to be sanitized
    var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap,xlink:href");

    var htmlAttrs = makeMap('abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,' +
        'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,' +
        'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,' +
        'scope,scrolling,shape,size,span,start,summary,target,title,type,' +
        'valign,value,vspace,width');

// SVG attributes (without "id" and "name" attributes)
// https://wiki.whatwg.org/wiki/Sanitization_rules#svg_Attributes
    var svgAttrs = makeMap('accent-height,accumulate,additive,alphabetic,arabic-form,ascent,' +
        'baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,' +
        'cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,' +
        'font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,' +
        'height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,' +
        'marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,' +
        'max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,' +
        'path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,' +
        'requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,' +
        'stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,' +
        'stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,' +
        'stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,' +
        'underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,' +
        'width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,' +
        'xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan', true);

    var validAttrs = _extend({},
        uriAttrs,
        svgAttrs,
        htmlAttrs);

    function makeMap(str, lowercaseKeys) {
        var obj = {}, items = str.split(','), i;
        for (i = 0; i < items.length; i++) {
            obj[lowercaseKeys ? _lowercase(items[i]) : items[i]] = true;
        }
        return obj;
    }


    /**
     * @example
     * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
     *
     * @param {string} html string
     * @param {object} handler
     */
    function htmlParser(html, handler) {
        if (typeof html !== 'string') {
            if (html === null || typeof html === 'undefined') {
                html = '';
            } else {
                html = '' + html;
            }
        }
        var index, chars, match, stack = [], last = html, text;
        stack.last = function () {
            return stack[stack.length - 1];
        };

        while (html) {
            text = '';
            chars = true;

            // Make sure we're not in a script or style element
            if (!stack.last() || !specialElements[stack.last()]) {

                // Comment
                if (html.indexOf("<!--") === 0) {
                    // comments containing -- are not allowed unless they terminate the comment
                    index = html.indexOf("--", 4);

                    if (index >= 0 && html.lastIndexOf("-->", index) === index) {
                        if (handler.comment) handler.comment(html.substring(4, index));
                        html = html.substring(index + 3);
                        chars = false;
                    }
                    // DOCTYPE
                } else if (DOCTYPE_REGEXP.test(html)) {
                    match = html.match(DOCTYPE_REGEXP);

                    if (match) {
                        html = html.replace(match[0], '');
                        chars = false;
                    }
                    // end tag
                } else if (BEGING_END_TAGE_REGEXP.test(html)) {
                    match = html.match(END_TAG_REGEXP);

                    if (match) {
                        html = html.substring(match[0].length);
                        match[0].replace(END_TAG_REGEXP, parseEndTag);
                        chars = false;
                    }

                    // start tag
                } else if (BEGIN_TAG_REGEXP.test(html)) {
                    match = html.match(START_TAG_REGEXP);

                    if (match) {
                        // We only have a valid start-tag if there is a '>'.
                        if (match[4]) {
                            html = html.substring(match[0].length);
                            match[0].replace(START_TAG_REGEXP, parseStartTag);
                        }
                        chars = false;
                    } else {
                        // no ending tag found --- this piece should be encoded as an entity.
                        text += '<';
                        html = html.substring(1);
                    }
                }

                if (chars) {
                    index = html.indexOf("<");

                    text += index < 0 ? html : html.substring(0, index);
                    html = index < 0 ? "" : html.substring(index);

                    if (handler.chars) handler.chars(decodeEntities(text));
                }

            } else {
                // IE versions 9 and 10 do not understand the regex '[^]', so using a workaround with [\W\w].
                html = html.replace(new RegExp("([\\W\\w]*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
                    function (all, text) {
                        text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

                        if (handler.chars) handler.chars(decodeEntities(text));

                        return "";
                    });

                parseEndTag("", stack.last());
            }

            if (html == last) {
                throw new Error("The sanitizer was unable to parse the following block " +
                    "of html: " + html);
            }
            last = html;
        }

        // Clean up any remaining tags
        parseEndTag();

        function parseStartTag(tag, tagName, rest, unary) {
            tagName = _lowercase(tagName);
            if (blockElements[tagName]) {
                while (stack.last() && inlineElements[stack.last()]) {
                    parseEndTag("", stack.last());
                }
            }

            if (optionalEndTagElements[tagName] && stack.last() == tagName) {
                parseEndTag("", tagName);
            }

            unary = voidElements[tagName] || !!unary;

            if (!unary) {
                stack.push(tagName);
            }

            var attrs = {};

            rest.replace(ATTR_REGEXP,
                function (match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
                    var value = doubleQuotedValue
                        || singleQuotedValue
                        || unquotedValue
                        || '';

                    attrs[name] = decodeEntities(value);
                });
            if (handler.start) handler.start(tagName, attrs, unary);
        }

        function parseEndTag(tag, tagName) {
            var pos = 0, i;
            tagName = _lowercase(tagName);
            if (tagName) {
                // Find the closest opened tag of the same type
                for (pos = stack.length - 1; pos >= 0; pos--) {
                    if (stack[pos] == tagName) break;
                }
            }

            if (pos >= 0) {
                // Close all the open elements, up the stack
                for (i = stack.length - 1; i >= pos; i--)
                    if (handler.end) handler.end(stack[i]);

                // Remove the open elements from the stack
                stack.length = pos;
            }
        }
    }

    var hiddenPre = document.createElement("pre");

    /**
     * decodes all entities into regular string
     * @param value
     * @returns {string} A string with decoded entities.
     */
    function decodeEntities(value) {
        if (!value) {
            return '';
        }

        hiddenPre.innerHTML = value.replace(/</g, "&lt;");
        // innerText depends on styling as it doesn't display hidden elements.
        // Therefore, it's better to use textContent not to cause unnecessary reflows.
        return hiddenPre.textContent;
    }

    /**
     * Escapes all potentially dangerous characters, so that the
     * resulting string can be safely inserted into attribute or
     * element text.
     * @param value
     * @returns {string} escaped text
     */
    function encodeEntities(value) {
        return value.
            replace(/&/g, '&amp;').
            replace(SURROGATE_PAIR_REGEXP, function (value) {
                var hi = value.charCodeAt(0);
                var low = value.charCodeAt(1);
                return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
            }).
            replace(NON_ALPHANUMERIC_REGEXP, function (value) {
                return '&#' + value.charCodeAt(0) + ';';
            }).
            replace(/</g, '&lt;').
            replace(/>/g, '&gt;');
    }

    /**
     * create an HTML/XML writer which writes to buffer
     * @param {Array} buf use buf.jain('') to get out sanitized html string
     * @returns {object} in the form of {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * }
     */
    function htmlSanitizeWriter(buf, uriValidator) {
        var ignore = false;
        var out = _bind(buf, buf.push);
        return {
            start: function (tag, attrs, unary) {
                tag = _lowercase(tag);
                if (!ignore && specialElements[tag]) {
                    ignore = tag;
                }
                if (!ignore && validElements[tag] === true) {
                    out('<');
                    out(tag);
                    _forEach(attrs, function (value, key) {
                        var lkey = _lowercase(key);
                        var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
                        if (validAttrs[lkey] === true &&
                            (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
                            out(' ');
                            out(key);
                            out('="');
                            out(encodeEntities(value));
                            out('"');
                        }
                    });
                    out(unary ? '/>' : '>');
                }
            },
            end: function (tag) {
                tag = _lowercase(tag);
                if (!ignore && validElements[tag] === true) {
                    out('</');
                    out(tag);
                    out('>');
                }
                if (tag == ignore) {
                    ignore = false;
                }
            },
            chars: function (chars) {
                if (!ignore) {
                    out(encodeEntities(chars));
                }
            }
        };
    }


    var NODE_TYPE_ELEMENT = 1;
    var NODE_TYPE_ATTRIBUTE = 2;
    var NODE_TYPE_TEXT = 3;
    var NODE_TYPE_COMMENT = 8;
    var NODE_TYPE_DOCUMENT = 9;
    var NODE_TYPE_DOCUMENT_FRAGMENT = 11;

    return _extend({}, new $$SanitizeUriProvider(), new $SanitizeProvider());
}));