// ajax site and id
var kcgSearchSite = "https://data.kcg.gov.tw/api/action/datastore_search";
var kcgTripId = "92290ee5-6e61-456f-80c0-249eae2fcc97";
// prepare save data
var tripList = [] ;
// wait for complete
var run = true ;
// ajax data object
var data = {
    resource_id: kcgTripId,
    offset: 0
};
// variable - fix
var spotMaxItem = 3 ; // one page spot number
var shiftMaxNo = 5;		// max shift button
var paginationMax = 5 ;
var sartPage = 0 ;


$(document).ready(function() {
	// get trip data
	data.offset = 0 ;
	while(true) {
		getTripDat(data, tripList);
		data.offset += 100 ;
		if (!run) {
			break;
		}
	}

	// show trip data
	console.log(tripList);

	// show spot counter
	$(".spot_counetr").text("景點筆數 : " + tripList.length );
	// show spot
	showSpotData(tripList, 0, tripList.length, spotMaxItem);
	// show pagibnation
	sartPage = showPagination(sartPage, 0, Math.ceil(tripList.length/spotMaxItem)
									 , paginationMax);
	// init page event
	pageEventInit(paginationMax) ;
});

function getTripDat(data, tripList) {
	var next ;

	$.ajax({
		url: kcgSearchSite,
		data: data,
		datatype:"json",
		async: false, // set sync (default async)
		error: function (xhr, ajaxOptions, thrownError) {
			// console.log(xhr);
			run = false ;
		},
		success:  function (respData, textStatus) {
			next = respData.result._links.next;

			// console.log(next, getParameterString(next, "offset"));
			if (respData.result.records.length > 0 ) {
				for(var j=0 ; j<respData.result.records.length ; j++) {
					tripList.push(respData.result.records[j]);
				}
				// console.log(respData.result.records[0].Name, respData.result.records);
			}
			else {
				run = false ;
				// console.log(respData);
			}
		},
	});
}

// show home spot screen
function	showSpotData(records, startRecord, totalRecord, spotMaxItem) {
	var spot = $(".spot");
	var spot_pic = $(".spot_pic");
	var spot_name = $(".spot_name");
	var spot_info = $(".spot_info");
	var spot_cost = $(".spot_cost");
	var spot_add = $(".spot_add");
	var spot_time = $(".spot_time");

	for (var i=0 ; i < spotMaxItem ; i++) {
		if ((startRecord+i) >= totalRecord) {
			spot[i].style.display = "none" ;
		}
		else {
			spot[i].style.display = "flex" ;
 			spot_pic[i].src =  records[i+startRecord].Picture1;
	 		spot_name[i].innerText = records[i+startRecord].Name;
	 		spot_info[i].innerText = records[i+startRecord].Description;
 			spot_cost[i].innerText = records[i+startRecord].Ticketinfo;
	 		spot_cost.next()[i].innerText = records[i+startRecord].Zone;
	 		spot_add[i].innerText = records[i+startRecord].Add;
	 		spot_time[i].innerText = records[i+startRecord].Opentime;
	 	}
	}
}

// startPage from 0 
function	showPagination(startPage, indexPage, totalPage, paginationMax) {
	var pageItem = $(".page-item") ;
	var currStartPage = 0 ;
	
	if (indexPage>=startPage && indexPage<(startPage+paginationMax)) {
		currStartPage = startPage;
	}
	else {
		currStartPage = indexPage;
	}

	pageItem.removeClass("active").addClass("disabled");
	for(var i=0 ; i<paginationMax ; i++) {
		var index = i + 1 ;

		if ((startPage+i) < totalPage) {
			pageItem[index].style.display = "block";
			pageItem[index].classList.remove("disabled");
			pageItem[index].children.innerText = (startPage+1).toString();
		}
		else {
			pageItem[index].style.display = "none";
		}

		if ((i+startPage) == indexPage) {
			pageItem[index].classList.add("active");
		}
	}

	if (startPage != 0) {
		pageItem[0].classList.remove("disabled");
	}

	if ((startPage+paginationMax) < (totalPage-1)) {
		pageItem[paginationMax+1].classList.remove("disabled");
	}

	return currStartPage;
}

// page event init 
function pageEventInit(paginationMax) {
	var pageItem = $(".page-item") ;

	for(var i=1 ; i<=paginationMax ; i++) {
		pageItem[i].onclick = changePage;
	}
	pageItem[0].onclick = pageDown ;
	pageItem[paginationMax+1].onclick = pageUp ;
}

function changePage(event) {
	var inValue = Number(event.toElement.innerText) ;
	sartPage = showPagination(sartPage, inValue-1, Math.ceil(tripList.length/spotMaxItem)
									 , paginationMax);
}

function pageDown() {
	sartPage = showPagination(sartPage, sartPage-1, Math.ceil(tripList.length/spotMaxItem)
									 , paginationMax);
}

function pageUp() {
	sartPage = showPagination(sartPage+1, sartPage+paginationMax, Math.ceil(tripList.length/spotMaxItem)
									 , paginationMax);
}

// get parameter value 
// no exist resurn null
// http://www.mysite.com/mypage.html?var1=value1&var2=value2&var3=value3
function getParameterString(url, name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = url.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}