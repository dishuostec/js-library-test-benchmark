import {
	BENCHMARK_BEGIN,
	BENCHMARK_END,
	BENCHMARK_GROUP_BEGIN,
	BENCHMARK_GROUP_END,
	BENCHMARK_ITEM_BEGIN,
	BENCHMARK_ITEM_END,
	BENCHMARK_PKG_END,
} from './reporter/events.js';
import MochaReporter from './reporter/mocha.js';
import create_reporter from './reporter/reporter.js';
import { load } from './skypack.js';

export function create_runner({
	specs,
	packages,
	append_packages,
	pinned,
	known_issues,
	create_test,
	create_run,
}) {
	return async () => {
		const fn_list = [...Object.entries(append_packages)];

		for (const pkg_name in packages) {
			const fn = await load(pkg_name, packages[pkg_name], pinned);

			if (typeof fn !== 'function') {
				throw new Error(pkg_name + ' is NOT a function');
			}

			fn_list.push([pkg_name, fn]);
		}

		const reporter = create_reporter(specs, fn_list.map(d => d[0]));

		await new Promise(async resolve => {
			const assert = chai.assert;

			mocha.setup({ ui: 'bdd' });
			mocha.reporter(MochaReporter, reporter);
			mocha.checkLeaks();

			for (const [pkg_name, fn] of fn_list) {

				describe(pkg_name, function() {

					for (const spec of specs) {

						describe(spec.description, function() {

							const { tests, description: group } = spec;

							for (const test of tests) {
							
								const { description } = test;

								const issue = known_issues[pkg_name]?.[group]?.[description];
								if (issue) {
									it(description, function() {
										throw new Error(`Known issue for "${pkg_name}" running ${(group)}:${(description)}: ${issue}`);
									});
									continue;
								}

								describe('', function() {
									beforeEach(function(done) {
										this.timeout(500);
										setTimeout(done, 0);
									});

									const check = create_test(assert, fn, test, spec);
									if (check.before) {before(check.before);}
									if (check.after) {after(check.after);}

									it(description, check.run);
								});
							}
						});
					}
				});
			}

			mocha.run(resolve);
		});

		const { dispatch } = reporter;

		const test_result = {};
		dispatch('stats', /** @param {ReporterState} stats */(stats) => {
			stats.packages.forEach(({ name, specs }) => {
				test_result[name] = specs.map(({ list }) => {
					return list.map(({ passed }) => {
						return passed;
					});
				});
			});
		});

		dispatch(BENCHMARK_BEGIN);

		for (let i = 0; i < specs.length; i++) {
			const { description: group, tests } = specs[i];

			dispatch(BENCHMARK_GROUP_BEGIN, group);

			for (let j = 0; j < tests.length; j++) {
				const test = tests[j];
				await new Promise(async resolve => {

					const suite = new Benchmark.Suite(test.description, {
						onStart() {
							dispatch(BENCHMARK_ITEM_BEGIN);
						},
						onCycle(event) {
							const { hz, stats: { rme, sample } } = event.target;
							dispatch(BENCHMARK_PKG_END, { ops: hz, rme, run: sample.length });
						},
						onComplete() {
							dispatch(BENCHMARK_ITEM_END);
							resolve();
						},
					});

					for (const [pkg_name, fn] of fn_list) {

						if (!test_result[pkg_name][i][j] || known_issues[pkg_name]?.[group]?.[test.description]) {
							suite.add(pkg_name, () => {
								throw new Error('test failed');
							});

							continue;
						}

						const run = create_run(fn, test);
						suite.add(pkg_name, run, {
							minSamples: 5,
							maxTime: 0.01, // secs
						});

					}

					suite.run({ async: true });
				});

			}

			dispatch(BENCHMARK_GROUP_END, group);
		}

		dispatch(BENCHMARK_END);

	};
}