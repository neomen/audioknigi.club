;( function( $ ) {
  $( ".jp-audio .controls .play" ).on( "click", function() {
    chrome.extension.sendMessage("play");
  });
  $( ".jp-audio .controls .pause" ).on( "click", function() {
    chrome.extension.sendMessage("pause");
  });
chrome.extension.sendMessage("start");
} ( jQuery, window, document ) );
