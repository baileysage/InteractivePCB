var globalData = require("./global.js");
var render     = require("./render.js");
var ipcb       = require("./ipcb.js");
var layerTable = require("./layer_table.js")
var bomTable   = require("./bom_table.js")

const boardRotation = document.getElementById("boardRotation");
boardRotation.oninput=function()
{
    render.SetBoardRotation(boardRotation.value);
};

const darkModeBox = document.getElementById("darkmodeCheckbox");
darkModeBox.onchange = function () 
{
    ipcb.setDarkMode(darkModeBox.checked);
};

const highlightpin1Checkbox =document.getElementById("highlightpin1Checkbox");
highlightpin1Checkbox.onchange=function()
{
    globalData.setHighlightPin1(highlightpin1Checkbox.checked);
    render.RenderPCB(globalData.GetAllCanvas().front);
    render.RenderPCB(globalData.GetAllCanvas().back);
};

const dragCheckbox = document.getElementById("dragCheckbox");
dragCheckbox.checked=function()
{
    globalData.setRedrawOnDrag(dragCheckbox.checked);
};
dragCheckbox.onchange=function()
{
    globalData.setRedrawOnDrag(dragCheckbox.checked);
};


const combineValues = document.getElementById("combineValues");
combineValues.onchange=function()
{
    globalData.setCombineValues(combineValues.checked);
    bomTable.populateBomTable();
};


const hidePlacedParts = document.getElementById("hidePlacedParts");
hidePlacedParts.onchange=function()
{
    globalData.setHidePlacedParts(hidePlacedParts.checked);
    bomTable.populateBomTable();
};

const debugModeBox = document.getElementById("debugMode");
debugModeBox.onchange=function()
{
    globalData.setDebugMode(debugModeBox.checked);
    render.RenderPCB(globalData.GetAllCanvas().front);
    render.RenderPCB(globalData.GetAllCanvas().back);
};



/* BOM Table FIlter */
const filterBOM = document.getElementById("bom-filter");
filterBOM.oninput=function()
{
    bomTable.Filter(filterBOM.value);
};

const clearFilterBOM = document.getElementById("clearBOMSearch");
clearFilterBOM.onclick=function()
{
    filterBOM.value="";
    bomTable.Filter(filterBOM.value);
};

const removeBOMEntries = document.getElementById("removeBOMEntries");
removeBOMEntries.oninput=function()
{
    bomTable.FilterByAttribute(removeBOMEntries.value);
};


/* Layer Table FIlter */
const filterLayer = document.getElementById("layer-filter");
filterLayer.oninput=function()
{
    layerTable.Filter(filterLayer.value);
};

const clearFilterLayer = document.getElementById("clearLayerSearch");
clearFilterLayer.onclick=function()
{
    filterLayer.value="";
    layerTable.Filter(filterLayer.value);
};





const bomCheckboxes = document.getElementById("bomCheckboxes");
bomCheckboxes.oninput=function()
{
    bomTable.setBomCheckboxes(bomCheckboxes.value);
};

const additionalAttributes = document.getElementById("additionalAttributes");
additionalAttributes.oninput=function()
{
    ipcb.setAdditionalAttributes(additionalAttributes.value);
};

const fl_btn = document.getElementById("fl-btn");
fl_btn.onclick=function()
{
    ipcb.changeCanvasLayout("F");
};

const fb_btn = document.getElementById("fb-btn");
fb_btn.onclick=function()
{
    ipcb.changeCanvasLayout("FB");
};

const fullscreen_btn = document.getElementById("fullscreen-btn");
fullscreen_btn.onclick=function()
{
    ipcb.toggleFullScreen();
};

const bl_btn = document.getElementById("bl-btn");
bl_btn.onclick=function()
{
    ipcb.changeCanvasLayout("B");
};

const bom_btn = document.getElementById("bom-btn");
bom_btn.onclick=function()
{
    ipcb.changeBomLayout("BOM");
};

const lr_btn = document.getElementById("bom-lr-btn");
lr_btn.onclick=function()
{
    ipcb.changeBomLayout("LR");
};

const tb_btn = document.getElementById("bom-tb-btn");
tb_btn.onclick=function()
{
    ipcb.changeBomLayout("TB");
};

const pcb_btn = document.getElementById("pcb-btn");
pcb_btn.onclick=function()
{
    ipcb.changeBomLayout("PCB");
};

const lay_btn = document.getElementById("lay-btn");
lay_btn.onclick=function()
{
    ipcb.toggleLayers();
};

const load_pcb = document.getElementById("pcbFileInput");
load_pcb.onchange=function()
{
  // Check for the various File API support.
  if (window.FileReader)
  {
      // FileReader are supported.

     var reader = new FileReader();
    // Read file into memory as UTF-8
    reader.readAsText(load_pcb.files[0]);

    // Handle errors load
    reader.onload = function loadHandler(event) {
                        pcbdata = JSON.parse(event.target.result);
                        pcbdata = JSON.parse(event.target.result);
                        layerTable.clearLayerTable();
                        bomTable.clearBOMTable();

                        render.ClearCanvas(globalData.GetAllCanvas().front);
                        render.ClearCanvas(globalData.GetAllCanvas().back);

                    };

    reader.onerror = function errorHandler(evt) {
                          if(evt.target.error.name == "NotReadableError") {
                              alert("Cannot read file !");
                          }
                    };
  }
  else
  {
      alert('FileReader are not supported in this browser.');
  }
}
