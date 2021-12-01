(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[110],{

/***/ "./node_modules/codemirror/mode/vb/vb.js":
/*!***********************************************!*\
  !*** ./node_modules/codemirror/mode/vb/vb.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// CodeMirror, copyright (c) by Marijn Haverbeke and others\n// Distributed under an MIT license: https://codemirror.net/LICENSE\n\n(function(mod) {\n  if (true) // CommonJS\n    mod(__webpack_require__(/*! ../../lib/codemirror */ \"./node_modules/codemirror/lib/codemirror.js\"));\n  else {}\n})(function(CodeMirror) {\n\"use strict\";\n\nCodeMirror.defineMode(\"vb\", function(conf, parserConf) {\n    var ERRORCLASS = 'error';\n\n    function wordRegexp(words) {\n        return new RegExp(\"^((\" + words.join(\")|(\") + \"))\\\\b\", \"i\");\n    }\n\n    var singleOperators = new RegExp(\"^[\\\\+\\\\-\\\\*/%&\\\\\\\\|\\\\^~<>!]\");\n    var singleDelimiters = new RegExp('^[\\\\(\\\\)\\\\[\\\\]\\\\{\\\\}@,:`=;\\\\.]');\n    var doubleOperators = new RegExp(\"^((==)|(<>)|(<=)|(>=)|(<>)|(<<)|(>>)|(//)|(\\\\*\\\\*))\");\n    var doubleDelimiters = new RegExp(\"^((\\\\+=)|(\\\\-=)|(\\\\*=)|(%=)|(/=)|(&=)|(\\\\|=)|(\\\\^=))\");\n    var tripleDelimiters = new RegExp(\"^((//=)|(>>=)|(<<=)|(\\\\*\\\\*=))\");\n    var identifiers = new RegExp(\"^[_A-Za-z][_A-Za-z0-9]*\");\n\n    var openingKeywords = ['class','module', 'sub','enum','select','while','if','function', 'get','set','property', 'try', 'structure', 'synclock', 'using', 'with'];\n    var middleKeywords = ['else','elseif','case', 'catch', 'finally'];\n    var endKeywords = ['next','loop'];\n\n    var operatorKeywords = ['and', \"andalso\", 'or', 'orelse', 'xor', 'in', 'not', 'is', 'isnot', 'like'];\n    var wordOperators = wordRegexp(operatorKeywords);\n\n    var commonKeywords = [\"#const\", \"#else\", \"#elseif\", \"#end\", \"#if\", \"#region\", \"addhandler\", \"addressof\", \"alias\", \"as\", \"byref\", \"byval\", \"cbool\", \"cbyte\", \"cchar\", \"cdate\", \"cdbl\", \"cdec\", \"cint\", \"clng\", \"cobj\", \"compare\", \"const\", \"continue\", \"csbyte\", \"cshort\", \"csng\", \"cstr\", \"cuint\", \"culng\", \"cushort\", \"declare\", \"default\", \"delegate\", \"dim\", \"directcast\", \"each\", \"erase\", \"error\", \"event\", \"exit\", \"explicit\", \"false\", \"for\", \"friend\", \"gettype\", \"goto\", \"handles\", \"implements\", \"imports\", \"infer\", \"inherits\", \"interface\", \"isfalse\", \"istrue\", \"lib\", \"me\", \"mod\", \"mustinherit\", \"mustoverride\", \"my\", \"mybase\", \"myclass\", \"namespace\", \"narrowing\", \"new\", \"nothing\", \"notinheritable\", \"notoverridable\", \"of\", \"off\", \"on\", \"operator\", \"option\", \"optional\", \"out\", \"overloads\", \"overridable\", \"overrides\", \"paramarray\", \"partial\", \"private\", \"protected\", \"public\", \"raiseevent\", \"readonly\", \"redim\", \"removehandler\", \"resume\", \"return\", \"shadows\", \"shared\", \"static\", \"step\", \"stop\", \"strict\", \"then\", \"throw\", \"to\", \"true\", \"trycast\", \"typeof\", \"until\", \"until\", \"when\", \"widening\", \"withevents\", \"writeonly\"];\n\n    var commontypes = ['object', 'boolean', 'char', 'string', 'byte', 'sbyte', 'short', 'ushort', 'int16', 'uint16', 'integer', 'uinteger', 'int32', 'uint32', 'long', 'ulong', 'int64', 'uint64', 'decimal', 'single', 'double', 'float', 'date', 'datetime', 'intptr', 'uintptr'];\n\n    var keywords = wordRegexp(commonKeywords);\n    var types = wordRegexp(commontypes);\n    var stringPrefixes = '\"';\n\n    var opening = wordRegexp(openingKeywords);\n    var middle = wordRegexp(middleKeywords);\n    var closing = wordRegexp(endKeywords);\n    var doubleClosing = wordRegexp(['end']);\n    var doOpening = wordRegexp(['do']);\n\n    var indentInfo = null;\n\n    CodeMirror.registerHelper(\"hintWords\", \"vb\", openingKeywords.concat(middleKeywords).concat(endKeywords)\n                                .concat(operatorKeywords).concat(commonKeywords).concat(commontypes));\n\n    function indent(_stream, state) {\n      state.currentIndent++;\n    }\n\n    function dedent(_stream, state) {\n      state.currentIndent--;\n    }\n    // tokenizers\n    function tokenBase(stream, state) {\n        if (stream.eatSpace()) {\n            return null;\n        }\n\n        var ch = stream.peek();\n\n        // Handle Comments\n        if (ch === \"'\") {\n            stream.skipToEnd();\n            return 'comment';\n        }\n\n\n        // Handle Number Literals\n        if (stream.match(/^((&H)|(&O))?[0-9\\.a-f]/i, false)) {\n            var floatLiteral = false;\n            // Floats\n            if (stream.match(/^\\d*\\.\\d+F?/i)) { floatLiteral = true; }\n            else if (stream.match(/^\\d+\\.\\d*F?/)) { floatLiteral = true; }\n            else if (stream.match(/^\\.\\d+F?/)) { floatLiteral = true; }\n\n            if (floatLiteral) {\n                // Float literals may be \"imaginary\"\n                stream.eat(/J/i);\n                return 'number';\n            }\n            // Integers\n            var intLiteral = false;\n            // Hex\n            if (stream.match(/^&H[0-9a-f]+/i)) { intLiteral = true; }\n            // Octal\n            else if (stream.match(/^&O[0-7]+/i)) { intLiteral = true; }\n            // Decimal\n            else if (stream.match(/^[1-9]\\d*F?/)) {\n                // Decimal literals may be \"imaginary\"\n                stream.eat(/J/i);\n                // TODO - Can you have imaginary longs?\n                intLiteral = true;\n            }\n            // Zero by itself with no other piece of number.\n            else if (stream.match(/^0(?![\\dx])/i)) { intLiteral = true; }\n            if (intLiteral) {\n                // Integer literals may be \"long\"\n                stream.eat(/L/i);\n                return 'number';\n            }\n        }\n\n        // Handle Strings\n        if (stream.match(stringPrefixes)) {\n            state.tokenize = tokenStringFactory(stream.current());\n            return state.tokenize(stream, state);\n        }\n\n        // Handle operators and Delimiters\n        if (stream.match(tripleDelimiters) || stream.match(doubleDelimiters)) {\n            return null;\n        }\n        if (stream.match(doubleOperators)\n            || stream.match(singleOperators)\n            || stream.match(wordOperators)) {\n            return 'operator';\n        }\n        if (stream.match(singleDelimiters)) {\n            return null;\n        }\n        if (stream.match(doOpening)) {\n            indent(stream,state);\n            state.doInCurrentLine = true;\n            return 'keyword';\n        }\n        if (stream.match(opening)) {\n            if (! state.doInCurrentLine)\n              indent(stream,state);\n            else\n              state.doInCurrentLine = false;\n            return 'keyword';\n        }\n        if (stream.match(middle)) {\n            return 'keyword';\n        }\n\n        if (stream.match(doubleClosing)) {\n            dedent(stream,state);\n            dedent(stream,state);\n            return 'keyword';\n        }\n        if (stream.match(closing)) {\n            dedent(stream,state);\n            return 'keyword';\n        }\n\n        if (stream.match(types)) {\n            return 'keyword';\n        }\n\n        if (stream.match(keywords)) {\n            return 'keyword';\n        }\n\n        if (stream.match(identifiers)) {\n            return 'variable';\n        }\n\n        // Handle non-detected items\n        stream.next();\n        return ERRORCLASS;\n    }\n\n    function tokenStringFactory(delimiter) {\n        var singleline = delimiter.length == 1;\n        var OUTCLASS = 'string';\n\n        return function(stream, state) {\n            while (!stream.eol()) {\n                stream.eatWhile(/[^'\"]/);\n                if (stream.match(delimiter)) {\n                    state.tokenize = tokenBase;\n                    return OUTCLASS;\n                } else {\n                    stream.eat(/['\"]/);\n                }\n            }\n            if (singleline) {\n                if (parserConf.singleLineStringErrors) {\n                    return ERRORCLASS;\n                } else {\n                    state.tokenize = tokenBase;\n                }\n            }\n            return OUTCLASS;\n        };\n    }\n\n\n    function tokenLexer(stream, state) {\n        var style = state.tokenize(stream, state);\n        var current = stream.current();\n\n        // Handle '.' connected identifiers\n        if (current === '.') {\n            style = state.tokenize(stream, state);\n            if (style === 'variable') {\n                return 'variable';\n            } else {\n                return ERRORCLASS;\n            }\n        }\n\n\n        var delimiter_index = '[({'.indexOf(current);\n        if (delimiter_index !== -1) {\n            indent(stream, state );\n        }\n        if (indentInfo === 'dedent') {\n            if (dedent(stream, state)) {\n                return ERRORCLASS;\n            }\n        }\n        delimiter_index = '])}'.indexOf(current);\n        if (delimiter_index !== -1) {\n            if (dedent(stream, state)) {\n                return ERRORCLASS;\n            }\n        }\n\n        return style;\n    }\n\n    var external = {\n        electricChars:\"dDpPtTfFeE \",\n        startState: function() {\n            return {\n              tokenize: tokenBase,\n              lastToken: null,\n              currentIndent: 0,\n              nextLineIndent: 0,\n              doInCurrentLine: false\n\n\n          };\n        },\n\n        token: function(stream, state) {\n            if (stream.sol()) {\n              state.currentIndent += state.nextLineIndent;\n              state.nextLineIndent = 0;\n              state.doInCurrentLine = 0;\n            }\n            var style = tokenLexer(stream, state);\n\n            state.lastToken = {style:style, content: stream.current()};\n\n\n\n            return style;\n        },\n\n        indent: function(state, textAfter) {\n            var trueText = textAfter.replace(/^\\s+|\\s+$/g, '') ;\n            if (trueText.match(closing) || trueText.match(doubleClosing) || trueText.match(middle)) return conf.indentUnit*(state.currentIndent-1);\n            if(state.currentIndent < 0) return 0;\n            return state.currentIndent * conf.indentUnit;\n        },\n\n        lineComment: \"'\"\n    };\n    return external;\n});\n\nCodeMirror.defineMIME(\"text/x-vb\", \"vb\");\n\n});\n\n\n//# sourceURL=webpack:///./node_modules/codemirror/mode/vb/vb.js?");

/***/ })

}]);