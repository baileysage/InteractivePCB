/*
    Functions for enabling or disabling full screen mode.

    Functions are taken from W3 School,

    https://www.w3schools.com/howto/howto_js_fullscreen.asp
*/
"use strict";


/* View in fullscreen */
function openFullscreen()
{
    let elem = document.documentElement;

    if (elem.requestFullscreen)
    {
        elem.requestFullscreen();
    }
    /* Safari */
    else if (elem.webkitRequestFullscreen)
    {
        elem.webkitRequestFullscreen();
    }
    /* IE11 */
    else if (elem.msRequestFullscreen)
    {
        elem.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen()
{
    if (document.exitFullscreen)
    {
        document.exitFullscreen();
    }
    /* Safari */
    else if (document.webkitExitFullscreen)
    {
        document.webkitExitFullscreen();
    }
    /* IE11 */
    else if (document.msExitFullscreen)
    {
        document.msExitFullscreen();
    }
}

module.exports = {
  openFullscreen, closeFullscreen
};
