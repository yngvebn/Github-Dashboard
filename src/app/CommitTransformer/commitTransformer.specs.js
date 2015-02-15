describe('commitTransformer', function() {
	beforeEach(module('app'));
	var commitTransformer;

	beforeEach(inject(function(_commitTransformer_){
		commitTransformer = _commitTransformer_;
	}))

	it('should be defined', function() {
		expect(commitTransformer).toBeDefined();
	});

	it('should be possible to add one commit', function(){
		commitTransformer.add([{ sha: 'abc' }]);
		expect(commitTransformer.commits.length).toEqual(1);
	})
});