/*
define(['config','jquery','backbone'], function () {
	//直接加载 config,jquery,backbone哪个先加载结束不固定
    //但是config文件应该先于jquery,backbone后两者加载
    //所以会导致jquery,backbone对应模块文件找不到 因为二者在二级目录lib下
})  
    
通过在模块文件内部自定义模块，保证config文件的优先加载

*/

require(['../config'], function () {
    require(['page2.temp']);
})
,define("page2.temp", ['jquery','underscore'], function () {
	//main module code here
      
})