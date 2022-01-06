"use strict";

var Point        = require("../render/point.js").Point;
var BoundingBox  = require("../BoundingBox.js").BoundingBox;

var Package_Pad_Rectangle  = require("./Package_Pad_Rectangle.js").Package_Pad_Rectangle;
var Package_Pad_Oblong     = require("./Package_Pad_Oblong.js").Package_Pad_Oblong;
var Package_Pad_Round      = require("./Package_Pad_Round.js").Package_Pad_Round;
var Package_Pad_Octagon    = require("./Package_Pad_Octagon.js").Package_Pad_Octagon;

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
            if (pad.shape == "rect") 
            {
                this.pads.push(new Package_Pad_Rectangle(pad));
            }
            else if (pad.shape == "oblong") 
            {
                this.pads.push(new Package_Pad_Oblong(pad));
            }
            else if (pad.shape == "round") 
            {
                this.pads.push(new Package_Pad_Round(pad));
            }
            else if (pad.shape == "octagon") 
            {
                this.pads.push(new Package_Pad_Octagon(pad));
            }
            else
            {
                console.log("ERROR: Unsupported pad type ", pad.shape);
            }
        }
    }

    Render(guiContext, isViewFront, location)
    {
        for (let pad of this.pads)
        {
            pad.Render(guiContext, isViewFront, location);
        }
    }
}

module.exports = {
    Package
};
