import React from 'react';
import * as Babel from '@babel/standalone';
// Old
// import Interpreter from 'js-interpreter';
//  _ is a lodash library, which is a JavaScript library that provides utility functions for common programming tasks.
//  why we use lodash?
//  The reason is that lodash provides utility functions for common programming tasks, such as checking if two objects are equal.
//  By using lodash, we can make our code more readable and maintainable.
//  For example, instead of writing if (object1.name === object2.name && object1.age === object2.age && object1.address === object2.address) { ... }, we can write if (_.isEqual(object1, object2)) { ... }.
import _ from 'lodash';

function CodeEditorComponent() {
	const [MonacoEditor, setMonacoEditor] = React.useState(null);
	const [output, setOutput] = React.useState('');
	const [isCorrect, setIsCorrect] = React.useState(null);
	// Why we use useRef instead of useState?
	// The reason is that we don't want to re-render the component when the editor changes.
	// If we used useState, the component would re-render every time the editor changes, which would cause the editor to lose focus.
	// By using useRef, we can make sure that the component doesn't re-render when the editor changes, which means that the editor will keep its focus.
	const editorRef = React.useRef(null);
	const expectedOutput = {"name": "Rokas"};

	// why import in useEffect and not in the top?
	// The reason is that the import statement is a top-level declaration, which means it is run before the component is rendered.
	// This means that the component will be rendered before the import is finished, which means that the Monaco Editor package will not be available when the component is rendered.
	// By using the useEffect hook, we can make sure that the import is run after the component is rendered, which means that the Monaco Editor package will be available when the component is rendered.
	React.useEffect(() => {
		// Dynamically import the Monaco Editor package
		import('react-monaco-editor').then(monacoEditor => {
			// Set the Monaco Editor package to the state
			setMonacoEditor(() => monacoEditor.default);
		});
	}, []);

	const executeCode = () => {
		// Get the code from the editor and store it in a variable
		const editorCode = editorRef.current.getValue();

		// Return a new Promise that will resolve when the code has been executed by the interpreter
		// The Promise will resolve with an object containing the logs from the interpreter
		// The Promise will reject if there's an error in the code or if the code takes longer than 1 second to execute
		// The Promise will reject with an object containing the error message
		return new Promise((resolve, reject) => {
			// What is Web Worker?
			// A Web Worker is a JavaScript file that runs in the background, separate from the main thread.
			// Web Workers are useful for running code that takes a long time to execute, such as code that uses a lot of CPU power.
			// Web Workers are also useful for running code that needs to run in the background, such as code that needs to run while the user is doing something else.
			// So we creating with web worker a new thread, which is running in the background, and we can run our code there, and it will not affect the main thread.
			// The main thread is the thread that runs the code that is visible to the user, such as the code that runs when the user clicks a button.
			// The main thread is also the thread that runs the code that updates the user interface, such as the code that updates the text in a text field.
			//  But Web Worker should be in cloud or server?
			// No, Web Workers are not in the cloud or on a server.
			// Web Workers are in the browser, which means that they run on the user's computer.
			// So where should be then a worker.js file?
			// The worker.js file should be in the public folder, because it is a static file, and it is not changing, so it should be in the public folder.
			// Create a new Worker instance and pass it the code from the editor as a string to execute it
			// Why wroker.js is seprate file?
			// The reason is that the Web Worker API doesn't allow you to import modules, which means that you can't use the import statement in a Web Worker.
			// This means that you can't use the import statement in the code that you pass to the Web Worker.
			// By using a separate file, we can make sure that the code that we pass to the Web Worker doesn't contain any import statements.
			const worker = new Worker(`${import.meta.env.PUBLIC_PUBLIC_URL}/worker.js`);
			// Assuming worker is your Web Worker instance
			// The onmessage event handler is called when the Web Worker sends a message to the main thread.
			worker.onmessage = (event) => {
				// Log the raw event data
				console.log('Raw event data:', event.data);


				if (event.data.error) {
					// If there's an error, set the output to the error message
					setOutput(event.data.error);
					setIsCorrect(false);
				} else {
					try {
						// Try to parse the result as JSON
						const result = JSON.parse(event.data.result);

						let output;
						if (Array.isArray(result)) {
							output = JSON.stringify(result);
						} else if (typeof result === 'object') {
							output = JSON.stringify(result, null, 2);
						} else {
							output = result;
						}

						setOutput(output);

						const expected = expectedOutput;


						// Log the result and expected output to the console
						console.log('Result:', result);
						console.log('Expected Output:', expected);

						// Check if the result is equal to the expected output
						if (_.isEqual(result, expected)) {
							setIsCorrect(true);
							console.log('Output is correct'); // Log to the console
						} else {
							setIsCorrect(false);
							console.log('Output is incorrect'); // Log to the console
						}

					} catch (error) {
						// If the result cannot be parsed as JSON, handle it as a string
						setOutput(event.data.result);

						const result = event.data.result
						const expected = expectedOutput

						console.log('Result:', result);
						console.log('Expected Output:', expected);

						if (_.isEqual(result, expected)) {
							setIsCorrect(true);
							console.log('Output is correct');
						} else {
							setIsCorrect(false);
							console.log('Output is incorrect');
						}

					}

				}
			};

			//  Transpile the code from the editor using Babel
			// Why we need to transpile the code?
			// The reason is that the Web Worker API doesn't support the import statement, which means that you can't use the import statement in a Web Worker.
			// This means that you can't use the import statement in the code that you pass to the Web Worker.
			// By using Babel, we can transpile the code from the editor to ES5, which means that we can use ES6 syntax in the code that we pass to the Web Worker.
			const transpiledCode = Babel.transform(editorCode, { presets: ['es2015'] }).code;
			// console.log(transpiledCode)
			// Pass the transpiled code to the Web Worker
			// The Web Worker will execute the code and send the result back to the main thread
			worker.postMessage(`self.result = (() => { ${transpiledCode} })();`);
		});
	};

	const handleRunCode = () => {
		// console.log(editorRef.current.getValue())
		executeCode().then(({ logs }) => {
			// If the output is correct, set the output to the logs
			setOutput(logs);
		}).catch(error => {
			// If there's an error, set the output to the error message
			setOutput(error.toString());
			setIsCorrect(false);
		});
	};

	if (!MonacoEditor) {
		return <div>Loading...</div>;
	}

	return (

		<section
			className="mt-8 text-white p-4 rounded-lg overflow-x-auto"
		>
			<MonacoEditor
				width="800"
				height="600"
				language="javascript"
				theme="vs-dark"
				editorDidMount={(editor) => { editorRef.current = editor; }}
			/>

			<article className=" bg-gray-700 p-4 rounded-br-lg rounded-bl-lg">
				<button
					className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-br-lg rounded-bl-lg inline-flex items-center shadow-md"
					onClick={handleRunCode}
				>
					<svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z" /><path d="M5 3l14 9-14 9V3z" /></svg>
					<span>Run</span>
				</button>
				<pre className='w-full min-h-[200px] p-4 rounded overflow-x-auto whitespace-pre-wrap break-words'>{output}</pre>
			</article>
		</section>

	)
}

export default CodeEditorComponent;