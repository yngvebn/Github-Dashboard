var TestData = TestData || {};

TestData.commits = {};
TestData.commits.master = [
	{
		sha: 'a1',
		parents: ['a2'],
		commit: {
			committer: {
				date: "2015-02-07T13:35:55Z"
			}
		}
	},
	{
		sha: 'a2',
		parents: [],
		commit: {
			committer: {
				date: "2015-02-06T13:35:55Z"
			}
		}	
	}
];

TestData.commits.develop = [
		{
		sha: 'b1',
		parents: ['b2'],
		commit: {
			committer: {
				date: "2015-02-07T13:35:55Z"
			}
		}
	},
	{
		sha: 'b2',
		parents: [{ sha: 'a2' }],
		commit: {
			committer: {
				date: "2015-02-07T10:35:55Z"
			}
		}	
	},
	{
		sha: 'a2',
		parents: [],
		commit: {
			committer: {
				date: "2015-02-06T13:35:55Z"
			}
		}	
	}
]

TestData.uniqueCommits = 4;