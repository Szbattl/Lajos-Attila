$(document).ready(function() {
  var bookedDates = {};
  var userBookedDates = [];
  var selectedStartDate = null;
  var selectedEndDate = null;
  var hoverStartDate = null;
  var hoverEndDate = null;

  var isSelecting = false;

  $("#calendar").datepicker({
    numberOfMonths: 2,
    minDate: 0,
    beforeShowDay: function(date) {
      var dateString = $.datepicker.formatDate('yy-mm-dd', date);
      var isUserBooked = userBookedDates.indexOf(dateString) !== -1;
      var isBetween = selectedStartDate !== null && selectedEndDate !== null &&
        date >= selectedStartDate && date <= selectedEndDate;
      var isHovered = hoverStartDate !== null && hoverEndDate !== null &&
        date >= hoverStartDate && date <= hoverEndDate;

      return [true, isUserBooked ? "user-booked" : "", isBetween || isHovered ? "in-between" : ""];
    },
    onSelect: function(dateText) {
      if (!isSelecting) {
        // Első kattintás esetén
        selectedStartDate = new Date(dateText);
        selectedEndDate = null;
        isSelecting = true;
      } else {
        // Második kattintás esetén
        selectedEndDate = new Date(dateText);
        if (selectedEndDate < selectedStartDate) {
          var temp = selectedStartDate;
          selectedStartDate = selectedEndDate;
          selectedEndDate = temp;
        }
        isSelecting = false;
      }
      highlightSelectedPeriod();
      if (selectedEndDate !== null) {
        $("#bookingForm").slideDown();
      }
    },
    onClose: function() {
      $(".ui-datepicker-calendar .ui-state-highlight").removeClass("ui-state-highlight");
      highlightSelectedPeriod();
    },
  });

  // Egérrel való húzás esemény kezelése
  $("#calendar .ui-datepicker-calendar").on("mousemove", "td", function() {
    if (isSelecting) {
      var dateText = $(this).attr("data-year") + "-" +
        ($(this).attr("data-month").length === 1 ? "0" : "") + ($(this).attr("data-month")) + "-" +
        ($(this).text().length === 1 ? "0" : "") + ($(this).text());
      hoverStartDate = new Date(dateText);
      hoverEndDate = null;

      highlightSelectedPeriod();
    }
  });

  // ... (a kód a kérdésben található kód)
});
