BUILD_DIR = build
DIST_NAME = cricinfo-tweaks
FF_DIST_NAME = $(DIST_NAME)-firefox.zip
CHROME_DIST_NAME = $(DIST_NAME)-chrome.zip

all: firefox chrome

clean:
	@if [ -d "${BUILD_DIR}" ]; then rm -r "${BUILD_DIR}"; fi
	@if [ -f "${FF_DIST_NAME}" ]; then rm "${FF_DIST_NAME}"; fi
	@if [ -f "${CHROME_DIST_NAME}" ]; then rm "${CHROME_DIST_NAME}"; fi

firefox: clean
	mkdir "${BUILD_DIR}"
	cp manifest-firefox.json "${BUILD_DIR}"/manifest.json
	cp cricinfo_graph_tweaks.js "${BUILD_DIR}"/
	cp chart.umd.min.js "${BUILD_DIR}"/
	cd "${BUILD_DIR}" && zip -r "../${FF_DIST_NAME}" . && cd ..
	rm -r "${BUILD_DIR}"

chrome: clean
	mkdir "${BUILD_DIR}"
	cp manifest-chrome.json "${BUILD_DIR}"/manifest.json
	cp cricinfo_graph_tweaks.js "${BUILD_DIR}"/
	cp chart.umd.min.js "${BUILD_DIR}"/
	cd "${BUILD_DIR}" && zip -r "../${CHROME_DIST_NAME}" . && cd ..
	rm -r "${BUILD_DIR}"
