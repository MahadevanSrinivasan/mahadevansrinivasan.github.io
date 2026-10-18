var session = null;
var increment = 0;
var progress = 0;
var currentMediaSession;

document.addEventListener('DOMContentLoaded', function () {
  var progressEl = document.getElementById('progress');
  if (progressEl) {
    progressEl.addEventListener('mouseup', seekMedia);
    progressEl.addEventListener('mouseenter', showTime);
    progressEl.addEventListener('mouseleave', hideTime);
  }

  var castBtn = document.getElementById('castme');
  if (castBtn) {
    castBtn.addEventListener('click', launchApp);
  }

  var stopBtn = document.getElementById('stop');
  if (stopBtn) {
    stopBtn.addEventListener('click', stopApp);
  }

  var playBtn = document.getElementById('play');
  if (playBtn) {
    playBtn.addEventListener('click', function () {
      if (!session || !currentMediaSession) {
        return;
      }
      currentMediaSession.play(null, playSuccess, playPauseFailure);
    });
  }

  var pauseBtn = document.getElementById('pause');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', function () {
      if (!session || !currentMediaSession) {
        return;
      }
      currentMediaSession.pause(null, pauseSuccess, playPauseFailure);
    });
  }

  var loadCastInterval = setInterval(function () {
    if (window.chrome && chrome.cast && chrome.cast.isAvailable) {
      console.log('Cast has loaded.');
      clearInterval(loadCastInterval);
      initializeCastApi();
    } else {
      console.log('Unavailable');
    }
  }, 1000);
});

function initializeCastApi() {
  var applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
  var sessionRequest = new chrome.cast.SessionRequest(applicationID);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
  chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
}

function sessionListener(e) {
  session = e;
  console.log('New session');
  if (session.media.length !== 0) {
    console.log('Found ' + session.media.length + ' sessions.');
  }
}

function receiverListener(e) {
  if (e === 'available') {
    console.log('Chromecast was found on the network.');
    launchApp();
  } else {
    console.log('There are no Chromecasts available.');
  }
}

function onInitSuccess() {
  console.log('Initialization succeeded');
}

function onInitError() {
  console.log('Initialization failed');
}

function pauseSuccess() {
  console.log('Pause Success');
  var pauseBtn = document.getElementById('pause');
  var playBtn = document.getElementById('play');
  if (pauseBtn) {
    pauseBtn.classList.add('hidden');
  }
  if (playBtn) {
    playBtn.classList.remove('hidden');
  }
  increment = 0;
}

function playPauseFailure() {
  console.log('Pause Failure');
}

function playSuccess() {
  console.log('Play Success');
  var playBtn = document.getElementById('play');
  var pauseBtn = document.getElementById('pause');
  if (playBtn) {
    playBtn.classList.add('hidden');
  }
  if (pauseBtn) {
    pauseBtn.classList.remove('hidden');
  }
  if (currentMediaSession && currentMediaSession.media && currentMediaSession.media.duration) {
    var tt = currentMediaSession.media.duration;
    increment = (1 / tt) * 100;
  }
}

function launchApp() {
  console.log('Launching the Chromecast App...');
  chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}

function onLaunchError() {
  console.log('Error connecting to the Chromecast.');
}

function onRequestSessionSuccess(e) {
  console.log('Successfully created session: ' + e.sessionId);
  session = e;
  loadMedia();
}

function loadMedia() {
  if (!session) {
    console.log('No session.');
    return;
  }

  var targetLink = (typeof videoLink !== 'undefined') ? videoLink : '';
  var mediaInfo = new chrome.cast.media.MediaInfo(targetLink);
  mediaInfo.contentType = 'video/mp4';

  var request = new chrome.cast.media.LoadRequest(mediaInfo);
  request.autoplay = true;

  session.loadMedia(request, onLoadSuccess, onLoadError);
}

function onLoadSuccess(mediaSession) {
  console.log('Successfully loaded.');
  currentMediaSession = mediaSession;
  playSuccess();
  mediaSession.addUpdateListener(onMediaStatusUpdate);
  var tt = mediaSession.media.duration;
  increment = (1 / tt) * 100;
  console.log(increment, mediaSession.media.duration);
  updateProgressBar();
}

function updateProgressBar() {
  var progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = progress + '%';
  }
  var timeLeftInSecs = progress / increment;
  var hours = Math.floor(timeLeftInSecs / 3600);
  var minutes = Math.floor(timeLeftInSecs / 60);
  var seconds = timeLeftInSecs - hours * 3600 - minutes * 60;
  var timeLeftEl = document.getElementById('timeleft');
  if (timeLeftEl) {
    if (!isNaN(timeLeftInSecs)) {
      timeLeftEl.innerHTML = ((hours < 10) ? ('0' + hours) : hours) + ':' + ((minutes < 10) ? ('0' + minutes) : minutes) + ':' + ((seconds < 10) ? ('0' + seconds.toFixed(3)) : seconds.toFixed(3));
    } else {
      timeLeftEl.innerHTML = '00:00:00.000';
    }
  }
  if (progress < 100 && increment !== 0) {
    progress = progress + increment;
    setTimeout(updateProgressBar, 1000);
  }
}

function onMediaStatusUpdate(e) {
  if (e === false) {
    progress = 0;
    increment = 0;
  } else if (currentMediaSession && currentMediaSession.media) {
    console.log('Updating Media');
    progress = (currentMediaSession.currentTime / currentMediaSession.media.duration);
    console.log(currentMediaSession.currentTime, currentMediaSession.media.duration);
  }
}

function onLoadError() {
  console.log('Failed to load.');
}

function stopApp() {
  if (session) {
    session.stop(onStopAppSuccess, onStopAppError);
  }
  progress = 0;
  increment = 0;
}

function onStopAppSuccess() {
  console.log('Successfully stopped app.');
}

function onStopAppError() {
  console.log('Error stopping app.');
}

function seekMedia(event) {
  var progressEl = document.getElementById('progress');
  if (!progressEl || !currentMediaSession || !currentMediaSession.media) {
    return;
  }
  var pos = parseInt(event.offsetX, 10);
  var total = progressEl.clientWidth;
  console.log(pos / total);
  var request = new chrome.cast.media.SeekRequest();
  var seekTime = (pos / total) * currentMediaSession.media.duration;
  request.currentTime = seekTime;
  currentMediaSession.seek(request, function () { onSeekSuccess(seekTime); }, onSeekError);
}

function showTime(event) {
  var progressEl = document.getElementById('progress');
  if (!progressEl || !currentMediaSession || !currentMediaSession.media) {
    return;
  }
  var pos = parseInt(event.offsetX, 10);
  var total = progressEl.clientWidth;
  console.log(pos / total);
  var timeLeftInSecs = (pos / total) * currentMediaSession.media.duration;
  var hours = Math.floor(timeLeftInSecs / 3600);
  var minutes = Math.floor(timeLeftInSecs / 60);
  var seconds = timeLeftInSecs - hours * 3600 - minutes * 60;
  var hoverTimeEl = document.getElementById('hoverTime');
  if (hoverTimeEl) {
    if (!isNaN(timeLeftInSecs)) {
      hoverTimeEl.innerHTML = ((hours < 10) ? ('0' + hours) : hours) + ':' + ((minutes < 10) ? ('0' + minutes) : minutes) + ':' + ((seconds < 10) ? ('0' + seconds.toFixed(3)) : seconds.toFixed(3));
    }
  }
}

function hideTime() {
  var hoverTimeEl = document.getElementById('hoverTime');
  if (hoverTimeEl) {
    hoverTimeEl.innerHTML = '00:00:00.000';
  }
}

function onSeekSuccess(currTime) {
  if (currentMediaSession && currentMediaSession.media) {
    progress = currTime / currentMediaSession.media.duration;
  }
  console.log('Seek success');
}

function onSeekError() {
  console.log('Seek Failure');
}
