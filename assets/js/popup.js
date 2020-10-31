var videoUrl = {}

function parseUrl(url) {
    const videoIDRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
    let parsedResult = {
        url: ''
    }
    parsedResult.url = url.match(videoIDRegex);
    return parsedResult;
}

function clickDownloadButton($event) {
    const downloadType = $event.target.id;
    let videoUrlQuery = '';
    videoUrlQuery = videoUrl.url[0];
    chrome.runtime.sendMessage({url: videoUrlQuery, downloadType: downloadType}, function(res){
        let downloadButton = document.querySelector(`button#${downloadType}`);
        downloadButton.innerHTML = `<span>${res}</span>`;
        downloadButton.disabled = true;
    });
}

function createButton(buttonType) {
    let buttonDiv = document.createElement('DIV');
    buttonDiv.classList.add('download-btn');
    buttonDiv.classList.add(buttonType);
    let button = document.createElement('BUTTON');
    button.onclick = clickDownloadButton;
    button.id = buttonType;
    button.innerHTML = '<span>Download </span>' + buttonType;
    buttonDiv.appendChild(button);
    return buttonDiv;
}

window.onload = () => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        const url = tabs[0].url;
        videoUrl = parseUrl(url);
        let containerDiv = document.getElementById("download-btn-container");
        let buttonTypes = ['Audio', 'Video'];
        // To Do: Add playlist support
        buttonTypes.forEach(buttonType => containerDiv.appendChild(createButton(buttonType)));
    });
}