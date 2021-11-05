const HAS_BUFFER = typeof Buffer !== 'undefined';

const LARGE_ARRAY_SIZE = 200;

const objectProto = Object.prototype;

const symbol = Symbol('a');
const symbol2 = Symbol('b');
const symbol3 = Symbol('c');

const asyncFunc = () => Function('return async () => {}');
const genFunc = () => Function('return function*(){}');


function Foo() {
	this.a = 1;
}

Foo.prototype.b = 1;
Foo.c = function() {};

class Test {
	constructor(num = 123) {
		this.value = num;
		this.items = [1, 2, 3];
	}

	get number() {
		return this.value;
	}
}

/** @type {SpecDefine[]} */
const specs = [
	{
		description: 'JSON',
		tests: [
			{ description: 'booleans', value: () => false },
			{ description: 'numbers', value: () => 0 },
			{ description: 'strings', value: () => 'a' },
			{ description: 'null', value: () => null },
			{ description: 'arrays', value: () => ['a', ''] },
			{ description: 'objects', value: () => ({ 'a': 0, 'b': 1, 'c': 2 }) },
			{ description: 'array-like', value: () => ({ '0': 'a', 'length': 1 }) },
			{
				description: 'array of objects',
				value: () => ([{ 'a': 0 }, { 'b': 1 }]),
				check: (assert, actual, array) => {
					assert.deepEqual(actual, array);
					assert.notStrictEqual(actual, array);
					assert.notStrictEqual(actual[0], array[0]);
					assert.notStrictEqual(actual[1], array[1]);
				},
			},
		],
	},

	{
		description: 'common',
		tests: [
			{ description: 'undefined', value: () => undefined },
			{ description: 'date object', value: () => new Date },
			{
				description: 'objects with object values',
				value: () => ({ 'a': /a/, 'b': ['B'], 'c': { 'C': 1 } }),
			},
			{ description: 'regexes', value: () => /a/gim },
			{ description: 'sets', value: () => new Set([1, 2]) },
			{ description: 'maps', value: () => new Map([['a', 1], ['b', 2]]) },
			{
				description: 'symbol',
				value: () => symbol,
				check: (assert, actual) => {
					assert.strictEqual(actual, symbol);
				},
			},
		],
	},

	{
		description: 'example',
		tests: [
			{
				description: 'json',
				value: () => [
					{
						'_id': '5e16d8c6d7eee2857c907fbe',
						'index': 0,
						'nickname': null,
						'isActive': false,
						'balance': 2077.55,
						'picture': 'http://placehold.it/32x32',
						'age': 33,
						'details': {
							'email': 'ericksonphillips@retrotex.com',
							'address': {
								'street': '554 Lyme Avenue',
								'city': 'Harborton',
								'state': 'Texas',
								'zipcode': 4945,
								'coords': {
									'latitude': 61.497735,
									'longitude': -38.711066,
								},
							},
						},
						'interests': [
							'amet',
							'voluptate',
							'sit',
							'duis',
							'fugiat',
							'consectetur',
							'amet',
						],
						'friends': [
							{
								'id': 0,
								'name': 'Belinda Chandler',
								'friends_common': {
									'count': 2,
									'friends_of_friends': [
										{
											'id': 0,
											'name': 'George Ayala',
										},
										{
											'id': 1,
											'name': 'Nadia Nguyen',
										},
									],
								},
							},
							{
								'id': 1,
								'name': 'Sheena Kidd',
								'friends_common': {
									'count': 2,
									'friends_of_friends': [
										{
											'id': 0,
											'name': 'Kimberly Martinez',
										},
										{
											'id': 1,
											'name': 'Meadows Fitzpatrick',
										},
									],
								},
							},
							{
								'id': 2,
								'name': 'Winnie Mccarthy',
								'friends_common': {
									'count': 2,
									'friends_of_friends': [
										{
											'id': 0,
											'name': 'Robbie Dale',
										},
										{
											'id': 1,
											'name': 'Orr Houston',
										},
									],
								},
							},
						],
					},
					{
						'_id': '5e16d8c6ed426d1c22bf306b',
						'index': 1,
						'nickname': null,
						'isActive': false,
						'balance': 2916.08,
						'picture': 'http://placehold.it/32x32',
						'age': 20,
						'details': {
							'email': 'orrhouston@retrotex.com',
							'address': {
								'street': '962 McDonald Avenue',
								'city': 'Lithium',
								'state': 'West Virginia',
								'zipcode': 4536,
								'coords': {
									'latitude': 83.372808,
									'longitude': 150.181923,
								},
							},
						},
						'interests': [
							'eu',
							'et',
							'dolore',
							'sunt',
							'elit',
							'nulla',
							'fugiat',
						],
						'friends': [
							{
								'id': 0,
								'name': 'Hood Washington',
								'friends_common': {
									'count': 2,
									'friends_of_friends': [
										{
											'id': 0,
											'name': 'Hebert Delacruz',
										},
										{
											'id': 1,
											'name': 'Sharp Rose',
										},
									],
								},
							},
							{
								'id': 1,
								'name': 'Karla Velasquez',
								'friends_common': {
									'count': 2,
									'friends_of_friends': [
										{
											'id': 0,
											'name': 'Carey Holman',
										},
										{
											'id': 1,
											'name': 'Baird Short',
										},
									],
								},
							},
							{
								'id': 2,
								'name': 'Juliet Oneal',
								'friends_common': {
									'count': 2,
									'friends_of_friends': [
										{
											'id': 0,
											'name': 'Owens Richards',
										},
										{
											'id': 1,
											'name': 'Lily Olsen',
										},
									],
								},
							},
						],
					},
				],
				check: (assert, output, input) => {
					assert.deepEqual(output, input, 'initial copy');

					output[0].age++;
					assert.notEqual(input[0].age, 34, 'increment');

					output[1].details.address.coords.longitude = 100;
					assert.notEqual(input[1].details.address.coords.longitude, 100, 'nested assignment');

					output[0].friends[1].friends_common.friends_of_friends.push('BOB');
					assert.equal(input[0].friends[1].friends_common.friends_of_friends.includes('BOB'), false, 'nested push');
				},
			},
			{
				description: 'lite',
				value: () => ([
					{
						'_id': '5e16d8c6d7eee2857c907fbe',
						'index': 0,
						'nickname': null,
						'isActive': false,
						'balance': 2077.55,
						'password': undefined,
						'picture': 'http://placehold.it/32x32',
						'age': 33,
						'joined': new Date(),
						'locales': /(EN|ES)/i,
						'details': {
							'email': 'ericksonphillips@retrotex.com',
							'address': {
								'street': '554 Lyme Avenue',
								'city': 'Harborton',
								'state': 'Texas',
								'zipcode': 4945,
								'coords': {
									'latitude': 61.497735,
									'longitude': -38.711066,
								},
							},
						},
						'interests': [
							'amet',
							'voluptate',
							'sit',
							'duis',
							'fugiat',
							'consectetur',
							'amet',
						],
						'friends': [
							{
								'id': 0,
								'name': 'Belinda Chandler',
								'friends_common': {
									'count': 2,
									'friends_of_friends': [
										{
											'id': 0,
											'name': 'George Ayala',
										},
										{
											'id': 1,
											'name': 'Nadia Nguyen',
										},
									],
								},
							},
							{
								'id': 1,
								'name': 'Sheena Kidd',
								'friends_common': {
									'count': 2,
									'friends_of_friends': [
										{
											'id': 0,
											'name': 'Kimberly Martinez',
										},
										{
											'id': 1,
											'name': 'Meadows Fitzpatrick',
										},
									],
								},
							},
							{
								'id': 2,
								'name': 'Winnie Mccarthy',
								'friends_common': {
									'count': 2,
									'friends_of_friends': [
										{
											'id': 0,
											'name': 'Robbie Dale',
										},
										{
											'id': 1,
											'name': 'Orr Houston',
										},
									],
								},
							},
						],
					},
					{
						'_id': '5e16d8c6ed426d1c22bf306b',
						'index': 1,
						'nickname': null,
						'isActive': false,
						'balance': 2916.08,
						'password': undefined,
						'picture': 'http://placehold.it/32x32',
						'age': 20,
						'joined': new Date(),
						'locales': /(EN)/i,
						'details': {
							'email': 'orrhouston@retrotex.com',
							'address': {
								'street': '962 McDonald Avenue',
								'city': 'Lithium',
								'state': 'West Virginia',
								'zipcode': 4536,
								'coords': {
									'latitude': 83.372808,
									'longitude': 150.181923,
								},
							},
						},
						'interests': [
							'eu',
							'et',
							'dolore',
							'sunt',
							'elit',
							'nulla',
							'fugiat',
						],
						'friends': [
							{
								'id': 0,
								'name': 'Hood Washington',
								'friends_common': {
									'count': 2,
									'friends_of_friends': [
										{
											'id': 0,
											'name': 'Hebert Delacruz',
										},
										{
											'id': 1,
											'name': 'Sharp Rose',
										},
									],
								},
							},
							{
								'id': 1,
								'name': 'Karla Velasquez',
								'friends_common': {
									'count': 2,
									'friends_of_friends': [
										{
											'id': 0,
											'name': 'Carey Holman',
										},
										{
											'id': 1,
											'name': 'Baird Short',
										},
									],
								},
							},
							{
								'id': 2,
								'name': 'Juliet Oneal',
								'friends_common': {
									'count': 2,
									'friends_of_friends': [
										{
											'id': 0,
											'name': 'Owens Richards',
										},
										{
											'id': 1,
											'name': 'Lily Olsen',
										},
									],
								},
							},
						],
					},
				]),
				check: (assert, copy, input) => {
					assert.deepEqual(copy, input, 'initial copy');

					copy[0].age++;
					assert.notEqual(input[0].age, 34, 'increment');

					copy[1].details.address.coords.longitude = 100;
					assert.notEqual(input[1].details.address.coords.longitude, 100, 'nested assignment');

					copy[0].friends[1].friends_common.friends_of_friends.push('BOB');
					assert.equal(input[0].friends[1].friends_common.friends_of_friends.includes('BOB'), false, 'nested push');

					input[0].joined.setHours(9);
					assert.notEqual(input[0].joined, copy[0].joined);

					copy[0].joined.setMinutes(56);
					assert.notEqual(input[0].joined, copy[0].joined);

					copy[1].locales.lastIndex = 9;
					assert.notEqual(input[1].locales.lastIndex, copy[1].locales.lastIndex);
				},
			},
			{
				description: 'default',
				value: () => ({
					regexp: /foo[\\\/](?=\d)/,
					array: [
						new Date(),
						new Date(100),
						'invalid date',
						Date.now(),
					],
					map: new Map([
						[{ foo: 1 }, { a: 1 }],
						[{ bar: 2 }, { b: 2 }],
					]),
					set: new Set([
						{ foo: 1 }, { bar: 2 }, [1, 2, 3],
					]),
					custom: new Test(456),
					int8arr: new Int8Array([4, 5, 6]),
					dataview: new DataView(new ArrayBuffer(4)),
					buffer: HAS_BUFFER ? Buffer.from('hello') : null,
				}),
				check: (assert, copy, input) => {
					assert.deepEqual(copy, input, 'initial copy');

					// RegExp
					copy.regexp.lastIndex = 9;
					assert.notEqual(input.regexp.lastIndex, 9, 'regexp.lastindex');

					// Array + Date
					input.array[0].setMinutes(1);
					assert.notEqual(copy.array[0].getMinutes(), 0, 'Array<Date> #1');

					copy.array[3] = new Date(copy.array[3]);
					assert.notEqual(input.array[3] instanceof Date, true, 'Array<Date> #2');

					// Set
					input.set.add(9);
					assert.equal(copy.set.has(9), false, 'Set #1');

					[...copy.set][2].push(123);
					assert.deepEqual([...input.set][2], [1, 2, 3], 'Set #2');
					assert.deepEqual([...copy.set][2], [1, 2, 3, 123], 'Set #3');

					// Map
					input.map.set('hello', 'world');
					assert.equal(copy.map.has('hello'), false, 'Map #1');

					[...copy.map.keys()][0].bar = 123;
					assert.deepEqual([...input.map.keys()][0], { foo: 1 }, 'Map #2');
					assert.deepEqual([...copy.map.keys()][0], { foo: 1, bar: 123 }, 'Map #3');

					// Class
					input.custom.value = 789;
					assert.equal(copy.custom.number, 456, 'Class #1');

					input.custom.items.push(789);
					assert.deepEqual(copy.custom.items, [1, 2, 3], 'Class #2');

					copy.custom.items.pop();
					assert.equal(input.custom.items.length, 4, 'Class #3');

					// Int8Array
					copy.int8arr[1] = 42;
					assert.equal(input.int8arr[1], 5, 'Int8 #1');

					input.int8arr[0] = 0;
					assert.equal(copy.int8arr[0], 4, 'Int8 #2');

					if (HAS_BUFFER) {
						// Buffer :: "hello"
						copy.buffer.write('foobar');
						assert.equal(input.buffer.toString(), 'hello', 'Buffer #1');

						copy.buffer[1] = 11;
						assert.notEqual(input.buffer[1], copy.buffer[1], 'Buffer #2');

						const current = copy.buffer.toString();
						input.buffer.write('hello');
						assert.equal(copy.buffer.toString(), current, 'Buffer #3');
					}

					// DataView :: [0, 0, 0]
					input.dataview.setInt8(1, 1);
					assert.equal(input.dataview.getInt8(1), 1, 'Dataview #1');
					assert.equal(copy.dataview.getInt8(1), 0, 'Dataview #2');

					copy.dataview.setInt8(0, 3);
					assert.equal(input.dataview.getInt8(0), 0, 'Dataview #3');
					assert.equal(copy.dataview.getInt8(0), 3, 'Dataview #4');
				},
			},
			{
				description: 'full',
				...(() => {
					const symbol1 = Symbol('foo');
					const symbol2 = Symbol('bar');

					return {
						value: () => {
							const item = {
								regexp: /foo[\\\/](?=\d)/,
								array: [
									new Date(),
									new Date(100),
									'invalid date',
									Date.now(),
								],
								map: new Map([
									[{ foo: 1 }, { a: 1 }],
									[{ bar: 2 }, { b: 2 }],
								]),
								set: new Set([
									{ foo: 1 }, { bar: 2 }, [1, 2, 3],
								]),
								int8arr: new Int8Array([4, 5, 6]),
								buffer: HAS_BUFFER ? Buffer.from('hello') : null,
								symbol1: symbol1,
								symbol2: symbol2,
								[symbol1]: 'hello',
								[symbol2]: [1, 2, 3, 4],
							};

							Object.defineProperty(item, 'hidden1', {
								enumerable: false,
								value: 'found me',
							});

							Object.defineProperty(item, 'hidden2', {
								enumerable: false,
								value: [1, 2, 3],
							});

							Object.defineProperty(item, 'secret', {
								enumerable: false,
								get() {
									return 'password';
								},
							});

							return item;
						},
					};
				})(),
				check: (assert, copy, input) => {
					// assert.deepStrictEqual(copy, input, 'initial copy');

					// RegExp
					copy.regexp.lastIndex = 9;
					assert.notEqual(input.regexp.lastIndex, 9, 'regexp.lastindex');

					// Array + Date
					input.array[0].setMinutes(1);
					assert.notEqual(copy.array[0].getMinutes(), 0, 'Array<Date> #1');

					copy.array[3] = new Date(copy.array[3]);
					assert.notEqual(input.array[3] instanceof Date, true, 'Array<Date> #2');

					// Set
					input.set.add(9);
					assert.equal(copy.set.has(9), false, 'Set #1');

					[...copy.set][2].push(123);
					assert.deepEqual([...input.set][2], [1, 2, 3], 'Set #2');
					assert.deepEqual([...copy.set][2], [1, 2, 3, 123], 'Set #3');

					// Map
					input.map.set('hello', 'world');
					assert.equal(copy.map.has('hello'), false, 'Map #1');

					[...copy.map.keys()][0].bar = 123;
					assert.deepEqual([...input.map.keys()][0], { foo: 1 }, 'Map #2');
					assert.deepEqual([...copy.map.keys()][0], { foo: 1, bar: 123 }, 'Map #3');

					// Int8Array
					copy.int8arr[1] = 42;
					assert.equal(input.int8arr[1], 5, 'Int8 #1');

					input.int8arr[0] = 0;
					assert.equal(copy.int8arr[0], 4, 'Int8 #2');

					if (HAS_BUFFER) {
						// Buffer :: "hello"
						copy.buffer.write('foobar');
						assert.equal(input.buffer.toString(), 'hello', 'Buffer #1');

						copy.buffer[1] = 11;
						assert.notEqual(input.buffer[1], copy.buffer[1], 'Buffer #2');

						const current = copy.buffer.toString();
						input.buffer.write('hello');
						assert.equal(copy.buffer.toString(), current, 'Buffer #3');
					}

					// Symbol
					assert.equal(input.symbol1, copy.symbol1, 'Symbol #1');
					assert.equal(input.symbol2, copy.symbol2, 'Symbol #2');

					// Symbol Properties
					assert.equal(input[input.symbol1], 'hello', 'SymProp #1');
					assert.equal(copy[copy.symbol1], 'hello', 'SymProp #2');

					input[input.symbol2].push(7, 8, 9);
					assert.equal(input[input.symbol2].length, 7, 'SymProp #3');
					assert.equal(copy[copy.symbol2].length, 4, 'SymProp #4');

					copy[copy.symbol2].push('hello');
					assert.equal(input[input.symbol2].length, 7, 'SymProp #3');
					assert.equal(copy[copy.symbol2].length, 5, 'SymProp #4');

					// NON-Enumerable Properties
					assert.deepEqual(
						Object.getOwnPropertyDescriptor(input, 'hidden1'),
						Object.getOwnPropertyDescriptor(copy, 'hidden1'),
						'Hidden #1',
					);

					assert.deepEqual(
						Object.getOwnPropertyDescriptor(input, 'hidden2'),
						Object.getOwnPropertyDescriptor(copy, 'hidden2'),
						'Hidden #2',
					);

					assert.equal(input.secret, copy.secret, 'Hidden #3');

					copy.hidden2.push('hello');
					assert.equal(input.hidden2.includes('hello'), false, 'Hidden #4');
				},
			},
		],
	},

	{
		description: 'object',
		tests: [
			{ description: '`arguments` object', value: function() {return arguments; } },
			{ description: 'boolean objects', value: () => Object(false) },
			{ description: 'number object', value: () => Object(0) },
			{ description: 'string object', value: () => Object('a') },
			{
				description: 'symbol object',
				value: () => Object(symbol),
				check: (assert, actual, value) => {
					assert.strictEqual(typeof actual, 'object');
					assert.strictEqual(typeof actual.valueOf(), 'symbol');
					assert.notStrictEqual(actual, value);
				},
			},
			{
				description: 'circular references',
				value: () => {
					const object = {
						'foo': { 'b': { 'c': { 'd': {} } } },
						'bar': {},
					};

					object.foo.b.c.d = object;
					object.bar.b = object.foo.b;
					return object;
				},
				check: (assert, actual, object) => {
					assert.ok(actual.bar.b === actual.foo.b && actual === actual.foo.b.c.d && actual !== object);
				},
			},
			{
				description: 'objects with circular references',
				value: () => {
					const cyclical = {};
					for (let i = 0; i <= LARGE_ARRAY_SIZE; i++) {
						cyclical['v' + i] = [i ? cyclical['v' + (i - 1)] : cyclical];
					}
					return cyclical;
				},
				check: (assert, clone, cyclical) => {
					const actual = clone['v' + LARGE_ARRAY_SIZE][0];
					assert.strictEqual(actual, clone['v' + (LARGE_ARRAY_SIZE - 1)]);
					assert.notStrictEqual(actual, cyclical['v' + (LARGE_ARRAY_SIZE - 1)]);
				},
			},
		],
	},

	{
		description: 'expando object',
		tests: [false, true, 1, 'a'].map(v => ({
			description: JSON.stringify(v),
			value: () => {
				const object = Object(v);
				object.a = 1;
				return object;
			},
		})),
		check: (assert, actual) => {
			assert.strictEqual(actual.a, 1);
		},
	},

	{
		description: 'array',
		tests: [
			{
				description: 'modify length',
				value: () => {
					const arr = ['a', ''];
					arr.length = 3;
					return arr;
				},
				check: (assert, actual, array) => {
					assert.deepEqual(actual, array);
					assert.deepEqual(actual.length, array.length);
				},
			},
			{
				description: 'array buffers', value: () => new ArrayBuffer(2),
				check: (assert, actual, buffer) => {
					assert.strictEqual(actual.byteLength, buffer.byteLength);
					assert.notStrictEqual(actual, buffer);
				},
			},
			{
				description: 'buffers', value: () => new Uint8Array([1, 2]),
				check: (assert, actual, buffer) => {
					assert.strictEqual(actual.byteLength, buffer.byteLength);
					// assert.strictEqual(actual.inspect(), buffer.inspect());
					assert.strictEqual(actual.toString(), buffer.toString());
					assert.notStrictEqual(actual, buffer);

					buffer[0] = 2;
					assert.strictEqual(actual[0], 1);
				},
			},
			{
				description: '`index` and `input` of array properties',
				value: () => /c/.exec('abcde'),
				check: (assert, actual) => {
					assert.strictEqual(actual.index, 2);
					assert.strictEqual(actual.input, 'abcde');
				},
			},
			{
				description: '`lastIndex` regexp property', value: () => {
					const regexp = /c/g;
					regexp.exec('abcde');
					return regexp;
				},
				check: (assert, actual) => {
					assert.strictEqual(actual.lastIndex, 3);
				},
			},
		],
	},

	{
		description: 'Class',
		tests: [
			{ description: 'Foo instance', value: () => new Foo },
			{
				description: 'prototype objects',
				value: () => Foo.prototype,
				check: (assert, actual) => {
					assert.ok(!(actual instanceof Foo));
					assert.deepEqual(actual, { 'b': 1 });
				},
			},
			{
				description: 'set the `[[Prototype]]` of a clone',
				value: () => new Foo,
				// check: (assert, actual) => assert.ok(actual instanceof Foo),
				check: (assert, actual) => assert.instanceOf(actual, Foo),
			},
			{
				description: 'set the `[[Prototype]]` of a clone even when the `constructor` is incorrect',
				value: () => new Foo,
				before: () => {Foo.prototype.constructor = Object;},
				after: () => {Foo.prototype.constructor = Foo;},
				check: (assert, actual) => assert.instanceOf(actual, Foo),
				// check: (assert, actual) => assert.ok(actual instanceof Foo),
			},
			{
				description: 'ensure `value` constructor is a function before using its `[[Prototype]]`',
				value: () => new Foo,
				before: () => {Foo.prototype.constructor = null;},
				after: () => {Foo.prototype.constructor = Foo;},
				check: (assert, actual) => assert.notInstanceOf(actual, Foo),
			},
			{
				description: 'clone properties that shadow those on `Object.prototype`',
				value: () => ({
					'constructor': objectProto.constructor,
					'hasOwnProperty': objectProto.hasOwnProperty,
					'isPrototypeOf': objectProto.isPrototypeOf,
					'propertyIsEnumerable': objectProto.propertyIsEnumerable,
					'toLocaleString': objectProto.toLocaleString,
					'toString': objectProto.toString,
					'valueOf': objectProto.valueOf,
				}),
				check: (assert, actual, value) => {
					assert.deepEqual(actual, value);
					assert.notStrictEqual(actual, value);
				},
			},
			{
				description: 'symbol properties',
				value: () => {
					function Foo() {
						this[symbol] = { 'c': 1 };
					}

					Foo.prototype[symbol2] = 2;

					Object.defineProperty(Foo.prototype, symbol3, {
						'configurable': true,
						'enumerable': false,
						'writable': true,
						'value': 3,
					});

					const object = { 'a': { 'b': new Foo } };
					object[symbol] = { 'b': 1 };

					return object;
				},
				check: (assert, actual, value) => {
					assert.notStrictEqual(actual[symbol], value[symbol]);
					assert.notStrictEqual(actual.a, value.a);

					assert.deepEqual(actual[symbol], value[symbol]);
					assert.deepEqual(Object.getOwnPropertySymbols(actual.a.b), [symbol]);
					assert.deepEqual(actual.a.b[symbol], value.a.b[symbol]);
					assert.deepEqual(actual.a.b[symbol2], value.a.b[symbol2]);
					assert.deepEqual(actual.a.b[symbol3], value.a.b[symbol3]);
				},
			},
		],
	},

	{
		description: 'arrayViews',
		tests: [
			'Float32Array',
			'Float64Array',
			'Int8Array',
			'Int16Array',
			'Int32Array',
			'Uint8Array',
			'Uint8ClampedArray',
			'Uint16Array',
			'Uint32Array',
			'DataView',
		].map(type => {
			const Ctor = window[type];
			const buffer = new ArrayBuffer(24);

			return [
				{ description: type, value: () => new Ctor(buffer) },
				{ description: type, value: () => new Ctor(buffer, 8, 1) },
			];
		}).flat(),
		check: (assert, actual, view) => {
			assert.deepEqual(actual, view);
			assert.notStrictEqual(actual, view);
			assert.notStrictEqual(actual.buffer, view.buffer);
			assert.strictEqual(actual.byteOffset, view.byteOffset);
			assert.strictEqual(actual.length, view.length);
		},
	},

	{
		description: 'uncloneable',
		tests: [
			{ description: 'Dom elements', value: () => document.body, check: false },
			{ description: 'functions', value: () => Foo, check: false },
			{ description: 'async functions', value: asyncFunc, check: false },
			{ description: 'generator functions', value: genFunc, check: false },
			{ description: 'the `Proxy` constructor', value: () => Proxy, check: false },
		],
		check: (assert, actual, value) => {
			const expected = value === Foo ? { 'c': Foo.c } : {};
			assert.deepEqual(actual, expected);
			// assert.deepEqual(actual, value);
		},
	},

	{
		description: 'uncloneable #2',
		tests: [
			{
				description: 'Dom elements',
				value: () => create_uncloneable(document.body),
			},
			{ description: 'functions', value: () => create_uncloneable(Foo) },
			{ description: 'async functions', value: () => create_uncloneable(asyncFunc()) },
			{ description: 'generator functions', value: () => create_uncloneable(genFunc()) },
			{ description: 'the `Proxy` constructor', value: () => create_uncloneable(Proxy) },
		],
		check: (assert, actual, object) => {
			assert.deepEqual(actual, object);
			assert.notStrictEqual(actual, object);
		},
	},
];

export default specs;

const create_uncloneable = (value) => {
	return { 'a': value, 'b': { 'c': value } };
};