define([
    "jquery",
    "backbone"
  ],
  function ($, Backbone) {

  "use strict";

  var AppModel = Backbone.Model.extend({
    initialize: function() {
      this.following = null;
      this.followingTracks = {};
      this.queue = [];
    },
    connectApi: function() {
      var self = this;
      this._getFollowing(function(data){
        self.following = data;
        self._fillQueue();
      });
    },
    getTrackUrl: function() {
      var trackUrl = this.queue.shift();
      this._fillQueue();
      return trackUrl;
    },
    _fillQueue: function() {
      var self = this;
      if(this.queue.length < 5) {
        this._getRandomTrack(function(){
          self.trigger("trackReady");
          self._fillQueue();
        });
      }
    },
    _getRandomTrack: function(callback) {
      var self = this,
        randomUserIndex = Math.floor(Math.random() * (this.following.length - 1)),
        randomUser = this.following[randomUserIndex],
        randomUserId = randomUser.id,
        randomTrackIndex;

      if(this.followingTracks[randomUserId]) {
        randomTrackIndex = Math.floor(Math.random() * (this.followingTracks[randomUserId].length - 1));
        self.queue.push(this.followingTracks[randomUserId][randomTrackIndex].permalink_url);
        callback();
      } else {
        $.ajax({
          type: "GET",
          url: randomUser.uri+"/tracks?limit=200",
          dataType: "json",
          success: function (data) {
            self.followingTracks[randomUserId] = data;
            randomTrackIndex = Math.floor(Math.random() * (data.length - 1));
            self.queue.push(data[randomTrackIndex].permalink_url);
            callback();
          }
        });
      }
    },
    _getFollowing: function(callback) {
      $.ajax({
        type: "GET",
        url: "https://api.soundcloud.com/me/followings.json?limit=200",
        dataType: "json",
        success: function (data) {
          callback(data);
        },
        error: function() {
          console.log("error");
          console.dir(arguments);
        }
      });
    }
  });

  return AppModel;
});