/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    console.log("[VS]: Handling click")
    function buttonTextToPlaybackRate(text) {
      return parseFloat(text.substring(1));
    }

    // Sends message to the content script
    function choose_speed(tabs) {
      let playbackRate = buttonTextToPlaybackRate(e.target.textContent)
      browser.tabs.sendMessage(tabs[0].id, {
        command: "set_speed",
        playbackRate: playbackRate
      });
      console.log(`[VS]: Message {command: "set_speed", pRate: ${playbackRate}} sent`);
    }
    
   function logError(error) {
      console.error(`[VS]: Could not choose speed: ${error}`);
    }
    
    // Body
    if (!e.target.classList.contains("button") || !e.target.closest("#popup-content")) {
      return;
    } 
    if (e.target.classList.contains("speed")) {
      console.log("[VS]: Button click");
      browser.tabs.query({active: true, currentWindow: true})
        .then(choose_speed)
        .catch(logError);
    }
  });
}

function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`[VS]: Failed to execute content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.query({active: true, currentWindow: true})
  .then((tabs) => browser.scripting.executeScript(
                   { target: { tabId: tabs[0].id } , files: ["/content_scripts/set_speed.js"] }))
  .then(listenForClicks)
  .then(() => {console.log("[VS]: Popup loaded")})
  .catch(reportExecuteScriptError);
