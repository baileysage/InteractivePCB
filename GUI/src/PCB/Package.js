"use strict";

var BoundingBox  = require("../BoundingBox.js").BoundingBox;

var Package_Pad_Rectangle  = require("./Package_Pad_Rectangle.js").Package_Pad_Rectangle;
var Package_Pad_Oblong     = require("./Package_Pad_Oblong.js").Package_Pad_Oblong;
var Package_Pad_Round      = require("./Package_Pad_Round.js").Package_Pad_Round;
var Package_Pad_Octagon    = require("./Package_Pad_Octagon.js").Package_Pad_Octagon;

var colormap           = require("../colormap.js");

class Package
{
    constructor(iPCB_JSON_Package)
    {
        this.boundingBox = new BoundingBox(iPCB_JSON_Package.bounding_box.x0, iPCB_JSON_Package.bounding_box.y0, iPCB_JSON_Package.bounding_box.x1, iPCB_JSON_Package.bounding_box.y1);
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

    Render(guiContext, isViewFront, location, isSelected)
    {
        for (let pad of this.pads)
        {
            if(    (((location == "F") && (pad.IsSMD()) &&  isViewFront))
                || (((location == "B") && (pad.IsSMD()) && !isViewFront))
                || (pad.IsTHT())
            )
            {
                let color = colormap.GetPadColor(pad.IsPin1(), isSelected, false);
                pad.Render(guiContext, color);
            }
        }

        if(    (isSelected && (location == "F") && isViewFront)
            || (isSelected && (location == "B") && !isViewFront)
          )
        {
            let color = colormap.GetBoundingBoxColor(isSelected, false);
            this.boundingBox.Render(guiContext, color);
        }
    }
}

module.exports = {
    Package
};
