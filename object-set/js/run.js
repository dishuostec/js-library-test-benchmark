import { create_runner } from '../../common/runner.js';
import packages, { append_packages, known_issues, pinned } from './packages.js';
import specs from './specs.js';

function create_test(assert, fn, test) {
	const { source, key, value, run, check, before, after } = test;

	const object = source();

	const run_check = typeof check === 'function'
		? check
		: (assert, actual) => assert.deepEqual(actual, check);

	return {
		before,
		run() {
			let actual;
			if (run) {
				actual = run(fn, object);
			} else {
				fn(object, key, value);
				actual = object;
			}
			run_check(assert, actual);
		},
		after,
	};
}

function create_run(fn, test) {
	const { source, key, value, before, run, after } = test;

	return () => {
		before?.();

		const object = source();
		if (run) {
			run(fn, object);
		} else {
			fn(object, key, value);
		}
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
