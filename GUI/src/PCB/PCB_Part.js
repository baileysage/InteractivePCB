"use strict";

var Package  = require("./Package.js").Package;

class PCB_Part
{
    constructor(iPCB_JSON_Part)
    {
        this.name        = iPCB_JSON_Part.name;
        this.value       = iPCB_JSON_Part.value;
        this.package     = new Package(iPCB_JSON_Part.package);
        this.attributes  = new Map();
        this.location    = iPCB_JSON_Part.location;

        // Iterate over all attributes and add the, to attribute map.
        for(let attribute of iPCB_JSON_Part.attributes)
        {
            this.attributes.set(attribute.name.toLowerCase(),attribute.value);
        }

    }

    Render(guiContext, isViewFront, isSelected)
    {
        this.package.Render(guiContext, isViewFront, this.location, isSelected);
    }
}

module.exports = {
    PCB_Part
};
