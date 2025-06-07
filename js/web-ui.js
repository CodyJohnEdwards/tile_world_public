import "./util/ui-decorator.js";
import "./components/mod.js";
import {ServerEvent} from "./constants/server_events.js";

async function prefetch() {
  let items = await window.electron.prefetch();
  gnoSysTransmitClientEvent("RegisterItems", JSON.stringify(items));
}

function init() {
  prefetch();
  handleFirstEvent();
  initAutoSave();
}

function showControlToasts() {
  document.querySelectorAll('#control-toast-container .toast')
      .forEach((toastEl, idx) => {
        const toast = new bootstrap.Toast(toastEl);
        setTimeout(() => toast.show(), idx * 500);
      });
}

function handleFirstEvent() {
  registerGnoSysServerEventHandler(ServerEvent.PLAYER_UPDATE, playerInfo => {
    window.sendPlayerInfoCount = window.sendPlayerInfoCount || 0;
    window.sendPlayerInfoCount++;
  });

  let controlToastShown = false;
  registerGnoSysServerEventHandler(ServerEvent.GAME_STATE_CHANGED, state => {
    if (state === "PLAYING" && !controlToastShown) {
      showControlToasts();
      controlToastShown = true;
    }
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

export function startWebUI() {
  init();
}

export default startWebUI;
