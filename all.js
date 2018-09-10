var kcgSearchSite = "https://data.kcg.gov.tw/api/action/datastore_search";
var kcgTripId = "92290ee5-6e61-456f-80c0-249eae2fcc97";
var next ;
var start ;

var data = {
    resource_id: kcgTripId,
    offset: 0
};


$(document).ready(function() {

	// while(0) {
		$.ajax({
			url: kcgSearchSite,
			data: data,
			datatype:"json",
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr);
			},
			success:  function (respData, textStatus) {
				start = respData.result._links.start;
				next = respData.result._links.next;
				console.log(next, getParameterString(next, "offset"));
				//console.log(getParameterString(start, "offset"));
			},
		});
		data.offset = 100 ;
		$.ajax({
			url: kcgSearchSite,
			data: data,
			datatype:"json",
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr);
			},
			success:  function (respData, textStatus) {
				start = respData.result._links.start;
				next = respData.result._links.next;
				console.log(next, getParameterString(next, "offset"));
				//console.log(getParameterString(start, "offset"));
			},
		});
		data.offset = 200 ;
		$.ajax({
			url: kcgSearchSite,
			data: data,
			datatype:"json",
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr);
			},
			success:  function (respData, textStatus) {
				start = respData.result._links.start;
				next = respData.result._links.next;
				console.log(next, getParameterString(next, "offset"));
				//console.log(getParameterString(start, "offset"));
			},
		});
		data.offset = 300 ;
		$.ajax({
			url: kcgSearchSite,
			data: data,
			datatype:"json",
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr);
			},
			success:  function (respData, textStatus) {
				start = respData.result._links.start;
				next = respData.result._links.next;
				console.log(next, getParameterString(next, "offset"));
				//console.log(getParameterString(start, "offset"));
			},
		});

	// }
	


});

function getParameterString(url, name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = url.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}