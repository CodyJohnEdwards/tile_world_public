(function() {
  if (window.electron) {
    return;
  }

  console.log('Electron API not detected, using mock implementation');

  async function fetchJson(path) {
    try {
      const resp = await fetch(path);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch (err) {
      console.error('Failed to load', path, err);
      return null;
    }
  }

  const itemFiles = [
    'elder_flower.json',
    'hollow_thorn.json',
    'mushroom.json',
    'sage.json',
    'tincture.json',
  ];

  function loadLocalSaves() {
    try {
      const raw = localStorage.getItem('saveData');
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error('Failed to parse save data from localStorage', err);
      return {};
    }
  }

  function writeLocalSaves(data) {
    try {
      localStorage.setItem('saveData', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      console.error('Failed to write save data to localStorage', err);
      return { success: false, error: err.message };
    }
  }

  window.electron = {
    async prefetch() {
      const items = [];
      for (const file of itemFiles) {
        const data = await fetchJson(`assets/items/${file}`);
        if (data) items.push(data);
      }
      return { items };
    },
    async findSaveData() {
      return loadLocalSaves();
    },
    async createNewSave(playerInfo) {
      const data = loadLocalSaves();
      data[playerInfo.name] = playerInfo;
      return writeLocalSaves(data);
    },
    async persistSaveData(playerInfo) {
      const data = loadLocalSaves();
      data[playerInfo.name] = playerInfo;
      return writeLocalSaves(data);
    }
  };
})();
