import { readFile, writeFile, appendFileSync, appendFile } from "fs";
const lockfile = require('proper-lockfile');

export const configFileName = 'config_usage.json';

export type SuiteWithConfigType = { suite: string, config: string };
export type ConfigType = {
  config: string[];
  suites: {
    pending: string[];
    in_progress: SuiteWithConfigType[];
    completed: SuiteWithConfigType[];
  };
  logs: string[];
};

export async function readFileData(fileName: string) {
  return new Promise<string>((res, rej) => {
    readFile(fileName, "utf8", (err, data) => {
      if (err) {
        console.error("readFileData", err);
        rej();
      } else {
        res(data);
      }
    });
  })
}

export async function writeFileData(fileName: string, data: string) {
  return new Promise<void>((res, rej) => {
    writeFile(fileName, data, 'utf8', (err) => {
      if (err) {
        console.error('writeFileData', err);
        rej();
      } else {
        res();
      }
    });
  })
}

export async function readJson<T>(fileName: string) {
  try {
    const data = await readFileData(fileName);
    const jsonData: T = JSON.parse(data);
    return jsonData;
  } catch (parseErr) {
    console.error("Invalid JSON:", parseErr);
  }
}

export async function writeJson(fileName: string, obj: any) {
  try {
    const data = JSON.stringify(obj, null, 2);
    await writeFileData(fileName, data);
  } catch(err) {
    console.error('Error writing JSON:', err);
  }
}



export async function lockwriteJson(fileName: string, cb: (obj: ConfigType) => ConfigType) {
  const release = await lockfile.lock(fileName, { retries: 5, stale: 5000 });
  let obj = await readJson<ConfigType>(fileName);
  if (obj) {
    obj = cb(obj);
    try {
      writeJson(fileName, obj)
    } catch (err) {
      console.error('lockwriteJson', err);
    } finally {
      if (release) {
        await release();
      }
    }
  }
}

export async function sortLog() {
  const release = await lockfile.lock(configFileName, { retries: 5, stale: 5000 });
  try {
    const config = await readJson<ConfigType>(configFileName);
    if (config) {
      config.logs = config.logs.sort();
      await writeJson(configFileName, config);
      console.log('------------- Runner logs starts ------------\n');
      console.log(config.logs.join('\n'));
      console.log('\n-------------- Runner logs ends -------------');
    }
  } catch (err) {
    console.error('sortLog', err);
  } finally {
    if (release) {
      await release();
    }
  }
}

export const makeLog = (log: string) => `${new Date().getTime()} ${log}`;