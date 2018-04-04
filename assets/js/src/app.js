baseURL = window.location.origin;
currentURL = document.location.href;

/**
 * Onload set scroll bar to bottom of the scrollable container 
 * @param {DOM element object} el 
 */
function scrollToBottom(el) {
	var $scrollableArea = $(el);
	$scrollableArea.scrollTop($scrollableArea[0].scrollHeight);
}

function getQueryString() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}


/**
 * ------------------------------------------------------------------------------
 * DOM Interaction (Ready/Load, Click, Hover, Change)
 * ------------------------------------------------------------------------------
 */
 $(initPage); // Document Ready Handler
 
 function initPage(){
	var pageId = $('body').attr('data-page-id') ? $('body').attr('data-page-id') : '';
	if(pageId==''){
		requiredAuth();
		alert("Warning! Unable to process your request\n.data-page-id attribute is not found in body tag.");
	}
	console.log("DOM Init #### data-page-id = "+pageId);	
	
	if(pageId == 'login'){
		//auth();
		/**
		*
		* Login
		*
		*/
		var elBtnLogin = '#btnLogin';
		var elFrmLogin = '#frmLogin';
		
		$(elBtnLogin).on('click',doLogin);
	}	
	
	if(pageId == 'operation'){
		requiredAuth();
		
		// Load Data
		loadOperationPageData();
		
		// On Clicking Create Batch
		$('#btnCreateBatch').on('click',createBatch);
	}
 }
 
 
 
 function loadOperationPageData(){
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
 
function requiredAuth(){
 if(sessionStorage.getItem('sess_username')== null || sessionStorage.getItem('sess_username') == ''){
	window.location.href = "index.html"; 
 }
}

function createBatch(e){
	e.preventDefault();
	var frm = $('#frmCreateBatch');	
	var postData = frm.serialize();
	var table = $('tableName');
	var date = $('date');
	var time = $('timepicker');
	var regex = $('regex');
	
	var xhr = new Ajax();
	xhr.type = 'get';
	xhr.url = 'mock_data/user.json';
	xhr.data = postData;
	var promise = xhr.init();

	promise.done(function (data) {
		//console.log(data);
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