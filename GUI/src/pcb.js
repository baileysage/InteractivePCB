/*
    This file contains all of the definitions for working with pcbdata.json. 
    This file declares all of the access functions and interfaces for converting 
    the json file into an internal data structure. 
*/

"use strict";
var Part     = require("./Part.js");
var globalData = require("./global.js");


/***************************************************************************************************
                                         PCB Part Interfaces
**************************************************************************************************/
// This will hold the part objects. There is one entry per part
// Format of a part is as follows
// [VALUE,PACKAGE,REFRENECE DESIGNATOR, ,LOCATION, ATTRIBUTE],
// where ATTRIBUTE is a dict of ATTRIBUTE NAME : ATTRIBUTE VALUE
let BOM = [];

let BOM_Combined = new Map();

//TODO: There should be steps here for validating the data and putting it into a 
//      format that is valid for our application
function CreateBOM(pcbdataStructure)
{
    // For every part in the input file, convert it to our internal 
    // representation data structure.
    for(let part of pcbdataStructure.parts)
    {
        // extract the part data. This is here so I can iterate the design 
        // when I make changes to the underlying json file.
        let value     = part.value;
        let footprint = "";
        let reference = part.name;
        let location  = part.location;

        let attributes = new Map(); // Create a empty dictionary
        for(let i of part.attributes)
        {
            attributes.set(i.name.toLowerCase(),i.value.toLowerCase());
        }

        let checkboxes = new Map();
        // Add the par to the global part array
        BOM.push(new Part.Part(value, footprint, reference, location, attributes, checkboxes));

        if(BOM_Combined.has(value))
        {
            let exisingPart = BOM_Combined.get(value)
            exisingPart.quantity = exisingPart.quantity + 1;
            exisingPart.reference = exisingPart.reference + "," + reference;
        }
        else
        {
            // Add the par to the global part array
            BOM_Combined.set(value, new Part.Part(value, footprint, reference, location, [], []));
        }
    }

    console.log(BOM)
    console.log(BOM_Combined)
}

function GetBOM()
{
     if(globalData.getCombineValues())
     {
        let result = []

        for(let parts of BOM_Combined.values())
        {
            result.push(parts)
        }
        return result;
     }
     else
     {
        return BOM;
     }
}

function getAttributeValue(part, attributeToLookup)
{
    let attributes = part.attributes;
    let result = "";

    if(attributeToLookup == "name")
    {
        result = part.reference;
    }
    else
    {
        result = (attributes.has(attributeToLookup) ? attributes.get(attributeToLookup) : "");
    }
    // Check that the attribute exists by looking up its name. If it exists
    // the return the value for the attribute, otherwise return an empty string. 
    return result;
}

/***************************************************************************************************
                                         PCB Layers Interfaces
***************************************************************************************************/

function GetLayerCanvas(layerName, isFront)
{
    let layerCanvas = globalData.layer_list.get(layerName);

    if(layerCanvas == undefined)
    {
        return undefined;
    }
    else
    {
        return layerCanvas[globalData.render_layers].GetCanvas(isFront);
    }
}

module.exports = {
    CreateBOM, GetBOM, getAttributeValue, GetLayerCanvas
};