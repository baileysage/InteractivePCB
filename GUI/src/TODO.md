* Define a format for part data that will comprise the pcbdata.json file. 
    - Current version "works" but is chaotic, and not documented. 
    - Some entries are numbers but represented as strings. Represent all umbers as either strings or as numbers, not a combination of both.
    - The pcbdata,json file will be the defined file format for working with EagleCAD pcb data. 

* Create a class that interacts can interact with the pcbdata.json file. 
    - The class will provide the interface for working with the parts and will extract the data or process the data per he user requirements.

* Be able to display all of top layer, as per the current iBOM release.