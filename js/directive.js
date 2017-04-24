angular.module("TodoDirective", []).directive("todoTable", function() {
	return {
		restrict: "E", //A -> attribute E -> element
		templateUrl: "templates/directives/todo-table.html"
	};
});