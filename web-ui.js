function on_init() {
    /// Call rust function with string argument
    wasm_exports.hi_rust_with_string(js_object("plugin initialized!"));
}

register_plugin = function (importObject) {
    window.globalLogs = window.globalLogs || [];
    // Make send_player_info_js available to Rust.
    importObject.env.send_player_info_js = send_player_info_js;
    importObject.env.sendEventToRust = sendEventToRust;
    importObject.env.send_log_js = send_log_js;
}

// register this plugin in miniquad, required to make plugin's functions available from rust
miniquad_add_plugin({ register_plugin, on_init });



function send_log_js(log) {
    const clog = consume_js_object(log);

    // Append the log message to the globalLogs array.
    window.globalLogs.push(clog);
    console.log("Log added:", clog);

    // Create a span element and set its text to the log.
    const span = document.createElement('span');
    span.innerText = "- " + clog;

    // Optionally add a class for styling purposes.
    span.className = 'log-entry';

    // Set the span to display as a block element so it appears on a new line.
    span.style.display = 'block';

    // Get the log container div.
    const logDiv = document.getElementById("log");
    if (logDiv) {
        // Prepend the span element to the div so each new log appears on top.
        logDiv.insertBefore(span, logDiv.firstChild);
    } else {
        console.error("Div with id 'log' not found!");
    }
}


function send_player_info_js(js_object) {
    let loading_spinner = document.getElementById("spinner").style;

    if (loading_spinner.display !== "none") {
        loading_spinner.display = "none";
    }
    // Convert the JsObject to a string (using your helper, e.g. consume_js_object),
    // then parse the JSON.
    const jsonString = consume_js_object(js_object);
    try {
        const playerInfo = JSON.parse(jsonString);
        updateSidebar(playerInfo);
        // You can further process playerInfo as needed.
    } catch (error) {
        console.error("Failed to parse player info:", error);
    }
}

function sendEventToRust(event) {
    // Convert the event (an object or string) into a JsObject.
    const jsEvent = js_object(event);
    // Call the exported Rust function to handle the event.
    wasm_exports.receive_event(jsEvent);
}
function updateSidebar(playerInfo) {
    // Get the sidebar element
    const sidebar = document.getElementById("active-menu");
    if (!sidebar) {
        console.error("Sidebar element not found!");
        return;
    }

    // Clear any existing content
    sidebar.innerHTML = '';

    // Create a header for the sidebar
    const header = document.createElement('div');
    header.className = 'arcane-container-header';
    header.innerText = "Player Info";
    sidebar.appendChild(header);

    // Create an element for the player's name
    const nameEl = document.createElement('div');
    nameEl.className = 'arcane-container-item';
    nameEl.innerText = `Name: ${playerInfo.name}`;
    sidebar.appendChild(nameEl);

    // Create an element for the player's health
    const healthEl = document.createElement('div');
    healthEl.className = 'arcane-container-item';
    healthEl.innerText = `Health: ${playerInfo.health} / ${playerInfo.max_health}`;
    sidebar.appendChild(healthEl);

    // Create an element for the player's energy
    const energyEl = document.createElement('div');
    energyEl.className = 'arcane-container-item';
    energyEl.innerText = `Energy: ${playerInfo.energy} / ${playerInfo.max_energy}`;
    sidebar.appendChild(energyEl);
}