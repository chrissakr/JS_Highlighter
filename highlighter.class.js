class Highlighter {
	constructor({ originalContent, htmlWrapper, highlighterClass, createMap, mapPrefix }) {
		this.originalContent = originalContent || '';
		this.originalContentArray = this.originalContent.split('');
		this.parsedContent = {};
		this.htmlWrapper = htmlWrapper || 'span';
		this.highlighterClass = highlighterClass || 'highlight-me';
		this.createMap = createMap || false;
		this.mapPrefix = mapPrefix || 'highlighter-map-';
		this.phrase = '';
		this.stringFromHTML();
	}

	stringFromHTML() {
		let tagStarted = false;
		let tagClosed = true;
		let quoteStarted = false;
		let quoteEnded = true;
		let apoStarted = false;
		let apoEnded = true;

		this.parsedContent = {
			ob: [],
			string: ''
		};

		for (let i = 0, len = this.originalContentArray.length; i < len; i++) {
			let currentChar = this.originalContentArray[i];
			let isTagClosed = tagClosed;
			let isQuoteClosed = isTagClosed || (!isTagClosed && quoteEnded);
			let isApoClosed = isTagClosed || (!isTagClosed && apoEnded);

			if (isTagClosed && currentChar !== '<') {
				this.parsedContent.ob.push({ location: i, character: currentChar });
				this.parsedContent.string += currentChar;
			} else if (isTagClosed && currentChar === '<') {
				tagStarted = true;
				tagClosed = false;
			} else if (!isTagClosed && isQuoteClosed && isApoClosed && currentChar === '>') {
				tagStarted = false;
				tagClosed = true;
			} else if (!isTagClosed && isQuoteClosed && isApoClosed && currentChar === '"') {
				quoteStarted = true;
				quoteEnded = false;
			} else if (!isTagClosed && !isQuoteClosed && isApoClosed && currentChar === '"') {
				quoteStarted = false;
				quoteEnded = true;
			} else if (!isTagClosed && isQuoteClosed && isApoClosed && currentChar === "'") {
				apoStarted = true;
				apoEnded = false;
			} else if (!isTagClosed && isQuoteClosed && !isApoClosed && currentChar === "'") {
				apoStarted = false;
				apoEnded = true;
			}
		}
	}

	searchForContent() {
		const minifiedPhrase = this.phrase.toLowerCase();
		const minifiedSource = this.parsedContent.string.toLowerCase();
		const occurences = [];
		let lastChar = 0;
		
		while (lastChar < minifiedSource.length) {
			let position = minifiedSource.indexOf(minifiedPhrase, lastChar);
			if (position < 0) {
				lastChar = minifiedSource.length;
			} else {
				occurences.push({ start: position, end: position + minifiedPhrase.length - 1 });
				lastChar = position + minifiedPhrase.length;
			}
		}
	
		return occurences;
	}

	highlightedContent(phrase) {
		this.phrase = phrase;
		const occurences = this.searchForContent();
		let newContentArray = [...this.originalContentArray];
		let contentMapArray = [];
	
		for (let i = 0, len = occurences.length; i < len; i++) {
			let startIndex = this.parsedContent.ob[occurences[i].start].location;
			let endIndex = this.parsedContent.ob[occurences[i].end].location;
			let id = this.createMap ? ` id="${this.mapPrefix}${i}"` : '';
			newContentArray[startIndex] = `<${this.htmlWrapper} class="${this.highlighterClass}"${id}>${newContentArray[startIndex]}`;
			newContentArray[endIndex] += `</${this.htmlWrapper}>`;
			if (this.createMap) {
				contentMapArray.push(`<a href="#${this.mapPrefix}${i}">[${i}]</a>`);
			}
		}
	
		return { html: newContentArray.join(''), map: contentMapArray.join('') };
	}
}