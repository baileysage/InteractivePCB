"use strict";

let versionString_Major = 2;
let versionString_Minor = 2;
let versionString_Patch = 1;

function GetVersionString()
{

    let result = 'V' + String(versionString_Major) + '.' + String(versionString_Minor) + '.' + String(versionString_Patch)

    return result;
}

module.exports = {
    GetVersionString
};
