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
  pointPage: 0,
  totalPage: 0,
  totalRecord: 0,
  dataOrigin: true
};
// filter condition
var filter = {
	allDay: false ,
	notAllDay: false ,
	fee: false ,
	Free: false ,
	noCost: false ,
	location: "全部"
};
var filterData = null;


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

	/* ===== always Origin ===== */
	page.totalPage = Math.ceil(tripList.length/page.spotMaxItem);
	page.totalRecord = tripList.length;
	// show spot counter
	$(".spot_counetr").text("景點筆數 : " + page.totalRecord );
	// show spot
	showSpotData(tripList, page.pointPage, page.totalRecord, page.spotMaxItem);

	// show pagibnation
	showPagination(page, page.totalPage);

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
function	showSpotData(records, pointPage, totalRecord, spotMaxItem) {
	var spot = $(".spot");
	var spot_pic = $(".spot_pic");
	var spot_name = $(".spot_name");
	var spot_info = $(".spot_info");
	var spot_cost = $(".spot_cost");
	var spot_add = $(".spot_add");
	var spot_time = $(".spot_time");
	var startRecord = pointPage * spotMaxItem ;

	for (var i=0 ; i < spotMaxItem ; i++) {
		if ((startRecord+i) >= totalRecord) {
			spot[i].style.display = "none" ;
		}
		else {
			spot[i].style.display = "flex" ;

			// fix data issue
			spot_pic[i].src =  records[i+startRecord].Picture1;
	 		spot_name[i].innerText = records[i+startRecord].Name;
	 		spot_info[i].innerText = records[i+startRecord].Description;
	 		if (records[i+startRecord].Ticketinfo.length != 0 ) {
	 			spot_cost[i].innerText = records[i+startRecord].Ticketinfo;
	 		}
	 		else {
	 			// add 5 space
 				spot_cost[i].innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
 			}
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

	pageItem.removeClass("active").addClass("disabled") ;
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

	if (totalPage == 0) {
		pageItem[0].style.display = "none";
		pageItem[page.paginationMax+1].style.display = "none";
	}
	else {
		pageItem[0].style.display = "block";
		pageItem[page.paginationMax+1].style.display = "block";
	}

	if (page.pointPage != 0) {
		pageItem[0].classList.remove("disabled");
		pageItem[0].onclick = pageDown ;
	}
	else {
		pageItem[0].onclick = null ;
	}

	if ((currStartPage+page.paginationMax) <= (totalPage-1)) {
		pageItem[page.paginationMax+1].classList.remove("disabled");
		pageItem[page.paginationMax+1].onclick = pageUp ;
	}
	else {
		pageItem[page.paginationMax+1].onclick = null ;
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
	// show spot
	if (page.dataOrigin) {
		showSpotData(tripList, page.pointPage, page.totalRecord, page.spotMaxItem);
	}
	else {
		showSpotData(filterData, page.pointPage, page.totalRecord, page.spotMaxItem);
	}

	// show pagination
	showPagination(page, page.totalPage);
}

function pageDown() {
	page.pointPage -= 1 ;

	// show spot
	if (page.dataOrigin) {
		showSpotData(tripList, page.pointPage, page.totalRecord, page.spotMaxItem);
	}
	else {
		showSpotData(filterData, page.pointPage, page.totalRecord, page.spotMaxItem);
	}
	// show pagination
	showPagination(page, page.totalPage);
}

function pageUp() {
	page.pointPage += 1 ;

	// show spot
	if (page.dataOrigin) {
		showSpotData(tripList, page.pointPage, page.totalRecord, page.spotMaxItem);
	}
	else {
		showSpotData(filterData, page.pointPage, page.totalRecord, page.spotMaxItem);
	}

	// show pagination
	showPagination(page, page.totalPage);
}

// location filter
function locateSelect(event) {
	//var filter = $("badge") ;

  // get locate data
	//filterLocation = event.target.options[event.target.selectedIndex].value ;
	filter.location = event.target.options[event.target.selectedIndex].value ;
/*	
	// show filter button
  if (filterLocation == "全部") {
  	filrterBtn1.innerHTML = filterLable ;
		filrterBtn1.style.color = "#9013FE";
		filrterBtn1.style.backgroundColor = "#F2F2F2";
  }
  else {
		filrterBtn1.innerHTML = filterLocation + filterLable ;
		filrterBtn1.style.color = "#F2F2F2";
		filrterBtn1.style.backgroundColor = "#9013FE";
  }
*/
  // filetr data
	//filterData = xhrRespDataRaw.result.records.filter(filterSpot);
	filterData = tripList.filter(filterSpot);
	
	// show filter screen
  //showFilterScreen()

	/* ===== always filter data ===== */
  page.startPage = 0;
  page.pointPage = 0;
  page.dataOrigin = false;

	page.totalPage = Math.ceil(filterData.length/page.spotMaxItem);
	page.totalRecord = filterData.length;
	// show spot counter
	$(".spot_counetr").text("景點筆數 : " + page.totalRecord );
	// show spot
	showSpotData(filterData, page.pointPage, page.totalRecord, page.spotMaxItem);

	// show pagibnation
	showPagination(page, page.totalPage);
}

// condition filter
function conditionSelect(event) {
	//var filrterBtn2 = document.getElementById("filter_btn2");
	//var filrterBtn3 = document.getElementById("filter_btn3");

	switch (event.target.value) {
		case "all_day" :
			if (event.toElement.checked) {
				filter.allDay = true ;
			}
			else {
				filter.allDay = false ;
			}
			break ;
		case "not_all_day" :
			if (event.toElement.checked) {
				filter.notAllDay = true ;
			}
			else {
				filter.notAllDay = false ;			
			}
			break ;
		case "p_fee" :
			if (event.toElement.checked) {
				filter.fee = true ;
			}
			else {
				filter.fee = false ;
			}
			break ;
		case "p_free" :
			if (event.toElement.checked) {
				filter.free = true ;
			}
			else {
				filter.free = false ;
			}
			break ;
		case "p_none" :
			if (event.toElement.checked) {
				filter.noCost = true ;
			}
			else {
				filter.noCost = false ;
			}
			break ;
		default :
			break ;
	}

/*
	filrterBtn2.innerHTML = "" ;
	if (filterAllDay && filterNotAllDay) {
		filrterBtn2.innerHTML = "全天候開放" + "/" + "非全天候開放";
	}
	else {
		if (filterAllDay) {
			filrterBtn2.innerHTML = "全天候開放";
		}
		if (filterNotAllDay) {
			filrterBtn2.innerHTML = "非全天候開放";
		}
	}
	if (filrterBtn2.innerHTML == "") {
		filrterBtn2.style.color = "#9013FE";
		filrterBtn2.style.backgroundColor = "#F2F2F2";
	}
	else {
		filrterBtn2.style.color = "#F2F2F2";
		filrterBtn2.style.backgroundColor = "#9013FE";
	}
	filrterBtn2.innerHTML += filterLable ;

	filrterBtn3.innerHTML = "" ;
	if (filterFree && filterNotFree){
		filrterBtn3.innerHTML = "免費參觀" + "/" + "非免費參觀";
	}
	else {
	 	if (filterFree) {
			filrterBtn3.innerHTML = "免費參觀";
		}
		if (filterNotFree) {
			filrterBtn3.innerHTML = "非免費參觀";
		}
	}
	if (filrterBtn3.innerHTML == "") {
		filrterBtn3.style.color = "#9013FE";
		filrterBtn3.style.backgroundColor = "#F2F2F2";
	}
	else {
		filrterBtn3.style.color = "#F2F2F2";
		filrterBtn3.style.backgroundColor = "#9013FE";
	}
	filrterBtn3.innerHTML += filterLable ;
*/

  // filter data
	filterData = tripList.filter(filterSpot);
	
	// show filter screen
  //showFilterScreen();

	/* ===== always filter data ===== */
  page.startPage = 0;
  page.pointPage = 0;
  page.dataOrigin = false;

	page.totalPage = Math.ceil(filterData.length/page.spotMaxItem);
	page.totalRecord = filterData.length;
	// show spot counter
	$(".spot_counetr").text("景點筆數 : " + page.totalRecord );
	// show spot
	showSpotData(filterData, page.pointPage, page.totalRecord, page.spotMaxItem);

	// show pagibnation
	showPagination(page, page.totalPage);
}

// filter check function
function filterSpot(data) {
	var filterState = true ;

	var b = data.Opentime ;
	if (filter.free || filter.fee || filter.noCost) {
		filterState = false ;
		if (filter.free && (data.Ticketinfo=="免費參觀")) {
			filterState = true;
		}
		if ((filter.noCost) && (data.Ticketinfo==="")) {
			filterState = true;
		}
		if (filter.fee) {
			if (!(data.Ticketinfo=="免費參觀") && !(data.Ticketinfo==="")) {
			filterState = true;				
			}
		}
	}

	if (filter.location != "全部") {
		if (!(data.Zone==filter.location)) {
			filterState = false ;
		}
	}

  var a = data.Opentime ;
	if (filter.allDay ||  filter.notAllDay)  {
		if (filter.allDay &&  filter.notAllDay) {
			// all open select
		  ;
		}
		else if (filter.allDay) {
			// all day - mask not all day
			if (!(data.Opentime=="全天候開放")) {
				filterState = false ;
			}
		}
		else {
			// not all day - mask all ady
			if (data.Opentime=="全天候開放") {
				filterState = false ;
			}
		}
	}

	
	return filterState;
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