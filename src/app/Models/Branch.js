(function(){
	function Branch(data){
		this.name = '';
		this.sha = '';

		angular.extend(this, data);
	}

	Branch.prototype = {
		setLane: function(lane){
			this.lane = lane;
		}
	}

	angular.module('app').value('Branch', Branch);
}());