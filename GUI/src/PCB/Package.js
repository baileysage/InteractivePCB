"use strict";

var Point        = require("../render/point.js").Point;
var BoundingBox  = require("../BoundingBox.js").BoundingBox;
var Package_Pad  = require("./Package_Pad.js").Package_Pad;



class Package
{
    constructor(iPCB_JSON_Package)
    {
        let bBox_PointA = new Point(iPCB_JSON_Package.bounding_box.x0, iPCB_JSON_Package.bounding_box.y0);
        let bBox_PointB = new Point(iPCB_JSON_Package.bounding_box.x1, iPCB_JSON_Package.bounding_box.y1);

        this.boundingBox = new BoundingBox(bBox_PointA, bBox_PointB);
        this.pads = [];

        for(let pad of iPCB_JSON_Package.pads)
        {
            this.pads.push(new Package_Pad(pad));
        }
    }

    Render(isViewFront, scalefactor)
    {
        
    }
}

module.exports = {
    Package
};
