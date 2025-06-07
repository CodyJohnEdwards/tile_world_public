export async function loadWasmWithProgress(path, progressCallback) {
    const response = await fetch(path);
    const contentLength = parseInt(response.headers.get('content-length')) || 0;
    if (!response.body) {
        progressCallback(100);
        load(path);
        return Promise.resolve();
    }
    const reader = response.body.getReader();
    let received = 0;
    const chunks = [];
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (contentLength) {
            const percent = Math.floor((received / contentLength) * 100);
            progressCallback(percent);
        }
    }
    progressCallback(100);
    const blob = new Blob(chunks, { type: 'application/wasm' });
    const url = URL.createObjectURL(blob);
    return new Promise(resolve => {
        load(url);
        const interval = setInterval(() => {
            if (typeof wasm_exports !== 'undefined') {
                clearInterval(interval);
                resolve();
            }
        }, 50);
    });
}
