describe('tests', function () {
    //var chai = require('chai');
    //var should = chai.should();
    //chai.use(require('chai-string'));
    //var sanitizer = require('../sanitizer');

    it("should sanitize basic script tags", function () {
        var safe = sanitizer.sanitizeHTML("<script>alert('owned')</script>");
        safe.should.be.equal("");
    })

});
