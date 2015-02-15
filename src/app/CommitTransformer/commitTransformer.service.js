(function() {
    function commitTransformer() {
        var commitData = [];

        return {
            add: add,
            commits: commitData
        }

        function isNewCommit(commit) {
            return !_.some(commitData, {
                sha: commit.sha
            });
        }

        function add(commits, branch) {
            _.chain(commits)
                .map(function(c) {
                    return {
                        sha: c.sha,
                        date: new Date(c.commit.committer.date)
                    }
                })
                .value()
                .forEach(function(item) {
                    if (isNewCommit(item)) {
                    	var insertAtIndex = _.sortedLastIndex(commitData, item, 'date');
                        commitData.splice(insertAtIndex, 0, item);
                    }
                });

        }


    }

    angular.module('app').factory('commitTransformer', commitTransformer);
}());