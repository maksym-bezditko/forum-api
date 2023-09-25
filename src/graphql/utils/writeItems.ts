import fs from 'fs';

export const writeItems = <T>(newItems: T[], path: string) => {
  try {
    fs.writeFileSync(path, JSON.stringify(newItems, null, 2), {
      encoding: 'utf8',
    });
  } catch (e) {
    console.error(`Error writing file: ${e}`);
  }
};
