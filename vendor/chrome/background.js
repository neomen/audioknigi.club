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

function openACInNewTab() {
  chrome.tabs.create({ "url": getACUrl() });
}

function runScriptOnACTab(scriptFile) {
  chrome.tabs.query({}, function (tabs) {
    var ymUrl = getACUrl();
    var audioTab = tabs.filter(function (tab) {
      return tab.url.includes(ymUrl)
    });

    if (audioTab.length) {
      chrome.tabs.executeScript(audioTab[0].id, { "file": scriptFile });
    } else {
      openACInNewTab();
    }

    if (tab) {
      openACInNewTab();
    }
  });
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

chrome.browserAction.onClicked.addListener(function (tab) {
  clickHandler();
});

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
  updateStatus(request);
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'toggle-play') {
    clickHandler();
  }
});
