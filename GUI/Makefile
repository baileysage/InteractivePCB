JS_DEPS := node_modules
JS_SRCS := $(wildcard src/*.js)
JS_SRCS += $(wildcard src/*/*.js)


BROWSERIFY := npx browserify

.DEFAULT_GOAL := index.js

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
	    Release

index.js: $(JS_DEPS)/.stamp $(JS_SRCS) pcbdata.json index.css
	$(BROWSERIFY) ./src/ipcb.js ./src/render.js ./src/htmlFunctions.js ./src/pcb.js ./src/colormap.js --debug --outfile $@ 

pcbdata.json: ../Examples/Eagle/Simple_BRD/pcbdata.json
	cp $< $@


.PHONY: release
release: ./Release/iPCB.zip Release/Plugins/Eagle/ipcb.ulp | Release Release/Plugins/Eagle

Release:
	mkdir $@

Release/Plugins/Eagle:
	mkdir -p $@ 

Release/iPCB.zip: index.js index.css iPCB.html | Release
	zip $@ $^

Release/Plugins/Eagle/ipcb.ulp: ../Plugins/Eagle/ipcb.ulp | Release/Plugins/Eagle
	cp $< $@

print-%  : ; @echo $* = $($*)