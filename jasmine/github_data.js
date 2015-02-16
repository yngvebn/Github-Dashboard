var TestData = TestData || {};

TestData.commits = {};
TestData.branches = [{
    name: "master",
    commit: {
        sha: "a1"
    }
}, {
    name: "develop",
    commit: {
        sha: "b1"
    }
}, {
    name: "feature1",
    commit: {
        sha: "f1"
    }
}];


TestData.commits.master = [{
    sha: 'a1',
    parents: ['a2'],
    commit: {
        committer: {
            date: "2015-02-07T13:35:55Z"
        }
    }
}, {
    sha: 'a2',
    parents: [],
    commit: {
        committer: {
            date: "2015-02-06T13:35:55Z"
        }
    }
}];

TestData.commits.develop = [{
    sha: 'b1',
    parents: ['b2'],
    commit: {
        committer: {
            date: "2015-02-07T13:35:55Z"
        }
    }
}, {
    sha: 'b2',
    parents: [{
        sha: 'a2'
    }],
    commit: {
        committer: {
            date: "2015-02-07T10:35:55Z"
        }
    }
}, {
    sha: 'a2',
    parents: [],
    commit: {
        committer: {
            date: "2015-02-06T13:35:55Z"
        }
    }
}];

TestData.commits.feature1 = [
{
    sha: 'f1',
    parents: ['b1'],
    commit: {
        committer: {
            date: "2015-02-08T13:35:54Z"
        }
    }
},{
    sha: 'b1',
    parents: ['b2'],
    commit: {
        committer: {
            date: "2015-02-07T13:35:54Z"
        }
    }
}, {
    sha: 'b2',
    parents: [{
        sha: 'a2'
    }],
    commit: {
        committer: {
            date: "2015-02-07T10:35:55Z"
        }
    }
}, {
    sha: 'a2',
    parents: [],
    commit: {
        committer: {
            date: "2015-02-06T13:35:55Z"
        }
    }
}];

TestData.transformed = {};

TestData.uniqueCommits = 5;