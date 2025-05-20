import { configFileName, lockwriteJson, makeLog } from '../file';
import { ctest as teardown } from './fixutre';

teardown('teardown app config', async ({ configFileName: configName }) => {
  try {
    await lockwriteJson(configFileName, (obj) => {
      const index = obj.suites.in_progress.findIndex((ele) => ele.config == configName)
      if (index != -1) {
        const [completed] = obj.suites.in_progress.splice(index, 1);
        obj.config.push(completed.config);
        obj.suites.completed.push(completed);
        obj.logs.push(makeLog(`2 Runner: Completed ${completed.suite} with ${configName}`));
      }
      return obj;
    })
  } catch (error) {
    // console.error(makeErrorStackTraceAsString(error));
    teardown.fail()
    return error;
  }
});