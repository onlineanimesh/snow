var baseURL = window.location.origin;
var currentURL = document.location.href;

//Web Service/REST API Config
var APIBaseURL = baseURL + '/mock_data/'; // in production it might be https://www.something.com/api/
var API = {};
API.userAuth = APIBaseURL + 'user.json'; // in production it might be https://www.something.com/api/uauth.action
API.createBatch = APIBaseURL + 'create_batch.json';
API.getAll = APIBaseURL + 'all.json';
API.gerResult = APIBaseURL + 'result.json';


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
 * Time format AM, PM
 * @param {*} date 
 */
function formatAMPM(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;
	var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
	//var strTime = '<span><span class="h1">' + hours + '</span>:<span class="h3">' + minutes + '</span><sup><span class="h6 text-danger">' + seconds + '</span> ' + ampm + '</sup></span>';
	//var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}


/**
 * ------------------------------------------------------------------------------
 * DOM Interaction (Ready/Load, Click, Hover, Change)
 * ------------------------------------------------------------------------------
 */
$(DOMReady); // Document Ready Handler

function DOMReady() {
	var pageId = $('body').attr('data-page-id') ? $('body').attr('data-page-id') : '';
	if (pageId == '') {
		requiredAuth();
		alert("Warning! Unable to process your request\n.data-page-id attribute is not found in body tag.");
	}
	console.log("DOM Init #### data-page-id = " + pageId);

	if (pageId == 'login') {
		//auth();
		/**
		*
		* Login
		*
		*/
		var elBtnLogin = '#btnLogin';
		var elFrmLogin = '#frmLogin';

		$(elBtnLogin).on('click', doLogin);
	}

	if (pageId == 'operation') {
		requiredAuth();

		// Load Data
		loadOperationPageData();

		// On Clicking Create Batch
		$('#btnCreateBatch').on('click', createBatch);

		renderDataTableListBatches();
	}

	if (pageId == 'scan_result') {
		requiredAuth();
		
	}
} // end of $(document).ready();



function loadOperationPageData() {
	var xhr = new Ajax();
	xhr.type = 'get';
	xhr.url = API.getAll;
	xhr.data = { username: sessionStorage.getItem('sess_username'), password: sessionStorage.getItem('sess_password') };
	var promise = xhr.init();

	promise.done(function (data) {
		$.each(data, function (key, value) {
			// APPEND OR INSERT DATA TO SELECT ELEMENT.
			$('#tableName').append('<option title="' + value.description + '" data-type="' + value.table_type + '" value="' + value.table_type_id + '">' + value.table_name + '_' + value.table_type_id + '</option>');
			//$('#tableName').append('<option data-type="' + key + '" value="' + key + '">' + key + '</option>');
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


function doLogin(e) {
	e.preventDefault();
	var postUsername = $("#username").val();
	var postPassword = $("#password").val();
	var xhr = new Ajax();
	xhr.type = 'get';
	xhr.url = API.userAuth;
	xhr.data = { username: postUsername, password: postPassword };
	var promise = xhr.init();

	promise.done(function (data) {
		//console.log(data);
		$.each(data, function (i, user) {
			//console.log(user.username);
			if ((user.username == postUsername) && (user.password == postPassword)) {
				sessionStorage.setItem('sess_username', postUsername);
				sessionStorage.setItem('sess_password', postPassword);
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


function requiredAuth() {
	if (sessionStorage.getItem('sess_username') == null || sessionStorage.getItem('sess_username') == '') {
		window.location.href = "index.html";
	}
}


function createBatch(e) {
	e.preventDefault();
	var d = new Date();
	var time_stamp = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + '_' + d.getHours() + '-' + d.getMinutes();
	var frm = $('#frmCreateBatch');
	//var postData = frm.serialize();
	var table_id = $('#tableName').val();
	var table_type = $('#tableName option:selected').attr('data-type');

	var selected = [];
	$('#tableName :selected').each(function (key) {
		console.log(key);
		selected[$(this).val()] = $(this).text();
	});
	console.log(selected);

	var date = $('#date').val();
	var time = $('#timepicker').val();
	var regex = $('#regex').val();
	var sess_username = sessionStorage.getItem('sess_username');
	var sess_password = sessionStorage.getItem('sess_password');
	var postData = {
		username: sess_username,
		password: sess_password,
		batch: [{
			id: table_type + '_' + time_stamp,
			table_type: table_type,
			table_type_id: table_id
		}]
	};
	console.log(JSON.stringify(postData));
	var xhr = new Ajax();
	xhr.type = 'get';
	xhr.url = API.createBatch;
	xhr.data = postData;
	var promise = xhr.init();
	//frm.submit();
	promise.done(function (data) {
		//console.log(data);
		//renderDataTableListBatches();
		//table.ajax.reload();
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


function renderDataTableListBatches() {
	//console.log("renderDataTableListBatches() called");
	var table;
	table = $('#tableListBatches').DataTable({
		'ajax': {
			'url': API.createBatch,
			'dataSrc': function (json) {
				console.log(json);
				var return_data = new Array();
				$.each(json, function (index, val) {
					//console.log(index);					
					//$.each(val.commands, function (index, val) {
					//console.log(cmdObj.deploymentPlan);
					return_data.push({
						'sr': index + 1,
						'batch_id': val.batch_id,
						'table_type': val.table_type,
						'batch_date': val.batch_date,
						'regex': val.regex,
						'status': val.status
					});
					//});
				});
				return return_data;
				//return json;

			},
		},
		'columns': [
			{ 'data': "sr" },
			{ 'data': "batch_id" },
			{ 'data': "table_type" },
			{ 'data': "batch_date" },
			{ 'data': "regex" },
			{ 'data': "status" }
		]
	});
	return table;
}