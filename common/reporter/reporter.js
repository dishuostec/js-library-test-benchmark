import {
	div,
	main,
	span,
	table,
	tbody,
	td,
	text,
	th,
	thead,
	tr,
	pre,
	details,
	summary,
} from 'https://unpkg.com/@hyperapp/html?module';
import { app } from 'https://unpkg.com/hyperapp?module';
import numeral from 'https://cdn.skypack.dev/numeral';

const format = (v) => numeral(v).format('0.0a');

import {
	BENCHMARK_BEGIN,
	BENCHMARK_END,
	BENCHMARK_GROUP_BEGIN,
	BENCHMARK_GROUP_END,
	BENCHMARK_ITEM_BEGIN,
	BENCHMARK_ITEM_END,
	BENCHMARK_PKG_END,
	TEST_END,
	TEST_GROUP_BEGIN,
	TEST_ITEM_BEGIN,
	TEST_ITEM_FAIL,
	TEST_ITEM_PASS,
	TEST_PKG_BEGIN,
} from './events.js';


const cal_level = percent => {
	if (percent > 0.978713764) {return 1;}
	if (percent > 0.94427191) {return 2;}
	if (percent > 0.854101966) {return 3;}
	if (percent > 0.618033989) {return 4;}

	return 5;
};

const cal_score = percent => {
	return Math.floor(percent * 100);
};

/**
 *
 * @param {SpecDefine[]} specs
 * @param {string[]} pkgs
 * @return {*}
 */
export default function create_reporter(specs, pkgs) {

	/** @type {ReporterState} */
	const state = {
		specs: specs.map(s => ({
			name: s.description,
			list: s.tests.map(t => t.description),
		})),
		packages: pkgs.map(pkg => ({
			name: pkg,
			specs: specs.map(s => ({
				list: s.tests.map(() => ({})),
			})),
		})),
	};

	const dark = (new URLSearchParams(location.search)).get('theme') !== 'light';

	const dispatch = app({
		init: state,

		node: document.getElementById('reporter'),

		/**
		 * @param {ReporterState} state
		 */
		view: (state) => {
			return main(
				{ id: 'reporter', class: { dark } },

				table([
					thead(
						tr([
							th(),
							...state.packages.map(({ name, score }) => th([
								score && span({ class: 'score' }, [text(`(${score})`)]),
								span(text(name)),
							])),
						]),
					),
					tbody(
						state.specs
							.map(({ name, list }, group) => [
								tr({ class: 'spec-group' }, [
									td({ class: 'name' }, [text(name)]),
									...state.packages.map(p => {
										const { passed, list, score } = p.specs[group] ?? {};

										return td([
											score && span({ class: 'score' }, [text(`(${score})`)]),
											span([text(passed ?? '0')]),
											text('/'),
											span([text(list?.length)]),
										]);
									}),
								]),

								...list
									.map((item, i) =>
										tr({ class: 'spec-item' }, [
											td({ class: 'name' }, text(item)),
											...state.packages.map(p => {
												const { passed, stats, level, score, error } = p.specs[group].list[i];
												return td(
													{
														class: [
															'test',
															{
																passed: passed === true,
																failed: passed === false,
																['level-' + level]: passed === true && level,
															},
														],
													},
													div(
														{ class: 'test-result' },
														error
															? [
																details([
																	summary(text('failed')),
																	pre(
																		text(error.message),
																	),
																]),
															]
															: [
																// score && span([text(`[${score}]`)]),
																stats && [
																	// span({
																	// 	class: ['rme', {
																	// 		warn: stats.rme > 8,
																	// 		danger: stats.rme > 20,
																	// 	}],
																	// }, text(`\xb1${stats.rme.toFixed(2)}%`)),
																	span({
																		class: 'ops',
																		title: `${stats.ops.toFixed(stats.ops < 100 ? 2 : 0)} ops`,
																	}, [
																		span({ class: 'number' }, text(format(stats.ops))),
																	]),
																],
															].flat(),
													),
												);
											}),
										])),
							])
							.flat(),
					),
				]),
			);
		},
	});

	const dispatch_event = (event, arg) => {

		switch (event) {
			case TEST_END:
				return dispatch(reset_index);
			case TEST_PKG_BEGIN:
				return dispatch(test_pkg_begin, arg);
			case TEST_GROUP_BEGIN:
				return dispatch(test_group_begin, arg);
			case TEST_ITEM_BEGIN:
				return dispatch(test_item_begin);
			case TEST_ITEM_PASS:
				return dispatch(test_item_pass, arg);
			case TEST_ITEM_FAIL:
				return dispatch(test_item_fail, arg);

			case BENCHMARK_BEGIN:
				return dispatch(reset_index);
			case BENCHMARK_GROUP_BEGIN:
				return dispatch(benchmark_group_begin);
			case BENCHMARK_ITEM_BEGIN:
				return dispatch(benchmark_item_begin);
			case BENCHMARK_PKG_END:
				return dispatch(benchmark_pkg_end, arg);
			case BENCHMARK_ITEM_END:
				return dispatch(benchmark_item_end, arg);
			case BENCHMARK_GROUP_END:
				return dispatch(benchmark_group_end);
			case BENCHMARK_END:
				return dispatch(benchmark_end);

			case 'stats':
				return dispatch((stats, cb) => {
					cb(stats);
					return stats;
				}, arg);
		}
	};

	return {
		dispatch: dispatch_event,
	};
}

/**
 * @param {ReporterState} state
 */
function reset_index(state) {

	return {
		...state,
		current_pkg_index: undefined,
		current_group_index: undefined,
		current_item_index: undefined,
	};
}

/**
 * @param {ReporterState} state
 */
function test_pkg_begin(state) {
	const current_pkg_index = (state.current_pkg_index ?? -1) + 1;

	return {
		...state,
		current_pkg_index,
		current_group_index: undefined,
		current_item_index: undefined,
	};
}

/**
 * @param {ReporterState} state
 */
function test_group_begin(state) {
	const current_group_index = (state.current_group_index ?? -1) + 1;

	return {
		...state,
		current_group_index,
		current_item_index: undefined,
	};
}

/**
 * @param {ReporterState} state
 */
function test_item_begin(state, detail) {
	const current_item_index = (state.current_item_index ?? -1) + 1;

	return {
		...state,
		current_item_index,
	};
}

/**
 * @param {ReporterState} state
 */
function test_item_pass(state, detail) {
	const pkg = state.packages[state.current_pkg_index];
	const group = pkg.specs[state.current_group_index];
	const item = group.list[state.current_item_index];

	Object.assign(item, { passed: true });
	group.passed = (group.passed ?? 0) + 1;
	pkg.passed = (pkg.passed ?? 0) + 1;

	return state;
}


/**
 * @param {ReporterState} state
 */
function test_item_fail(state, detail) {
	const pkg = state.packages[state.current_pkg_index];
	const group = pkg.specs[state.current_group_index];
	const item = group.list[state.current_item_index];

	Object.assign(item, { passed: false, error: detail.err });
	group.failed = (group.failed ?? 0) + 1;
	pkg.failed = (pkg.failed ?? 0) + 1;

	return state;
}

/**
 * @param {ReporterState} state
 */
function benchmark_group_begin(state) {
	const current_group_index = (state.current_group_index ?? -1) + 1;

	return {
		...state,
		current_group_index,
		current_pkg_index: undefined,
		current_item_index: undefined,
	};
}

/**
 * @param {ReporterState} state
 */
function benchmark_group_end(state) {
	state.packages.forEach(({ name, specs }) => {

		const group = specs[state.current_group_index];

		group.score = group.list.reduce((score, item) => {
			return item.passed ? score + item.score : score;
		}, 0);
	});

	return {
		...state,
	};
}


/**
 * @param {ReporterState} state
 */
function benchmark_item_begin(state) {
	const current_item_index = (state.current_item_index ?? -1) + 1;

	return {
		...state,
		current_item_index,
		current_pkg_index: undefined,
	};
}

/**
 * @param {ReporterState} state
 */
function benchmark_item_end(state) {
	const max = Math.max(...state.packages.map(p => {
		const item = p.specs[state.current_group_index].list[state.current_item_index];
		return item.passed ? item.stats.ops : 1;
	}));

	state.packages.forEach((p) => {

		const item = p.specs[state.current_group_index].list[state.current_item_index];

		const percent = item.stats.ops / max;

		const level = cal_level(percent);
		const score = cal_score(percent);

		Object.assign(item, { level, score });
	});

	return state;
}

/**
 * @param {ReporterState} state
 */
function benchmark_pkg_end(state, result) {
	const current_pkg_index = (state.current_pkg_index ?? -1) + 1;

	const pkg = state.packages[current_pkg_index];
	const group = pkg.specs[state.current_group_index];
	const item = group.list[state.current_item_index];

	item.stats = result;

	return {
		...state,
		current_pkg_index,
	};
}


/**
 * @param {ReporterState} state
 */
function benchmark_end(state) {
	state.packages.forEach((pkg) => {
		pkg.score = pkg.specs.reduce((score, item) => {
			return score + item.score;
		}, 0);
	});

	return {
		...state,
	};
}
