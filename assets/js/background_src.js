const ytdl = require('ytdl-core');
const streamToBlob = require('stream-to-blob');


chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
  // To Do: Add playlist support
  sendResponse('Started Download...');
  beginDownload(request.url, request.downloadType)
});
  
replaceSpecialChar = (str) => {
  return str.replace(/[ \':]/g, "_");
}

downloadAudio = (audioUrl) => {
  var stream = ytdl(audioUrl, { filter: 'audioonly'});
  stream.on('info', async (info) => {
      const title = replaceSpecialChar(info.videoDetails.title) + '.mp3';
      const stream = ytdl(audioUrl, { format: 'mp3', quality: 'highest' });
      const blob = await streamToBlob(stream, 'audio/mpeg')
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url, 
        filename: title
      });      
  });
}

downloadVideo = (videoUrl) => {
  var stream = ytdl(videoUrl);
  stream.on('info', async (info) => {
      const title = replaceSpecialChar(info.videoDetails.title) + '.mp4';
      const stream = ytdl(videoUrl, { format: 'mp4', quality: 'highest' });
      const blob = await streamToBlob(stream, 'video/mp4');
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url, 
        filename: title
      });      
  });
}

beginDownload = (videoUrl, downloadType) => {
  switch (downloadType) {
      case 'Video':
          downloadVideo(videoUrl);
          break;
      case 'Audio':
          downloadAudio(videoUrl);
          break;
      default:
          downloadVideo(videoUrl);
  }
}