;( function( $ ) {
  var current = $('.jp-playlist-current');
  var next = $(current).next();
  var link = next.find('.jp-playlist-item');
  if(link.length > 0){
    link[0].click();
  }
  chrome.extension.sendMessage("next");

  setTimeout(function() {
    if( $(".jp-state-playing").length > 0 ){
      chrome.extension.sendMessage("play");
    }else{
      chrome.extension.sendMessage("pause");
    }
  }, 1000);

} ( jQuery, window, document ) );
