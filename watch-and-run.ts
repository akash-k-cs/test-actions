// watch-and-run.js
import { exec } from  "child_process";
import { watch } from "chokidar";
import { ConfigType, configFileName, lockwriteJson, makeLog, sortLog, writeJson } from "./file";

const configtype: ConfigType = {
  config: JSON.parse(process.env.CONFIG_FILENAMES || '[]'),
  suites: {
    pending: ['SUITE1', 'SUITE2', 'SUITE3', 'SUITE4', 'SUITE5', 'SUITE6'],
    in_progress: [],
    completed: [],
  },
  logs: []
};

const watcher = watch(configFileName, { ignored: [/node_modules/, /src/, /playwright-report/, /test-results/] });

watcher.on("change", async (path) => {
  await nextRun();
});

function executeTestSuite(suite: string, config: string) {
  exec(`CONFIG_FILENAME=${config} npx playwright test --config=playwright.config.ts --project=${suite}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${stderr}`);
    } else {
      console.log(stdout);
    }
  });
}

export async function nextRun() {
  lockwriteJson(configFileName, (obj) => {
    while (obj.config.length > 0 && obj.suites.pending.length > 0) {
      const next_config = obj.config.shift();
      const next_pending = obj.suites.pending.shift();
      if (next_config && next_pending) {
        obj.suites.in_progress.push({ suite: next_pending, config: next_config })
        executeTestSuite(next_pending, next_config);
        obj.logs.push(makeLog(`0 Runner: Starting ${next_pending} with ${next_config}`));
        obj.logs.push(makeLog(`1 Runner: Pending ${obj.suites.pending.join(', ')}`));
      }
    }
    // exit if no pending or in progress task.
    if (!obj.suites.pending.length && !obj.suites.in_progress.length) {
      sortLog().finally( () => {
        process.exit();
      });
    }
    return obj
  })
}

writeJson(configFileName, configtype)