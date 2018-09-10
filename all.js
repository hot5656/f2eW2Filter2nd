var kcgSearchSite = "https://data.kcg.gov.tw/api/action/datastore_search";
var kcgTripId = "92290ee5-6e61-456f-80c0-249eae2fcc97";
var tripList = [] ;
var dataResp = false ;
var run = true ;

var data = {
    resource_id: kcgTripId,
    offset: 0
};


$(document).ready(function() {
	data.offset = 0 ;
	while(true) {
		dataResp = false ;
		getTripDat(data, tripList);
		while(!dataResp) {
			setTimeout(100);
		}
		data.offset += 100 ;
		if (!run) {
			break;
		}
	}


	// var run = true ;

	// data.offset = 0 ;
	// for (var i=0 ; i<10 ; i++) {
	// 	$.ajax({
	// 		url: kcgSearchSite,
	// 		data: data,
	// 		datatype:"json",
	// 		async: false, // set sync (default async)
	// 		error: function (xhr, ajaxOptions, thrownError) {
	// 			console.log(xhr);
	// 		},
	// 		success:  function (respData, textStatus) {
	// 			start = respData.result._links.start;
	// 			next = respData.result._links.next;

	// 			console.log(next, getParameterString(next, "offset"));
	// 			if (respData.result.records.length > 0 ) {
	// 				for(var j=0 ; j<respData.result.records.length ; j++) {
	// 					tripList.push(respData.result.records[j]);
	// 				}
	// 				console.log(respData.result.records[0].Name, respData.result.records);
	// 			}
	// 			else {
	// 				run = false ;
	// 				console.log(respData);
	// 			}
	// 		},
	// 	});

	// 	if (!run) {
	// 		break;
	// 	}
	// 	data.offset += 100 ;
	// }

	console.log(tripList);
});

function getTripDat(data, tripList) {
	var next ;

	$.ajax({
		url: kcgSearchSite,
		data: data,
		datatype:"json",
		async: false, // set async (default async)
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr);
			run = false ;
			dataResp = true ;
		},
		success:  function (respData, textStatus) {
			next = respData.result._links.next;

			console.log(next, getParameterString(next, "offset"));
			if (respData.result.records.length > 0 ) {
				for(var j=0 ; j<respData.result.records.length ; j++) {
					tripList.push(respData.result.records[j]);
				}
				console.log(respData.result.records[0].Name, respData.result.records);
			}
			else {
				run = false ;
				console.log(respData);
			}
			dataResp = true ;
		},
	});
}

function getParameterString(url, name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = url.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}