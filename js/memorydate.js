$(document).ready(function(){
	$(window).load(function(){
		new JsDatePick({
			useMode:2,
			target:"calendar",
			dateFormat:"%m-%d-%Y"
		});
	}); //set up js calendar http://javascriptcalendar.org/
	
	/* using jquery validation plugin, but a bit complex
	$.validator.addMethod(
		"dateFmt",
		function(value, element) {
			return value.match(/^dd?-dd?-dddd$/);
		},
		"Please enter a date in the format dd-mm-yyyy.");
	$('#date').validate({
			rules : {
				calendar : {
					required: true,
					date: true
				}
			}
		});
	*/
	
	function ValidateDate(dateValue){
		var dateRegex = new RegExp(/^\d{1,2}-\d{1,2}-\d{4}$/);
		return dateRegex.test(dateValue);
	}
	
	function Date2String(dateValue) { // Date in javascript to readable string
		return (dateValue.getMonth()+1)+'-'+dateValue.getDate()+'-'+dateValue.getFullYear();
	}
	function String2Date(dateValue) {
		return new Date(dateValue); //please make sure the date format is mm-dd-yyyy
	}
	
	function isLeapYear(yearValue) { // check leap year
		if (yearValue%100 == 0 && yearValue%400 == 0)
			return true;
		else if(yearValue%100 != 0 && yearValue%4 == 0)
			return true;
		else
			return false;
	}
	
	function Date2Days(days, months, years){ // transform date to the days of year
		var mdays = [31,28,31,30,31,30,31,31,30,31,30,31]; //days in each month
		var ds = days;
		for( i = 0; i < months; i++){
			if(i == 1 && isLeapYear(years)){
				ds += 29;
				continue;
			}
			ds += mdays[i];
		}
		return ds;
	}
	
	function doubleDigits(num){ // 2 digits
		return num > 9 ? "" + num:"0"+num;
	}
	
	function Days2Date(days, years){ // the reverse process of Date2Days
		var mdays = [31,28,31,30,31,30,31,31,30,31,30,31], //days in each month
			ms = 0;
			
		if(isLeapYear(years))
			mdays[1] = 29;
		else
			mdays[1] = 28;
			
		for( i = 0; i < 12; i++){
			if(days > mdays[i]){
				days -= mdays[i]
				ms ++;
			} else
				break;
		}
		
		return doubleDigits(ms+1)+'-'+doubleDigits(days)+'-'+years;
	}
	

	
	function daysOfYear(yearValue){
		var LeapYear_days = 366;
		var Year_days = 365;
		if (isLeapYear(yearValue))
			return LeapYear_days;
		else
			return Year_days;
	}
	function addDays(days, months, years, adds){ //recursive way to add days to date
		var restdays, m_restdays; // rest days of the year & rest days of the months
		var mdays = [31,28,31,30,31,30,31,31,30,31,30,31]; //days in each month
		if(isLeapYear(years)){
			restdays = 366 - Date2Days(days, months, years);
			mdays[1] = 29;
		}else{
			restdays = 365 - Date2Days(days, months, years);
			mdays[1] = 28;			
		}
		
		m_restdays = mdays[months] - days;
		if(adds > daysOfYear(years+1))
			return addDays(days, months, years+1, adds-daysOfYear(years+1));
		else {
			if(adds > restdays){
				//console.log("3:"+Days2Date(adds-restdays,years+1));
				return Days2Date(adds-restdays,years+1);
			} else {
				if(adds > mdays[months+1]){
					return addDays(days, months+1, years, adds-mdays[months+1]);
				} else {
					var over_month = false;
					if(adds > m_restdays){
						//console.log('1:'+(months+1+1)+'-'+(adds-m_restdays)+'-'+years);
						return doubleDigits(months+1+1)+'-'+doubleDigits(adds-m_restdays)+'-'+years;
					} else {
						//console.log('2:'+(months+1)+'-'+(adds+days)+'-'+years);
						return doubleDigits(months+1)+'-'+doubleDigits(adds+days)+'-'+years;
					}
				}		
			}
		}
	}
	
	function ComputeResults(dateValue){ // update the output fields
		var d = String2Date(dateValue);//getDateFromFormat(dateValue,"mm-dd-yyyy");
		var txt;
		txt = addDays(d.getDate(),d.getMonth(),d.getFullYear(),50);
		$("#d_50").text(" "+txt);
		txt = addDays(d.getDate(),d.getMonth(),d.getFullYear(),100);
		$("#d_100").text(" "+txt);
		txt = addDays(d.getDate(),d.getMonth(),d.getFullYear(),200);
		$("#d_200").text(" "+txt);
		txt = addDays(d.getDate(),d.getMonth(),d.getFullYear(),500);
		$("#d_500").text(" "+txt);
		txt = addDays(d.getDate(),d.getMonth(),d.getFullYear(),1000);
		$("#d_1000").text(" "+txt);
	}
	function ClearResults(){
		$("#d_50").text("");
		$("#d_100").text("");
		$("#d_200").text("");
		$("#d_500").text("");
		$("#d_1000").text("");
	}

	var data_validated = false;
	$("#warning").hide();
	function UpdateFields(){
		var date;
		var dt = $("#calendar").val();
		data_validated = ValidateDate(dt);
		if(data_validated){
			date = $("#calendar").val();
			ComputeResults(date);
			$("#warning").hide();
		}
		else {
			date = "";
			ClearResults();
			$("#warning").show();
			//event.preventDefault(); // should uncomment with the following #calendar event function
		}
	}
	//$("#calendar").bind('input propertychange paste change keyup',function(){
	//	UpdateFields();
	//});
	
	// a alternative way to detect if text field is changed without using event
	// which is useful for text field changed by other js code that won't trigger the event handling
	// from http://stackoverflow.com/questions/16048084/jquery-detect-textbox-value-change-not-based-on-user-input
	var myDate = $("#calendar");
	myDate.data("value", myDate.val());
	setInterval(function(){
		var data = myDate.data("value"),
			val = myDate.val();
		if (data !== val) {
			myDate.data("value", val);
			UpdateFields();
		}
	},100);
});