(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[59],{

/***/ "./node_modules/codemirror/mode/htmlmixed/htmlmixed.js":
/*!*************************************************************!*\
  !*** ./node_modules/codemirror/mode/htmlmixed/htmlmixed.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// CodeMirror, copyright (c) by Marijn Haverbeke and others\n// Distributed under an MIT license: https://codemirror.net/LICENSE\n\n(function(mod) {\n  if (true) // CommonJS\n    mod(__webpack_require__(/*! ../../lib/codemirror */ \"./node_modules/codemirror/lib/codemirror.js\"), __webpack_require__(/*! ../xml/xml */ \"./node_modules/codemirror/mode/xml/xml.js\"), __webpack_require__(/*! ../javascript/javascript */ \"./node_modules/codemirror/mode/javascript/javascript.js\"), __webpack_require__(/*! ../css/css */ \"./node_modules/codemirror/mode/css/css.js\"));\n  else {}\n})(function(CodeMirror) {\n  \"use strict\";\n\n  var defaultTags = {\n    script: [\n      [\"lang\", /(javascript|babel)/i, \"javascript\"],\n      [\"type\", /^(?:text|application)\\/(?:x-)?(?:java|ecma)script$|^module$|^$/i, \"javascript\"],\n      [\"type\", /./, \"text/plain\"],\n      [null, null, \"javascript\"]\n    ],\n    style:  [\n      [\"lang\", /^css$/i, \"css\"],\n      [\"type\", /^(text\\/)?(x-)?(stylesheet|css)$/i, \"css\"],\n      [\"type\", /./, \"text/plain\"],\n      [null, null, \"css\"]\n    ]\n  };\n\n  function maybeBackup(stream, pat, style) {\n    var cur = stream.current(), close = cur.search(pat);\n    if (close > -1) {\n      stream.backUp(cur.length - close);\n    } else if (cur.match(/<\\/?$/)) {\n      stream.backUp(cur.length);\n      if (!stream.match(pat, false)) stream.match(cur);\n    }\n    return style;\n  }\n\n  var attrRegexpCache = {};\n  function getAttrRegexp(attr) {\n    var regexp = attrRegexpCache[attr];\n    if (regexp) return regexp;\n    return attrRegexpCache[attr] = new RegExp(\"\\\\s+\" + attr + \"\\\\s*=\\\\s*('|\\\")?([^'\\\"]+)('|\\\")?\\\\s*\");\n  }\n\n  function getAttrValue(text, attr) {\n    var match = text.match(getAttrRegexp(attr))\n    return match ? /^\\s*(.*?)\\s*$/.exec(match[2])[1] : \"\"\n  }\n\n  function getTagRegexp(tagName, anchored) {\n    return new RegExp((anchored ? \"^\" : \"\") + \"<\\/\\s*\" + tagName + \"\\s*>\", \"i\");\n  }\n\n  function addTags(from, to) {\n    for (var tag in from) {\n      var dest = to[tag] || (to[tag] = []);\n      var source = from[tag];\n      for (var i = source.length - 1; i >= 0; i--)\n        dest.unshift(source[i])\n    }\n  }\n\n  function findMatchingMode(tagInfo, tagText) {\n    for (var i = 0; i < tagInfo.length; i++) {\n      var spec = tagInfo[i];\n      if (!spec[0] || spec[1].test(getAttrValue(tagText, spec[0]))) return spec[2];\n    }\n  }\n\n  CodeMirror.defineMode(\"htmlmixed\", function (config, parserConfig) {\n    var htmlMode = CodeMirror.getMode(config, {\n      name: \"xml\",\n      htmlMode: true,\n      multilineTagIndentFactor: parserConfig.multilineTagIndentFactor,\n      multilineTagIndentPastTag: parserConfig.multilineTagIndentPastTag,\n      allowMissingTagName: parserConfig.allowMissingTagName,\n    });\n\n    var tags = {};\n    var configTags = parserConfig && parserConfig.tags, configScript = parserConfig && parserConfig.scriptTypes;\n    addTags(defaultTags, tags);\n    if (configTags) addTags(configTags, tags);\n    if (configScript) for (var i = configScript.length - 1; i >= 0; i--)\n      tags.script.unshift([\"type\", configScript[i].matches, configScript[i].mode])\n\n    function html(stream, state) {\n      var style = htmlMode.token(stream, state.htmlState), tag = /\\btag\\b/.test(style), tagName\n      if (tag && !/[<>\\s\\/]/.test(stream.current()) &&\n          (tagName = state.htmlState.tagName && state.htmlState.tagName.toLowerCase()) &&\n          tags.hasOwnProperty(tagName)) {\n        state.inTag = tagName + \" \"\n      } else if (state.inTag && tag && />$/.test(stream.current())) {\n        var inTag = /^([\\S]+) (.*)/.exec(state.inTag)\n        state.inTag = null\n        var modeSpec = stream.current() == \">\" && findMatchingMode(tags[inTag[1]], inTag[2])\n        var mode = CodeMirror.getMode(config, modeSpec)\n        var endTagA = getTagRegexp(inTag[1], true), endTag = getTagRegexp(inTag[1], false);\n        state.token = function (stream, state) {\n          if (stream.match(endTagA, false)) {\n            state.token = html;\n            state.localState = state.localMode = null;\n            return null;\n          }\n          return maybeBackup(stream, endTag, state.localMode.token(stream, state.localState));\n        };\n        state.localMode = mode;\n        state.localState = CodeMirror.startState(mode, htmlMode.indent(state.htmlState, \"\", \"\"));\n      } else if (state.inTag) {\n        state.inTag += stream.current()\n        if (stream.eol()) state.inTag += \" \"\n      }\n      return style;\n    };\n\n    return {\n      startState: function () {\n        var state = CodeMirror.startState(htmlMode);\n        return {token: html, inTag: null, localMode: null, localState: null, htmlState: state};\n      },\n\n      copyState: function (state) {\n        var local;\n        if (state.localState) {\n          local = CodeMirror.copyState(state.localMode, state.localState);\n        }\n        return {token: state.token, inTag: state.inTag,\n                localMode: state.localMode, localState: local,\n                htmlState: CodeMirror.copyState(htmlMode, state.htmlState)};\n      },\n\n      token: function (stream, state) {\n        return state.token(stream, state);\n      },\n\n      indent: function (state, textAfter, line) {\n        if (!state.localMode || /^\\s*<\\//.test(textAfter))\n          return htmlMode.indent(state.htmlState, textAfter, line);\n        else if (state.localMode.indent)\n          return state.localMode.indent(state.localState, textAfter, line);\n        else\n          return CodeMirror.Pass;\n      },\n\n      innerMode: function (state) {\n        return {state: state.localState || state.htmlState, mode: state.localMode || htmlMode};\n      }\n    };\n  }, \"xml\", \"javascript\", \"css\");\n\n  CodeMirror.defineMIME(\"text/html\", \"htmlmixed\");\n});\n\n\n//# sourceURL=webpack:///./node_modules/codemirror/mode/htmlmixed/htmlmixed.js?");

/***/ })

}]);