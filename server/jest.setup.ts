let logs: string[] = [];
let logSpy: jest.SpyInstance;

beforeEach(() => {
  // Spy on console.log to capture calls and push to logs array
  logSpy = jest.spyOn(console, 'log').mockImplementation((...args: any[]) => {
    logs.push(args.join(' '));
  });
});

afterEach(() => {
  const testState = expect.getState();

  // If the test has failed, print the captured logs
  if (testState.numPassingAsserts !== testState.assertionCalls) {
    logSpy.mockRestore();
    console.log(
      `------------------------\n` +
        `\u001b[31m[FAILED] ${testState.currentTestName}\u001b[0m\n` +
        `------------------------\n` +
        `\u001b[33mConsole Output:\u001b[0m\n` +
        `${
          logs.length > 0
            ? logs.map((log, index) => `${index + 1}: ${log}`).join('\n')
            : 'No console output captured.'
        }`,
    );
  }

  // Clear the logs for the next test
  logs = [];
  // Restore the original console.log for future tests
  logSpy.mockRestore();

  // Additional cleanup
  jest.clearAllMocks();
});
