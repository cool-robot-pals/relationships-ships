const fs = require('fs');
const path = require('path');
const dest = path.resolve(__dirname, '../../dest');

type ProcessedFileList<O extends Array<string>> = {
	[key in O[number]]: string | Buffer | {};
};

type Runner<Input extends Array<string>, Output extends Array<string>> = (
	inputs: ProcessedFileList<Input>
) => Promise<ProcessedFileList<Output>>;

export type Task<Input extends Array<string>, Output extends Array<string>> = {
	inputs: Input;
	outputs: Output;
	runner: Runner<Input, Output>;
};

export const makeTask = (
	{ inputs, outputs }: { inputs: Array<string>; outputs: Array<string> },
	runner: Runner<Input, Output>
): Task<Input, Output> => ({
	inputs,
	outputs,
	runner,
});

export const runTask = async ({ inputs, runner }) => {
	let files: ProcessedFileList<typeof inputs[number]> = {};
	for (let file of inputs) {
		files[file] = require(path.resolve(dest, file));
	}
	const outputs = await runner(files);
	for (let [file, contents] of Object.entries(outputs)) {
		if (Buffer.isBuffer(contents)) {
			fs.writeFileSync(path.resolve(dest, file), contents);
		} else {
			fs.writeFileSync(path.resolve(dest, file), JSON.stringify(contents));
		}
	}
};
