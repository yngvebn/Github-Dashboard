(function() {
    function commitsService() {
        var data = {
            branches: [],
            commits: []
        };

        return {
            add: add,
            commits: data.commits,
            findCommit: findCommit,
            addBranch: addBranch
        }

        function addBranch(branch){
            if(!findBranch(branch.name)){
                data.branches.push({
                    name: branch.name,
                    sha: branch.commit.sha
                });
            }
        }

        function findBranch(name){
            return _.find(data.branches, { name: name});
        }
        
        function getHeadsForCommit(sha){
            return _(data.branches).filter({ sha: sha }).pluck('name').value();
        }

        function findCommit(sha) {
            return _.find(data.commits, {
                sha: sha
            });
        }

        function isNewCommit(commit) {
            return !findCommit(commit.sha);
        }

        function addBranchToCommit(commit, branch) {
            if (commit.branches.indexOf('master') > -1) return;
            if (branch === 'master') {
                commit.branches = [branch];
            } else {
                commit.branches.push(branch);
            }
        }

        function add(commits, branch) {
            _.chain(commits)
                .map(function(c) {
                    return {
                        sha: c.sha,
                        date: new Date(c.commit.committer.date),
                        branches: [branch],
                        heads: getHeadsForCommit(c.sha)
                    }
                })
                .value()
                .forEach(function(item) {
                    if (isNewCommit(item)) {
                        var insertAtIndex = _.sortedLastIndex(data.commits, item, 'date');
                        data.commits.splice(insertAtIndex, 0, item);
                    } else {
                        addBranchToCommit(findCommit(item.sha), branch);
                    }
                });

        }


    }

    angular.module('app').factory('commitsService', commitsService);
}());