$( function() {
    $( "#txtStartDate" ).datepicker();
} );

function calendarTodos() {
	document.getElementById("divCalendar").innerHTML = "";
	
	var startDate = $('#txtStartDate').val();
	var numberDays = $('#txtNumberDays').val();
	var countryCode = $('#txtCountryCode').val();  
  
	var partsStartDate = startDate.split('/');  
	
	var dateStartDate = new Date(partsStartDate[2], partsStartDate[0] - 1, partsStartDate[1]);
	// mes comienza en cero
  
	var dateEndDate=new Date(dateStartDate);
	dateEndDate.setDate(dateEndDate.getDate() + parseInt(numberDays-1));
	
	var startYear = dateStartDate.getFullYear();
	var endYear = dateEndDate.getFullYear();
	var startMonth = dateStartDate.getMonth();
	var endMonth = dateEndDate.getMonth();
	var startDay = dateStartDate.getDate();
	var endDay = dateEndDate.getDate();
	
	var auxYear = startYear;
	var auxMonth = startMonth;
	
	while ((auxYear < endYear) || (auxYear==endYear && auxMonth <= endMonth)) { 
		//alert('auxYear: ' + auxYear);
		//alert('endYear: ' + endYear);
		//alert('auxMonth: ' + auxMonth);		
		//alert('endMonth: ' + endMonth);		
		//alert('startMonth: ' + startMonth);
		//alert('endMonth: ' + endMonth);
		//alert('numberMes: ' + numberMes);
		//alert('startDay: ' + startDay);
		//alert('endDay ANTES: ' + endDay);*/		
		
		if (auxYear == startYear && auxMonth == startMonth){
			startDay = dateStartDate.getDate();
		} else {
			startDay = 1;
		}
		
		if (auxYear == endYear && auxMonth == endMonth){		
			endDay = dateEndDate.getDate();
		} else {
			endDay = 31;
		}		
		calendarPorMes(auxMonth, startDay, endDay, auxYear);				
		
		auxMonth++;
		
		if (auxMonth==12){
			auxYear++;
			auxMonth=0;
		}
	}
	
}


function calendarPorMes(month, startDay, endDay, year) {

  months = new Array('January','February','March','April','May','June','July','August','September','October','November','December');

  this_month = new Date(year, month, 1);
  next_month = new Date(year, month + 1, 1);

  // Find out when this month starts and ends.
  first_week_day = this_month.getDay();
  days_in_this_month = Math.round((next_month.getTime() - this_month.getTime()) / (1000 * 60 * 60 * 24));

  calendar_html = '<table style="background-color:666699; color:ffffff;">';
  calendar_html += '<tr><td colspan="7" style="background-color:9999cc; color:000000; text-align: center;">' + months[month] + ' ' + year + '</td></tr>';    
  calendar_html += '<tr style="background-color:9999cc; color:000000; text-align: center;"><td>S</td><td>M</td><td>T</td><td>W</td><td>T</td><td>F</td><td>S</td></tr>';
  calendar_html += '<tr>';

  // Fill the first week of the month with the appropriate number of blanks.
  for(week_day = 0; week_day < first_week_day; week_day++) {
    calendar_html += '<td style="background-color:9999cc; color:000000;"> </td>';
  }

  week_day = first_week_day;
  for(day_counter = 1; day_counter <= days_in_this_month; day_counter++) {
    week_day %= 7;
    if(week_day == 0)
      calendar_html += '</tr><tr>';
  
	var backgroundColor = "";
	
	if (week_day==0 || week_day==6){
		backgroundColor="yellow";
	} else {
		backgroundColor="LightGreen";
	}	
  
	if (day_counter<startDay || day_counter > endDay){
		calendar_html += '<td style="background-color:9999cc; color:000000; text-align: center;"> ' + '&nbsp;&nbsp;' + ' </td>';
	} else {
		calendar_html += '<td id="td-' + year + '-' +pad('00',(month+1),true) + '-'+pad('00',day_counter,true) + '" style="background-color:' + backgroundColor + '; color:000000; text-align: center;"> ' + day_counter + ' </td>';		
	}	
	
    week_day++;
  }

  calendar_html += '</tr>';
  calendar_html += '</table><br/>';

  // Mostrar el calendario
  document.getElementById("divCalendar").innerHTML += calendar_html;
  
  	// Check if day is feriado
	var keyholidayapi = '02b8b29f-c2d2-4fba-8d71-2fed8ae9c2b5';
	var countryCode = $('#txtCountryCode').val();
	var urlholidayapi = 'https://holidayapi.com/v1/holidays?key='+ keyholidayapi+'&country='+countryCode+'&year='+year+'&month='+(month+1);
	$.ajax({
        url: urlholidayapi		
    }).then(function(data) {		
	
		for (x in data.holidays) {				
			$('.rpt2').append('FERIADO ').append(x).append(' ') ;  				
			var dateHoliday = data.holidays[x].date;
			var nameHoliday = data.holidays[x].name;				
			$('#td-' + dateHoliday).css('background-color', 'ORANGE');
			$('#td-' + dateHoliday).attr('title', nameHoliday);
		}	   		
		  
    });
  
}

function pad(pad, str, padLeft) {
  if (typeof str === 'undefined') 
    return pad;
  if (padLeft) {
    return (pad + str).slice(-pad.length);
  } else {
    return (str + pad).substring(0, pad.length);
  }
}