/* 
*  File set up is similar to the JSON data map.
*  However syntax is different since parsing XML to JSON conversion will create a new JSON 
*  One step further is needed, Angular does not data bind XML data. REST service calls need to be 
*  convertted from XML to JSON to do data mapping
*/

(function () {
	'use strict';

	function contactCtrl ($scope,$http) {
		window.scope = $scope;


		//initialize global variables
		var result = {};

		//pulling in data response from xml for Section and Section Content
		var SectionData;
		var SectionContentData;

		 $scope.SectionContentData = [];


		//Read in XML file
		$http.get("../_api/web/lists/getbytitle(' ')/items?$filter=(Active eq 1)&$orderby=DisplayOrder asc",
            {
            //parse XML to JSON
		    transformResponse: function (cnv) {
		      var x2js = new X2JS();
		      var aftCnv = x2js.xml_str2json(cnv);
		      return aftCnv;
		    }
	  	})
	    .success(function (response) {

	    	//on successful response set new parsed JSON to $scope variable
	    	$scope.data = response.feed.entry;
	    	SectionData = $scope.data;
	  	});


	    //Read in XML file
	  	$http.get("../_api/web/lists/getbytitle(' ')/items?$filter=(Active eq 1)&$orderby=DisplayOrder asc",
	            {
	            //parse XML to JSON
			    transformResponse: function (cnv) {
			      var x2js = new X2JS();
			      var aftCnv = x2js.xml_str2json(cnv);
			      return aftCnv;
			    }
		  	})
		    .success(function (response) {

		    	//on successful response set new parsed JSON to $scope variable
		    	$scope.data2 = response.feed.entry;
		    	SectionContentData = $scope.data2;

		    	//loop section content data
				//compare ID from both service calls.
				//if IDs match place section content in the corresponding section 
		    	for (var i = 0; i < $scope.data2.length; i++) {
		    		$scope.data2[i].pId = $scope.data2[i].content.properties.OnPageSectionHeadingId.__text;
		    	}
		    	$scope.SectionContentData = $scope.data2;
		  	});


	    	//Loop array with Section data after success response of Section content data is read 
		  	$scope.filterSecId = function() {
				angular.forEach(SectionData, function(value, key) {
					if (!value.hasOwnProperty('secId')) {
							if(value.Display !== false){

								//check page id based on Service call
								if(value.content.properties.OnPage.__text === 'Contacts'){

									//data bind ng-repeat key value to HTML
									result[key] = value;
								}
						 	}
						}
				});
				return result;
			};

		var init = function() {
			console.log('Contacts init');
			document.body.scrollTop = document.documentElement.scrollTop = 0;
			
		};
		init();		
	}


  angular.module('myApp').controller('contactCtrl', ['$scope','$http',contactCtrl])
  	.directive('myPostRepeatDirective', function() {
	  return function(scope) {
	    if (scope.$last){

	    	angular.element(document).ready(function () {
			});
	    }
	  };
	}).run([
        '$rootScope',
        '$state',
        function ($rootScope, $state,$stateParams) {
            $rootScope.$state = $state;
    		$rootScope.$stateParams = $stateParams;

        }
    ]);
}()

);