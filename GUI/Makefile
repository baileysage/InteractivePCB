JS_DEPS := node_modules
JS_SRCS := $(wildcard src/*.js)
JS_SRCS += $(wildcard src/*/*.js)


BROWSERIFY := npx browserify

.DEFAULT_GOAL := Build/build.stamp

# Track an empty file as a timestamp of the last `npm install`
$(JS_DEPS)/.stamp: package.json package-lock.json
	npm install
	touch $@

.PHONY: clean
clean:
	rm -fr           \
	    index.js     \
	    node_modules \
	    pcbdata.json \
	    Release      \
	    Build

# Stamp file used since multiple files needed for output. 
# MAke output depend n stamp file so if any output file changes the stamp will be updated.
# This is a work around to get past the one output per rule issue in make.
Build/build.stamp: Build/index.js Build/index.css Build/iPCB.html 
	touch $@

Build/index.js_pretty: $(JS_DEPS)/.stamp $(JS_SRCS) Build/pcbdata.json index.css | Build
	$(BROWSERIFY) ./src/ipcb.js ./src/render.js ./src/htmlFunctions.js ./src/pcb.js ./src/colormap.js --debug --outfile $@ 

Build/index.js: Build/index.js_pretty | Build
	cp $< $@
	@#npx uglify-js  --compress -- $< > $@

Build/index.css: index.css | Build
	cp $< $@
	@#npx uglifycss $< --ugly-comments  > $@

Build/iPCB.html: iPCB.html | Build
	cp $< $@
	@#npx html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true $<  > $@

Build/pcbdata.json: ../Examples/Eagle/Simple_BRD/pcbdata.json | Build
	cp $< $@

Release:
	mkdir $@

Build:
	mkdir $@

Release/Plugins/Eagle:
	mkdir -p $@ 

Release/iPCB.zip: Build/index.js Build/index.css Build/iPCB.html | Release
	zip $@ $^

Release/Plugins/Eagle/ipcb.ulp: ../Plugins/Eagle/ipcb.ulp | Release/Plugins/Eagle
	cp $< $@

print-%  : ; @echo $* = $($*)

.PHONY: release
release: ./Release/iPCB.zip Release/Plugins/Eagle/ipcb.ulp | Release Release/Plugins/Eagle
