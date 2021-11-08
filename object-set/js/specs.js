const symbol = Symbol('foo');

function Custom() {
	//
}

/** @type {SpecDefine[]} */
const specs = [
	{
		description: 'basic',
		tests: [
			{
				description: 'mutate original object',
				source: () => ({ foo: 1 }),
				key: 'bar',
				value: 123,
				check: (assert, actual) => {
					// assert.ok(actual === origin);
					assert.deepEqual(actual, { foo: 1, bar: 123 });
				},
			},

		],
	},
	{
		description: 'assign',
		tests: [
			{
				description: 'add value to key path :: shallow :: string',
				source: () => ({}),
				key: 'abc',
				value: 123,
				check: { abc: 123 },
			},
			{
				description: 'add value to key path :: shallow :: array',
				source: () => ({}),
				key: ['abc'],
				value: 123,
				check: { abc: 123 },
			},
			{
				description: 'add value to key path :: nested :: string',
				source: () => ({}),
				key: 'a.b.c',
				value: 123,
				check: { a: { b: { c: 123 } } },
			},
			{
				description: 'add value to key path :: nested :: array',
				source: () => ({}),
				key: ['a', 'b', 'c'],
				value: 123,
				check: { a: { b: { c: 123 } } },
			},
			{
				description: 'create Array via integer key :: string',
				source: () => ({}),
				key: ['foo', '0'],
				value: 123,
				check: (assert, actual) => {
					assert.instanceOf(actual.foo, Array);
					assert.deepEqual(actual, { foo: [123] });
				},
			},
			{
				description: 'create Array via integer key :: number',
				source: () => ({}),
				key: ['foo', 0],
				value: 123,
				check: (assert, actual) => {
					assert.instanceOf(actual.foo, Array);
					assert.deepEqual(actual, { foo: [123] });
				},
			},
		],
	},
	{
		description: 'array',
		tests: [
			{
				description: 'create array instead of object via numeric key :: simple',
				source: () => ({ a: 1 }),
				key: 'e.0',
				value: 2,
				check: (assert, input) => {
					assert.instanceOf(input.e, Array);
					assert.strictEqual(input.e[0], 2);
					assert.deepEqual(input, {
						a: 1,
						e: [2],
					});
				},
			},
			{
				description: 'create array instead of object via numeric key :: nested',
				source: () => ({ a: 1 }),
				key: 'e.0.0',
				value: 123,
				check: (assert, input) => {
					assert.instanceOf(input.e, Array);
					assert.strictEqual(input.e[0][0], 123);
					assert.deepEqual(input, {
						a: 1,
						e: [[123]],
					});
				},
			},
			{
				description: 'be able to create object inside of array',
				source: () => ({}),
				key: ['x', '0', 'z'],
				value: 123,
				check: (assert, input) => {
					assert.instanceOf(input.x, Array);
					assert.deepEqual(input, {
						x: [{ z: 123 }],
					});
				},
			},
			{
				description: 'create object from decimal-like key :: array :: zero :: string',
				source: () => ({}),
				key: ['x', '10.0', 'z'],
				value: 123,
				check: (assert, input) => {
					assert.notInstanceOf(input.x, Array);
					assert.deepEqual(input, {
						x: { '10.0': { z: 123 } },
					});
				},
			},
			{
				description: 'create array from decimal-like key :: array :: zero :: number',
				source: () => ({}),
				key: ['x', 10.0, 'z'],
				value: 123,
				check: (assert, input) => {
					assert.instanceOf(input.x, Array);
					const x = Array(10);
					x.push({ z: 123 });
					assert.deepEqual(input, { x });
				},
			},
			{
				description: 'create object from decimal-like key :: array :: nonzero',
				source: () => ({}),
				key: ['x', '10.2', 'z'],
				value: 123,
				check: (assert, input) => {
					assert.notInstanceOf(input.x, Array);
					assert.deepEqual(input, {
						x: { '10.2': { z: 123 } },
					});
				},
			},
		],
	},
	{
		description: 'objects',
		tests: ['overwrite', 'merge'].map((verb, is_merge) => {
			return [
				{
					description: `${verb} existing object value :: simple`,
					source: () => ({ hello: { a: 1 } }),
					key: 'hello',
					value: { foo: 123 },
					check: is_merge
						? { hello: { a: 1, foo: 123 } }
						: { hello: { foo: 123 } },
				},
				{
					description: `${verb} existing object value :: nested`,
					source: () => ({ a: { b: { c: 123 } } }),
					key: 'a.b',
					value: { foo: 123 },
					check: is_merge
						? { a: { b: { c: 123, foo: 123 } } }
						: { a: { b: { foo: 123 } } },
				},
				{
					description: `${verb} existing array value :: simple`,
					source: () => ([{ foo: 1 }]),
					key: '0',
					value: { bar: 2 },
					check: is_merge
						? [{ foo: 1, bar: 2 }]
						: [{ bar: 2 }],
				},
				{
					description: `${verb} existing array value :: nested`,
					source: () => ([
						{ name: 'bob', age: 56, friends: ['foobar'] },
						{ name: 'alice', age: 47, friends: ['mary'] },
					]),
					run: (fn, input) => {
						fn(input, '0', { age: 57, friends: ['alice', 'mary'] });
						fn(input, '1', { friends: ['bob'] });
						fn(input, '2', { name: 'mary', age: 49, friends: ['bob'] });
						return input;
					},
					check: is_merge
						? [
							{ name: 'bob', age: 57, friends: ['alice', 'mary'] },
							{ name: 'alice', age: 47, friends: ['bob'] },
							{ name: 'mary', age: 49, friends: ['bob'] },
						]
						: [
							{ age: 57, friends: ['alice', 'mary'] },
							{ friends: ['bob'] },
							{ name: 'mary', age: 49, friends: ['bob'] },
						],
				},
			];
		}).flat(),
	},
	{
		description: 'preserve',
		tests: [
			{
				description: 'preserve existing object structure',
				source: () => ({ a: { b: { c: 123 } } }),
				key: 'a.b.x.y',
				value: 456,
				check: {
					a: {
						b: {
							c: 123,
							x: {
								y: 456,
							},
						},
					},
				},
			},
			{
				description: 'overwrite existing non-object values as object',
				source: () => ({ a: { b: 123 } }),
				key: 'a.b.c',
				value: 'hello',
				check: {
					a: {
						b: {
							c: 'hello',
						},
					},
				},
			},
			{
				description: 'preserve existing object tree w/ array value',
				source: () => ({
					a: {
						b: {
							c: 123,
							d: {
								e: 5,
							},
						},
					},
				}),
				key: 'a.b.d.z',
				value: [1, 2, 3, 4],
				check: {
					a: {
						b: {
							c: 123,
							d: {
								e: 5,
								z: [1, 2, 3, 4],
							},
						},
					},
				},
			},
		],
	},
	{
		description: 'pollution',
		tests: [
			{
				description: 'protect against "__proto__" assignment',
				source: () => ({ abc: 123 }),
				run: (fn, input) => {
					const before = input.__proto__;
					fn(input, '__proto__.hello', 123);
					return [input, before];
				},
				after: () => {
					if ({}.__proto__.hasOwnProperty('hello')) {
						delete {}.__proto__.hello;
					}
				},
				check: (assert, [input, before]) => {
					assert.strictEqual(input.__proto__, before);
					assert.deepEqual(input, { abc: 123 });

					assert.notStrictEqual({}.hello, 123);
					assert.notStrictEqual((new Object).hello, 123);
					assert.notStrictEqual(Object.create(null).hello, 123);
				},
			},
			{
				description: 'protect against "__proto__" assignment :: nested',
				source: () => ({ abc: 123 }),
				run: (fn, input) => {
					const before = input.__proto__;
					fn(input, ['xyz', '__proto__', 'hello'], 123);
					return [input, before];
				},
				check: (assert, [input, before]) => {
					assert.strictEqual(input.__proto__, before);
					assert.deepEqual(input, {
						abc: 123,
						xyz: {
							// empty
						},
					});

					assert.strictEqual({}.hello, undefined);
					assert.strictEqual(input.hello, undefined);
					assert.strictEqual((new Object).hello, undefined);
					assert.strictEqual(Object.create(null).hello, undefined);
				},
			},
			{
				description: 'ignore "prototype" assignment',
				source: () => ({ a: 123 }),
				key: 'a.prototype.hello',
				value: 'world',
				check: (assert, input) => {

					assert.strictEqual(input.a.prototype, undefined);
					assert.strictEqual(input.a.hello, undefined);

					assert.deepEqual(input, {
						a: {
							// converted, then aborted
						},
					});

					assert.strictEqual(
						JSON.stringify(input),
						'{"a":{}}',
					);
				},
			},
			{
				description: 'ignore "constructor" assignment :: direct',
				source: () => ({ a: 123 }),
				key: 'a.constructor',
				value: Custom,
				check: (assert, input) => {
					assert.notStrictEqual(input.a.constructor, Custom);
					assert.notInstanceOf(input.a, Custom);

					assert.instanceOf(input.a.constructor, Object, '~> 123 -> {}');
					assert.isNotOk(input.a.hasOwnProperty('constructor'));
					assert.deepEqual(input, { a: {} });
				},
			},
			{
				description: 'ignore "constructor" assignment :: nested',
				source: () => ({}),
				key: 'constructor.prototype.hello',
				value: 'world',
				check: (assert, input) => {
					assert.isNotOk(input.hasOwnProperty('constructor'));
					assert.isNotOk(input.hasOwnProperty('hello'));

					assert.deepEqual(input, {
						// empty
					});
				},
			},
		],
	},

	{
		description: 'edge case',
		tests: [
			{
				description: 'preserve the sign of `0` #1',
				source: () => ({ '-0': 'a', '0': 'b' }),
				key: -0,
				value: 2,
				check: { '-0': 2, '0': 'b' },
			},
			{
				description: 'preserve the sign of `0` #2',
				source: () => ({ '-0': 'a', '0': 'b' }),
				key: Object(-0),
				value: 2,
				check: { '-0': 2, '0': 'b' },
			},
			{
				description: 'preserve the sign of `0` #3',
				source: () => ({ '-0': 'a', '0': 'b' }),
				key: 0,
				value: 2,
				check: { '-0': 'a', '0': 2 },
			},
			{
				description: 'preserve the sign of `0` #4',
				source: () => ({ '-0': 'a', '0': 'b' }),
				key: Object(0),
				value: 2,
				check: { '-0': 'a', '0': 2 },
			},
			{
				description: 'unset symbol keyed property values',
				source: () => ({}),
				key: symbol,
				value: 1,
				check: (assert, object) => {
					assert.strictEqual(_.unset(object, symbol), true);
					assert.isOk(!(symbol in object));
				},
			},
			{
				description: 'set a key over a path',
				source: () => ({ 'a.b': 1 }),
				key: ['a.b'],
				value: 2,
				check: { 'a.b': 2 },
			},
			{
				description: 'not coerce array paths to strings',
				source: () => ({ 'a,b,c': 1, 'a': { 'b': { 'c': 1 } } }),
				key: ['a', 'b', 'c'],
				value: 2,
				check: { 'a,b,c': 1, 'a': { 'b': { 'c': 2 } } },
			},
			{
				description: 'not ignore empty brackets',
				source: () => ({}),
				key: 'a[]',
				value: 2,
				check: { 'a': { '': 2 } },
			},
			...[
				{ key: '', check: { '': 2 } },
				{ key: [], check: {} },
				{ key: [''], check: { '': 2 } },
			].map(({ key, check }, i) => ({
				description: `handle empty paths #${i + 1}`,
				source: () => ({}),
				key,
				value: 2,
				check,
			})),
			...[
				'a[-1.23]["[\\"b\\"]"].c[\'[\\\'d\\\']\'][\ne\n][f].g',
				['a', '-1.23', '["b"]', 'c', '[\'d\']', '\ne\n', 'f', 'g'],
			].map((key, i) => ({
				description: `handle complex paths #${i + 1}`,
				source: () => ({ 'a': { '1.23': { '["b"]': { 'c': { '[\'d\']': { '\ne\n': { 'f': { 'g': 1 } } } } } } } }),
				key,
				value: 2,
				check: (assert, object) => {
					assert.strictEqual(object.a[-1.23]['["b"]'].c['[\'d\']']['\ne\n'].f.g, 2);
				},
			})),
			...[
				'a[1].b.c',
				['a', '1', 'b', 'c'],
			].map((key, i) => ({
				description: `create parts of \`path\` that are missing #${i + 1}`,
				source: () => ({}),
				key,
				value: 2,
				check: (assert, actual) => {
					assert.deepStrictEqual(actual, { 'a': [undefined, { 'b': { 'c': 2 } }] });
					assert.isOk(!('0' in actual.a));
				},
			})),
			...[
				{ s: null, check: null },
				{ s: undefined, check: undefined },
			].map(({ s, check }, i) => ({
				description: `not error when \`object\` is nullish #${i + 1}`,
				source: () => s,
				key: 'a.b',
				value: 2,
				check,
			})),
			{
				description: 'not create an array for missing non-index property names that start with numbers',
				source: () => ({}),
				key: ['1a', '2b', '3c'],
				value: 2,
				check: { '1a': { '2b': { '3c': 2 } } },
			},
			...['a', ['a'], { 'a': 1 }, NaN]
				.map((value, i) => ({
					description: `not assign values that are the same as their destinations #${i + 1}`,
					source: () => {
						const object = {};
						Object.defineProperty(object, 'a', {
							'configurable': true,
							'enumerable': true,
							'get': () => value,
							'set': function() { object.changed = true; },
						});
						return object;
					},
					key: 'a',
					value,
					check: { a: value },
				})),
		],
	},
];

export default specs;