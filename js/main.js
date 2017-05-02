$(function () {

  var _root = "http://jsonplaceholder.typicode.com/";
  var _initialView = true;

  function userView(initialView){
    $('#UserContainer').show();

    if(initialView){
      //$('.userButton').remove();
      var $users = $('#users');
      $.ajax({
        type: 'GET',
        url: _root + "users",
        success: function(users) {
          console.log("Users Connection Successful");
          $.each(users, function(i, user) {
            $users.append('<button type="button" name="' + user.id + '" class="userButton btn btn-default btn-block">' + user.name + '</button>');
          });
        }
      });
    }

    $('#AlbumContainer').hide();
    $('#PhotoContainer').hide();
  }

  userView(_initialView);

  $('#users').on('click', '.userButton', function () {
    var $this = $(this);
    //console.log($this.attr('name'));
    var userID = getUserId($this);
    //console.log(userID);
    _initialView = true;
    albumView(userID, _initialView);
  });

  function getUserId(user){
    return user.attr('name');
  }

  function albumView(userID, initialView) {
    $('#AlbumContainer').show();

    if (initialView) {
      $('.albumTile').remove();
      //var $albums = $('#albums');
      $.ajax({
        type: 'GET',
        datatype: 'json',
        url: _root + "albums?userId=" + userID,
        success: function(albums) {
          console.log("Album Connection Successful");
          displayAlbums(albums);
        }
      });
      $('#AlbumContainer').data("userid", userID);
    }

    $('#UserContainer').hide();
    $('#PhotoContainer').hide();
  }

  function displayAlbums(albums) {
    var $albumsDiv = $('#albums');
    $.each(albums, function(i, album){
      $.ajax({
        type: 'GET',
        datatype: 'json',
        async: false,
        url: _root + "photos?albumId=" + album.id,
        success: function(photos) {
          //console.log(photos[0]);
          var albumThumbSrc = photos[0].thumbnailUrl;
          $albumsDiv.append('<img class="albumTile album_' + album.id + '" src="' + albumThumbSrc + '">');
        }
      });
    });
  }

  $('#albums').on('click', '.albumTile', function() {
    var $this = $(this);
    var albumID = getAlbumId($this);
    //console.log(albumID);
    var userID = $('#AlbumContainer').data("userid");
    photoView(albumID, userID);
  });

  function getAlbumId(album) {
    var albumID = album.attr('class');
    albumID = albumID.split('_');
    return albumID[1];
  }

  $('.userBack').click(function() {
    _initialView = false;
    userView(_initialView);
  });

  function photoView(albumID, userID) {
    $('#PhotoContainer').show();
    $('.photoTile').remove();
    var $photos = $('#photos');
    $.ajax({
      type: 'GET',
      url: _root + "photos?albumId=" + albumID,
      success: function(photos) {
        console.log("Photos Connection Successful");
        $.each(photos, function(i, photo) {
          console.log(photo);
          $photos.append('<img class="photoTile photo_' + photo.id + '" src="' + photo.thumbnailUrl + '">');
        });
      }
    });

    $('#PhotoContainer').data("userid", userID);
    $('#AlbumContainer').hide();
  }

  $('.albumBack').click(function() {
    var userID = $('#PhotoContainer').data("userid");
    _initialView = false;
    albumView(userID, _initialView);
  });



});
