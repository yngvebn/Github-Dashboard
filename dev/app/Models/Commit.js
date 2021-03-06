(function(){

	function Commit(options){
		this.sha = null;
		this.date = null;
		this.branches = [];
		this.heads = [];
		this.message = '';
		angular.extend(this, options);
	}

	Commit.prototype = {
		addToBranch: function(branch){
			if (this.isOnMaster()) return;
			if (branch === 'master') {
                this.branches = [branch];
            } else {
                this.branches.push(branch);
            }
		},
		isOnMaster: function(){
			return this.branches.indexOf('master') > -1;
		},
		setX: function(x){

			this.position = this.position || {x: 0, y: 0, lane: 0};
			this.position.x = x;
		},
		setY: function(y){
			//console.log("Setting Y:"+y+" for commit "+this.sha+" on "+this.branches.join())
			this.position = this.position || {x: 0, y: 0, lane: 0};
			this.position.y = y;	
		},
		setLane: function(lane){
			this.position = this.position || {x: 0, y: 0, lane: 0};
			this.position.lane = lane;
		}

	};



	angular.module('app').value('Commit', Commit);

}());