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
var page = {
  spotMaxItem: 3,   // one page spot number
  shiftMaxNo: 5,		// max shift button
  paginationMax: 5,
  startPage: 0,
  pointPage: 0
};
// var spotMaxItem = 3 ; // one page spot number
// var shiftMaxNo = 5;		// max shift button
// var paginationMax = 5 ;
// var sartPage = 0 ;


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
	showSpotData(tripList, 0, tripList.length, page.spotMaxItem);
	// show pagibnation
	showPagination(page, Math.ceil(tripList.length/page.spotMaxItem));

	// init page event
	// pageEventInit(page.paginationMax) ;
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
function	showPagination(page, totalPage) {
	var pageItem = $(".page-item") ;
	var currStartPage = 0 ;
	
	if (page.pointPage>=page.startPage && page.pointPage<(page.startPage+page.paginationMax)) {
		currStartPage = page.startPage;
	}
	else {
		if(page.pointPage < page.startPage) {
			currStartPage = page.startPage - 1 ;
		} 
		else {
			currStartPage = page.startPage + 1 ;
		}
	}

	pageItem.removeClass("active").addClass("disabled").remove("onclick") ;
	for(var i=0 ; i<page.paginationMax ; i++) {
		var index = i + 1 ;

		if ((currStartPage+i) < totalPage) {
			pageItem[index].style.display = "block";
			pageItem[index].classList.remove("disabled");
			pageItem[index].children[0].innerText = (currStartPage+1+i).toString();
			pageItem[index].onclick = changePage;
		}
		else {
			pageItem[index].style.display = "none";
		}

		if ((i+currStartPage) == page.pointPage) {
			pageItem[index].classList.add("active");
		}
	}

	if (page.pointPage != 0) {
		pageItem[0].classList.remove("disabled");
		pageItem[0].onclick = pageDown ;
	}

	if ((currStartPage+page.paginationMax) < (totalPage-1)) {
		pageItem[page.paginationMax+1].classList.remove("disabled");
		pageItem[page.paginationMax+1].onclick = pageUp ;
	}

	page.startPage = currStartPage;
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
	page.pointPage = inValue-1 ;
	showPagination(page, Math.ceil(tripList.length/page.spotMaxItem));
}

function pageDown() {
	page.pointPage -= 1 ;
	showPagination(page, Math.ceil(tripList.length/page.spotMaxItem));
}

function pageUp() {
	page.pointPage += 1 ;
	showPagination(page, Math.ceil(tripList.length/page.spotMaxItem));
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