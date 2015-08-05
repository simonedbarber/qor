!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t("object"==typeof exports?require("jquery"):jQuery)}(function(t){"use strict";function i(n,o){this.$element=t(n),this.options=t.extend({},i.DEFAULTS,t.isPlainObject(o)&&o),this.$source=null,this.ascending=!0,this.init()}var n="qor.sorting",o="enable."+n,e="disable."+n,r="change."+n,s="mousedown."+n,a="mouseup."+n,d="dragstart."+n,u="dragover."+n,p="drop."+n,h="qor-sorting",c="qor-sorting-highlight",f="tbody> tr";return i.prototype={constructor:i,init:function(){var n=this.options,o=this.$element,e=o.find(f),r=e.first().find(n.input).data("position"),s=e.last().find(n.input).data("position");t("body").addClass(h),o.find("tbody .qor-list-action").append(i.TEMPLATE),this.ascending=s>r,this.bind()},bind:function(){var i=this.options;this.$element.on(r,i.input,t.proxy(this.change,this)).on(s,i.toggle,t.proxy(this.mousedown,this)).on(a,t.proxy(this.mouseup,this)).on(d,f,t.proxy(this.dragstart,this)).on(u,f,t.proxy(this.dragover,this)).on(p,f,t.proxy(this.drop,this))},unbind:function(){this.$element.off(r,this.change).off(s,this.mousedown)},change:function(i){var n,o,e=this.options,r=this.$element.find(f),s=t(i.currentTarget),a=s.closest("tr"),d=a.parent(),u=s.data(),p=u.position,h=parseInt(s.val(),10),c=h>p,g=this.ascending;r.each(function(i){var o=t(this),r=o.find(e.input),s=r.data("position");s===h&&(n=i),c?s>p&&h>=s&&r.data("position",--s).val(s):p>s&&s>=h&&r.data("position",++s).val(s)}),s.data("position",h),"number"==typeof n?(o=r.eq(n),c?g?o.after(a):o.before(a):g?o.before(a):o.after(a)):c?g?d.append(a):d.prepend(a):g?d.prepend(a):d.append(a),this.highlight(a),this.sort(u.sortingUrl,p,h)},mousedown:function(i){t(i.currentTarget).closest("tr").prop("draggable",!0)},mouseup:function(){this.$element.find(f).prop("draggable",!1)},dragstart:function(i){var n=i.originalEvent,o=t(i.currentTarget);o.prop("draggable")&&n.dataTransfer&&(n.dataTransfer.effectAllowed="move",this.$source=o)},dragover:function(t){var i=this.$source;i&&t.currentTarget!==this.$source[0]&&t.preventDefault()},drop:function(i){var n,o,e,r,s,a,d=this.options,u=this.ascending,p=this.$source;p&&i.currentTarget!==this.$source[0]&&(i.preventDefault(),o=t(i.currentTarget),n=p.find(d.input),e=n.data(),r=e.position,s=o.find(d.input).data("position"),a=s>r,this.$element.find(f).each(function(){var i=t(this).find(d.input),n=i.data("position");a?n>r&&s>=n&&i.data("position",--n).val(n):r>n&&n>=s&&i.data("position",++n).val(n)}),n.data("position",s).val(s),a?u?o.after(p):o.before(p):u?o.before(p):o.after(p),this.highlight(p),this.sort(e.sortingUrl,r,s))},sort:function(i,n,o){i&&t.post(i,{from:n,to:o})},highlight:function(t){t.addClass(c),setTimeout(function(){t.removeClass(c)},2e3)},destroy:function(){this.unbind(),this.$element.removeData(n)}},i.DEFAULTS={toggle:!1,input:!1},i.TEMPLATE='<a class="qor-sorting-toggle"><i class="material-icons">swap_vert</i></a>',i.plugin=function(o){return this.each(function(){var e,r=t(this),s=r.data(n);if(!s){if(/destroy/.test(o))return;r.data(n,s=new i(this,o))}"string"==typeof o&&t.isFunction(e=s[o])&&e.apply(s)})},t(function(){if(/sorting\=true/.test(window.location.search)){var n=".qor-list",r={toggle:".qor-sorting-toggle",input:".qor-sorting-position"};t(document).on(e,function(o){i.plugin.call(t(n,o.target),"destroy")}).on(o,function(o){i.plugin.call(t(n,o.target),r)}).trigger("disable.qor.slideout").triggerHandler(o)}}),i});