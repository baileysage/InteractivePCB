"use strict";

var globalData = require("../global.js");





class Table_TestPointEntry
{
    constructor(testPoint)
    {

        let tr = document.createElement("TR");

        // trace name
        let td = document.createElement("TD");
        td.innerHTML = testPoint.name
        tr.appendChild(td);

        td = document.createElement("TD");
        td.innerHTML = testPoint.expected;
        tr.appendChild(td);

        td = document.createElement("TD");
        td.contentEditable = "true"
        tr.appendChild(td);

        td = document.createElement("TD");
        td.innerHTML = testPoint.description;
        tr.appendChild(td);





        return tr;
    }
}

module.exports = {
    Table_TestPointEntry
};
