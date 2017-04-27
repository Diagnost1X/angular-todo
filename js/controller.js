angular.module("RouteControllers", [])
	.controller("HomeController", function($scope, store, $rootScope) {
		if (!store.get("username")) {
			$rootScope.explicitUser = "Sign In"
		} else {
			$rootScope.explicitUser = "Welcome, " + store.get("username");
		};

		$scope.title = "Welcome To Angular Todo!";
	})
	.controller("RegisterController", function($scope, $location, UserAPIService, store, $rootScope){

		$scope.registrationUser = {};
		var URL = "https://morning-castle-91468.herokuapp.com/";

	if (store.get("authToken")) {
		$location.path("/todo");
	};

		$scope.login = function(){
			UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.data).then(function(results) {
				$scope.token = results.data.token;
				store.set("username", $scope.registrationUser.username);
				store.set("authToken", $scope.token);
				$rootScope.explicitUser = "Welcome, " + store.get("username");
				console.log($scope.token);
			}).catch(function(err) {
				console.log(err.data);
			});
		}

		$scope.submitForm = function(){
			if ($scope.registrationForm.$valid){
				$scope.registrationUser.username = $scope.user.username;
				$scope.registrationUser.password = $scope.user.password;

				UserAPIService.callAPI(URL + "accounts/register/", $scope.registrationUser).then(function(results){
					$scope.data = results.data;
					alert("You have successfully registered to Angular Todo");
					$scope.login();
				}).catch(function(err){
					alert("Oops! Something went wrong!");
					console.log(err);
				});
			}
		}

		})
	.controller("TodoController", function($scope, $location, TodoAPIService, store) {
			var URL = "https://morning-castle-91468.herokuapp.com/";

		if (!store.get("authToken")) {
			$location.path("/accounts/register");
		}

			$scope.authToken = store.get("authToken");
			$scope.username = store.get("username");

			$scope.todos = [];

			TodoAPIService.getTodos(URL + "todo/", $scope.username, $scope.authToken).then(function(results) {
				$scope.todos = results.data || [];
				console.log ($scope.todos);
				$("#submit").click(function() {
					$("#todo-modal").modal("hide");
				});
			}).catch(function(err) {
				console.log(err);
			});

			$scope.submitForm = function() {
				if ($scope.todoForm.$valid) {
					$scope.todo.username = $scope.username;
					$scope.todos.push($scope.todo);

					TodoAPIService.createTodo(URL + "todo/", $scope.todo, $scope.authToken).then(function(results) {
						console.log(results)
					}).catch(function(err) {
						console.log(err)
					});
				}
			}

			$scope.editTodo = function(id) {
				$location.path("/todo/edit/" + id);
			};

			$scope.deleteTodo = function(id) {
				TodoAPIService.deleteTodo(URL + "todo/" + id, $scope.username, $scope.authToken).then(function(results) {
					console.log(results);
				}).catch(function(err) {
					console.log(err);
				});
			}
		})
	.controller("EditTodoController", function($scope, $location, $routeParams, TodoAPIService, store) {
			var id = $routeParams.id;
			var URL = "https://morning-castle-91468.herokuapp.com/";

			TodoAPIService.getTodos(URL + "todo/" + id, $scope.username, store.get("authToken")).then(function(results) {
				$scope.todo = results.data;
			}).catch(function(err) {
				console.log(err);
			});

			$scope.submitForm = function() {
				if ($scope.todoForm.$valid) {
					$scope.todo.username = $scope.username;

					TodoAPIService.editTodo(URL + "todo/" + id, $scope.todo, store.get("authToken")).then(function(results) {
						$location.path("/todo");
					}).catch(function(err) {
						console.log(err);
					});
				}
			}
		})
	.controller("LoginController", function($scope, $location, UserAPIService, store, $rootScope) {
		var URL = "https://morning-castle-91468.herokuapp.com/";
		$scope.loginUser = {};

	if (store.get("authToken")) {
		$location.path("/todo");
	};

		$scope.submitForm = function() {
			if ($scope.loginForm.$valid) {
				$scope.loginUser.username = $scope.user.username;
				$scope.loginUser.password = $scope.user.password;

				UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.loginUser).then(function(results) {
					$scope.token = results.data.token;
					store.set("username", $scope.loginUser.username);
					store.set("authToken", $scope.token);
					$rootScope.explicitUser = "Welcome, " + store.get("username");
					$location.path("/todo");
				}).catch(function(err) {
					console.log(err);
					alert("Username or Password is incorrect");
				});
			}
		};
	})
	.controller("LogoutController", function(store, $rootScope) {
		store.remove("username");
		store.remove("authToken");
		$rootScope.explicitUser = "Sign In";
	});
	
