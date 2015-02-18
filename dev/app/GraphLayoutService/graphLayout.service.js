function graphLayoutService(configuration, $q) {
    var timePositions;
    return {
        updatePositions: updatePositions
    };

    function updateXPosition(commit, index) {
        return $q(function(resolve, reject){
            var xPosition = index * configuration.intervals.x;
            if (timePositions[commit.date]) {
                xPosition = timePositions[commit.date];
            } else {
                timePositions[commit.date] = xPosition;
            }
            commit.setX(xPosition);
            return resolve(xPosition);
        });
    }

    function updateYPosition(commit, n, branches) {
        return $q(function(resolve, reject){
            var masterLane = _(branches).find({
                name: 'master'
            }).lane;
            var yPosition =masterLane +configuration.intervals.baseline;
            commit.setLane(masterLane);
            if (!commit.isOnMaster()) {
                var matchingBranches = _.filter(branches, function(b) {
                    return commit.branches.indexOf(b.name) > -1;
                });
                var lowestLanePosition = _.chain(matchingBranches)
                    .pluck('lane')
                    .min()
                    .value();
                commit.setLane(lowestLanePosition);
                yPosition =(lowestLanePosition*configuration.intervals.y)+configuration.intervals.baseline;
            }
            
            commit.setY(yPosition);
            resolve(yPosition);
        });
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
        return $q(function(resolve, reject){
            var currentMaxX = 0;
            function updateMaxXPosition(x){
               currentMaxX = x > currentMaxX ? x : currentMaxX;
            }

            updateBranchLanes(branches);
            timePositions = {};
            _.forEach(commits, function(commit, n) {
                updateXPosition(commit, n).then(updateMaxXPosition);
                updateYPosition(commit, n, branches);
            });
            resolve(currentMaxX);
        });
    }
}

angular.module('app').factory('graphLayoutService', graphLayoutService);