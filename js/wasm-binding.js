
window.gnoSysServerEventHandlers = window.gnoSysServerEventHandlers || {};

function handleGnosysServerEventOnce(eventName, fn) {
    
    window.gnoSysServerEventHandlers[eventName] = window.gnoSysServerEventHandlers[eventName] || [];

    const onceWrapper = function(...args) {
        fn.apply(this, args);
        window.gnoSysServerEventHandlers[eventName] = window.gnoSysServerEventHandlers[eventName].filter(h => h !== onceWrapper);
    };

    
    window.gnoSysServerEventHandlers[eventName].push(onceWrapper);

    return onceWrapper;
}

function registerGnoSysServerEventHandler(serverEvent, handlerFn) {
    if (!window.gnoSysServerEventHandlers[serverEvent] || !window.gnoSysServerEventHandlers[serverEvent] instanceof Array) {
        window.gnoSysServerEventHandlers[serverEvent] = [];
    }

    window.gnoSysServerEventHandlers[serverEvent].push(handlerFn);
}

function on_init() {
}

register_plugin = function(importObject) {
    importObject.env.gno_sys_server_transmit_event = gnoSysReceiveServerEvent;
}

miniquad_add_plugin({ register_plugin, on_init });



function gnoSysReceiveServerEvent(new_state) {
    const serialized_json = consume_js_object(new_state);
    const event = JSON.parse(serialized_json);

    if (!event.id) {
        console.log("INVALID EVENT");
    }

    window.gnoSysServerEventHandlers[event.id] = window.gnoSysServerEventHandlers[event.id] || [];

    window.gnoSysServerEventHandlers[event.id].forEach(cb => {
        if (typeof cb === 'function') {
            cb(event.data);
        }
    });

}


function gnoSysTransmitClientEvent(name, value) {
    
    const jsEvent = js_object(name + ":" + value);
    
    wasm_exports.gno_sys_server_receive_event(jsEvent);
}





