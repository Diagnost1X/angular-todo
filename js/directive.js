angular.module("TodoDirective", [])
	.directive("todoTable", function() {
		return {
			restrict: "E", //A -> attribute E -> element
			templateUrl: "templates/directives/todo-table.html"
		};
	});
angular.module("NavbarDirective", [])
	.directive("navbar", function() {
		return {
			restrict: "E",
			templateUrl: "templates/directives/navbar.html"
		};
	});