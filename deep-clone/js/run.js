import equal from 'https://cdn.skypack.dev/fast-deep-equal';
import isObject from 'https://cdn.skypack.dev/lodash-es/isObject';
import { create_runner } from '../../common/runner.js';
import packages, { append_packages, known_issues, pinned } from './packages.js';
import specs from './specs.js';

const default_check = (assert, actual, value) => {
	assert.ok(equal(actual, value));

	if (isObject(value)) {
		assert.notStrictEqual(actual, value);
	} else {
		assert.strictEqual(actual, value);
	}
};

function create_test(assert, fn, { value, check, before, after }, { check: group_check }) {
	return {
		before,
		after,
		run() {
			const origin = value();
			const actual = fn(origin);

			group_check?.(assert, actual, origin);

			if (check !== false) {
				(check ?? default_check)(assert, actual, origin);
			}
		},
	};
}

function create_run(fn, { value, before, after }) {
	return () => {
		before?.();
		fn(value());
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
