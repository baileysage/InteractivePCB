"use strict";

var Package_Pad        = require("./Package_Pad.js").Package_Pad
var Point              = require("../render/point.js").Point
var render_lowlevel    = require("../render/render_lowlevel.js");
var colormap           = require("../colormap.js");

class Package_Pad_Oblong extends Package_Pad
{
    constructor(iPCB_JSON_Pad)
    {
        super(iPCB_JSON_Pad);
        this.pad_type   = iPCB_JSON_Pad.pad_type;
        this.pin1       = iPCB_JSON_Pad.pin1;
        this.shape      = iPCB_JSON_Pad.shape;
        this.angle      = iPCB_JSON_Pad.angle;
        this.x          = iPCB_JSON_Pad.x;
        this.y          = iPCB_JSON_Pad.y;
        this.diameter   = iPCB_JSON_Pad.diameter;
        this.elongation = iPCB_JSON_Pad.elongation;
        this.drill      = iPCB_JSON_Pad.drill;  // TODO: This is not needed and is undefined if type is smd. True for all pad types.
    }


    /*
        An oblong pad can be thought of as having a rectangular middle with two semicircle ends. 

        EagleCAD provides provides three pieces of information for generating these pads. 
            1) Center point = Center of part
            2) Diameter = distance from center point to edge of semicircle
            3) Elongation =% ratio relating diameter to width

        The design also has 4 points of  interest, each representing the 
        corner of the rectangle. 

        To render the length and width are derived. This is divided in half to get the 
        values used to translate the central point to one of the verticies. 
    */
    Render(guiContext, isFront, location)
    {
        if(    (((location == "F") && (this.pad_type == "smd") &&  isFront))
            || (((location == "B") && (this.pad_type == "smd") && !isFront))
            || (this.pad_type == "tht")
          )
        {
            guiContext.save();
            // Diameter is the disnce from center of pad to tip of circle
            // elongation is a factor that related the diameter to the width
            // This is the total width
            let width   = this.diameter*this.elongation/100;
            
            // THe width of the rectangle is the diameter -half the radius.
            // See documentation on how these are calculated.
            let height  = (this.diameter-width/2)*2;

            // assumes oval is centered at (0,0)
            let centerPoint = new Point(this.x, this.y);

            let color = colormap.GetPadColor(this.pin1, false, false);

            let renderOptions = { 
                color: color,
                fill: true,
            };

            render_lowlevel.Oval( 
                guiContext,
                centerPoint,
                height,
                width,
                this.angle,
                renderOptions
            );

            /* Only draw drill hole if tht type pad */
            if(this.pad_type == "tht")
            {
                let centerPoint = new Point(this.x, this.y);

                let renderOptions = {
                    color: "#CCCCCC",
                    fill: true,
                };

                render_lowlevel.Circle(
                    guiContext,
                    centerPoint,
                    this.drill/2,
                    renderOptions
                );
            }
            guiContext.restore();
        }
    }
}

module.exports = {
    Package_Pad_Oblong
};
