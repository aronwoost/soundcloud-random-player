require.config({
  paths:{
    jquery: "vendor/jquery-1.10.1",
    underscore: "vendor/underscore-1.4.4",
    backbone: "vendor/backbone.1.0.0-master-fd0cb9695d"
  },

  shim:{
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    }
  }
});

require(
  [
    "jquery",
    "app_view",
    "app_model"
  ],
  function ($, AppView, AppModel) {

    "use strict";

    var appModel = new AppModel(),
      appView = new AppView({model:appModel}),
      auth = JSON.parse(localStorage.getItem("sc-random-player:auth"));

    if(auth) {
      $.ajaxSetup({
        beforeSend: function(xhr, settings){
          if(settings.url.indexOf("?") !== -1){
            settings.url += "&oauth_token=" + auth.accessToken;
          } else {
            settings.url += "?oauth_token=" + auth.accessToken;
          }
        }
      });

      appModel.connectApi();
    } else {
      appView.showConnectBtn();
    }

  }
);