import { create_runner } from '../../common/runner.js';
import packages, { append_packages, known_issues, pinned } from './packages.js';
import specs from './specs.js';

function create_test(assert, fn, { equal, value1, value2 }) {
	return {
		run() {
			assert.equal(fn(value1, value2), equal);
		},
	};
}

function create_run(fn, { value1, value2 }) {
	return () => {
		fn(value1, value2);
	};
}


export default async function run_test() {
	const runner = create_runner({
		specs,
		packages,
		append_packages,
		pinned,
		known_issues,
		create_test,
		create_run,
	});

	await runner();
}
