---
layout: page
title: "JavaScript create_function function"
comments: true
sharing: true
footer: true
alias:
- /functions/view/create_function:378
- /functions/view/create_function
- /functions/view/378
- /functions/create_function:378
- /functions/378
---
<!-- Generated by Rakefile:build -->
A JavaScript equivalent of PHP's create_function

{% codeblock funchand/create_function.js lang:js https://raw.github.com/kvz/phpjs/master/functions/funchand/create_function.js raw on github %}
function create_function (args, code) {
  // http://kevin.vanzonneveld.net
  // +   original by: Johnny Mast (http://www.phpvrouwen.nl)
  // +   reimplemented by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: f = create_function('a, b', "return (a + b);");
  // *     example 1: f(1, 2);
  // *     returns 1: 3
  try {
    return Function.apply(null, args.split(',').concat(code));
  } catch (e) {
    return false;
  }
}
{% endcodeblock %}

 - [view on github](https://github.com/kvz/phpjs/blob/master/functions/funchand/create_function.js)
 - [edit on github](https://github.com/kvz/phpjs/edit/master/functions/funchand/create_function.js)

### Example 1
This code
{% codeblock lang:js example %}
f = create_function('a, b', "return (a + b);");
f(1, 2);
{% endcodeblock %}

Should return
{% codeblock lang:js returns %}
3
{% endcodeblock %}


### Other PHP functions in the funchand extension
{% render_partial _includes/custom/funchand.html %}
