$(function () {

  var root = "http://jsonplaceholder.typicode.com/";

  var $users = $('#users');

  $.ajax({
    type: 'GET',
    url: root + "users",
    success: function(users) {
      $.each(users, function(i, user) {
        $users.append('<li>'+ user.name + '</li>');
      });
    }
  });

});
