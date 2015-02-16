describe('GraphLayout', function() {
	beforeEach(module('app'));

	var commitsService, graphLayoutService;

	beforeEach(inject(function(_commitsService_, _graphLayoutService_){
		commitsService = _commitsService_;
		graphLayoutService = _graphLayoutService_;
	}));

	beforeEach(function(){
		function addAllTestCommits(){
			_.forEach(TestData.branches, function(n, key){
				commitsService.addBranch(TestData.branches[key]);
			});
			
			_.forEach(TestData.commits, function(n, key){
				commitsService.add(TestData.commits[key], key);
			});
		}
		addAllTestCommits();
	})

	it('should be defined', function() {
		expect(graphLayoutService).toBeDefined();
	});

	it('should update x-position correctly', function(){
		graphLayoutService.updatePositions(commitsService.commits, commitsService.branches);
		expect(commitsService.commits[0].position.x).toEqual(0);
		expect(commitsService.commits[1].position.x).toEqual(1);
	});

	it('should update y-position correctly', function(){
		graphLayoutService.updatePositions(commitsService.commits, commitsService.branches);
		var a1 = commitsService.findCommit('a1');
		var b1 = commitsService.findCommit('b1');
		expect(a1.position.y).toEqual(0);
		expect(b1.position.y).toEqual(1);

	})

	it('should assign same position to two commits at the same time', function(){
		graphLayoutService.updatePositions(commitsService.commits, commitsService.branches);
		var a1 = commitsService.findCommit('a1');
		var b1 = commitsService.findCommit('b1');
		expect(a1.position.x).toEqual(b1.position.x);
	});

	it('should always assign master-lane to commits on both master and something else', function(){
		graphLayoutService.updatePositions(commitsService.commits, commitsService.branches);
		var b1 = commitsService.findCommit('a2');
		expect(b1.position.y).toEqual(0);
	});

	it('should assign lowest possible lane to a commit on two branches', function() {
		graphLayoutService.updatePositions(commitsService.commits, commitsService.branches);
		var b1 = commitsService.findCommit('b1');
		expect(b1.branches.length).toEqual(2);
		expect(b1.position.y).toEqual(1);
	});
});