import "./util/ui-decorator.js"
import "./components/mod.js"
import { ServerEvent } from "./constants/server_events.js";

async function prefetch() {
  let items = await window.electron.prefetch();
  gnoSysTransmitClientEvent("RegisterItems", JSON.stringify(items));
}

function init() {
  prefetch();
  handleFirstEvent();
  initAutoSave();
}

function handleFirstEvent() {
  registerGnoSysServerEventHandler(ServerEvent.PLAYER_UPDATE, playerInfo => {
    let loading_spinner = document.getElementById("spinner").style;
    if (loading_spinner.display !== "none") {
      loading_spinner.display = "none";
    }
    window.sendPlayerInfoCount = window.sendPlayerInfoCount || 0;
    window.sendPlayerInfoCount++;
  });
}

function initAutoSave() {
  registerGnoSysServerEventHandler(ServerEvent.PLAYER_UPDATE, playerInfo => {
    try {
      if (window.sendPlayerInfoCount % 100 === 0) {
        window.electron.persistSaveData(playerInfo)
      }
    } catch (error) {
      console.error("COULD NOT PARSE PLAYER DATA");
    }
  });
}

init();
