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

        let attributes_name  = iPCB_JSON_Part.attributes.name.split(";");
        let attributes_value = iPCB_JSON_Part.attributes.value.split(";");

        for(let i = 0; i < attributes_name.length; i++)
        {
            // Keys are always in lower case format
            this.attributes.set(attributes_name[i].toLowerCase(), attributes_value[i]);
        }

    }

    Render(isViewFront, scalefactor)
    {
        this.package.Render(isViewFront, this.location, scalefactor);
    }
}

module.exports = {
    PCB_Part
};
