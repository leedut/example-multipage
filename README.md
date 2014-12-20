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

对于上面两种看法，我的看法是全部交给子页面可能会出现jquery版本混乱、js代码和页面强耦合的问题，虽然用了require.js文件我们需要把一个文件拆分成很多个模块文件、文件数量增加，但是对于js文件的管理更加清晰、页面的加载量可以得到有效控制，何乐不为.

所以，如何优化require.js在多页面下的应用，解决上面提到的几个问题？这个项目给出了一些例子，还望能抛砖引玉，能帮助大家获得更多的使用姿势。

###解决办法
其实让layout页面或者模版页面不加载js文件是可行的（通用基础库及模版布局除外），将js加载交还给子页面来决定。所以在asp .net mvc中需要用`@render script{...}` 、在php中可能php页面里还是写了一堆script标签，这和我们最初的设想不一样，我们想的是如何仅通过require.js和入口文件进行js文件加载。

所以我们可以通过配置文件的方式，让子页面的入口js文件来决定其加载的文件。这样可以将后端逻辑代码和前端js加载代码分离，后端需要做的，只是在模型或者action方法里根据当前页面路由（例如AddUser、ListUser等）定义一个string，在模版引擎输出的时候虽然根据同一layout页面进行布局，但是根据路由定义的string就是这个子页面的入口文件。

    /*thinkphp的Admin下的action方法*/
    public function singleArtist(){
	    //...
	    $js_name = 'admin.singleartist'
	    $this->assign('js_name',$js_name);
	    $this->display();
	}
    /*模版页面底部*/
    ....-->
    <script type="text/javascript" src="js/require.js" data-main="js/{$js_name}.js" defer async="true" ></script>


而且这种方法还有一个好处就是分部视图的子视图中不出现任何script代码，也就是说子视图只负责html骨架，具体要加载什么js文件，不过问，交给路由了。以后js文件进行修改时，无需改动后端html或者php源码，只需改动几个静态的入口js文件即可，不用担心模块依赖和版本冲突。

原fork项目里的解决方案也是这个思路。所以梳理一下在处理多页面下的文件加载时，我们可以：
 * 模版页面内定义通用script标签，用于加载require.js和子页面入口文件
 * 子页面内无需写入script标签，而在子页面对应的model或action中定义主入口文件名称
 * 可以自定义一个config文件，用来加载最基础的依赖库和配置模块。子页面的入口文件里就无需二次定义jquery、zepto这些类库了。


 

    /*config.js示例*/
     require.config({
         paths: {
    	     "jquery": "js/jquery.min",
    	     "underscore": "js/underscore.min",
    	     "backbone": "js/backbone.min"
    	},
    	shim: {
    		'underscore':{
    			exports: '_'
    		},
    		'backbone': {
    			deps: ['underscore', 'jquery'],
    				exports: 'Backbone'
    			}
    	}
    });

所以简单写了两个版本：asp .net mvc 和 thinkphp版本的，不是完整的运行文件，就是给各位提供一下解决思路吧。


###进一步优化
可以利用require.js所提供的node环境下的r.js合并子页面所需的小文件，具体请移步[r.js](https://github.com/jrburke/r.js)。
	



