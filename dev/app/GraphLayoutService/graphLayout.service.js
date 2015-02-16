function graphLayoutService(configuration) {
    var timePositions;
    return {
        updatePositions: updatePositions
    };

    function updateXPosition(commit, index) {
        var xPosition = index * configuration.intervals.x;
        if (timePositions[commit.date]) {
            xPosition = timePositions[commit.date];
        } else {
            timePositions[commit.date] = xPosition;
        }
        commit.setX(xPosition);
    }

    function updateYPosition(commit, n, branches) {
        var yPosition = _(branches).find({
            name: 'master'
        }).lane+configuration.intervals.baseline;

        if (!commit.isOnMaster()) {
            var matchingBranches = _.filter(branches, function(b) {
                return commit.branches.indexOf(b.name) > -1;
            });
            var lowestLanePosition = _.chain(matchingBranches)
                .pluck('lane')
                .min()
                .value();

            yPosition =(lowestLanePosition*configuration.intervals.y)+configuration.intervals.baseline;
        }
        
        commit.setY(yPosition);
    }

    function updateBranchLanes(branches) {
    	var index = 1;
	    _.forEach(branches, function(branch, n) {
	    	if(branch.isMaster()){
	    		branch.setLane(0);
	    	}
	    	else{
	    		branch.setLane(index);	
	    		index++;
	    	}            
        });

    }

    function updatePositions(commits, branches) {
        updateBranchLanes(branches);
        timePositions = {};
        _.forEach(commits, function(commit, n) {
            updateXPosition(commit, n);
            updateYPosition(commit, n, branches);

        });
    }
}

angular.module('app').factory('graphLayoutService', graphLayoutService);