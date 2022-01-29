document.addEventListener('DOMContentLoaded', (e) => {
	const searchBTN = document.querySelector('#search');
	const searchValue = document.querySelector('#phrase');

	const highlighterClass = new Highlighter({
		originalContent: document.querySelector('#content_to_highlight').innerHTML,
		createMap: true
	});

	searchBTN.addEventListener('click', (e) => {
		let newHTML = highlighterClass.highlightedContent(searchValue.value);
		document.querySelector('#content_to_highlight').innerHTML = `<div>${newHTML.map}</div>${newHTML.html}`;
	});
});