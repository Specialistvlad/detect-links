var lib = require('./').replace;
var data = [
	//complex
	[
		'http://www.examp_l-e.test.com:8080/hello/index.html?arg=val&arg2=val2#fragment-test',
		'<a href="http://www.examp_l-e.test.com:8080/hello/index.html?arg=val&arg2=val2#fragment-test">http://www.examp_l-e.test.com:8080/hello/index.html?arg=val&arg2=val2#fragment-test</a>'
	],

	// Simple
	['test.com', '<a href="test.com">test.com</a>'],

	// With cyrillic symbols
	['теСт.рф', '<a href="теСт.рф">теСт.рф</a>'],
	['xxx-y-zzz_jj.ru', '<a href="xxx-y-zzz_jj.ru">xxx-y-zzz_jj.ru</a>'],

	['http://www.xxx-y-zzzzz.ru',
		'<a href="http://www.xxx-y-zzzzz.ru">http://www.xxx-y-zzzzz.ru</a>'
	],
	['https://test.com', '<a href="https://test.com">https://test.com</a>'],

	['www.xxx-y-zzzzz.ru', '<a href="www.xxx-y-zzzzz.ru">www.xxx-y-zzzzz.ru</a>'],
	['www.test.com', '<a href="www.test.com">www.test.com</a>'],
	['www.test.ru', '<a href="www.test.ru">www.test.ru</a>'],
	['https://www.test.com',
		'<a href="https://www.test.com">https://www.test.com</a>'
	],

	// Long with subdomains
	['www.test.aa.asd.asd.sad.as.saabcdefg123.ru',
		'<a href="www.test.aa.asd.asd.sad.as.saabcdefg123.ru">www.test.aa.asd.asd.sad.as.saabcdefg123.ru</a>'
	],
	['http://aaa.xxx-y-zzzzz.ru',
		'<a href="http://aaa.xxx-y-zzzzz.ru">http://aaa.xxx-y-zzzzz.ru</a>'
	],

	// With charters that easy pretend to errors
	['http://test.com"', '<a href="http://test.com">http://test.com</a>"'],
	['test.ru"', '<a href="test.ru">test.ru</a>"'],
	['<asd>test.ru"', '<asd><a href="test.ru">test.ru</a>"'],
	['<asd>test.ru"', '<asd><a href="test.ru">test.ru</a>"'],
	['<atest.ru"', '<<a href="atest.ru">atest.ru</a>"'],
	['!ahttp://test.com"', '!a<a href="http://test.com">http://test.com</a>"'],
	['!ahttp://test.a_c..com"', '!ahttp://test.a_c..com"'],

	// Merged
	// TODO should detect root domain and sepatare urls ['www.xxx-y-zzzzz.ruxxx-y-zzzzz.ru', '<a href="www.xxx-y-zzzzz.ru">www.xxx-y-zzzzz.ru</a><a href="xxx-y-zzzzz.ru">xxx-y-zzzzz.ru</a>'],
	['xxx-y-zzzzz.ruhttp://www.test.com',
		'<a href="xxx-y-zzzzz.ru">xxx-y-zzzzz.ru</a><a href="http://www.test.com">http://www.test.com</a>'
	],

	// With query string
	['http://www.aaa.bbb.test.com?aaa=bbb&ccc=ddd"<zxc',
		'<a href="http://www.aaa.bbb.test.com?aaa=bbb&ccc=ddd">http://www.aaa.bbb.test.com?aaa=bbb&ccc=ddd</a>"<zxc'
	],
	[
		'.school-of-inspiration.ru/nauchnyj-stil-ponyatie-priznaki-i-primeryНаучный стиль текста',
		'.<a href="school-of-inspiration.ru/nauchnyj-stil-ponyatie-priznaki-i-primery">school-of-inspiration.ru/nauchnyj-stil-ponyatie-priznaki-i-primery</a>Научный стиль текста'
	],
	// Already hyperlinks
	['<a href="test.com" >abcdefg123.ru</a>',
		'<a href="test.com" >abcdefg123.ru</a>'
	],
	['<a href = "test.com" asdasdas>xxx-y-zzzzz.ru</a>',
		'<a href = "test.com" asdasdas>xxx-y-zzzzz.ru</a>'
	],
	['<a asdasdas="jhg" href="test.com" Q#*(@%)sdf;lk>http://xxx-y-zzzzz.ru</a>',
		'<a asdasdas="jhg" href="test.com" Q#*(@%)sdf;lk>http://xxx-y-zzzzz.ru</a>'
	],
	['<a href= "test.com" data-value="123" data-valueb=21>test.com</a>',
		'<a href= "test.com" data-value="123" data-valueb=21>test.com</a>'
	],
	['<a href="test.com" >test.ru</a>', '<a href="test.com" >test.ru</a>'],
	['<a href ="test.com" >http://test.com</a>',
		'<a href ="test.com" >http://test.com</a>'
	],
	[
		'<a href="https://www.test.com/" rel="nofollow noopener" target="_blank">https://www.test.com/</a>',
		'<a href="https://www.test.com/" rel="nofollow noopener" target="_blank">https://www.test.com/</a>'
	],
	[
		'Est temporibus optio molestiae aperiam delectus et. Qui incidunt accusamus qui deserunt quidem similique ab. Debitis dolores quo voluptatem saepe sit cum quia. Natus pariatur vel illum aut laboriosam tenetur quasi molestiae ducimus. Dolorem dolores maiores optio quod eos nam est alias.',
		'Est temporibus optio molestiae aperiam delectus et. Qui incidunt accusamus qui deserunt quidem similique ab. Debitis dolores quo voluptatem saepe sit cum quia. Natus pariatur vel illum aut laboriosam tenetur quasi molestiae ducimus. Dolorem dolores maiores optio quod eos nam est alias.'
	],

];

var success = 0;

function test(item, i, data) {
	var actual = lib(item[0], {
		concatenateWithTag: '',
		forceNewTab: false,
		forceExternalLink: false,
	});
	var expected = item[1];
	var result = actual == expected ? '' : '\n';

	success += actual == expected;
	result += 'Test (' + (i + 1).toString() + ' of ' + data.length + ')';
	result += actual == expected ? ' PASS ' + item[0] : ' ERROR ' + item[0] +
		'\nActual:   \'' + actual + '\'' +
		'\nExpected: \'' + expected + '\'';
	if (actual !== expected) {
		result += '\n';
	}
	return result;
}

data.map(test).forEach(function(item) {
	console.log(item)
});

console.log('Success: ' + success + ' of ' + data.length);
if (success != data.length) {
	process.exit(1);
}
