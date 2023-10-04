//injecting coloBlindess
function injectScript() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let currentTabId = tabs[0].id;
      chrome.scripting.executeScript({
          target: {tabId: currentTabId},
          files: ['colorBlindness.js']
      });
  });
}
injectScript();


//navigation buttons From/To main page
document.getElementById('btnVideoControl').addEventListener('click', function() {
  document.getElementById('videoControlSection').style.display = 'block';
  document.querySelector('.grid-container').style.display = 'none';
});
document.getElementById('btnColorAdjustment').addEventListener('click', function() {
  document.getElementById('colorAdjustmentSection').style.display = 'block';
  document.querySelector('.grid-container').style.display = 'none';
});
document.getElementById('btnTimers').addEventListener('click', function() {
  document.getElementById('timerSection').style.display = 'block';
  document.querySelector('.grid-container').style.display = 'none';
});
document.getElementById('btnBackToMain').addEventListener('click', function() {
  document.querySelector('.grid-container').style.display = 'block';
  document.getElementById('videoControlSection').style.display = 'none';
});
document.getElementById('btnBackToMainFromColor').addEventListener('click', function() {
  document.getElementById('colorAdjustmentSection').style.display = 'none';
  document.querySelector('.grid-container').style.display = 'block';
});
document.getElementById('btnBackToMainFromTimer').addEventListener('click', function() {
  document.getElementById('timerSection').style.display = 'none';
  document.querySelector('.grid-container').style.display = 'block';
});





//video manipulation buttons
document.getElementById('btnReset').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let currentTabId = tabs[0].id;
    chrome.runtime.sendMessage({action: 'resetVideoSpeed', tabId: currentTabId}, function(response) {
      //console.log(response.result);
    });
  });
});
document.getElementById('btnSetSpeed').addEventListener('click', function() {
  let speed = parseFloat(document.getElementById('inputSpeed').value) / 100;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let currentTabId = tabs[0].id;
      chrome.runtime.sendMessage({action: 'setVideoSpeed', speed: speed, tabId: currentTabId}, function(response) {
          //console.log(response.result);
      });
  });
});
document.getElementById('btnDownloadVideo').addEventListener('click', function() {
  chrome.runtime.sendMessage({action: 'downloadVideo'}, function(response) {
      //Sadly this was too much trouble
  });
});


//color manipulation buttons
function sendMessage(action) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let currentTabId = tabs[0].id;
      chrome.tabs.sendMessage(currentTabId, {action: action});
  });
}
document.getElementById('btnMonochrome').addEventListener('click', function() {
  sendMessage("toggleMonochrome");
});
document.getElementById('btnBlindness').addEventListener('click', function() {
  sendMessage("toggleBlindness");
});
document.getElementById('btnRedBlind').addEventListener('click', function() {
  sendMessage("toggleProtanopia");
});
document.getElementById('btnGreenBlind').addEventListener('click', function() {
  sendMessage("toggleDeuteranopia");
});
document.getElementById('btnBlueBlind').addEventListener('click', function() {
  sendMessage("toggleTritanopia");
});


//timer elements
document.getElementById('setTimer').addEventListener('click', function() {
  let timerValue = document.getElementById('timerInput').value;
  console.log("Timer Value:", timerValue); // New log
  
  if (!/^\d+$/.test(timerValue)) {
      alert("Invalid input! Please enter only digits.");
      return;
  }
  while (timerValue.length < 6) {
      timerValue = "0" + timerValue;
  }
  const hours = parseInt(timerValue.substring(0, 2), 10);
  const minutes = parseInt(timerValue.substring(2, 4), 10);
  const seconds = parseInt(timerValue.substring(4, 6), 10);

  const totalMilliseconds = ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000;
  console.log("Total Milliseconds:", totalMilliseconds); // New log

  chrome.runtime.sendMessage({action: "startTimer", duration: totalMilliseconds});
});
