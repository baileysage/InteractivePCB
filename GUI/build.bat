@echo on
title Test



npx browserify .\src\ibom.js .\src\render.js .\src\htmlFunctions.js .\src\pcb.js .\vender\split.js --debug --outfile index.js