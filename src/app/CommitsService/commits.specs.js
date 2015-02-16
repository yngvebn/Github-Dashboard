describe('commitsService', function() {
	beforeEach(module('app'));
	var commitsService;

	beforeEach(inject(function(_commitsService_){
		commitsService = _commitsService_;
	}));

	function addAllTestCommits(){
		_.forEach(TestData.branches, function(n, key){
			commitsService.addBranch(TestData.branches[key]);
		});
		
		_.forEach(TestData.commits, function(n, key){
			commitsService.add(TestData.commits[key], key);
		});
	}

	it('should be defined', function() {
		expect(commitsService).toBeDefined();
	});
	it('should be possible to add commits from github', function(){
		commitsService.add(TestData.commits.master, 'master');
		expect(commitsService.commits.length).toEqual(2);
	});

	it('should should be possible to add commits from different branches', function(){
		addAllTestCommits();
		expect(commitsService.commits.length).toEqual(TestData.uniqueCommits);
	});

	it('should add commits in the correct order', function(){
		addAllTestCommits();
		var lastDate = new Date(0);

		_.forEach(commitsService.commits, function(n){
			expect(n.date >= lastDate).toBeTruthy();
			lastDate = n.date;
		})
	});

	it('should set correct branch-information for commits', function(){
		addAllTestCommits();
		expect(commitsService.findCommit('a1').branches).toEqual(['master']);
		expect(commitsService.findCommit('a2').branches).toEqual(['master']);
		expect(commitsService.findCommit('b1').branches).toEqual(['develop', 'feature1']);
		expect(commitsService.findCommit('b2').branches).toEqual(['develop', 'feature1']);
	});

	it('should set correct HEAD-information for commits', function(){
		addAllTestCommits();

		expect(commitsService.findCommit('a1').heads).toEqual(['master']);
		expect(commitsService.findCommit('b1').heads).toEqual(['develop']);
		expect(commitsService.findCommit('f1').heads).toEqual(['feature1']);
	})
});