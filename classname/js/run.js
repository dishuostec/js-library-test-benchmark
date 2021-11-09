import { create_runner } from '../../common/runner.js';
import packages, { append_packages, known_issues, pinned } from './packages.js';
import specs from './specs.js';

function create_test(assert, fn, test) {
	const { check, args, expect, before, after } = test;

	const run = check
		? () => check.forEach(({ args, expect }) => assert.strictEqual(fn(...args), expect))
		: () => assert.strictEqual(fn(...args), expect);

	return {
		before,
		run,
		after,
	};
}

function create_run(fn, test) {
	const { check, args, before, after } = test;

	return () => {
		before?.();
		if (check) {
			check.forEach(({ args }) => fn(...args));
		} else {
			fn(...args);
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
