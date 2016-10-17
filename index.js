var utilUrl = require('url');
var merge = require('merge');

var tlds = require('tld-list').sort(function(a, b) {
	a = a.length;
	b = b.length;
	return a > b ? -1 : a < b ? 1 : 0;
});

var defaults = {
	alowedProtocols: ['http', 'https', 'ftp'],
	concatenateWithTag: 'rel="nofollow noopener"',
	forceExternalLink: true,
	forceNewTab: true,
	alowedDomains: tlds,
	ignoreAlreadyReplaced: true,
};

module.exports.replace = function(source, options) {
	if (!source) {
		return source;
	}

	source = new String(source);
	var options = merge(defaults, options || {});
	var alowedProtocols = options.alowedProtocols.join('|');
	alowedDomains = options.alowedDomains.join('|');

	var re = {
		protocols: '((' + alowedProtocols + '):\\/\\/){0,1}',
		domainName: '(([\\w\\-А-Яа-я]+[.])+)',
		topLevelDomains: '(' + alowedDomains + ')',
		port: '(\\:(\\d{1,5})){0,1}',
		path: '((\\/[\\w\\-$_.+]*)*)',
		query: '(\\?([a-z]*=[\\w\\-А-я$_.+!*\'(),&%;]*)*){0,1}',
		fragment: '(#([\\w\\-А-я$_.+!*\'(),&%;])*){0,1}',
		alreadyReplacedDetecter: '(?![\\S]*<\\/a>)(?!([\\S]*[\\"][ \\S]*[>]))',
	};

	var regexp = new RegExp(
		re.protocols + re.domainName + re.topLevelDomains + re.port +
		re.path + re.query + re.fragment +
		(options.ignoreAlreadyReplaced ? re.alreadyReplacedDetecter : ''),
		'g');

	return source.replace(regexp, textToHyperLink);

	function textToHyperLink(text) {
		var url = utilUrl.parse(text);
		var title = text;
		var link = text;

		if (!url.protocol && options.forceExternalLink) {
			link = '//' + link;
		}

		return '<a href="' + link + '"' +
			(options.concatenateWithTag ? ' ' + options.concatenateWithTag : '') +
			(options.forceNewTab ? 'target = "_blank"' : '') +
			'>' + text + '</a>';
	}
}
