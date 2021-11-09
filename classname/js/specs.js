const foo = () => {};

/** @type {SpecDefine[]} */
const specs = [
	{
		description: 'classcat',
		tests: [
			{
				description: 'nothing, null, undefined',
				check: [
					{ args: [], expect: '' },
					{ args: [null], expect: '' },
					{ args: [undefined], expect: '' },
					{ args: [[, , , null, undefined]], expect: '' },
				],
			},
			{
				description: 'empty objects',
				check: [
					{ args: [{}], expect: '' },
					{ args: [[]], expect: '' },
					{ args: [[{}]], expect: '' },
					{ args: [[{}, {}, {}]], expect: '' },
				],
			},
			{
				description: 'booleans',
				check: [
					{ args: [true], expect: '' },
					{ args: [false], expect: '' },
					{ args: [[true, false]], expect: '' },
				],
			},
			{
				description: 'numbers',
				check: [
					{ args: [0], expect: '0' },
					{ args: [[0, 1]], expect: '0 1' },
					{ args: [{ 0: true, 1: true }], expect: '0 1' },
				],
			},
			{
				description: 'empty strings',
				check: [
					{ args: [''], expect: '' },
					{
						args: [{
							elf: '',
							orc: '',
							gnome: '',
						}], expect: '',
					},
					{ args: [['', '', '']], expect: '' },
				],
			},
			{
				description: 'arrays of strings',
				check: [
					{ args: [['elf', 'orc', false, 'gnome']], expect: 'elf orc gnome' },
				],
			},
			{
				description: 'array of arrays',
				check: [
					{ args: [['elf', ['orc', [false, 'gnome']]]], expect: 'elf orc gnome' },
				],
			},
			{
				description: 'object of key:string pairs',
				check: [
					{
						args: [{
							elf: true,
							orc: true,
							dodo: false,
							gnome: true,
						}], expect: 'elf orc gnome',
					},
				],
			},
			{
				description: 'array of objects and arrays',
				check: [
					{
						args: [[
							'elf',
							'half-orc',
							{
								'half-elf': true,
							},
							['gnome', 'goblin', 'dwarf'],
						]], expect: 'elf half-orc half-elf gnome goblin dwarf',
					},
				],
			},
		],
	},
	{
		description: 'clsx',
		tests: [
			{
				description: 'strings',
				check: [
					{ args: [''], expect: '' },
					{ args: ['foo'], expect: 'foo' },
					{ args: [true && 'foo'], expect: 'foo' },
					{ args: [false && 'foo'], expect: '' },
				],
			},
			{
				description: 'strings (variadic)',
				check: [
					{ args: ['', ''], expect: '' },
					{ args: ['foo', 'bar'], expect: 'foo bar' },
					{ args: [true && 'foo', false && 'bar', 'baz'], expect: 'foo baz' },
					{ args: [false && 'foo', 'bar', 'baz', ''], expect: 'bar baz' },
				],
			},
			{
				description: 'objects',
				check: [
					{ args: [{}], expect: '' },
					{ args: [{ foo: true }], expect: 'foo' },
					{ args: [{ foo: true, bar: false }], expect: 'foo' },
					{ args: [{ foo: 'hiya', bar: 1 }], expect: 'foo bar' },
					{ args: [{ foo: 1, bar: 0, baz: 1 }], expect: 'foo baz' },
					{ args: [{ '-foo': 1, '--bar': 1 }], expect: '-foo --bar' },
				],
			},
			{
				description: 'objects (variadic)',
				check: [
					{ args: [{}, {}], expect: '' },
					{ args: [{ foo: 1 }, { bar: 2 }], expect: 'foo bar' },
					{ args: [{ foo: 1 }, null, { baz: 1, bat: 0 }], expect: 'foo baz' },
					{
						args: [{ foo: 1 }, {}, {}, { bar: 'a' }, { baz: null, bat: Infinity }],
						expect: 'foo bar bat',
					},
				],
			},
			{
				description: 'arrays',
				check: [
					{ args: [[]], expect: '' },
					{ args: [['foo']], expect: 'foo' },
					{ args: [['foo', 'bar']], expect: 'foo bar' },
					{ args: [['foo', 0 && 'bar', 1 && 'baz']], expect: 'foo baz' },
				],
			},
			{
				description: 'arrays (nested)',
				check: [
					{ args: [[[[]]]], expect: '' },
					{ args: [[[['foo']]]], expect: 'foo' },
					{ args: [[true, [['foo']]]], expect: 'foo' },
					{ args: [['foo', ['bar', ['', [['baz']]]]]], expect: 'foo bar baz' },
				],
			},
			{
				description: 'arrays (variadic)',
				check: [
					{ args: [[], []], expect: '' },
					{ args: [['foo'], ['bar']], expect: 'foo bar' },
					{ args: [['foo'], null, ['baz', ''], true, '', []], expect: 'foo baz' },
				],
			},
			{
				description: 'arrays (no `push` escape)',
				check: [
					{ args: [{ push: 1 }], expect: 'push' },
					{ args: [{ pop: true }], expect: 'pop' },
					{ args: [{ push: true }], expect: 'push' },
					{ args: ['hello', { world: 1, push: true }], expect: 'hello world push' },
				],
			},
			{
				description: 'functions',
				check: [
					{ args: [foo, 'hello'], expect: 'hello' },
					{ args: [foo, 'hello', [[foo], 'world']], expect: 'hello world' },
				],
			},
		],
	},
	{
		description: 'classnames',
		tests: [
			{
				description: 'keeps object keys with truthy values',
				args: [{
					a: true,
					b: false,
					c: 0,
					d: null,
					e: undefined,
					f: 1,
				}],
				expect: 'a f',
			},
			{
				description: 'joins arrays of class names and ignore falsy values',
				args: ['a', 0, null, undefined, true, 1, 'b'],
				expect: 'a 1 b',
			},
			{
				description: 'supports heterogenous arguments',
				args: [{ a: true }, 'b', 0],
				expect: 'a b',
			},
			{
				description: 'should be trimmed',
				args: ['', 'b', {}, ''],
				expect: 'b',
			},
			{
				description: 'returns an empty string for an empty configuration',
				args: [{}],
				expect: '',
			},
			{
				description: 'supports an array of class names',
				args: [['a', 'b']],
				expect: 'a b',
			},
			{
				description: 'joins array arguments with string arguments',
				check: [
					{ args: [['a', 'b'], 'c'], expect: 'a b c' },
					{ args: ['c', ['a', 'b']], expect: 'c a b' },
				],
			},
			{
				description: 'handles multiple array arguments',
				args: [['a', 'b'], ['c', 'd']],
				expect: 'a b c d',
			},
			{
				description: 'handles arrays that include falsy and true values',
				args: [['a', 0, null, undefined, false, true, 'b']],
				expect: 'a b',
			},
			{
				description: 'handles arrays that include arrays',
				args: [['a', ['b', 'c']]],
				expect: 'a b c',
			},
			{
				description: 'handles arrays that include objects',
				args: [['a', { b: true, c: false }]],
				expect: 'a b',
			},
			{
				description: 'handles deep array recursion',
				args: [['a', ['b', ['c', { d: true }]]]],
				expect: 'a b c d',
			},
			{
				description: 'handles arrays that are empty',
				args: ['a', []],
				expect: 'a',
			},
			{
				description: 'handles nested arrays that have empty nested arrays',
				args: ['a', [[]]],
				expect: 'a',
			},
			{
				description: 'handles all types of truthy and falsy property values as expected',
				args: [{
					// falsy:
					null: null,
					emptyString: '',
					noNumber: NaN,
					zero: 0,
					negativeZero: -0,
					false: false,
					undefined: undefined,

					// truthy (literally anything else):
					nonEmptyString: 'foobar',
					whitespace: ' ',
					function: Object.prototype.toString,
					emptyObject: {},
					nonEmptyObject: { a: 1, b: 2 },
					emptyList: [],
					nonEmptyList: [1, 2, 3],
					greaterZero: 1,
				}],
				expect: 'nonEmptyString whitespace function emptyObject nonEmptyObject emptyList nonEmptyList greaterZero',
			},
			{
				description: 'handles toString() method defined on object',
				args: [{
					toString: function() { return 'classFromMethod'; },
				}],
				expect: 'classFromMethod',
			},
			{
				description: 'handles toString() method defined inherited in object',
				args: [(() => {
					var Class1 = function() {};
					var Class2 = function() {};
					Class1.prototype.toString = function() { return 'classFromMethod'; };
					Class2.prototype = Object.create(Class1.prototype);
					return new Class2();
				})()],
				expect: 'classFromMethod',
			},
		],
	},
	{
		description: 'dedupe',
		tests: [
			{
				description: 'should dedupe',
				args: ['foo', 'bar', 'foo', 'bar', { foo: true }],
				expect: 'foo bar',
			},
			{
				description: 'should make sure subsequent objects can remove/add classes',
				args: ['foo', { foo: false }, { foo: true, bar: true }],
				expect: 'foo bar',
			},
			{
				description: 'should make sure object with falsy value wipe out previous classes',
				check: [
					{ args: ['foo foo', 0, null, undefined, true, 1, 'b', { 'foo': false }], expect: '1 b' },
					{ args: ['foo', 'foobar', 'bar', { foo: false }], expect: 'foobar bar' },
					{ args: ['foo', 'foo-bar', 'bar', { foo: false }], expect: 'foo-bar bar' },
					{ args: ['foo', '-moz-foo-bar', 'bar', { foo: false }], expect: '-moz-foo-bar bar' },
				],
			},
		],
	},
];

export default specs;