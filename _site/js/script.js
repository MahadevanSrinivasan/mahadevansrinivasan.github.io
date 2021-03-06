var session = null;
var increment = 0;
var progress = 0;
var currentMediaSession;

$( document ).ready(function(){
  document.getElementById("progress").addEventListener('mouseup', seekMedia);
  var loadCastInterval = setInterval(function(){
    if (chrome.cast.isAvailable) 
    {
      console.log('Cast has loaded.');
      clearInterval(loadCastInterval);
      initializeCastApi();
    } 
    else 
    {
      console.log('Unavailable');
    }
  }, 1000);
});


function initializeCastApi() 
{
  var applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
  var sessionRequest = new chrome.cast.SessionRequest(applicationID);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
  chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
}

function sessionListener(e) 
{
  session = e;
  console.log('New session');
  if (session.media.length !== 0) 
  {
    console.log('Found ' + session.media.length + ' sessions.');
  }
}

function receiverListener(e) {
  if( e == 'available' ) 
  {
    console.log("Chromecast was found on the network.");
    launchApp();
  }
  else 
  {
    console.log("There are no Chromecasts available.");
  }
}

function onInitSuccess() 
{
  console.log("Initialization succeeded");
}

function onInitError() 
{
  console.log("Initialization failed");
}

$('#castme').click(function()
{
  launchApp();
});


function launchApp() 
{
  console.log("Launching the Chromecast App...");
  chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}

function onRequestSessionSuccess(e) 
{
  console.log("Successfully created session: " + e.sessionId);
  session = e;
}

function onLaunchError() 
{
  console.log("Error connecting to the Chromecast.");
}

function onRequestSessionSuccess(e) 
{
  console.log("Successfully created session: " + e.sessionId);
  session = e;
  loadMedia();
}

function loadMedia() 
{
  if (!session) 
  {
    console.log("No session.");
    return;
  }

  var mediaInfo = new chrome.cast.media.MediaInfo(videoLink);
  mediaInfo.contentType = 'video/mp4';

  var request = new chrome.cast.media.LoadRequest(mediaInfo);
  request.autoplay = true;

  session.loadMedia(request, onLoadSuccess, onLoadError);
}

function onLoadSuccess(mediaSession) {
  console.log('Successfully loaded.');
  currentMediaSession = mediaSession;
  mediaSession.addUpdateListener(onMediaStatusUpdate);
  var tt = mediaSession.media.duration;
  increment = (1/tt)*100;
  console.log(increment, mediaSession.media.duration); 
  updateProgressBar();
}

function updateProgressBar()
{
  document.getElementById('progressBar').style.width= (progress) +'%';
  var timeLeftInSecs = progress/increment;
  var hours = Math.floor(timeLeftInSecs / 3600);
  var minutes = Math.floor(timeLeftInSecs / 60);
  var seconds = timeLeftInSecs - hours * 3600 - minutes * 60;
  if(!isNaN(timeLeftInSecs))
  {
    document.getElementById('timeleft').innerHTML = ((hours < 10) ? ('0' + hours) : hours) + ':' + ((minutes<10) ? ('0' + minutes) : minutes) + ':' + ((seconds<10) ? ('0'+seconds.toFixed(3)) : seconds.toFixed(3));
  }
  else
  {
    document.getElementById('timeleft').innerHTML = '00:00:00.000';
  }
  if(progress < 100 && increment !== 0)
  {
    progress = progress + increment;
    setTimeout(updateProgressBar,1000);
  }
}


function onMediaStatusUpdate(e)
{
  if(e === false)
  {
    progress = 0;
    increment = 0;
  }
  else
  {
    console.log("Updating Media");
    progress = (currentMediaSession.currentTime / currentMediaSession.media.duration);
    console.log(currentMediaSession.currentTime, currentMediaSession.media.duration);
  }
}

function onLoadError() {
  console.log('Failed to load.');
}

$('#stop').click(function(){
  stopApp();
});

function stopApp() {
  session.stop(onStopAppSuccess, onStopAppError);
  progress = 0;
  increment = 0;
}

function onStopAppSuccess() {
  console.log('Successfully stopped app.');
}

function onStopAppError() {
  console.log('Error stopping app.');
}

function seekMedia(event)
{
  var pos = parseInt(event.offsetX);
  var total = document.getElementById("progress").clientWidth;
  console.log(pos/total);
  var request = new chrome.cast.media.SeekRequest();
  request.currentTime = (pos/total)*currentMediaSession.media.duration;
  currentMediaSession.seek(request, onSeekSuccess(request.currentTime), onSeekError);
}

function onSeekSuccess(currTime)
{
  progress = currTime/currentMediaSession.media.duration;
  console.log("Seek success");
}


function onSeekError()
{
  console.log("Seek Failure");
}

