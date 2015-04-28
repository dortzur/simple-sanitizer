# Simple Sanitizer
A small, quick, standalone and effective client side javascript html sanitizer.

A shameless port of [ngSanitize](https://docs.angularjs.org/api/ngSanitize) to normal javascript, zero dependencies required.

## Usage

```
	var safeHTML = sanitizer.sanitizeHTML(dangerousHTML);
```

You can also sanitize URIs for images, links etc:


```
	var safeUri = sanitizer.sanitizeUri(dangerousUri);
```


## License

MIT, see [LICENSE](https://github.com/dortzur/simple-sanitizer/blob/master/LICENSE) for details.
