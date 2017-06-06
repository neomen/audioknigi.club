var clickInterval = 400;
var clickCounter = 0;
var timer = null;
var status = 'pause';
var tab = null;
var bkg = chrome.extension.getBackgroundPage();
var oldStatus = status;
//set badge color
chrome.browserAction.setBadgeBackgroundColor({
  color: [0, 0, 0, 255]
});
function updateStatus(newStatus) {
  if (status != newStatus) {
    oldStatus = status;
    status = newStatus;
    switch (status) {
      case 'start':
        chrome.browserAction.setIcon({path: "img/icon.png"});
        chrome.browserAction.setBadgeText({text: ""});
        break;
      case 'play':
        //chrome.browserAction.setIcon({path: "img/play.png"});
        chrome.browserAction.setBadgeText({text: "▶"});
        break;
      case 'pause':
        //chrome.browserAction.setIcon({path: "img/pause.png"});
        chrome.browserAction.setBadgeText({text: "◼"});
        break;
      case 'prev':
        //chrome.browserAction.setIcon({path: "img/pause.png"});
        chrome.browserAction.setBadgeText({text: "◀◀"});
        break;
      case 'next':
        //chrome.browserAction.setIcon({path: "img/pause.png"});
        chrome.browserAction.setBadgeText({text: "▶▶"});
        break;
      default:
        chrome.browserAction.setIcon({path: "img/icon.png"});
        chrome.browserAction.setBadgeText({text: ""});
        break;
    }
  }
}

function getACUrl() {
  return 'https://audioknigi.club/';
}

function isACUrl(url) {
  var ymUrl = getACUrl();
  return url.indexOf(ymUrl) == 0;
}

function openACInNewTab() {
  chrome.tabs.create({"url": getACUrl()});
}

function runScriptOnACTab(scriptFile) {
  chrome.tabs.getAllInWindow(undefined, function(tabs) {
    var foundKey = false;
    for (var i = 0, tab; tab = tabs[i]; i++) {
      if (tab.url && isACUrl(tab.url)) {
        chrome.tabs.executeScript(tab.id, {"file": scriptFile});
        foundKey = true;
        break;
      }
    }
    if (!foundKey)
      openACInNewTab();
    }
  );
}
//paly of pause
function playOrPause() {
  if (status == "pause") {
    runScriptOnACTab("js/play.js");
  } else {
    runScriptOnACTab("js/pause.js");
  }
}

function previous() {
  runScriptOnACTab("libs/jquery-3.1.0.min.js");
  runScriptOnACTab("js/prev.js");
}

function next() {
  runScriptOnACTab("libs/jquery-3.1.0.min.js");
  runScriptOnACTab("js/next.js");
}

function clickHandler() {
  clickCounter += 1;
  clearTimeout(timer);
  timer = setTimeout(clickTimeout, clickInterval);
}

function clickTimeout() {
  switch (clickCounter) {
    case 3:
      previous();
      break;
    case 2:
      next();
      break;
    case 1:
      playOrPause();
      break;
    default:
      // more then three
      previous();
      break;
  }
  clickCounter = 0;
}

chrome.browserAction.onClicked.addListener(function(tab) {
  clickHandler();
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  updateStatus(request);
});
