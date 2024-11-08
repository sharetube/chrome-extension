(() => {
    // DEBUG
    let debug = { state: null, error: null, log: null, warn: null };

    // debug state
    debug.state = false;

    // Handle errors
    debug.error = error => (debug ? console.error(error) : null);

    // Handle logs
    debug.log = (...logs) => {
        if (debug.state) {
            console.log(...logs);
        }
    };

    // Handle warnings
    debug.warn = warning => (debug ? console.warn(warning) : null);

    //? Enable or disable debugging mode
    function stDebug() {
        debug.state = !debug.state;
        console.log(`Debugging is now ${debug.state ? "enabled" : "disabled"}`);
    }

    window.STDebug = stDebug;

    // Wait for element to be available in the DOM with a timeout
    const waitElement = (selector, timeout = 10000, retries = 3) =>
        new Promise((resolve, reject) => {
            const attempt = retryCount => {
                const element = document.querySelector(selector);
                if (element) return resolve(element);

                const observer = new MutationObserver(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        clearTimeout(timeoutId);
                        observer.disconnect();
                        resolve(element);
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                });

                const timeoutId = setTimeout(() => {
                    observer.disconnect();
                    if (retryCount > 0) {
                        debug.warn(`Retrying... (${retries - retryCount + 1})`);
                        attempt(retryCount - 1);
                    } else {
                        debug.error(
                            `Element "${selector}" not found after ${timeout}ms`
                        );
                        resolve(null); // Resolve with null instead of rejecting
                    }
                }, timeout);
            };

            attempt(retries);
        });

    // Create an element in the DOM from a template
    const createElement = async (selector, templatePath, elementClass) => {
        try {
            const parentElement = await waitElement(selector);
            const response = await fetch(chrome.runtime.getURL(templatePath));
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            const element = doc.querySelector(elementClass);
            parentElement.prepend(element);
        } catch (error) {
            debug.error(error);
        }
    };

    // Check ad element
    const checkAd = () => {
        const ad = document.querySelector(".ad-showing");
        debug.log("Ad element", ad);
        return ad ? true : false;
    };

    // Wait for the ad to end
    const waitForAdToEnd = () =>
        new Promise(resolve => {
            const checkAd = () => {
                if (!document.querySelector(".ad-showing")) {
                    resolve();
                } else {
                    requestAnimationFrame(checkAd);
                }
            };
            checkAd();
        });

    // Get the current state of the video
    const getState = player => ({
        isPlayed: !player.paused,
        time: player.currentTime,
        speed: player.playbackRate,
    });

    // Set the state of the video
    const setState = (player, { isPlayed, time, speed }) => {
        player.playbackRate = speed;
        isPlayed ? player.play() : player.pause();
        player.currentTime = time;
    };

    // Send the state of the video
    const sendState = player => debug.log(getState(player));

    // Actions to mute or unmute video by user
    const muteVideo = () => {
        debug.log("Mute video");
    };

    const unmuteVideo = () => {
        debug.log("Unmute video");
    };

    // Add event listeners to the player
    const addVideoEventListeners = player => {
        const events = ["play", "pause"];
        events.forEach(event => {
            player.addEventListener(event, () => {
                sendState(player);
            });
        });

        // Change the speed of the video
        player.addEventListener("ratechange", () => {
            if (!player.isPlayed) {
                sendState(player);
            }
        });

        // Mute and unmute the video
        let isMute = null;
        player.addEventListener("volumechange", () => {
            if (player.muted && !isMute) {
                muteVideo();
                isMute = true;
            }
            if (isMute !== false && !player.muted) {
                unmuteVideo();
                isMute = false;
            }
        });
    };

    // Add event listeners to youtube player
    const initializeVideoPlayer = () => {
        waitElement("video.video-stream.html5-main-video")
            .then(addVideoEventListeners)
            .catch(debug.error);
    };

    // Add overlay to an element
    const addOverlayToElement = (element, overlayClass, zIndex = 2100) => {
        if (!element.querySelector(overlayClass)) {
            const overlay = document.createElement("div");
            overlay.className = overlayClass;
            overlay.style.position = "absolute";
            overlay.style.top = "0";
            overlay.style.right = "0";
            overlay.style.bottom = "0";
            overlay.style.left = "0";
            overlay.style.zIndex = zIndex;
            overlay.style.cursor = "pointer";
            //! Debug
            // overlay.style.backgroundColor = "red";
            element.style.position = "relative";
            element.prepend(overlay);
        }
    };

    // Add overlay to multiple elements
    const addOverlayToElements = (selector, overlayClass, zIndex) => {
        document.querySelectorAll(selector).forEach(element => {
            addOverlayToElement(element, overlayClass, zIndex);
        });
    };

    // Handle click on the overlay
    const handleElementClick = (e, overlayClass) => {
        if (e.target.classList.contains(overlayClass)) {
            const link = e.target.parentElement.querySelector("a");
            if (link) {
                const href = link.getAttribute("href");
                window.open(href, "_blank");
            }
        }
    };

    // Observe new elements in the DOM and add overlay to them
    const observeNewElements = selectors => {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        selectors.forEach(
                            ({ selector, overlayClass, zIndex }) => {
                                if (node.matches(selector)) {
                                    addOverlayToElement(
                                        node,
                                        overlayClass,
                                        zIndex
                                    );
                                }
                            }
                        );
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    };

    // Initialize overlay for an element
    const initializeOverlay = (selector, overlayClass, zIndex) => {
        waitElement(selector).then(() => {
            addOverlayToElements(selector, overlayClass, zIndex);
            document.body.addEventListener("click", e =>
                handleElementClick(e, overlayClass)
            );
        });
    };

    // Define the elements to observe
    const elementsToObserve = [
        {
            selector: "ytd-topbar-logo-renderer",
            overlayClass: "st-logo-icon-container",
            zIndex: 2000,
        },
        {
            selector: "ytd-compact-video-renderer",
            overlayClass: "st-compact-video-renderer",
            zIndex: 2100,
        },
        {
            selector: "ytd-comment-view-model",
            overlayClass: "st-comment-view-model",
            zIndex: 2000,
        },
        {
            selector: "ytd-video-owner-renderer",
            overlayClass: "st-video-owner-renderer",
            zIndex: 2000,
        },
        {
            selector: "ytm-shorts-lockup-view-model-v2",
            overlayClass: "st-shorts-lockup-view-model",
            zIndex: 2000,
        },
    ];

    // Initialize overlays for defined elements
    elementsToObserve.forEach(({ selector, overlayClass, zIndex }) => {
        initializeOverlay(selector, overlayClass, zIndex);
    });

    // Observe new elements in the DOM
    observeNewElements(elementsToObserve);

    // Wait for the ad to end and initialize the video player
    waitForAdToEnd().then(initializeVideoPlayer).catch(debug.error);

    // Create the playlist element
    createElement(
        "#secondary-inner",
        "/src/templates/playlist.html",
        ".st-playlist"
    );
})();
