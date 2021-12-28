"use strict";

let versionString_Major = 3;
let versionString_Minor = 'X';
let versionString_Patch = 'X';

let versionString_isAlpha = true;

function GetVersionString()
{

    let result = 'V' + String(versionString_Major) + '.' + String(versionString_Minor) + '.' + String(versionString_Patch)

    if(versionString_isAlpha)
    {
        result = result + "-Alpha"
    }

    return result;

}

module.exports = {
    GetVersionString
};
