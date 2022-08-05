"use strict";


var pcb                = require("../pcb.js");

class PCB_TestPoint
{
    constructor(iPCB_JSON_TestPoint)
    {
        this.name        = iPCB_JSON_TestPoint.name;
        this.description = iPCB_JSON_TestPoint.description;
        this.expected    = iPCB_JSON_TestPoint.expected;
    }
}

module.exports = {
    PCB_TestPoint
};
