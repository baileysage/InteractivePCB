"use strict";

var globalData = require("../global.js");
var colorMap   = require("../colormap.js");


function createLayerCheckboxChangeHandler(layer, isFront)
{
    return function()
    {
        /*
            The following will correctly signal to the canvas what PCB layers should be displayed.
        */
        if(isFront)
        {
            if(globalData.readStorage( "checkbox_layer_front_" + layer.name + "_visible" ) == "true")
            {
                globalData.layer_list.get(layer.name)[globalData.render_layers].SetVisibility(isFront,false);
                globalData.writeStorage("checkbox_layer_front_" + layer.name + "_visible", "false");
            }
            else
            {
                globalData.layer_list.get(layer.name)[globalData.render_layers].SetVisibility(isFront,true);
                globalData.writeStorage("checkbox_layer_front_" + layer.name + "_visible", "true");
            }
        }
        else
        {
            if(globalData.readStorage( "checkbox_layer_back_" + layer.name + "_visible" ) == "true")
            {
                globalData.layer_list.get(layer.name)[globalData.render_layers].SetVisibility(isFront,false);
                globalData.writeStorage("checkbox_layer_back_" + layer.name + "_visible", "false");
            }
            else
            {
                globalData.layer_list.get(layer.name)[globalData.render_layers].SetVisibility(isFront,true);
                globalData.writeStorage("checkbox_layer_back_" + layer.name + "_visible", "true");
            }
        }
    }
}

class Table_LayerEntry
{
    constructor(layer)
    {
        this.visible_front = true;
        this.visible_back  = true;

        // Assumes that all layers are visible by default.
        if (    (globalData.readStorage( "checkbox_layer_front_" + layer.name + "_visible" ) == "true")
             || (globalData.readStorage( "checkbox_layer_front_" + layer.name + "_visible" ) == null)
        )
        {
            this.visible_front = true;
            globalData.writeStorage("checkbox_layer_front_" + layer.name + "_visible", "true");
        }
        else
        {
            this.visible_front = false;
        }

        // Assumes that all layers are visible by default.
        if (    (globalData.readStorage( "checkbox_layer_back_" + layer.name + "_visible" ) == "true")
             || (globalData.readStorage( "checkbox_layer_back_" + layer.name + "_visible" ) == null)
        )
        {
            this.visible_back = true;
            globalData.writeStorage("checkbox_layer_back_" + layer.name + "_visible", "true");
        }
        else
        {
            this.visible_back = false;
        }

        // Assumes that all layers are visible by default.
        if (globalData.readStorage( "checkbox_layer_color_" + layer.name ) == null )
        {
            
        }
        else
        {
         
        }


        let tr = document.createElement("TR");
        tr.appendChild(this.CreateCheckbox_Visible(layer, true));
        tr.appendChild(this.CreateCheckbox_Visible(layer, false));
        tr.appendChild(this.CreateCheckbox_Color(layer));

        // Layer
        let td = document.createElement("TD");
        td.innerHTML = layer.name;
        tr.appendChild(td);
        return tr;
    }

    /*
        Create a checkbox entry for layer table. 

        When checked (visible) an eye icon will be used
        and when unselected (not visible) an eye icon will 
        slash will be used.
    */
    CreateCheckbox_Visible(layer, isFront)
    {
        let newlabel = document.createElement("Label");
        let td       = document.createElement("TD");
        let input    = document.createElement("input");
        
        input.type = "checkbox";
        newlabel.classList.add("check_box_layer")
        if(isFront)
        {
            input.checked = this.visible_front;
        }
        else
        {
            input.checked = this.visible_back;
        }

        input.onchange = createLayerCheckboxChangeHandler(layer, isFront);

        var span = document.createElement("Span");
        span.classList.add("checkmark")

        newlabel.appendChild(input);
        newlabel.appendChild(span);
        td.appendChild(newlabel);
        return td;
    }

    CreateCheckbox_Color(layer)
    {
        let newlabel = document.createElement("Label");
        let td       = document.createElement("TD");
        let input    = document.createElement("input");
        
        input.type = "checkbox";
        newlabel.classList.add("check_box_color")


        input.onchange = function(){console.log("HELLO WORLD")}

        var span = document.createElement("Span");
        span.classList.add("checkmark_color")
        span.style.backgroundColor = colorMap.GetTraceColor(layer.layerNumber);

        newlabel.appendChild(input);
        newlabel.appendChild(span);
        td.appendChild(newlabel);
        return td;
    }
}

module.exports = {
    Table_LayerEntry
};
