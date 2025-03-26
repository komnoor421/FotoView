$(function () {

  const _root = "https://jsonplaceholder.typicode.com/";
  const _placeholderImgHostname = 'placehold.co'
  let _initialView = true;

  /* USER PAGE FUNCTIONS */

  //User view definition
  function userView(initialView){
    //show user view
    $('#UserContainer').show();
    if(initialView){
      var $users = $('#users');
      $.ajax({
        type: 'GET',
        url: _root + "users",
        success: function(users) {
          console.log("Users API Connection Successful :)");
          $.each(users, function(i, user) {
            //Creates list of user buttons & storing userid in data attribute of each element
            $users.append('<button type="button" data-userid="' + user.id + '" class="userButton btn btn-default btn-block">' + user.name + '</button>');
          });
        },
        error: function(){
          alert("Error loading Users :(");
        }
      });
    }
    //hide other views
    $('#AlbumContainer').hide();
    $('#PhotoContainer').hide();
    console.log("User View loaded!")
  }

  //Initializing list of users on pageload
  userView(_initialView);

  //When user button clicked, initiates Albums View
  $('#users').on('click', '.userButton', function () {
    //retrieves userid from data attr
    var userID = $(this).data("userid");
    console.log("Clicked on User ID: " + userID);
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
          console.log("Album API Connection Successful :)");
          displayAlbums(userID, albums);
        },
        error: function(){
          alert("Error loading Albums :(");
        }
      });
    }
    //hide other views
    $('#UserContainer').hide();
    $('#PhotoContainer').hide();
    console.log("Album View Loaded! Showing albums from User ID: " + userID);
  }

  //album sorting function
  function sortAlbums(){
    $('#albums .albumTile').sort(function (a,b) {
      return parseInt(a.dataset.albumid) - parseInt(b.dataset.albumid)
    }).appendTo('#albums');
  }

  //Accessing photos api for each album thumbnail
  function displayAlbums(userID, albums) {
    var $albumsDiv = $('#albums');
    $.each(albums, function(i, album){
      $.ajax({
        type: 'GET',
        datatype: 'json',
        url: _root + "photos?albumId=" + album.id,
        success: function(photos) {
          //retreiving thumbnail from first photo in album
          const albumThumbSrc = parsePhotoUrl(photos[0].thumbnailUrl, album.id);
          $albumsDiv.append('<img class="albumTile" data-userid="' + userID + '" data-albumid="' + album.id + '" src="' + albumThumbSrc + '">');
          //sorts albums in order by albumid data attribute while building DOM
          sortAlbums();
        },
        error: function(){
          alert("Error loading photos for album thumbnail :(");
        }
      });
    });
  }

  //When album clicked, initiates Photos view
  $('#albums').on('click', '.albumTile', function() {
    var $this = $(this);
    var albumID = $this.data("albumid")
    var userID = $this.data("userid");
    console.log("Clicked on Album ID: " + albumID + " from User ID: " + userID);
    photoView(albumID, userID);
  });

  //Event handler for back button on albums view
  $('.userBack').click(function() {
    console.log("Went back to Users View <<");
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
        console.log("Photos API Connection Successful :)");
        $.each(photos, function(i, photo) {
          const photoUrl = parsePhotoUrl(photo.thumbnailUrl, photo.id);
          $photos.append('<a href="' + photo.url + '" class="photoLink" data-photoid="' + photo.id + '" data-lightbox="gallery" data-title="' + photo.title + '"><img class="photoTile" src="' + photoUrl + '"></a>');
        });
      },
      error: function(){
        alert("Error loading Photos :(");
      }
    });
    //store userID in view
    $('#PhotoContainer').data("userid", userID);
    $('#AlbumContainer').hide();
    console.log("Photo View Loaded! Showing photos from Album ID: " + albumID + " from User ID: " + userID);
  }

  //logging when photo clicked
  $('#photos').on('click', '.photoLink', function () {
    console.log("Clicked on Photo ID: " + $(this).data("photoid"));
  });

  //event handler for back button on photos view
  $('.albumBack').click(function() {
    console.log("Went back to Albums View <<");
    var userID = $('#PhotoContainer').data("userid");
    _initialView = false;
    albumView(userID, _initialView);
  });

  function parsePhotoUrl(photoURL, id) {
    const url = new URL(photoURL);
    url.hostname = _placeholderImgHostname;
    url.pathname += '/white';
    const params = new URLSearchParams(url.search);
    params.set('text', `${id}`);
    url.search = params.toString();
    return url.href;
  }
});
