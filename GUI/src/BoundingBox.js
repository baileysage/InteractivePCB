"use strict";


var Point          = require("./render/point.js").Point

class BoundingBox
{
    constructor(a, b)
    {
        this.pointA = a;
        this.pointB = b;
    }
}

module.exports = {
    BoundingBox
};
