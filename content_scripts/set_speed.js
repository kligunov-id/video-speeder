(() => {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  console.log("[VS]: Content script running");

  function setSpeed(playbackRate) {
    for (element of document.getElementsByTagName("video")) {
      element.playbackRate = playbackRate;
      console.debug(`[VS]: Set playbackRate ${playbackRate} for element ${element.id}`);
    }
    // Ad-hoc for LMS
    // It hides video in an iframe,
    // hiding it from getElementsByTagName
    for (frame of document.getElementsByTagName("iframe")) {
      for (element of frame.contentDocument.getElementsByTagName("video")) {
        element.playbackRate = playbackRate;
        console.debug(`[VS]: Set playbackRate ${playbackRate} for element ${element.id}`);
      }
    }
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "set_speed") {
      setSpeed(message.playbackRate);
    }
  });
})();
