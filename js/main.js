$(function () {

  var _root = "http://jsonplaceholder.typicode.com/";
  var _initialView = true;

  /* USER PAGE FUNCTIONS */

  //User view definition
  function userView(initialView){
    $('#UserContainer').show();
    if(initialView){
      var $users = $('#users');
      $.ajax({
        type: 'GET',
        url: _root + "users",
        success: function(users) {
          console.log("Users Connection Successful");
          $.each(users, function(i, user) {
            //Creates list of user buttons & storing userid in data attribute of each element
            $users.append('<button type="button" data-userid="' + user.id + '" class="userButton btn btn-default btn-block">' + user.name + '</button>');
          });
        }
      });
    }
    //hide other views
    $('#AlbumContainer').hide();
    $('#PhotoContainer').hide();
  }

  //Initializing list of users on pageload
  userView(_initialView);

  //When user button clicked, initiates Albums View
  $('#users').on('click', '.userButton', function () {
    //retrieves userid from data attr
    var userID = $(this).data("userid");
    _initialView = true;
    albumView(userID, _initialView);
  });

  ///* ALBUM PAGE FUNCTIONS *///

  //Album View definition
  function albumView(userID, initialView) {
    //show album view
    $('#AlbumContainer').show();
    if (initialView) {
      $('.albumTile').remove();
      //accessing albums api for albums with userID parameter
      $.ajax({
        type: 'GET',
        datatype: 'json',
        url: _root + "albums?userId=" + userID,
        success: function(albums) {
          console.log("Album Connection Successful");
          displayAlbums(userID, albums);
        }
      });
      //store userID in view
      $('#AlbumContainer').data("userid", userID);
    }
    //hide other views
    $('#UserContainer').hide();
    $('#PhotoContainer').hide();
  }

  //Accessing photos api for each album thumbnail
  function displayAlbums(userID, albums) {
    var $albumsDiv = $('#albums');
    $.each(albums, function(i, album){
      $.ajax({
        type: 'GET',
        datatype: 'json',
        async: false,
        url: _root + "photos?albumId=" + album.id,
        success: function(photos) {
          //retreiving thumbnail from first photo in album
          var albumThumbSrc = photos[0].thumbnailUrl;
          $albumsDiv.append('<img class="albumTile" data-userid="' + userID + '" data-albumid="' + album.id + '" src="' + albumThumbSrc + '">');
        }
      });
    });
  }

  //When album clicked, initiates Photos view
  $('#albums').on('click', '.albumTile', function() {
    var $this = $(this);
    var albumID = $this.data("albumid")
    var userID = $this.data("userid");
    photoView(albumID, userID);
  });

  //Event handler for back button on albums view
  $('.userBack').click(function() {
    _initialView = false;
    userView(_initialView);
  });

  ///* PHOTO PAGE FUNCTIONS *///

  //Photo View definition
  function photoView(albumID, userID) {
    $('#PhotoContainer').show();
    $('.photoLink').remove();
    var $photos = $('#photos');
    //accessing photos api for photos in album with albumID parameter
    $.ajax({
      type: 'GET',
      url: _root + "photos?albumId=" + albumID,
      success: function(photos) {
        console.log("Photos Connection Successful");
        $.each(photos, function(i, photo) {
          $photos.append('<a href="' + photo.url + '" class="photoLink" data-lightbox="gallery" data-title="' + photo.title + '"><img class="photoTile photo_' + photo.id + '" src="' + photo.thumbnailUrl + '"></a>');
        });
      }
    });
    //store userID in view
    $('#PhotoContainer').data("userid", userID);
    $('#AlbumContainer').hide();
  }

  //event handler for back button on photos view
  $('.albumBack').click(function() {
    var userID = $('#PhotoContainer').data("userid");
    _initialView = false;
    albumView(userID, _initialView);
  });
});
