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
var filterLable = '<i class="far fa-times-circle"></i>' ;
var filterLableShift = '<i class="far fa-times-circle ml-2"></i>' ;


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

	/* ===== always Origin ===== */
	page.startPage = 0;
  page.pointPage = 0;
  page.dataOrigin = true;

	page.totalPage = Math.ceil(tripList.length/page.spotMaxItem);
	page.totalRecord = tripList.length;
	// show spot counter
	$(".spot_counetr").text("景點筆數 : " + page.totalRecord );
	// show spot
	showSpotData(tripList, page.pointPage, page.totalRecord, page.spotMaxItem);

	// show pagibnation
	showPagination(page, page.totalPage);

});

// search input and load
function inputSearch(event) {
		event.preventDefault();
		if (event.keyCode == 13) {
		//get trip data
		data.offset = 0 ;
		tripList.length = 0;
		run = true;
		while(true) {
			getTripDat(data, tripList);
			data.offset += 100 ;
			if (!run) {
				break;
			}
		}

		// filter 
		tripList = tripList.filter( function(item) {
			if (item.Name.indexOf(event.target.value) != -1) {
				return true;
			}
			else {
				return false;
			}

		});


		//return false ; 
		/* ===== always Origin ===== */
		page.startPage = 0;
  	page.pointPage = 0;
  	page.dataOrigin = true;

		page.totalPage = Math.ceil(tripList.length/page.spotMaxItem);
		page.totalRecord = tripList.length;
		// show spot counter
		$(".spot_counetr").text("景點筆數 : " + page.totalRecord );
		// show spot
		showSpotData(tripList, page.pointPage, page.totalRecord, page.spotMaxItem);

		// show pagibnation
		showPagination(page, page.totalPage);

		event.target.value = "";
	}
}

function getTripDat(data, tripList) {
	var next ;

	$.ajax({
		url: kcgSearchSite,
		data: data,
		datatype:"json",
		async: false, // set sync (default async)
		error: function (xhr, ajaxOptions, thrownError) {
			run = false ;
		},
		success:  function (respData, textStatus) {
			next = respData.result._links.next;

			if (respData.result.records.length > 0 ) {
				for(var j=0 ; j<respData.result.records.length ; j++) {
					tripList.push(respData.result.records[j]);
				}
			}
			else {
				run = false ;
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

// process clear fileter button
function clearFilter(index) {
	var filterBtn = null ;
	switch(index) {
		case 0 :
			filterBtn = $("#filte-btn-location") ;
			$("#location_sel")[0].selectedIndex = 0 ;
			filter.location = "全部" ;
			break ;
		case 1 :
			filterBtn = $("#filte-btn-open") ;
			$("#all_day")[0].checked = false ;
			$("#not_all_day")[0].checked = false ;
			filter.allDay = false ;
			filter.notAllDay = false ;
			break ;
		case 2 :
			filterBtn = $("#filte-btn-pay") ;
			$("#p_free")[0].checked = false ;
			$("#p_fee")[0].checked = false ;
			$("#p_none")[0].checked = false ;
			filter.fee = false ;
			filter.free = false ;
			filter.noCost = false ;
			break ;
		default :
			break;
	}
	if (filterBtn) {
		filterBtn.html(filterLable);
		// remove color
		filterBtn.removeClass("bg-info");
		filterBtn.removeClass("text-white");
		filterBtn.removeClass("btn");
		// add color
		filterBtn.addClass("bg-transparent");
		filterBtn.addClass("text-primary");
	}

  // filter data
	filterData = tripList.filter(filterSpot);

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

// location filter
function locateSelect(event) {
	var filterLocate = $("#filte-btn-location") ;

  // get locate data
	filter.location = event.target.options[event.target.selectedIndex].value ;
	
	// show filter button
  if (filter.location == "全部") {
  	filterLocate.html(filterLable);
		// remove color
		filterLocate.removeClass("bg-info");
		filterLocate.removeClass("text-white");
		filterLocate.removeClass("btn");
		// add color
		filterLocate.addClass("bg-transparent");
		filterLocate.addClass("text-primary");
  }
  else {
		filterLocate.html(filter.location + filterLableShift);
		// remove color
		filterLocate.removeClass("bg-transparent");
		filterLocate.removeClass("text-primary");
		// add color
		filterLocate.addClass("bg-info");
		filterLocate.addClass("text-white");
		filterLocate.addClass("btn");
  }

  // filetr data
	filterData = tripList.filter(filterSpot);

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
	var filterOpen = $("#filte-btn-open") ;
	var filterPay = $("#filte-btn-pay") ;
	var text;

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

	text = "" ;
	if (filter.allDay && filter.notAllDay) {
		text = "全天候開放" + " " + "非全天候開放";
	}
	else {
		if (filter.allDay) {
			text = "全天候開放";
		}
		if (filter.notAllDay) {
			text = "非全天候開放";
		}
	}
	if (text == "") {
		filterOpen.html(filterLable);
		// remove color
		filterOpen.removeClass("bg-info");
		filterOpen.removeClass("text-white");
		filterOpen.removeClass("btn");
		// add color
		filterOpen.addClass("bg-transparent");
		filterOpen.addClass("text-primary");
	}
	else {
		filterOpen.html(text+filterLableShift);
		// remove color
		filterOpen.removeClass("bg-transparent");
		filterOpen.removeClass("text-primary");
		// add color
		filterOpen.addClass("bg-info");
		filterOpen.addClass("text-white");
		filterOpen.addClass("btn");
	}

	text = "" ;
	if (filter.free) {
		text = "免費參觀";
	}
	if (filter.fee) {
		if (text != "") {
			text += " ";
		}
		text += "非免費參觀";
	}
	if (filter.noCost) {
		if (text != "") {
			text += " ";
		}
		text += "無資訊";
	}
	if (text == "") {
		filterPay.html(filterLable);
		// remove color
		filterPay.removeClass("bg-info");
		filterPay.removeClass("text-white");
		filterPay.removeClass("btn");
		// add color
		filterPay.addClass("bg-transparent");
		filterPay.addClass("text-primary");
	}
	else {
		filterPay.html(text+filterLableShift);
		// remove color
		filterPay.removeClass("bg-transparent");
		filterPay.removeClass("text-primary");
		// add color
		filterPay.addClass("bg-info");
		filterPay.addClass("text-white");
		filterPay.addClass("btn");
	}

  // filter data
	filterData = tripList.filter(filterSpot);

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