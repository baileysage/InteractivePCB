
# Changelog

## Version 2.3

### Fixed 
- Issue #68 (fe7b150c378e8fc68e62523c5763b038625774e2): BOM part filtering uses attribute value instead of attribute key for filtering.
- Issue #69 (fe7b150c378e8fc68e62523c5763b038625774e2): Adding a comma separate string to "remove BOM entry" will remove matching values from BOM table.
- Issue #80 (30cee24f708bb7f8967c7249528ed3e62a4e8461): Draw/Redraw canvas only after clicking BOM element.

### Added
- Issue #66 (3f709a815c58171d9600805478cb402bf578ffdc): Created button to toggle layer table visibility.
- Issue #78 (58147003ff3570bae0577ef1292cd2d83ee6be26): Created button to toggle full screen mode.

### Changed
- Issue #67 (5ae172ed48bec65cc4d4b0daf2130b6fb1211b82): Removed footprint as required BOM column. 
- Modified layer split logic to better support toggling BOM, BCB, and layer tables.

## Version 2.2.1

### Fixed 
- EagleCAD ULP outputs company name and revision to JSON file (Issue #60).
- Displaying empty string if company name, pcb revision, date, or project name are undefined (Issue #60).

## Version 2.2

### Fixed
- Fixed issue #56, regenerated all example PCB JSON files. 
- Resolved PCB not auto re-rendering when wither bounding box debug or highlight pin 1 options were selected/unselected.

### Added
- Version number now displayed as top entry under settings tab(Issue #55).

### Changed
- If requested layer numerical value is greater than or equal to 16, then black will be used for the color. This resolves an issue where program would error out and stop rendering since requested color was out of bounds.


## Version 2.1
### Added
- Added user ability to load new pcbdata.json file at runtime.
- Formalized pcbdata.json file using eBNF.

### Changed
- All references to iBOM now changed to iPCB. 
- 
### Removed


## Version 2.0
### Added
- Integrated make based build
## Changed
- Use npm to track dependencies instead of explicitly downloading them.
- Added split.js as a dependency so no longer need to have file in vendor folder. 
### Removed
- Cleanup of project to remove files that are not needed.
  - Old releases are now kept on Github
  - PCB data files were all moved to be under Examples instead of lingering in multiple locations.
  - Examples of using split.js were included in the source but were actually not used.
  - Removed build.bat as make is used instead.
  - Removed README in source folder as documentation was out of sync with actually building project.
## Version 1.x

### Added
- BOM-EX database support. 
### Fixed
- Resolved [BUG0004](https://github.com/oceanofthelost/InteractiveBOM/tree/master/BUG_TRACKING/BUG0004).
### Special Thanks
- @dronecz for reporting BUG0004
- @aholtzma for adding BOM-EX database support and python script for annotating pcbdata.json with customer ref information.

## Version 1.6 - 10-07-2018
### Added
- User can click on a part on the PCB to highlight that part and its BOM entry. 
### Fixed
- Resolved BUG that was highlighting multiple parts designator was a substring of another. 
- Pin can now be highlighted [BUG0001](https://github.com/oceanofthelost/InteractiveBOM/tree/master/BUG_TRACKING/BUG0002)


## Version 1.5 - 09-28-2018
### Added
- Support for using filter on user specified attributes
### Changed
- Reworked pcbdata input to be converted to an internal data structure.
- Simplified eagle ulp


## Version 1.4 - 09-27-2018
### Added
- User ability for adding attributes dynamically using a ',' separated list
- Added example pcbdata.json file for EagleCAD
### Changed
- User specified lists can now include whitespace in front of or trailing. 
  it will now be trimmed before doing comparisons.

## Version 1.3 - 09-27-2018
### Changed
- Changed BOM filtering to look at attribute value, not an attribute name


## Version 1.2 - 09-27-2018
### Added 
- User ability for filtering BOM entries using ',' separated string
### Changed
- Change sort in ibom.ulp to sort by package, then value, and finally reference designator
- Removed reference lookup
- Filter now searches the reference field
- Eagle ULP now outputs attributes as a ';' separated string
### Removed
- Removed reference search


## Version 1.1 - 09-26-2018
### Added
- Added ability to combine parts by value
- Added quantity field view in combined part mode
### Changed      
- Updated ibom.ulp to pack all parts with the same value into the same entry by default
### Fixed
- Fixed display with footprint showing reference designator. [BUG0001](https://github.com/oceanofthelost/InteractiveBOM/tree/master/BUG_TRACKING/BUG0001)


## Version 1.0 - 09-25-2018
- Initial release
