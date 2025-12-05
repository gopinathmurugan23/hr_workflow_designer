let inMemoryDB = [];

export async function saveWorkflow(dto) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = inMemoryDB.findIndex((w) => w.id === dto.id);
      if (idx >= 0) {
        inMemoryDB[idx] = dto;
      } else {
        inMemoryDB.push(dto);
      }
      resolve(dto);
    }, 400);
  });
}

export async function getWorkflow(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(inMemoryDB.find((w) => w.id === id) || null);
    }, 400);
  });
}

export async function listWorkflows() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(inMemoryDB), 400);
  });
}
