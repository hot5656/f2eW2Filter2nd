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
function	showSpotData(records, startRecord, totalRecord) {
	var spot = $(".spot");

	for (var i=0 ; i < spotMaxItem ; i++) {
		if ((startRecord+i) >= totalRecord) {
			spot[i].css( "display", "none") ;
		}
		else {
			spot[i].css( "display", "block") ;

			// img
			var x = spot[i].(:first-child);
			x.src = records[i+startRecord].Picture1;

			// spot_title
			x = x.next() ;
			x.innerHTML = records[i+startRecord].Name ;
			// spot_discribe
			x = x.nextElementSibling ;
			x.innerHTML = records[i+startRecord].Description ;
			// spot_dollar + address
			x = x.nextElementSibling ;
			x.innerHTML = '<i class="fas fa-dollar-sign"></i>' + records[i+startRecord].Ticketinfo 
										+"  " +'<i class="fas fa-address-card"></i>' + records[i+startRecord].Add ;
			// spot_locate + opentime
			x = x.nextElementSibling ;
			x.innerHTML = '<i class="fas fa-map-marker-alt"></i>' + records[i+startRecord].Zone 
										+"  " +'<i class="far fa-calendar-alt"></i>' + records[i+startRecord].Opentime ;
		}		
	}

/*
	var spot = document.getElementsByClassName("one_spot");
	for(var i=0 ; i < spotMaxItem ; i++) {
		if ((startRecord+i) >= totalRecord) {
			spot[i].style.display = "none";
		}
		else {
			spot[i].style.display = "block";
			// img
			var x = spot[i].firstElementChild;
			x.src = records[i+startRecord].Picture1;

			// spot_title
			x = x.nextElementSibling ;
			x.innerHTML = records[i+startRecord].Name ;
			// spot_discribe
			x = x.nextElementSibling ;
			x.innerHTML = records[i+startRecord].Description ;
			// spot_dollar + address
			x = x.nextElementSibling ;
			x.innerHTML = '<i class="fas fa-dollar-sign"></i>' + records[i+startRecord].Ticketinfo 
										+"  " +'<i class="fas fa-address-card"></i>' + records[i+startRecord].Add ;
			// spot_locate + opentime
			x = x.nextElementSibling ;
			x.innerHTML = '<i class="fas fa-map-marker-alt"></i>' + records[i+startRecord].Zone 
										+"  " +'<i class="far fa-calendar-alt"></i>' + records[i+startRecord].Opentime ;
		}
	}
*/
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