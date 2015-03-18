function commitsService(Commit, Branch, gitHubLoader, gitHubUrls, string) {
    var data = {
        branches: [],
        commits: []
    };

    var service = {
        add: add,
        commits: data.commits,
        branches: data.branches,
        findCommit: findCommit,
        addBranch: addBranch,
        loadRepository: loadRepository,
    };
    return service;

    function loadError() {

    }

    function loadCommits(repositoryId, sinceDate) {
        _.forEach(data.branches, function(b) {
            gitHubLoader.load(gitHubUrls.commits(repositoryId, {
                sha: b.sha, per_page: 250, since: sinceDate
            }))
                .then(function(result) {
                        service.add(result, b.name);
                    }, loadError,
                    function(result) {
                        service.add(result, b.name);
                    });
        });
    }

    function loadRepository(repositoryId, since) {
        data.branches.splice(0,data.branches.length);
        data.commits.splice(0,data.commits.length);

        gitHubLoader.load(gitHubUrls.branches(repositoryId))
            .then(function(result) {
                _.forEach(result, function(b) {
                    service.addBranch(b);
                });
            })
            .then(function() {
                loadCommits(repositoryId, since);
            });
    }

    function addBranch(branch) {
        if (!findBranch(branch.name)) {
            data.branches.push(new Branch({
                name: branch.name,
                sha: branch.commit.sha
            }));
        }
    }

    function findBranch(name) {
        return _.find(data.branches, {
            name: name
        });
    }

    function getHeadsForCommit(sha) {
        return _(data.branches).filter({
            sha: sha
        }).pluck('name').value();
    }

    function findCommit(sha) {
        return _.find(data.commits, {
            sha: sha
        });
    }

    function isNewCommit(commit) {
        return !findCommit(commit.sha);
    }

    function add(commits, branch) {
        //console.log(string.format('adding {0} commits to branch {1}', commits.length, branch));
        _.chain(commits)
            .map(function(c) {
                return new Commit({
                    sha: c.sha,
                    date: new Date(c.commit.committer.date),
                    branches: [branch],
                    heads: getHeadsForCommit(c.sha),
                    parents: _.pluck(c.parents, 'sha'),
                    message: c.commit.message
                });
            })
            .value()
            .forEach(function(item) {
                if (isNewCommit(item)) {
                    var insertAtIndex = _.sortedLastIndex(data.commits, item, 'date');
                    data.commits.splice(insertAtIndex, 0, item);
                } else {
                    findCommit(item.sha).addToBranch(branch);
                }
                findBranch.lastCommit = item.date;
            });



    }


}

angular.module('app').factory('commitsService', commitsService);