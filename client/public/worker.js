
// self.onmessage = (event) => {
//     const consoleLog = console.log;
//     let logs = '';
//     console.log = (...args) => {
//         logs += args.join(' ') + '\n';
//         // consoleLog(...args);
//     };

//     try {
//         // console.log('event.data:', event.data);  // Log event.data
//         eval(event.data);
//         self.postMessage({ result: logs });
//     } catch (error) {
//         self.postMessage({ error: error.message });
//     }

//     console.log = consoleLog;
// };

// What worker.js is - it is a file that is run in a separate thread.
// It is not run in the main thread, but in a separate thread.
// The main thread is the thread that is run by the browser.
//  So where is this thread run? It is run in the browser.
//  So the browser has a thread that is running this file.
//  And the browser has another thread that is running the main thread.
//  And the main thread is running the client.js file.
//  And the client.js file is running the worker.js file.
//  onmessage is an event listener that is listening for a message event.
//  And when it hears a message event, it will run the callback function.
//  And the callback function will take the event object as an argument.
//  And the event object will have a data property.
self.onmessage = (event) => {
    // const logs = []; - this is the old way of doing it. We will use the new way.
    const logs = [];
    const consoleLog = console.log;
    // console.log - we are going to overwrite the console.log function.
    //  And we are going to overwrite it with a new function.
    //  And this new function will take the arguments that are passed to it.
    //  And it will push them to the logs array.
    console.log = (...args) => {
        args.forEach(arg => {
            let formattedArg;
            if (Array.isArray(arg)) {
                formattedArg = JSON.stringify(arg);
            } else if (typeof arg === 'object' && arg !== null) {
                formattedArg = JSON.stringify(arg, null, 2);
            } else {
                formattedArg = arg;
            }
            logs.push(formattedArg);
        });
    };

    // eval - this is a function that will take a string and run it as JavaScript code.
    // So we are going to run the event.data as JavaScript code.
    // And the event.data is the string that we passed to the worker.
    // And we passed the string to the worker in the client.js file.
    try {
        eval(event.data);
        self.postMessage({ result: logs.join('\n') });
    } catch (error) {
        self.postMessage({ error: error.message });
    }

    console.log = consoleLog;
};