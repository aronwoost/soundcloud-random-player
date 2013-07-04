/*global SC:false */

define([
    "jquery",
    "backbone",
    "underscore"
  ],
  function ($, Backbone, _) {

  "use strict";

  var AppView = Backbone.View.extend({
    el:$("body"),
    initialize: function() {
      this.model.on("trackReady", this.playTrack, this);

      this.widget = null;

      var self = this;

      this.$el.find("#auth").click(function(evt) {
        evt.preventDefault();

        var clientId = "a0c9a45ed8a411e057c6e06e20125b28",
          redirectUri = "http://testapp.dev/auth.html",
          reqUrl = "https://api.soundcloud.com/connect?scope=non-expiring&redirect_uri="+redirectUri+"&response_type=token&client_id="+clientId;

        window.location = reqUrl;
      });

      this.$el.find("#next").click(function(evt) {
        evt.preventDefault();

        self.playTrack();
      });
    },
    playTrack: function() {
      var self = this;

      this.model.off("trackReady", this.playTrack, this);

      this.$el.find("#auth").hide();
      this.$el.find("#next").show();

      if(this.widget) {
        this.widget.load(this.model.getTrackUrl(), {auto_play: true});
      } else {
        var trackUrl = this.model.getTrackUrl();

        require(
          [
            "http://connect.soundcloud.com/sdk.js",
            "https://w.soundcloud.com/player/api.js"
          ],
          function () {
            SC.oEmbed(trackUrl, {auto_play: true}, function(oEmbed) {
              self.$el.find("#player").html(oEmbed.html);
              self.widget = SC.Widget(document.querySelector('iframe'));
              self.widget.bind(SC.Widget.Events.FINISH, function(){
                self.playTrack();
              });
            });
          }
        );


      }
    },
    showConnectBtn: function() {
      this.$el.find("#auth").removeAttr('disabled');
      this.$el.find("#auth").html("Connect with <strong>SoundCloud</strong>");
    }
  });

  return AppView;
});