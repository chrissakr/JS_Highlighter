# JS_Highlighter
Vanilla JS class to highlight phrase in html based content

## Usage
Class can be implemented in any code that allows vanilla JS and raw HTML / CSS. 
To implement it create a new Highlighter object and then ignite *highlightedContent* method.

## Setup
```
const highlighterClass = new Highlighter({
  originalContent,
  htmlWrapper, 
  highlighterClass, 
  createMap, 
  mapPrefix
});
```
- originalContent: required, html content to be used, 
- htmlWrapper: optional, html tag used to wrap the found strings; <span /> used by default, 
- highlighterClass: optional, class used for the wrapper; highlight-me used by default, 
- createMap: optional, if true it adds an ID to each occurence and creates a map; false by default, 
- mapPrefix: optional, if createMap set to true this defines the ID prefix for occurences; highlighter-map- by default
