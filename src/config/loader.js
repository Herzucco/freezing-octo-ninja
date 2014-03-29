var manifest = require("./manifest");

var count = 0;
var nbImages = 0;
var init;

function loader(callback)
{
    init = callback;

    for (var i in manifest.images)
    {
        nbImages++;
        var img = new Image();
        img.src = manifest.images[i];
        img.onload = function() { count++; };
        manifest.images[i] = img;
    }

    loading();
}

function loading()
{
    if (count >= nbImages)
    {
        var loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = "none";
        var gameScreen = document.getElementById('game-screen');
        gameScreen.style.display = "block";

        init();

        return;
    }

    requestAnimationFrame(loading);
}
module.exports = loader;