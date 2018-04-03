/**
 * ------------------------------------------------------------------------------
 * DOM Interaction (Ready/Load, Click, Hover, Change)
 * ------------------------------------------------------------------------------
 */
 $(initPage); // Document Ready Handler
 
 function initPage(){
	var pageId = $('body').attr('data-page-id') ? $('body').attr('data-page-id') : '';
	if(pageId==''){
		alert("Warning! Unable to process your request\n.data-page-id attribute is not found in body tag.");
	}
	console.log("DOM Init #### data-page-id = "+pageId);	
	
	if(pageId == 'login'){
		renderLogin();
	}
	if(pageId == 'operation'){
		renderOperation();
	}
 }
 
 function renderLogin(){
	console.log("renderLogin");
	/**
	*
	* Login
	*
	*/
	var elBtnLogin = '#btnLogin';
	var elFrmLogin = '#frmLogin';
	$(elBtnLogin).on('click',doLogin);
	
	function doLogin(e){
		e.preventDefault();
		var postUsername = $("#username").val();
		var postPassword = $("#password").val();
		var xhr = new Ajax();
		xhr.type = 'get';
		xhr.url = 'mock_data/user.json';
		xhr.data = {username: postUsername, password: postPassword};
		var promise = xhr.init();

		promise.done(function (data) {
			//console.log(data);
			$.each(data, function(i,user){
				//console.log(user.username);
				if( (user.username == postUsername) && (user.password == postPassword) ){
					sessionStorage.setItem('sess_username',postUsername);
					sessionStorage.setItem('sess_password',postPassword);
					window.location.href = "operation.html";
				}
			});
		});
		promise.done(function (data) {
			//do more
		});
		promise.done(function (data) {
			//do another task
		});
		promise.fail(function () {
			//show failure message
		});
		promise.always(function () {
			//always will be executed whether success or failue
			//do some thing
		});
		promise.always(function () {
			//do more on complete
		});
		
	}
 }
 
 function renderOperation(){	
	var xhr = new Ajax();
	xhr.type = 'get';
	xhr.url = 'mock_data/all.json';
	xhr.data = {username: sessionStorage.getItem('sess_username'), password:sessionStorage.getItem('sess_password')};
	var promise = xhr.init();

	promise.done(function (data) {
		$.each(data, function (index, value) {
			// APPEND OR INSERT DATA TO SELECT ELEMENT.
			$('#tableName').append('<option value="' + value.id + '">' + value.name + '</option>');
		});
	});
	promise.done(function (data) {
		//do more
	});
	promise.done(function (data) {
		//do another task
	});
	promise.fail(function () {
		//show failure message
	});
	promise.always(function () {
		//always will be executed whether success or failue
		//do some thing
	});
	promise.always(function () {
		//do more on complete
	});
 }
 
 