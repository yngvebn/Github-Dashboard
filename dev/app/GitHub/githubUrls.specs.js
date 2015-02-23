describe('githubUrls', function(){
	var gitHubUrls, uri;

	beforeEach(module('app'));

	beforeEach(inject(function(_gitHubUrls_, _uri_){
		gitHubUrls = _gitHubUrls_;
		uri = _uri_;
	}));

	it('should create the correct uri', function(){
		var repoUrl = gitHubUrls.repo('1234');
		expect(repoUrl).toEqual('https://api.github.com/repositories/1234');
	});

	it('should append the correct query', function(){

		var commitsUrl = gitHubUrls.commits('1234', { page : 2, per_page : 10 });

		expect(commitsUrl.toString()).toEqual('https://api.github.com/repositories/1234/commits?page=2&per_page=10');
	})
})