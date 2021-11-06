import { create_runner } from '../../common/runner.js';
import packages, { append_packages, known_issues, pinned } from './packages.js';
import specs from './specs.js';

function create_test(assert, fn, test) {
	const { object, run, check, key, value, before, after } = test;


	const run_check = typeof check === 'function'
		? check
		: (assert, result) => assert.deepEqual(result, check);

	return {
		before,
		run() {

			const result = run
				? run(fn, test)
				: fn(object, key, value);

			run_check(assert, result);
		},
		after,
	};
}

function create_run(fn, test) {
	const { key, value, before, object, run, after } = test;

	const call = run
		? run
		: () => fn(object, key, value);

	return () => {
		before?.();
		call(fn, test);
		after?.();
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
