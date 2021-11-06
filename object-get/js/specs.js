const symbol = Symbol('a');

const falsey = [, null, undefined, false, 0, NaN, ''];

const empties = [[], {}].concat(falsey.slice(1));

const obj = {
	undef: undefined,
	zero: 0,
	one: 1,
	n: null,
	f: false,
	a: {
		two: 2,
		b: {
			three: 3,
			c: {
				four: 4,
			},
		},
	},
};

const multiple_key = (func, { object, key, value }) =>
	key.map(path => func(object, path, value));
const key_x_object = (func, { object, key, value }) =>
	key.map(path => object.map(o => func(o, path, value)));


function check(path, value, def) {
	const list = [];

	list.push({
		description: JSON.stringify(path),
		object: obj,
		key: path,
		value: def,
		check: value,
	});

	if (path) {
		path = path.split('.');

		list.push({
			description: JSON.stringify(path),
			object: obj,
			key: path,
			value: def,
			check: value,
		});
	}

	return list;
}

/** @type {SpecDefine[]} */
const specs = [
	{
		description: 'normal',
		tests: [
			check('', undefined),
			check('one', obj.one),
			check('one.two', undefined),
			check('a', obj.a),
			check('a.two', obj.a.two),
			check('a.b', obj.a.b),
			check('a.b.three', obj.a.b.three),
			check('a.b.c', obj.a.b.c),
			check('a.b.c.four', obj.a.b.c.four),
			check('n', obj.n),
			check('n.badkey', undefined),
			check('f', false),
			check('f.badkey', undefined),
		].flat(),
	},
	{
		description: 'with defaults',
		tests: [
			check('', 'foo', 'foo'),
			check('undef', 'foo', 'foo'),
			check('n', null, 'foo'),
			check('n.badkey', 'foo', 'foo'),
			check('zero', 0, 'foo'),
			check('a.badkey', 'foo', 'foo'),
			check('a.badkey.anotherbadkey', 'foo', 'foo'),
			check('f', false, 'foo'),
			check('f.badkey', 'foo', 'foo'),
		].flat(),
	},
	{
		description: 'object is undefined',
		tests: [
			{
				description: 'no defaults',
				object: undefined,
				key: 'one',
				check: undefined,
			},
			{
				description: 'with defaults',
				object: undefined,
				key: 'one',
				value: 'foo',
				check: 'foo',
			},
		],
	},
	{
		description: 'key is undefined',
		tests: [
			{
				description: 'no defaults',
				object: obj,
				key: undefined,
				check: undefined,
			},
			{
				description: 'with defaults',
				object: obj,
				key: undefined,
				value: 'foo',
				check: 'foo',
			},
		],
	},
	{
		description: 'get and result',
		// set: false,
		tests: [
			{
				description: 'get string keyed property values',
				object: { 'a': 1 },
				key: ['a', ['a']],
				run: multiple_key,
				check: [1, 1],
			},
			{
				description: 'preserve the sign of `0`',
				object: { '-0': 'a', '0': 'b' },
				key: [-0, Object(-0), 0, Object(0)],
				run: multiple_key,
				check: ['a', 'a', 'b', 'b'],
			},
			{
				description: 'get symbol keyed property values',
				object: (() => {
					var object = {};
					object[symbol] = 1;
					return object;
				})(),
				key: symbol,
				check: 1,
			},
			{
				description: 'get deep property values',
				object: { 'a': { 'b': 2 } },
				key: ['a.b', ['a', 'b']],
				run: multiple_key,
				check: [2, 2],
			},
			{
				description: 'get a key over a path',
				object: { 'a.b': 1, 'a': { 'b': 2 } },
				key: ['a.b', ['a.b']],
				run: multiple_key,
				check: [1, 1],
			},
			{
				description: 'not coerce array paths to strings',
				object: { 'a,b,c': 3, 'a': { 'b': { 'c': 4 } } },
				key: ['a', 'b', 'c'],
				check: 4,
			},
			{
				description: 'not ignore empty brackets',
				object: { 'a': { '': 1 } },
				key: 'a[]',
				check: 1,
			},
			{
				description: 'handle empty paths',
				object: [{}, { '': 3 }],
				key: [['', ''], [[], ['']]],
				run: (func, { object, key }) =>
					key.map(pair => [func(object[0], pair[0]), func(object[1], pair[1])]),
				check: [[undefined, 3], [undefined, 3]],
			},
			{
				description: 'handle complex paths',
				object: { 'a': { '-1.23': { '["b"]': { 'c': { '[\'d\']': { '\ne\n': { 'f': { 'g': 8 } } } } } } } },
				key: [
					'a[-1.23]["[\\"b\\"]"].c[\'[\\\'d\\\']\'][\ne\n][f].g',
					['a', '-1.23', '["b"]', 'c', '[\'d\']', '\ne\n', 'f', 'g'],
				],
				run: multiple_key,
				check: [8, 8],
			},
			{
				description: 'return `undefined` when `object` is nullish',
				object: [null, undefined],
				key: ['constructor', ['constructor']],
				run: key_x_object,
				check: [[undefined, undefined], [undefined, undefined]],
			},
			{
				description: 'return `undefined` for deep paths when `object` is nullish',
				object: [null, undefined],
				key: ['constructor.prototype.valueOf', ['constructor', 'prototype', 'valueOf']],
				run: key_x_object,
				check: [[undefined, undefined], [undefined, undefined]],
			},
			{
				description: 'return `undefined` if parts of `path` are missing',
				object: { 'a': [, null] },
				key: ['a[1].b.c', ['a', '1', 'b', 'c']],
				run: multiple_key,
				check: [undefined, undefined],
			},
			{
				description: 'be able to return `null` values',
				object: { 'a': { 'b': null } },
				key: ['a.b', ['a', 'b']],
				run: multiple_key,
				check: [null, null],
			},
			{
				description: 'follow `path` over non-plain objects',
				object: 0,
				key: ['a.b', ['a', 'b']],
				before: () => Number.prototype.a = { 'b': 2 },
				after: () => delete Number.prototype.a,
				run: multiple_key,
				check: [2, 2],
			},
			{
				description: 'return the default value for `undefined` values',
				object: { 'a': {} },
				key: ['a.b', ['a', 'b']],
				...(() => {
					const values = empties.concat(true, new Date, 1, /x/, 'a');
					const expected = values.map(v => [v, v]);

					return { values, expected, check: [expected, expected] };
				})(),
				run: (func, { values, object, key }) =>
					key.map(path => values.map(v => [func(object, path, v), func(null, path, v)])),
			},
			{
				description: 'return the default value when `path` is empty',
				object: {},
				key: [],
				value: 'a',
				check: 'a',
			},
		],
	},
];

export default specs;