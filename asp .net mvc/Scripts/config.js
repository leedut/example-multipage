//require config配置
//设定路径或者初始化模块
requirejs.config({
    baseUrl:'../Scripts/lib',
    paths: {
        "jquery": "jquery.min",
        "underscore": "underscore.min",
        "backbone": "backbone.min"
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