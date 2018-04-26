/**
 * --------------------------------------------------------------------------------------
 * This is the main application file.
 * This file is responsible for controlling application behaviour
 * All frontend user activities are handled by the code block written here
 * --------------------------------------------------------------------------------------
 */

// Make sure jQuery has been loaded
if (typeof jQuery === 'undefined') {
	throw new Error('QTS Scanner App requires jQuery');
}


/**
 * Overridden console.log for production
 * @type Function|common_L4.commonAnonym$0
 */
window.console = (function (origConsole) {
	if (!window.console)
		console = {};
	var isDebug = true; // set true to display console in browser console
	var logArray = {
		logs: [],
		errors: [],
		warns: [],
		infos: []
	};
	return {
		log: function () {
			logArray.logs.push(arguments)
			isDebug && origConsole.log && origConsole.log.apply(origConsole, arguments);
		},
		warn: function () {
			logArray.warns.push(arguments)
			isDebug && origConsole.warn && origConsole.warn.apply(origConsole, arguments);
		},
		error: function () {
			logArray.errors.push(arguments)
			isDebug && origConsole.error && origConsole.error.apply(origConsole, arguments);
		},
		info: function (v) {
			logArray.infos.push(arguments)
			isDebug && origConsole.info && origConsole.info.apply(origConsole, arguments);
		},
		debug: function (bool) {
			isDebug = bool;
		},
		logArray: function () {
			return logArray;
		}
	};

}(window.console));


/**
* App Specific Variables, Constants
*/
var baseURL = window.location.origin;
var pathName = window.location.pathname;
var html_page = pathName.split('/').pop();
var currentURL = document.location.href;
var splitted_url = currentURL.split(html_page);
var basePath = baseURL;
if(html_page==""){
	basePath = baseURL+pathName;
}else{
	basePath = splitted_url[0];
}


/**
 * Web Service/REST API Config
 */
var APIBaseURL = basePath+'mock_data/'; // in production it might be https://www.something.com/api/
var API = {};
API.userAuth = APIBaseURL + 'user.json'; // in production it might be https://www.something.com/api/uauth.action
API.saveLoginData = APIBaseURL + 'user.json'; // in production it might be https://www.something.com/api/uauth.action
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
	console.log("###### DOM is Ready ###### data-page-id = " + pageId);

	if (pageId == 'login') {
		//auth();
		/**
		*
		* Login
		*
		*/
		var elBtnLogin = '#btnLogin';
		var elFrmLogin = '#frmLogin';
		var elLoginContent = '.login-content';
		var elLoginConfigContent = '.login-config-content';
		$(elLoginConfigContent).hide();

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
		renderDataTableResult();

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
	var elLoginContent = '.login-content';
	var elLoginConfigContent = '.login-config-content';
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
			}
		});
	});
	promise.done(function (data) {
		//do more
		//console.log(data);
		$.each(data, function (i, user) {
			//console.log(user.username);
			if ((user.username == postUsername) && (user.password == postPassword)) {				
				if(user.is_configured == "true"){
					$("#login_cred_alert_msg_container").addClass('alert-success');
				}else{
					$("#login_cred_alert_msg_container").removeClass('alert-success').addClass('alert-warning');
				}
				$("#login_cred_msg").html(user.message);
				$("#btnConfigLogin").html(user.btn_text);
			}
		});
		
		$(elLoginContent).hide();
		$(elLoginConfigContent).show();
		
		$("#btnConfigLogin").on("click", function(e){
			e.preventDefault();
			var xhr = new Ajax();
			xhr.type = 'post';
			xhr.url = API.saveLoginData;
			xhr.data = { username: postUsername, password: postPassword, hostname: window.location.host };
			var promise = xhr.init();
			promise.done(function (data) {
				//do another task
				window.location.href = "operation.html";
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
			
		});
				
	});
	promise.done(function (data) {
		//do another task
		//window.location.href = "operation.html";
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
	//var table_id = $('#tableName').val();
	//var table_type = $('#tableName option:selected').attr('data-type');

	var batchTable = [];
	$("#tableName option:selected").each(function (index, obj) {
		var id = $(this).val();
		var table_type = $(this).attr('data-type');
		item = {}
		item["batch_id"] = table_type + '_' + time_stamp;
		item["table_type"] = table_type;
		item["table_type_id"] = id;
		batchTable.push(item);
	});

	var date = $('#date').val();
	var time = $('#timepicker').val();
	var regex = $('#regex').val();
	var sess_username = sessionStorage.getItem('sess_username');
	var sess_password = sessionStorage.getItem('sess_password');
	var postData = {
		username: sess_username,
		password: sess_password,
		batch: batchTable
	};
	console.log(JSON.stringify(postData));
	var xhr = new Ajax();
	xhr.type = 'get';
	xhr.url = API.createBatch;
	xhr.data = postData;
	var promise = xhr.init();
	//frm.submit();
	promise.done(function (data) {
		console.log(data);
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
			'dataSrc': function (jsonData) {
				//console.log(jsonData);
				var return_data = new Array();
				$.each(jsonData, function (index, val) {
					//console.log(index);
					return_data.push({
						'sr': index + 1,
						'batch_id': val.batch_id,
						'table_type': val.table_type,
						'batch_date': val.batch_date,
						'regex': val.regex,
						'status': val.status
					});
				});
				return return_data;
				//return jsonData;

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


function renderDataTableResult() {
	var table;
	table = $('#tableResult').DataTable({
		'ajax': {
			'url': API.gerResult,
			'dataSrc': function (jsonData) {
				console.log(jsonData);
				var return_data = new Array();
				$.each(jsonData, function (batchIndex, batchObj) {
					$.each(batchObj.attachment, function (attachmentIndex, attachmentObj) {
						return_data.push({
							'1': batchObj.batch_id,
							'2': batchObj.regex,
							'3': attachmentObj.document_name,
							'4': attachmentObj.document_type,
							'5': attachmentObj.document_size,
							'6': attachmentObj.status,
							'7': '<span class="' + attachmentObj.status_txt_css_class + '">' + attachmentObj.status_message + '</span>'
						});
					});
				});
				return return_data;
				//return jsonData;

			},
		},
		'columns': [
			{ 'data': "1" },
			{ 'data': "2" },
			{ 'data': "3" },
			{ 'data': "4" },
			{ 'data': "5" },
			{ 'data': "6" },
			{ 'data': "7" }
		]
	});
	return table;
}