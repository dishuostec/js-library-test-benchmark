import pinned from './packages.pinned.js';

export { pinned };

const packages = {
	'lodash-es/cloneDeep': true,
	klona: 'klona',
	'klona/full': 'klona',
	'klona/lite': 'klona',
	'klona/json': 'klona',
	'clone': true,
	'clone:include': (m) => x => m.default(x, { includeNonEnumerable: true }),
	'clone-deep': true,
	'deep-copy': true,
	'rfdc:default': (m) => m.default(),
	'rfdc:proto': (m) => m.default({ proto: true }),
	'rfdc:circles': (m) => m.default({ circles: true }),
	'rfdc:all': (m) => m.default({ proto: true, circles: true }),
};

export default packages;

export const append_packages = {
	JSON: (x) => JSON.parse(JSON.stringify(x)),
};

const uncloneable = {
	'uncloneable': {
		'Dom elements': 'Infinite loop',
	},
	'uncloneable #2': {
		'Dom elements': 'Infinite loop',
	},
};

export const known_issues = {
	'deep-copy': {
		...uncloneable,
	},
	'rfdc:proto': {
		'arrayViews': {
			'DataView': 'Infinite loop',
		},
		...uncloneable,
	},
	'rfdc:all': {
		...uncloneable,
	},
};
