# requirejs/多页面应用

**Fork from  [jrburke](https://github.com/jrburke/requirejs)**，原文主要给了个例子，是在require.js在多页面环境下如何应用。翻译了一下，也加了一些自己的理解。
###require.js简介
require.js是一个javascript模块化编程的基础库，提供了异步加载和模块依赖的解决办法。其他入门简介请移步：[Javascript模块化编程（三）：require.js的用法 ](http://www.ruanyifeng.com/blog/2012/11/require_js.html) 。
###实际应用场景
require.js优化过的前端页面有这样的优点:
 * **JS文件异步加载**：
 页面初始化可以缩减为require.js和入口main.js文件，其余需要的js文件则可以通过main.js实现异步加载，不会出现因加载js阻塞导致页面假死的情况。
 * **解决模块依赖**：
在开发中，很多时候我们通过调整`<script type="text/javascript" src="../***.js">`标签的位置来维持js文件直接正确的依赖关系，若位置错误，很可能导致某些脚本文件不能运行，常见于各种依赖jquery的插件。 require.js通过模块化的方法解决了依赖问题，而且各模块所依赖的文件仅加载一次。

**简单实用，js文件模块管理、异步加载的利器。**

所以很多单页面应用适合使用require.js，因为不会阻塞页面、与backbone.js组合实现前端模块化开发。但是在多页面实际应用中 ，如分部视图、模版等页面布局模式中可能有这样的问题：
 * 子页面是否需要layout页面提供的js文件（例如，about us页面可能仅需要模版页面昨个布局，而不需要模版页面提供的jquery）
 * 子页面所需的jquery版本是否兼容layout页面（例如，子页面使用的各种插件：上传、富文本、日期选择、轮播等）
 * 子页面较多的情况下如何有效的维护各个页面的js文件（例如，很多各子页面都需要加载富文本编辑器、按照之前的模式我们只能在多个页面内ctrl+c&ctrl+v，如果突然间反馈说使用体验不好，更换编辑器只能再挨个页面源码找出来一个一个的改）

关于上面几个问题，可能会有这样的说法：模版页面不加载任何js文件，全部交给子页面自己解决;就算用了require.js，项目总计的js文件数量可能比之前还多，这也算不上是优化。
对于上面两种看法，我的看法是全部交给子页面可能会出现jquery版本混乱、js代码和页面强耦合的问题，虽然用了require.js文件我们需要把一个文件拆分成很多个模块文件、文件数量增加，但是对于js文件的管理更加清晰、页面的加载量可以得到有效控制，何乐不为。

所以，如何优化require.js在多页面下的应用，解决上面提到的几个问题？这个项目给出了一些例子，还望能抛砖引玉，能帮助大家获得更多的使用姿势。

###解决办法


the [requirejs/example-multipage-shim](https://github.com/requirejs/example-multipage-shim)
example instead. This project will not work well with shim config. This project works
best when all the dependencies are AMD modules.

## Getting this project template

If you are using [volo](https://github.com/volojs/volo):

    volo create projectname requirejs/example-multipage

Otherwise,
[download latest zipball of master](https://github.com/requirejs/example-multipage/zipball/master).

## Project layout

This project has the following layout:

* tools: The requirejs optimizer, **r.js**, and the optimizer config,
**build.js.**
* **www**: The code that runs in the browser while in development mode.
* **www-built**: Generated after an optimizer build. Contains the built code
that can be deployed to the live site.

This **www** has the following layout:


* **page1.html**: page 1 of the app.
* **page2.html**: page 2 of the app.
* **js**
    * app: the directory to store app-specific modules.
    * **lib**: the directory to hold third party modules, like jQuery.
    * **common.js**: contains the requirejs config, and it will be the build
    target for the set of common modules.
    * **page1.js**: used for the data-main for page1.html. Loads the common
    module, then loads **app/main1**, the main module for page 1.
    * **page2.js**: used for the data-main for page2.html. Loads the common
    module, then loads **app/main2**, the main module for page 2.

To optimize, run:

    node tools/r.js -o tools/build.js

That build command creates an optimized version of the project in a
**www-built** directory. The **js/common.js** file will contain all the common
modules. **js/page1.js** will contain the page1-specific modules,
**js/page2.js** will contain the page2-specific modules.

## Building up the common layer

As you do builds and see in the build output that each page is including the
same module, add it to common's "include" array in **tools/build.js**.

It is better to add these common modules to the **tools/build.js** config
instead of doing a require([]) call for them in **js/common.js**. Modules that
are not explicitly required at runtime are not executed when added to common.js
via the include build option. So by using **tools/build.js**, you can include
common modules that may be in 2-3 pages but not all pages. For pages that do
not need a particular common module, it will not be executed. If you put in a
require() call for it in **js/common.js**, then it will always be executed.

## More info

For more information on the optimizer:
http://requirejs.org/docs/optimization.html

For more information on using requirejs:
http://requirejs.org/docs/api.html
