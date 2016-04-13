(function() {
  'use strict';

  var userToken;

  var userData = JSON.parse(localStorage.getItem('userData'));
  if(!userData) {
    userData = [];
  }
  userData.forEach ( function (user) {
    $('#contributors ul')
    .append( $('<li>').text(user.userName)
    .append( $('<img>').attr('src', user.userAvatar))
  );
});

$('#search').submit(function(event) {
  event.preventDefault();
  userToken = $('#api-key').val();
  selectRepos();
});

function selectRepos(){
  localStorage.setItem( 'userToken', userToken );
  console.log(userToken);
  getRepos( $('#query').val() , userToken)
  .then( repoDataDone )
  .then( getRandomCommit )
  .fail(function repoDataFailed(xhr){
    console.warn (xhr);
    $('#contributors').append( 'Ajax failure: ' + xhr.status );
  });
}

function getRandomRepo( data ) {
  var randomRepo = Math.floor (Math.random() * data.items.length);
  var repo = data.items[randomRepo];
  console.log(repo);
  return repo;
}

function getRandomCommit( data ){
  console.log(data);
  var randomCommit = Math.floor (Math.random() * data.length);
  var commit = data[randomCommit];
  console.log(randomCommit);
  var userName = commit.author.login;
  var userAvatar = commit.author.avatar_url;
  console.log(userName);
  console.log(userAvatar);
  localData( userName, userAvatar );
  return renderData(commit);
}

function repoDataDone ( data ){
  var repo = getRandomRepo( data );
  return getCommits(repo);
}

function renderData ( commit ){
  $('#contributors ul')
  .append( $('<li>').text('User: ' + commit.author.login + ' ')
  .append( $('<img>').attr('src', commit.author.avatar_url))
);
}

function localData (userName, userAvatar) {
  var user  = {
    userName: userName,
    userAvatar: userAvatar,
  };
  userData.push(user);
  localStorage.setItem( 'userData', JSON.stringify (userData));
}

function getRepos( url, token ){
  return $.ajax({
    type: 'GET',
    url: 'https://api.github.com/search/repositories?q=' + url,
    dataType: 'json',
    headers: {
      Authorization: "token " + localStorage.getItem('userToken')
    }
  });
}

function getCommits(repo){
  return $.ajax({
    type: 'GET',
    url: 'https://api.github.com/repos/' + repo.full_name + '/commits',
    dataType: 'json',
    headers: {
      Authorization: "token " + localStorage.getItem('userToken')
    }
  });
}

}());
