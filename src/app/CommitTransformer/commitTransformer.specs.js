describe('commitTransformer', function() {
	beforeEach(module('app'));
	var commitTransformer;

	beforeEach(inject(function(_commitTransformer_){
		commitTransformer = _commitTransformer_;
	}));

	function addAllTestCommits(){
		_.forEach(TestData.commits, function(n, key){
			commitTransformer.add(TestData.commits[key], key);
		});
	}

	it('should be defined', function() {
		expect(commitTransformer).toBeDefined();
	});
	it('should be possible to add commits from github', function(){
		commitTransformer.add(TestData.commits.master, 'master');
		expect(commitTransformer.commits.length).toEqual(2);
	});

	it('should should be possible to add commits from different branches', function(){
		_.forEach(TestData.commits, function(n, key){
			commitTransformer.add(TestData.commits[key], key);
		});
		expect(commitTransformer.commits.length).toEqual(TestData.uniqueCommits);
	});

	it('should add commits in the correct order', function(){
		_.forEach(TestData.commits, function(n, key){
			commitTransformer.add(TestData.commits[key], key);
		});
		var lastDate = new Date(0);

		_.forEach(commitTransformer.commits, function(n){
			expect(n.date >= lastDate).toBeTruthy();
			lastDate = n.date;
		})
	});

	it('should set correct branch-information for commits', function(){
		addAllTestCommits();
		
	})
});