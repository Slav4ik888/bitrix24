import fs from 'fs';

export function getListFromJSON(fileJSON) {
  return JSON.parse(fs.readFileSync(fileJSON) || '[]');
}