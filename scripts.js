$(document).ready(function() {
  // Elérhető napok inicializálása
  var bookedDates = {};

  // Felhasználó által foglalt napok inicializálása
  var userBookedDates = [];

  // Kiválasztott időszak
  var selectedStartDate = null;
  var selectedEndDate = null;

  // Egérrel föléállt időszak
  var hoverStartDate = null;
  var hoverEndDate = null;

  // Naptár inicializálása
  $("#calendar").datepicker({
    numberOfMonths: 2,
    minDate: 0,
    // stílusok beállítása a naptár napjaihoz
    beforeShowDay: function(date) {
      var dateString = $.datepicker.formatDate('yy-mm-dd', date);
      var isUserBooked = userBookedDates.indexOf(dateString) !== -1;
      var isBetween = selectedStartDate !== null && selectedEndDate !== null &&
        date >= selectedStartDate && date <= selectedEndDate;

      var isHovered = hoverStartDate !== null && hoverEndDate !== null &&
        date >= hoverStartDate && date <= hoverEndDate;

      return [true, isUserBooked ? "user-booked" : "", isBetween || isHovered ? "in-between" : ""];
    },
    // dátum kiválasztása esemény
    onSelect: function(dateText) {
      if (selectedStartDate === null) {
        selectedStartDate = new Date(dateText);
        selectedEndDate = null;
      } else {
        selectedEndDate = new Date(dateText);
        if (selectedEndDate < selectedStartDate) {
          var temp = selectedStartDate;
          selectedStartDate = selectedEndDate;
          selectedEndDate = temp;
        }
      }
      // kiválasztott időszak kiemelése
      highlightSelectedPeriod();
      if (selectedEndDate !== null) {
        $("#bookingForm").slideDown();
      }
    },
    // naptár bezárása esemény
    onClose: function() {
      $(".ui-datepicker-calendar .ui-state-highlight").removeClass("ui-state-highlight");
      highlightSelectedPeriod();
    },
    // naptár megjelenése előtt esemény
   beforeShow: function() {
  $(".ui-datepicker-calendar td.hoverPeriod").removeClass("hoverPeriod");

  $(".ui-datepicker-calendar td").hover(
    function() {
      // Egérrel föléállás esemény
      var dateText = $(this).attr("data-year") + "-" +
        ($(this).attr("data-month").length === 1 ? "0" : "") + ($(this).attr("data-month")) + "-" +
        ($(this).text().length === 1 ? "0" : "") + ($(this).text());
      hoverStartDate = new Date(dateText);
      hoverEndDate = null;

      // Egérrel föléállt időszak kiemelése
      highlightHoverPeriod();
    },
    function() {
      // Egérről leállás esemény
      hoverStartDate = null;
      hoverEndDate = null;

      // Egérrel föléállt időszak kiemelésének eltávolítása
      highlightHoverPeriod();
    }
  );
}



  

  // Vissza a naptárhoz gomb esemény
$(document).ready(function() {
  $("#backToCalendar").on("click", function() {
    // Felhasználó által foglalt napok törlése
    userBookedDates = [];
    $("#confirmation").hide();
    // Naptár frissítése
    $("#calendar").datepicker("refresh");
  });

  // Dátum formázása
  function formatDate(date) {
    return $.datepicker.formatDate('yy-mm-dd', date);
  }

  // Űrlap validáció
  function validateForm() {
    var isValid = true;
    $("#reservationForm :input[required]").each(function() {
      if (!$(this).val()) {
        isValid = false;
        return false;
      }
    });

    // E-mail validáció
    var emailInput = $("#email");
    var emailValue = emailInput.val();
    var emailPattern = emailInput.attr("pattern");
    if (!new RegExp(emailPattern).test(emailValue)) {
      alert("Az E-mail cím nem megfelelő formátumú!");
      isValid = false;
    }
// Űrlap mezőbeírás esemény
  $("#email").on("input", function () {
    var emailInput = $(this);
    var placeholder = "példa@példa";

    // Ellenőrizzük, hogy a felhasználó elkezdett-e gépelni
    if (emailInput.val().trim() === placeholder) {
      // Ha a felhasználó még nem írt semmit, akkor töröljük a tartalmat
      emailInput.val("");
    }
  });
    // Irányítószám validáció
    var zipcodeInput = $("#zipcode");
    var zipcodeValue = zipcodeInput.val();
    var zipcodePattern = /^\d+$/; // Csak számok engedélyezettek
    if (!zipcodePattern.test(zipcodeValue)) {
      alert("Csak számok használata lehetséges az irányítószám mezőben!");
      isValid = false;
    }

    // Házszám validáció
    var houseNumberInput = $("#houseNumber");
    var houseNumberValue = houseNumberInput.val();
    var houseNumberPattern = /^\d+$/; // Csak számok engedélyezettek
    if (!houseNumberPattern.test(houseNumberValue)) {
      alert("Csak számok használata lehetséges a házszám mezőben!");
      isValid = false;
    }

    return isValid;
  
  }

  // Foglalás részleteinek lekérése
  function getBookingDetails() {
    var name = $("#name").val();
    var zipcode = $("#zipcode").val();
    var email = $("#email").val();
    var street = $("#street").val();
    var houseNumber = $("#houseNumber").val();
    var adults = $("#adults").val();
    var children = $("#children").val();

    return `
      Foglalási részletek:
      Név: ${name}
      Irányítószám: ${zipcode}
      E-mail cím: ${email}
      Utca: ${street}
      Házszám: ${houseNumber}
      Felnőttek száma: ${adults}
      Gyerekek száma: ${children}
    `;
  }

  // Kiválasztott időszak kiemelése
  function highlightSelectedPeriod() {
    $(".ui-datepicker-calendar .selectedPeriod").removeClass("selectedPeriod");
    $(".ui-datepicker-calendar .in-between").removeClass("in-between");

    if (selectedStartDate !== null) {
      var startDate = selectedStartDate;
      var endDate = selectedEndDate || startDate;

      $("#calendar .ui-datepicker-calendar td").each(function() {
        var currentDate = new Date($(this).attr("data-year"), $(this).attr("data-month"), $(this).text());

        if (currentDate >= startDate && currentDate <= endDate) {
          $(this).addClass("selectedPeriod");
        }
      });
    }
  }

  // Egérrel föléállt időszak kiemelése
  function highlightHoverPeriod() {
    $(".ui-datepicker-calendar .hoverPeriod").removeClass("hoverPeriod");

    if (hoverStartDate !== null) {
      var startDate = hoverStartDate;
      var endDate = hoverEndDate || startDate;

      $("#calendar .ui-datepicker-calendar td").each(function() {
        var currentDate = new Date($(this).attr("data-year"), $(this).attr("data-month"), $(this).text());

        if (currentDate >= startDate && currentDate <= endDate) {
          $(this).addClass("hoverPeriod");
        }
      });
    }
  }
});

  // Foglalás véglegesítése gomb esemény
   $("#submitBtn").on("click", function () {
    if (validateForm()) {
      var selectedDateText =
        "Foglalás dátuma: " +
        formatDate(selectedStartDate) +
        (selectedEndDate ? " - " + formatDate(selectedEndDate) : "");
      var bookingDetails = getBookingDetails();
      $("#selectedDate").text(selectedDateText);
      $("#bookingDetails").text(bookingDetails);

      // Felhasználó által foglalt napok frissítése
      var currentDate = new Date(selectedStartDate);
      while (currentDate <= selectedEndDate) {
        userBookedDates.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      $("#bookingForm").hide();
      $("#confirmation").slideDown();
    } else {
      // Hibajelzés, ha nem minden kötelező mező van kitöltve
      alert(
        "Kérlek töltse ki az összes kötelező mezőt a foglalás véglegesítéséhez!"
      );
    }
  });
// "Módosítás" gomb hozzáadása
  $("#modifyBtn").on("click", function() {
    // Űrlap megjelenítése
    showBookingForm();
  });

  // Foglalás véglegesítése gomb esemény
  $("#submitBtn").on("click", function() {
    if (validateForm()) {
      var selectedDateText =
        "Foglalás dátuma: " +
        formatDate(selectedStartDate) +
        (selectedEndDate ? " - " + formatDate(selectedEndDate) : "");
      var bookingDetails = getBookingDetails();
      $("#selectedDate").text(selectedDateText);
      $("#bookingDetails").text(bookingDetails);

      // Felhasználó által foglalt napok frissítése
      var currentDate = new Date(selectedStartDate);
      while (currentDate <= selectedEndDate) {
        userBookedDates.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Űrlap elrejtése
      hideBookingForm();

      $("#confirmation").slideDown();
    } else {
      alert("Kérlek töltse ki az összes kötelező mezőt a foglalás véglegesítéséhez!");
    }
  });

  // Megerősítés gomb esemény
  $("#confirmBtn").on("click", function() {

  });

    // Megerősítő üzenet létrehozása
    var confirmationMessage =
      "Köszönjük a foglalását!\n\n" + getBookingDetails();
    alert(confirmationMessage);
  });

  //Ez a rész a kapcsolat.html-hez tartozik
  $(document).ready(function() {
  // Automatikus képváltás időzítője (5 másodperc)
  var slideInterval = 5000;

  // Képek és megfelelő címek listája
  var images = [
    { src: "1649695901888.jpg", alt: "Stúdió Prémium Apartman", id: "studio" },
    { src: "IMG_20220404_135711.jpg", alt: "1,5 szobás Prémium Apartman", id: "masfeles" },
  ];

  var currentSlide = 0;
  var totalSlides = images.length;

  function updateCarousel() {
    // Kép és cím frissítése
    $("#apartmanCarousel .carousel-inner img").attr("src", images[currentSlide].src);
    $("#apartmanCarousel .carousel-inner img").attr("alt", images[currentSlide].alt);

    // Kiválasztott címelem frissítése
    $("#apartmanCarousel .carousel-inner .carousel-caption h3").text(images[currentSlide].alt);

    // Aktív diák kijelölése az előadónak
    $("#apartmanCarousel .carousel-indicators li").removeClass("active");
    $("#apartmanCarousel .carousel-indicators li:nth-child(" + (currentSlide + 1) + ")").addClass("active");
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  // Elindítjuk az időzítőt az automatikus képváltáshoz
  var slideTimer = setInterval(nextSlide, slideInterval);

  // Következő és előző gombok kezelése
  $("#apartmanCarousel .carousel-control-prev").on("click", prevSlide);
  $("#apartmanCarousel .carousel-control-next").on("click", nextSlide);

  // Kattintás a diákra az ugráshoz
  $("#apartmanCarousel .carousel-indicators li").on("click", function() {
    currentSlide = $(this).index();
    updateCarousel();
  });

  // Kép nagyítása kattintással
  $("#apartmanCarousel .carousel-inner img").on("click", function() {
    var src = $(this).attr("src");
    var alt = $(this).attr("alt");
    var modalHtml = `
      <div class="modal fade" id="imageModal" tabindex="-1" role="dialog" aria-labelledby="imageModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="imageModalLabel">${alt}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <img src="${src}" alt="${alt}" style="width: 100%;">
            </div>
          </div>
        </div>
      </div>
    `;

    $("body").append(modalHtml);
    $("#imageModal").modal();
  });
});

//kapcsolat.html vége
