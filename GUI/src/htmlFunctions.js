var globalData = require("./global.js");
var render     = require("./render.js");
var ipcb       = require("./ipcb.js");

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

const silkscreenCheckbox = document.getElementById("silkscreenCheckbox");
silkscreenCheckbox.checked=function()
{
    ipcb.silkscreenVisible(silkscreenCheckbox.checked);
};

silkscreenCheckbox.onchange=function()
{
    ipcb.silkscreenVisible(silkscreenCheckbox.checked);
};

const highlightpin1Checkbox =document.getElementById("highlightpin1Checkbox");
highlightpin1Checkbox.onchange=function()
{
    globalData.setHighlightPin1(highlightpin1Checkbox.checked);
    render.drawCanvas(allcanvas.front);
    render.drawCanvas(allcanvas.back);
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
    ipcb.populateBomTable();
};


const hidePlacedParts = document.getElementById("hidePlacedParts");
hidePlacedParts.onchange=function()
{
    globalData.setHidePlacedParts(hidePlacedParts.checked);
    ipcb.populateBomTable();
};

const debugModeBox = document.getElementById("debugMode");
debugModeBox.onchange=function()
{
    globalData.setDebugMode(debugModeBox.checked);
    render.drawCanvas(allcanvas.front);
    render.drawCanvas(allcanvas.back);
};




const filterBOM = document.getElementById("bom-filter");
filterBOM.oninput=function()
{
    ipcb.setFilterBOM(filterBOM.value);
};

const clearFilterBOM = document.getElementById("clearBOMSearch");
clearFilterBOM.onclick=function()
{
    filterBOM.value="";
    ipcb.setFilterBOM(filterBOM.value);
};

const filterLayer = document.getElementById("layer-filter");
filterLayer.oninput=function()
{
    ipcb.setFilterLayer(filterLayer.value);
};

const clearFilterLayer = document.getElementById("clearLayerSearch");
clearFilterLayer.onclick=function()
{
    filterLayer.value="";
    ipcb.setFilterLayer(filterLayer.value);
};

const bomCheckboxes = document.getElementById("bomCheckboxes");
bomCheckboxes.oninput=function()
{
    ipcb.setBomCheckboxes(bomCheckboxes.value);
};

const removeBOMEntries = document.getElementById("removeBOMEntries");
removeBOMEntries.oninput=function()
{
    ipcb.setRemoveBOMEntries(removeBOMEntries.value);
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