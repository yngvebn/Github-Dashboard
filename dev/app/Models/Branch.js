(function(){
	function Branch(data){
		this.name = '';
		this.sha = '';

		angular.extend(this, data);
	}

	Branch.prototype = {
		setLane: function(lane){
			this.lane = lane;
		},
		isMaster: function(){
			return this.name === 'master';
		}
	};

	angular.module('app').value('Branch', Branch);
}());