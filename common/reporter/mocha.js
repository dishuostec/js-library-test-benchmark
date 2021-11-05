import {
	TEST_BEGIN,
	TEST_END,
	TEST_GROUP_BEGIN,
	TEST_GROUP_END,
	TEST_ITEM_BEGIN, TEST_ITEM_END,
	TEST_ITEM_FAIL,
	TEST_ITEM_PASS,
	TEST_PKG_BEGIN, TEST_PKG_END,
} from './events.js';

const {
	EVENT_RUN_BEGIN,
	EVENT_RUN_END,
	EVENT_TEST_FAIL,
	EVENT_TEST_PASS,
	EVENT_SUITE_BEGIN,
	EVENT_SUITE_END,
	EVENT_TEST_BEGIN,
	EVENT_TEST_END,
} = Mocha.Runner.constants;

class MochaReporter {
	constructor(runner, options) {
		const { dispatch } = options.reporterOption;

		runner
			.once(EVENT_RUN_BEGIN, () => {
				dispatch(TEST_BEGIN);
			})
			.once(EVENT_RUN_END, () => {
				// dispatch('test.end');
				dispatch(TEST_END);
			})
			.on(EVENT_SUITE_BEGIN, (suite) => {
				if (suite.root) {return;}

				const [pkg, group, ...other] = suite.titlePath();
				if (other.length) {return;}

				if (group) {
					// dispatch('test.group', group);
					dispatch(TEST_GROUP_BEGIN, group);
				} else {
					// dispatch('test.pkg', pkg);
					dispatch(TEST_PKG_BEGIN, pkg);
				}
			})
			.on(EVENT_SUITE_END, (suite) => {
				if (suite.root) {return;}

				const [pkg, group, ...other] = suite.titlePath();
				if (other.length) {return;}

				if (group) {
					// dispatch('test.group', group);
					dispatch(TEST_GROUP_END, group);
				} else {
					// dispatch('test.pkg', pkg);
					dispatch(TEST_PKG_END, pkg);
				}
			})
			.on(EVENT_TEST_BEGIN, test => {
				const item = test.title;
				const [pkg, group] = test.parent.titlePath();
				// dispatch('test.run', { pkg, group, item });
				dispatch(TEST_ITEM_BEGIN, { pkg, group, item });
			})
			.on(EVENT_TEST_PASS, test => {
				const item = test.title;
				const [pkg, group] = test.parent.titlePath();
				// dispatch('test.pass', { pkg, group, item });
				dispatch(TEST_ITEM_PASS, { pkg, group, item });
			})
			.on(EVENT_TEST_FAIL, (test, err) => {
				const item = test.title;
				const [pkg, group] = test.parent.titlePath();
				// dispatch('test.fail', { pkg, group, item, err });
				dispatch(TEST_ITEM_FAIL, { pkg, group, item, err });
			})
			.on(EVENT_TEST_END, test => {
				dispatch(TEST_ITEM_END);
			});
	}
}

export default MochaReporter;
