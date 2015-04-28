describe('evil script protection', function () {
    //var chai = require('chai');
    //var should = chai.should();
    //chai.use(require('chai-string'));
    //var sanitizer = require('../sanitizer');

    it("should sanitize basic script tags", function () {
        sanitizer.sanitizeHTML("<script>alert('owned')</script>").should.be.equal("");;
        
    });

    it('should echo html', function() {
        sanitizer.sanitizeHTML('hello<b class="1\'23" align=\'""\'>world</b>.').
            should.be.equal('hello<b class="1\'23" align="&#34;&#34;">world</b>.');
    });

    it('should remove script', function() {
        sanitizer.sanitizeHTML('a<SCRIPT>evil< / scrIpt >c.').should.be.equal('ac.');
    });

    it('should remove script that has newline characters', function() {
        sanitizer.sanitizeHTML('a<SCRIPT\n>\n\revil\n\r< / scrIpt\n >c.').should.be.equal('ac.');
    });

    it('should remove DOCTYPE header', function() {
        sanitizer.sanitizeHTML('<!DOCTYPE html>').should.be.equal('');
        sanitizer.sanitizeHTML('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n"http://www.w3.org/TR/html4/strict.dtd">').should.be.equal('');
        sanitizer.sanitizeHTML('a<!DOCTYPE html>c.').should.be.equal('ac.');
        sanitizer.sanitizeHTML('a<!DocTyPe html>c.').should.be.equal('ac.');
    });

    it('should escape non-start tags', function() {
        sanitizer.sanitizeHTML('a< SCRIPT >A< SCRIPT >evil< / scrIpt >B< / scrIpt >c.').
            should.be.equal('a&lt; SCRIPT &gt;A&lt; SCRIPT &gt;evil&lt; / scrIpt &gt;B&lt; / scrIpt &gt;c.');
    });

    it('should remove attrs', function() {
        sanitizer.sanitizeHTML('a<div style="abc">b</div>c').should.be.equal('a<div>b</div>c');
    });

    it('should remove style', function() {
        sanitizer.sanitizeHTML('a<STyle>evil</stYle>c.').should.be.equal('ac.');
    });

    it('should remove style that has newline characters', function() {
        sanitizer.sanitizeHTML('a<STyle \n>\n\revil\n\r</stYle\n>c.').should.be.equal('ac.');
    });

    it('should remove script and style', function() {
        sanitizer.sanitizeHTML('a<STyle>evil<script></script></stYle>c.').should.be.equal('ac.');
    });

    it('should remove double nested script', function() {
        sanitizer.sanitizeHTML('a<SCRIPT>ev<script>evil</sCript>il</scrIpt>c.').should.be.equal('ac.');
    });

    it('should remove unknown  names', function() {
        sanitizer.sanitizeHTML('a<xxx><B>b</B></xxx>c').should.be.equal('a<b>b</b>c');
    });

    it('should remove unsafe value', function() {
        sanitizer.sanitizeHTML('<a href="javascript:alert()">').should.be.equal('<a></a>');
    });

    it('should handle self closed elements', function() {
        sanitizer.sanitizeHTML('a<hr/>c').should.be.equal('a<hr/>c');
    });

    it('should handle namespace', function() {
        sanitizer.sanitizeHTML('a<my:hr/><my:div>b</my:div>c').should.be.equal('abc');
    });

    it('should handle entities', function() {
        var everything = '<div rel="!@#$%^&amp;*()_+-={}[]:&#34;;\'&lt;&gt;?,./`~ &#295;">' +
            '!@#$%^&amp;*()_+-={}[]:&#34;;\'&lt;&gt;?,./`~ &#295;</div>';
        sanitizer.sanitizeHTML(everything).should.be.equal(everything);
    });

    it('should mangle improper html', function() {
        // This text is encoded more than a real HTML parser would, but it should render the same.
        sanitizer.sanitizeHTML('< div rel="</div>" alt=abc dir=\'"\' >text< /div>').
            should.be.equal('&lt; div rel=&#34;&#34; alt=abc dir=\'&#34;\' &gt;text&lt; /div&gt;');
    });

    it('should mangle improper html2', function() {
        // A proper HTML parser would clobber this more in most cases, but it looks reasonable.
        sanitizer.sanitizeHTML('< div rel="</div>" / >').
            should.be.equal('&lt; div rel=&#34;&#34; / &gt;');
    });

    it('should ignore back slash as escape', function() {
        sanitizer.sanitizeHTML('<img alt="xxx\\" title="><script>....">').
            should.be.equal('<img alt="xxx\\" title="&gt;&lt;script&gt;...."/>');
    });

    it('should ignore object attributes', function() {
        sanitizer.sanitizeHTML('<a constructor="hola">:)</a>').
            should.be.equal('<a>:)</a>');
        sanitizer.sanitizeHTML('<constructor constructor="hola">:)</constructor>').
            should.be.equal('');
    });

    it('should keep spaces as prefix/postfix', function() {
        sanitizer.sanitizeHTML(' a ').should.be.equal(' a ');
    });

    it('should allow multiline strings', function() {
        sanitizer.sanitizeHTML('\na\n').should.be.equal('&#10;a&#10;');
    });

    it('should accept tag delimiters such as "<" inside real tags (with nesting)', function() {
        //this is an integrated version of the 'should accept tag delimiters such as "<" inside real tags' test
        sanitizer.sanitizeHTML('<p> 10 < <span>100</span> </p>')
            .should.be.equal('<p> 10 &lt; <span>100</span> </p>');
    });

    it('should accept non-string arguments', function() {
        sanitizer.sanitizeHTML(null).should.be.equal('');
        sanitizer.sanitizeHTML(undefined).should.be.equal('');
        sanitizer.sanitizeHTML(42).should.be.equal('42');
        sanitizer.sanitizeHTML({}).should.be.equal('[object Object]');
        sanitizer.sanitizeHTML([1, 2, 3]).should.be.equal('1,2,3');
        sanitizer.sanitizeHTML(true).should.be.equal('true');
        sanitizer.sanitizeHTML(false).should.be.equal('false');
    });

    it('should accept SVG tags', function() {
        sanitizer.sanitizeHTML('<svg width="400px" height="150px" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red"/></svg>')
            .should.be.equal('<svg width="400px" height="150px" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red"/></svg>');
    });

    it('should not ignore white-listed svg camelCased attributes', function() {
        sanitizer.sanitizeHTML('<svg preserveAspectRatio="true"></svg>')
            .should.be.equal('<svg preserveAspectRatio="true"></svg>');

    });

    it('should sanitize SVG xlink:href attribute values', function() {
        sanitizer.sanitizeHTML('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:href="javascript:alert()"></a></svg>')
            .should.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a></a></svg>');

        sanitizer.sanitizeHTML('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:href="https://example.com"></a></svg>')
            .should.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:href="https://example.com"></a></svg>');
    });

    it('should sanitize unknown namespaced SVG attributes', function() {
        sanitizer.sanitizeHTML('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:foo="javascript:alert()"></a></svg>')
            .should.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a></a></svg>');

        sanitizer.sanitizeHTML('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a xlink:bar="https://example.com"></a></svg>')
            .should.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><a></a></svg>');
    });

    it('should not accept SVG animation tags', function() {
        sanitizer.sanitizeHTML('<svg xmlns:xlink="http://www.w3.org/1999/xlink"><a><text y="1em">Click me</text><animate attributeName="xlink:href" values="javascript:alert(1)"/></a></svg>')
            .should.be.equal('<svg xmlns:xlink="http://www.w3.org/1999/xlink"><a><text y="1em">Click me</text></a></svg>');

        sanitizer.sanitizeHTML('<svg><a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="?"><circle r="400"></circle>' +
            '<animate attributeName="xlink:href" begin="0" from="javascript:alert(1)" to="&" /></a></svg>')
            .should.be.equal('<svg><a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="?"><circle r="400"></circle></a></svg>');
    });
    
});
