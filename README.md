# Project Title

[InteractivePCB](https://github.com/oceanofthelost/InteractivePCB) is a hard fork of [InteractiveHtmlBom](https://github.com/openscopeproject/InteractiveHtmlBom) with a focus interactions with a PCB beyond a bill of materials. To that end, InteractivePCB lets one interaction with individual PCB layers, aid in PCB assembly by showing similar parts, and also provide an interactive BOM.

Currently InteractivePCB is designed to work with EagleCAD with minor support for FusionElectonics and can be displayed using the Chrome web browser.
## Table of Contents

1. [About the Project](#about-the-project)
1. [Project Status](#project-status)
1. [Getting Started](#getting-started)
	1. [Dependencies](#dependencies)
	1. [Building](#building)
	1. [Installation](#installation)
	1. [Usage](#usage)
		1. [EagleCAD](#eaglecad)
1. [Release Process](#release-process)
	1. [Bugfix Release](#bugfix-release)
	1. [Feature Release](#Feature-release)
	1. [Creating A Release](#creating-a-release)
	1. [Versioning](#versioning)
1. [How to Get Help](#how-to-get-help)
1. [Contributing](#contributing)
1. [License](#license)
1. [Authors](#authors)
1. [Acknowledgments](#acknowledgements)

## About the Project

[InteractivePCB](https://github.com/oceanofthelost/InteractivePCB) started as a hard fork of [InteractiveHtmlBom](https://github.com/openscopeproject/InteractiveHtmlBom) with the goal of adding support for EagleCAD, my choice of electronic CAD software at the time. Later InetractivePCB was used as a platform to learn HTML, JavaScript, CSS, and how to write formal specifications for data format.

InteractivePCB current focus is on integrate additional tools to analyze PCB's and to support additional ElectronicCAD software.

**[Back to top](#table-of-contents)**

## Project Status

InteractivePCB is still under active development but developed as time permits to the lead developer with features and enhancements implemented on an as needed basis.

Version 2 is released and can be found under [Releases](https://github.com/oceanofthelost/InteractivePCB/releases/). A Version 3 is in development with plans to release the project in the near future.

Browser support for Interactive PCB is primary for Chrome. Small PCB's may work in Firefox, but an unknown bug Forces Firefox to hand. No testing has been performed on other browsers.

**[Back to top](#table-of-contents)**

## Getting Started

The following section outlines how to get started  using and developing InteractivePCB. Dependencies, building, and usage shall be covered. For those interested only in using InteractivePCB, you may skip directly to [Usage](#usage)

### Dependencies

Following is a list of software expected to be installed:

1. [nodejs](https://nodejs.org/en/)
1. [npm](https://www.npmjs.com/)
1. [make](https://www.gnu.org/software/make/)

### Getting the Source

This project is [hosted on GitHub](https://github.com/oceanofthelost/InteractivePCB) and can be cloned by issuing the following command from a terminal:

```bash
$ git clone git@github.com:oceanofthelost/InteractivePCB.git
```

### Building

Open a terminal and navigate to GUI folder and issue the following command to build:

```bash
$ make
````

Once issued, make will use npm to install project specific dependencies, then generate InteractivePCB.html and related.

### Installation

No installation is necessary, simply have all the following files all in a folder:
1. index.css
2. index.js
1. iPCB.html

### Usage


#### EagleCAD

Start EagleCAD and from a PCB,  press ULP button and navigate to ipcb.ulp. Select a folder where to place script output, `pcbdata.json`. By default project directory is used.

Copy `pcbdata.json` to a folder created in [Installation](#installation).

Now open `iPCB.html` in a web browser.

**[Back to top](#table-of-contents)**

## Release Process

Creating a release shall follow either a bugfix or feature release process.

### Bugfix Release

Bugfix releases are designed to address specific issues found in release software. Once an issue is identified and an issue ticket created on GitHub, development will commonsense on fixing the issue. Upon fixing the bug and adding the change to the software, testing will be preformed and when complete will a new release will be made, tagged, and released on [GitHub]([released](https://github.com/oceanofthelost/InteractivePCB/releases).


### Feature Release

Feature releases used for adding new capabilities to InteractivePCB. First a feature request is made by creating a GitHuib issue. Next development on the feature will commence on a new branch and once complete will be merged back into master. When enough features are integrated or a milestone has been reached, then a release candidate will be created. Once a release candidate is made testing will commence to discover and fix any bugs. Once testing is complete a release will be made from the release candidate, tagged, and released on [GitHub]([released](https://github.com/oceanofthelost/InteractivePCB/releases).


### Creating A Release

To create a release, use the following steps:

1. Set new version number in `version.js`
2. Open a terminal and navigate to the GUI folder.
3. Issue `make release`
4. Make a new commit on `Release` by pulling in master.
5. Tag new release with version number assigned in 1.
6. Push both `Release` branch and tags to origin.

The above will generate a zip file `iPCB.zip`.


Next, from GitHub:
1. Navigate to [releases](https://github.com/oceanofthelost/InteractivePCB/releases)
2. Select draft new release
3. Under `Choose a tag` select tag corresponding to newest version number
4. Under release notes, add a changelog of changes between new release and last release.
5. Add a section on how to download release, unzip and basic steps to use Interactive PCB.
6. Under "Attach binaries" Upload zip file generated in last step along with any ElectronicCAD plugins.



### Versioning

InteractivePCB uses *Subjective Versioning* which is inspired by [Semantic Versioning](http://semver.org/). *Subjective Versioning* uses MAJOR.MINOR.PATCH-RC# with V prefixed. The following rules are used for incrementing MAJOR, MINOR, and PATCH:

1. MAJOR increment on breaking changes or at lead developers sole discretion. Upon incrementing MAJOR, MINOR and PATCH will be reset to 0.
2. MINOR increments on addition of new features not introducing breaking changes or large changes adding no new features or breaking changes. Incrementing minor will reset to zero PATCH.
3. PATCHincrements for bug fixes and small changes introducing no new features.
4. RC# is optional and is used for release candidates. For every fix # will increment.

## How to Get Help

Two methods exist for getting help related to InetractivePCB.

First and preferred way to request help is to post a questions on the [discussion board](https://github.com/oceanofthelost/InteractivePCB/discussions). If unable to ask a question on the discussion forum, you may also file an issue and adding the label `help` to the ticket.

In both cases of communication, do not worry, your request will be reviewed but a response may not or answered right away. Answer by the lead developer are made as time permits.

## Contributing

We encourage public contributions! Please review [CONTRIBUTING.md](CONTRIBUTING.md) for details on our development process and our [code of conduct](CODE_OF_CONDUCT.md) before you do!

**[Back to top](#table-of-contents)**

## License

??????????????

**[Back to top](#table-of-contents)**

## Authors

* **[Sean Alling](https://github.com/oceanofthelost/InteractivePCB)** - *Initial work*

Also see the list of [contributors](https://github.com/oceanofthelost/InteractivePCB/contributors) who participated in this project.

**[Back to top](#table-of-contents)**

## Acknowledgments

Thank you to the following for inspiration and assistance on this project.

[Embedded Artistry](https://github.com/embeddedartistry) for the thorough README template.

[Code Thessaurus](https://github.com/codethesaurus/codethesaur.us) for our code of conduct and issue and PR templates.

[openscopeproject](https://github.com/openscopeproject) for providing [InteractiveHtmlBom](https://github.com/openscopeproject/InteractiveHtmlBom) for without, this project would not exist.

**[Back to top](#table-of-contents)**
