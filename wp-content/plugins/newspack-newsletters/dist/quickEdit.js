(()=>{var i={},e=window&&window.jQuery;if("undefined"!=typeof inlineEditPost){var t=inlineEditPost.edit;inlineEditPost.edit=function(i){t.apply(this,arguments);var n=0;"object"==typeof i&&(n=parseInt(this.getId(i))),n>0&&e("tr#post-".concat(n," .inline_data.is_public")).data("is_public")&&e("tr#edit-".concat(n,' :input[name="switch_public_page"]')).prop("checked",!0)}}var n=window;for(var d in i)n[d]=i[d];i.__esModule&&Object.defineProperty(n,"__esModule",{value:!0})})();