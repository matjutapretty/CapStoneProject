function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = $.trim(ca[i]);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
};

document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendar');

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    let calendar = new FullCalendar.Calendar(calendarEl, {
        handleWindowResize: true,
        height: 'auto',
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        googleCalendarApiKey: 'AIzaSyCdpcXP0rQInm-pVTdTFJzfuxgvr2qrSD0',
        events: {
            googleCalendarId: 'ii560j119ive7dpsadvnm0mv4g@group.calendar.google.com'
        },
        initialDate: today,
        allDaySlot: false,
        slotMinTime: '08:00:00',
        slotMaxTime: '16:00:00',
        slotDuration: '00:20',
        slotLabelInterval: '00:20',
        slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short'
        },
        hiddenDays: [ 0 ],
        businessHours: [
            {
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: '08:00',
                endTime: '16:00'
            },
            {
                daysOfWeek: [6],
                startTime: '8:00',
                endTime: '12:00'
            }
        ],
        nowIndicator: true,
        navLinks: true,
        selectable: true,
        selectConstraint: 'businessHours',
        selectMirror: true,
        select: function (arg) {
            var title = prompt('Event Title:');
            if (title) {
                calendar.addEvent({
                    title: title,
                    start: arg.start,
                    end: arg.end,
                })
            }
            calendar.unselect()
        },
        eventClick: function (arg) {
            if (confirm('Are you sure you want to delete this event?')) {
                arg.event.remove()
            }
        },
        editable: true,
        selectOverlap: false,
        dayMaxEvents: false
    });
    if(getCookie('prefLang') == "en" || getCookie('prefLang') == ""){
        calendar.render();
    }else if(getCookie('prefLang') == "af"){
        calendar.setOption('locale', 'af');
        calendar.render();
    }else if(getCookie('prefLang') == "nso"){
        calendar.setOption('locale', 'nso');
        calendar.render();
    } else if(getCookie('prefLang') == "xh"){
        calendar.setOption('locale', 'xh');
        calendar.render();
    } else if(getCookie('prefLang') == "zu"){
        calendar.setOption('locale', 'zu');
        calendar.render();
    }
});




