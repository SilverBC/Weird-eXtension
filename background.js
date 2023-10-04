
chrome.runtime.onMessage.addListener((message, sender, reply) => {
    switch (message.action) {
        case "setVideoSpeed":
            chrome.scripting.executeScript({
                target: {tabId: message.tabId},  
                func: setVideoSpeed,
                args: [message.speed]
            }, () => reply({result: 'Speed set!'}));
            break;

        case "resetVideoSpeed":
            chrome.scripting.executeScript({
                target: {tabId: message.tabId},
                func: resetVideoSpeed
            }, () => reply({result: 'Speed reset!'}));
            break;

        case "downloadVideo":
            chrome.scripting.executeScript({
                target: {tabId: message.tabId},
                func: getVideoBlob
            }, ([result] = []) => {
                const blob = new Blob([result], {type: 'video/mp4'});  // Assuming mp4 format, you can refine this
                const url = URL.createObjectURL(blob);
                chrome.downloads.download({url: url, filename: 'downloaded_video.mp4'}, () => {
                    URL.revokeObjectURL(url);  // Cleanup blob URL
                    reply({result: 'Download initiated!'});
                });
            });
            break;

        default:
            reply({result: 'Unknown action!'});
    }

    return true;
});

// Functions to be injected
function setVideoSpeed(speed) {
    document.querySelector("video").playbackRate = speed;
}

function resetVideoSpeed() {
    document.querySelector("video").playbackRate = 1.0;
}

function getVideoBlob() {
    const videoUrl = document.querySelector("video").currentSrc;
    return fetch(videoUrl).then(response => response.blob());
}

let songPlaying = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);
    if (message.action === "startTimer") {
        startTimer(message.duration);
    }
});

function startTimer(duration) {
    console.log("Starting timer for duration:", duration);
    chrome.alarms.create("playSongAlarm", { delayInMinutes: duration / 60000 });
}

chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log("Alarm triggered:", alarm);
    if (alarm.name === "playSongAlarm") {
        notifyUserToPlaySong();
    }
});

function notifyUserToPlaySong() {
    console.log("Notifying user to play song");
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/Rob128.png',
        title: 'Timer Finished!',
        message: 'Click to play the song.'
    }, function (notificationId) {
        console.log("Notification shown:", notificationId);
    });
}

chrome.notifications.onClicked.addListener(function (notificationId) {
    console.log("Notification clicked:", notificationId);
    if (!songPlaying) {
        playSongInTab();
        notifyUserToStopSong();
    } else {
        stopSongInTab();
    }
    songPlaying = !songPlaying; // Toggle the songPlaying state
});

function playSongInTab() {
    console.log("Playing song in tab");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let currentTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            func: playAudio
        });
    });
}

function notifyUserToStopSong() {
    console.log("Notifying user to stop song");
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/Rob128.png',
        title: 'Song Playing!',
        message: 'Click to stop the song.'
    }, function (notificationId) {
        console.log("Notification shown:", notificationId);
    });
}

function stopSongInTab() {
    console.log("Stopping song in tab");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let currentTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: { tabId: currentTabId },
            func: stopAudio
        });
    });
}

function playAudio() {
    if (!window.myAudio) {
        window.myAudio = new Audio(chrome.runtime.getURL("songs/song.mp3"));
    }
    window.myAudio.play();
}

function stopAudio() {
    if (window.myAudio) {
        window.myAudio.pause();
        window.myAudio.currentTime = 0; // Optional: Reset song to the beginning
    }
}

