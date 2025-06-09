const selectors = require('./selectors');
const helpers = require('../helper');

const HEBREW_MONTHS = {
  ינואר: 1, פברואר: 2, מרץ: 3, אפריל: 4, מאי: 5, יוני: 6,
  יולי: 7, אוגוסט: 8, ספטמבר: 9, אוקטובר: 10, נובמבר: 11, דצמבר: 12,
};

const searchFlight = {
  // --------------   Functions -----------------------------------------------------------------------------------------------------
  async closeCookiesBanner() {
    const cookiesCloseButton = await $(selectors.cookiesClose);
    if (await cookiesCloseButton.isDisplayed()) {
      await cookiesCloseButton.click();
      console.log('🍪 Cookies banner closed');
    } else {
      console.log('🍪 No cookies banner displayed');
    }
  },

  async checkAllUISections() {
    return {
      icons: await helpers.checkElements({
        phoneIcon: selectors.phoneIcon,
        customerSupportIcon: selectors.customerSupportIcon,
        wallaToursIcon: selectors.wallaToursIcon,
        bestPriceIcon: selectors.bestPriceIcon,
        calendarIcon: selectors.calendarIcon,
        instagramIcon: selectors.instagramIcon,
        facebookIcon: selectors.facebookIcon,
        facebookGroupIcon: selectors.facebookGroupIcon
      }, "Icons", false),

      fields: await helpers.checkElements({
        fromField: selectors.fromField,
        toField: selectors.toField,
        dateField: selectors.dateField,
        travellersField: selectors.travelersDropdown,
        classField: selectors.classField
      }, "Fields", false),

      buttons: await helpers.checkElements({
        customerSupportButton: selectors.customerSupportButton,
        phoneNumberButton: selectors.phoneNumberButton,
        flightsButton: selectors.flightsButton,
        packagesButton: selectors.packagesButton,
        hotelButton: selectors.hotelButton,
        concertsButton: selectors.concertsButton,
        sportsButton: selectors.sportsButton,
        organizedHolidayButton: selectors.organizedHolidayButton,
        cruisesButton: selectors.cruisesButton,
        dynamicPackagesButton: selectors.dynamicPackagesButton,
        domesticFlightsButton: selectors.domesticFlightsButton,
        flightsEilatButton: selectors.flightsEilatButton,
        eilatPackagesButton: selectors.eilatPackagesButton
      }, "Buttons", true),

      searchPanelButtons: await helpers.checkElements({
        submitSearchButton: selectors.submitSearchButton,
        rewriteDestinationButton: selectors.rewriteDestinationButton,
        roundTripButton: selectors.roundTripButton,
        oneWayButton: selectors.oneWayButton,
        multipleDestinations: selectors.multipleDestinations,
        flexibleDatesButton: selectors.flexibleDatesButton
      }, "Search Panel Buttons", true),

      cheapestTickets: await helpers.checkElements({
        titleCheapestTickets: selectors.titleCheapestTickets,
        listOfCheapestTickets: selectors.listOfCheapestTickets,
        titleLastBoughtTickets: selectors.titleLastBoughtTickets,
        listOfLastBought: selectors.listOfLastBought
      }, "Cheapest Tickets Elements", false)
    };
  },

  async clearToField() {
    const toField = await $(selectors.toField);
    await toField.waitForDisplayed({ timeout: 5000 });
    await toField.waitUntil(async () => await toField.isEnabled(), {
      timeout: 5000,
      timeoutMsg: '"To" field is not enabled',
    });
    await toField.click();
    await toField.setValue('');
    await browser.keys(['Control', 'a']);
    await browser.keys('Backspace');
  },

  async clearFromField() {
    const fromField = await $(selectors.fromField);
    await fromField.waitForDisplayed({ timeout: 5000 });
    await fromField.waitUntil(async () => await fromField.isEnabled(), {
      timeout: 5000,
      timeoutMsg: '"From" field is not enabled',
    });
    await fromField.click();
    await fromField.setValue('');
    await browser.keys(['Control', 'a']);
    await browser.keys('Backspace');
  },

  async clickNewSearchButton() {
    const newSearchButton = await $(selectors.newSearchButton);
    await newSearchButton.waitForDisplayed({ timeout: 5000 });
    await newSearchButton.click();
  },

  /**
   * Search flight with dynamic destination, calendar, dates, and dropdown interaction
   * @param {Object} options
   * @param {string} [options.from] - Origin city (optional)
   * @param {string} options.to - Destination city (e.g., "New York")
   * @param {number} [options.fromArrowDownCount=1] - ArrowDowns for "from" suggestion list
   * @param {number} [options.arrowDownCount=2] - ArrowDowns for "to" suggestion list
   * @param {number} [options.nextMonthClicks=1] - Clicks on "next month" in calendar
   * @param {number} [options.departureDay=4] - Departure day of the month
   * @param {number} [options.returnDay=12] - Return day of the month
   * @param {number} [options.rowIndex=0] - Row index (0 = main row, >0 = multi-destination)
   * @param {boolean} [options.submit=true] - Whether to click the search button
   * @param {string} [options.flightClass] - Flight class to select (e.g., "מחלקת עסקים")
   * @param {boolean} [options.isOneWay] - Optional override for one-way trip logic
   */

  async searchFlight({
    from,
    to,
    fromArrowDownCount = 1,
    arrowDownCount = 2,
    departureDay,
    departureMonth,
    departureYear,
    returnDay,
    returnMonth,
    returnYear,
    rowIndex = 0,
    submit = true,
    flightClass,
    isOneWay: isOneWayOverride
  }) {
    await browser.pause(1000);

    const isMulti = rowIndex > 0;
    const isOneWay = Boolean(isOneWayOverride ?? (returnDay == null && returnMonth == null && returnYear == null));

    // --- FROM field (optional) ---
    if (from) {
      const fromFieldSelector = isMulti ? selectors.getFromFieldSelector(rowIndex) : selectors.fromField;
      const fromField = await $(fromFieldSelector);
      await fromField.waitForDisplayed({ timeout: 5000 });
      await fromField.click();
      await fromField.setValue(from);
      for (let i = 0; i < fromArrowDownCount; i++) {
        await browser.keys('ArrowDown');
        await browser.pause(300);
      }
      await browser.keys('Enter');
      await browser.pause(1000);
    }

    // --- TO field ---
    const toFieldSelector = isMulti ? selectors.getToFieldSelector(rowIndex) : selectors.toField;
    const toField = await $(toFieldSelector);
    await toField.waitForDisplayed({ timeout: 5000 });
    await toField.click();
    await toField.setValue(to);
    for (let i = 0; i < arrowDownCount; i++) {
      await browser.keys('ArrowDown');
      await browser.pause(300);
    }
    await browser.keys('Enter');
    await browser.pause(1000);

    // --- FLIGHT CLASS (optional) ---
    if (flightClass) {
      await this.selectFlightClass(flightClass);
    }

    // --- CALENDAR field ---
    const calendarSelector = isMulti
      ? selectors.getCalendarFieldSelector(rowIndex)
      : (isOneWay ? selectors.oneWayCalendar : selectors.roundTripCalendar);

    const nextButtonSelector = this.resolveNextButtonSelector({ isMulti, isOneWay, rowIndex });
    const calendar = await $(calendarSelector);
    await calendar.waitForDisplayed({ timeout: 5000 });
    await calendar.click();

    await browser.waitUntil(async () => {
      const monthBlocks = await $$(selectors.calendarMonthBlock);
      return monthBlocks.length >= 1;
    }, {
      timeout: 3000,
      timeoutMsg: '❌ Calendar did not fully open in time'
    });

    await this.selectCalendarDayByDate({
      day: departureDay,
      month: departureMonth,
      year: departureYear,
      nextButtonSelector,
    });

    if (!isOneWay && !isMulti) {
      await this.selectCalendarDayByDate({
        day: returnDay,
        month: returnMonth,
        year: returnYear,
        nextButtonSelector,
      });
    }

    // --- SUBMIT search ---
    if (submit && rowIndex === 0 && !isMulti) {
      const searchButton = await $(selectors.submitSearchButton);
      await searchButton.waitForDisplayed({ timeout: 5000 });
      await searchButton.click();
      console.log("✅ Search submitted.");
      await browser.pause(10000);
    }
    else if (submit && isMulti && rowIndex === 2) {
      const multiSearchButton = await $(selectors.multiSubmitSearchButton);
      await multiSearchButton.waitForDisplayed({ timeout: 5000 });
      await multiSearchButton.click();
      console.log("✅ Multi-Destination search submitted.");
      await browser.pause(10000);
    }

    console.log(`🧭 isOneWay: ${isOneWay}, isMulti: ${isMulti}, rowIndex: ${rowIndex}`);
  },


  selectCalendarDayByDate: async function ({ day, month, year, nextButtonSelector }) {
    const targetDate = new Date(Date.UTC(year, month - 1, day));
    console.log(`📅 Target: ${day}/${month}/${year} (UTC: ${targetDate.getTime()})`);

    for (let attempt = 0; attempt < 6; attempt++) {
           const monthBlocks = await $$(selectors.calendarMonthBlock);
      
      for (const block of monthBlocks) {
        const dayElems = await block.$$(selectors.calendarDay);
     
        for (const el of dayElems) {
          const elTime = parseInt(await el.getAttribute('time'), 10);
          const elText = await el.getText();
          const isVisible = await el.isDisplayed();
          const isClickable = await el.isClickable();

          const elDate = new Date(elTime);
          const isSameDate =
            elDate.getUTCFullYear() === year &&
            elDate.getUTCMonth() === month - 1 &&
            elDate.getUTCDate() === day;

         // console.log(`🔍 Checking day: ${elText} | ${elDate.toISOString()} | visible=${isVisible} | clickable=${isClickable} | match=${isSameDate}`);

          if (isSameDate && isVisible && isClickable) {
            console.log(`✅ Found and clicking: ${elText}`);
            await el.scrollIntoView();
            await el.click();
            return;
          }
        }
      }

      console.log(`➡️ Not found yet. Clicking next month (attempt ${attempt + 1})`);
      console.log(`🧭 Trying to click NEXT button: ${nextButtonSelector}`);

      const nextBtn = await $(nextButtonSelector);
      if (await nextBtn.isDisplayed()) {
        await nextBtn.scrollIntoView();
        await nextBtn.waitForClickable({ timeout: 3000 });
        await nextBtn.click();
        await browser.pause(500);
      }
    }

    throw new Error(`❌ Date ${day}/${month}/${year} not found in visible calendar`);
  },

resolveNextButtonSelector: function ({ isMulti, isOneWay, rowIndex }) {
    if (isMulti) {
      const selector = rowIndex === 1 ? selectors.nextButtonMulti1
                     : rowIndex === 2 ? selectors.nextButtonMulti2
                     : selectors.multiWayNextButtonSelector
                        ? selectors.multiWayNextButtonSelector(rowIndex)
                        : null;
      console.log(`🧭 Resolved MULTI selector: ${selector}`);
      return selector;
    }

    if (isOneWay) {
      console.log(`🧭 Resolved ONEWAY selector: ${selectors.oneWayNextButton}`);
      return selectors.oneWayNextButton;
    }

    console.log(`🧭 Resolved DEFAULT (round trip) selector: ${selectors.nextButton}`);
    return selectors.nextButton;
},

  //Navigate Search
  async openCalendar(selector = this.calendarIcon) {
      const calendarButton = await $(selector);
      await calendarButton.waitForDisplayed({ timeout: 5000 });
      await calendarButton.click();
  },

  async selectVisibleDay(dayNumber) {
      const allMatchingDays = await $$(this.visibleDaySelector(dayNumber));
      for (const el of allMatchingDays) {
          if (await el.isDisplayed()) {
              await el.click();
              return;
          }
      }
      throw new Error(`No visible day found for ${dayNumber}`);
  },

  async clickSearchButton() {
      const searchButton = await $(this. submitSearchButton);
      await searchButton.waitForClickable({ timeout: 5000 });
      await searchButton.click();
  }, 

  //Choose class 
  async selectFlightClass(optionText) {
      const dropdownButton = await $(selectors.classField);
      await dropdownButton.waitForDisplayed({ timeout: 5000 });
      await dropdownButton.click();

      const dropdownContainer = await $(selectors.dropDownClass);
      await dropdownContainer.waitForDisplayed({ timeout: 5000 });

      const listItemSelector = `${selectors.dropDownClass}//li`; // all options inside
      const options = await $$(listItemSelector);

      for (const option of options) {
          const text = await option.getText();
          if (text.trim() === optionText.trim()) {
              await option.click();
              console.log(`✅ Selected flight class: ${optionText}`);
              return;
          }
      }

      throw new Error(`❌ Flight class option "${optionText}" not found`);
  },

  // Search categories
  async selectRoundTripChanges() {
      const roundTripButton = await $(selectors.roundTripButton);
      const roundTripCalendar = await $(selectors.roundTripCalendar);
      await roundTripButton.waitForDisplayed();
      await roundTripButton.click();
      await roundTripButton.waitForDisplayed({ timeout: 3000 });
      return await roundTripCalendar.isDisplayed();
  },

  async selectMultiWayChanges() {
      const multipleDestinations = await $(selectors.multipleDestinations);
      const addDestinationMulti = await $(selectors.addDestinationMulti);
  
      await multipleDestinations.waitForDisplayed();
      await multipleDestinations.click();
      await addDestinationMulti.waitForDisplayed({ timeout: 3000 });
  
      for (let i = 2; i <= 4; i++) {
          await addDestinationMulti.click();
          await browser.pause(500); // Let the new line render
  
          const fromField = await $(selectors.getFromFieldSelector(i));
          const toField = await $(selectors.getToFieldSelector(i));
          const calendarField = await $(selectors.getCalendarFieldSelector(i));
  
          const isFromVisible = await fromField.isDisplayed();
          const isToVisible = await toField.isDisplayed();
          const isCalendarVisible = await calendarField.isDisplayed();
  
          if (!isFromVisible || !isToVisible || !isCalendarVisible) {
              console.error(`❌ One or more fields on line ${i} are not visible.`);
              return false;
          }
  
          if (i >= 3) {
              const removeButton = await $(selectors.getRemoveButtonSelector(i));
              const isRemoveVisible = await removeButton.isDisplayed();
  
              if (!isRemoveVisible) {
                  console.error(`❌ Remove button for line ${i} is not visible.`);
                  return false;
              }
          }
      }
  
      // ✅ Now remove rows down to only 2 left
      for (let i = 5; i >= 3; i--) {
          const removeButton = await $(selectors.getRemoveButtonSelector(i));
          if (await removeButton.isDisplayed()) {
              await removeButton.click();
              await browser.pause(500); // Let DOM update
          }
      }
  
      return true;
  },  

  //Travelers Field
  async openTravelersDropdown() {
      const roundTripButton = await $(selectors.roundTripButton);
      await roundTripButton.click();
      const dropdown = await $(selectors.travelersDropdown);
      await dropdown.waitForDisplayed({ timeout: 5000 });
      await dropdown.click();
  },

  async getTravelerCount(type) {
      let field;
      switch (type) {
          case 'adult':
              field = await $(selectors.adultCountField);
              break;
          case 'child':
              field = await $(selectors.childCountField);
              break;
          case 'infant':
              field = await $(selectors.infantCountField);
              break;
          default:
              throw new Error(`Invalid traveler type: ${type}`);
      }
      return parseInt(await field.getText());
  },

  async adjustTravelerCount(type, count) {
      let plusButton, minusButton;
      switch (type) {
          case 'adult':
              plusButton = await $(selectors.adultPlusButton);
              minusButton = await $(selectors.adultMinusButton);
              break;
          case 'child':
              plusButton = await $(selectors.childPlusButton);
              minusButton = await $(selectors.childMinusButton);
              break;
          case 'infant':
              plusButton = await $(selectors.infantPlusButton);
              minusButton = await $(selectors.infantMinusButton);
              break;
          default:
              throw new Error(`Invalid traveler type: ${type}`);
      }
  
      const clickCount = Math.abs(count);
  
      for (let i = 0; i < clickCount; i++) {
          const isPlus = count > 0;
          const button = isPlus ? plusButton : minusButton;
          const emoji = isPlus ? '➕' : '➖';
          const label = isPlus ? 'plus' : 'minus';
  
          await button.waitForDisplayed({ timeout: 5000 });
          await button.waitForClickable({ timeout: 5000 });
  
          const isDisabled = await button.getAttribute('disabled');
          if (isDisabled) {
              console.error(`❌ The ${label} button is disabled for ${type} count adjustment`);
              break;
          }
  
          console.log(`${emoji} Clicking ${type} ${label} button (${i + 1}/${clickCount})`);
          await button.click();
      }
  },
      
  //Flexible Dates
  async clickFlexibleDropdownAndCheck(expectedChoices = []) {
      const button = await $(selectors.flexibleDatesButton);
      const dropdown = await $(selectors.dropDownFlexy);

      await button.waitForDisplayed();
      await button.click();
      await dropdown.waitForDisplayed({ timeout: 3000 });

      if (!(await dropdown.isDisplayed())) {
          return false;
      }

      if (expectedChoices.length > 0) {
          for (const choice of expectedChoices) {
              const choiceElement = await dropdown.$(`//*[contains(text(), "${choice}")]`);
              if (!(await choiceElement.isDisplayed())) {
                  console.log(`Missing choice: ${choice}`);
                  return false;
              }
          }
      }

      return true;
  },

  async clickDropdownAndCheck(expectedChoices = []) {
      const buttonClass = await $(selectors.classField);
      const dropDownClass = await $(selectors.dropDownClass);
      const roundTripButton = await $(selectors.roundTripButton);
      await roundTripButton.click();
      await buttonClass.waitForDisplayed;
      await buttonClass.click();
      await dropDownClass.waitForDisplayed({ timeout: 3000 });

      if (!(await dropDownClass.isDisplayed())) {
          console.error('Dropdown did not display.');
          return false;
      }

      if (expectedChoices.length > 0) {
          for (const choice of expectedChoices) {
              const choiceElement = await dropDownClass.$(`//*[contains(text(), "${choice}")]`);
              if (!(await choiceElement.isDisplayed())) {
                  console.error(`Missing choice: ${choice}`);
                  return false;
              }
          }
      }

      console.log('All expected choices are displayed in the dropdown.');
      return true;
  },

  async checkHolidaysEveryTwoMonths() {
      const roundTripButton = await $(selectors.roundTripButton);
      await roundTripButton.click();
      await this.openCalendar();

      for (let i = 0; i < 6; i++) { // Checking for 12 months (every 2 months)
          const holidays = await $$(selectors.holidayIndicatorIcon);
          if (i % 2 === 1) {
              if (holidays.length === 0) {
                  console.error(`No holidays found in months ${i - 1} and ${i}`);
                  return false;
              }
          }
          await helpers.clickNextMonth(selectors.nextButton); // default is 1
           }

      console.log("Holidays found for every two months.");
      return true;
  },
  goBackSameAmountOfMonths: async function (count) {
    const backButton = await $(selectors.backButton);

    for (let i = 0; i < count; i++) {
      await backButton.waitForClickable({ timeout: 3000 });
      await backButton.click();
      await browser.pause(300); // brief wait for UI update
    }

    console.log(`🔙 Moved back ${count} month(s) in the calendar.`);
  },

    
  //Filters check
checkFlightFilterElements: async function () {
    await this.closeCookiesBanner();
    return {
      sortResultsButtons: await helpers.checkElements({
        bestFlightFilterButton: selectors.bestFlightFilterButton,
        fastestFlightFilterButton: selectors.fastestFlightFilterButton,
        cheapestFlightFilterButton: selectors.cheapestFlightFilterButton
      }, "Sort Results Buttons", true),

      priceFilters: await helpers.checkElements({
        priceRange: selectors.priceRange,
        priceRangeHandle: selectors.priceRangeHandle,
        maxPrice: selectors.maxPrice,
        minPrice: selectors.minPrice
      }, "Price Range Filters", false),

      airlineFilters: await helpers.checkElements({
        airlineCompaniesTitle: selectors.airlineCompaniesTitle,
        airlineFilterCheckbox: selectors.airlineFilterCheckbox,
        moreAirlineCompaniesArrow: selectors.moreAirlineCompaniesArrow,
        moreAirlineCompaniesOpeningTitle: selectors.moreAirlineCompaniesOpeningTitle,
        //moreAirlineCompaniesClosingTitle: selectors.moreAirlineCompaniesClosingTitle
      }, "Airline Filters", false),

      stopsFilters: await helpers.checkElements({
        directOrStopsTitle: selectors.directOrStopsTitle,
        flightStopsFilter: selectors.flightStopsFilter,
        oneStop: selectors.oneStop,
        twoStops: selectors.twoStops,
        directFlight: selectors.directFlight
      }, "Stops Filters", false),

      flightTypeFilters: await helpers.checkElements({
        typeOfFlightTitle: selectors.typeOfFlightTitle,
        typeOfFlightCheck: selectors.typeOfFlightCheck,
        charterFlight: selectors.charterFlight,
        regularFlight: selectors.regularFlight
      }, "Flight Type Filters", false),

      departureTimeFilters: await helpers.checkElements({
        departurePartOfTheDayTitle: selectors.departurePartOfTheDayTitle,
        morningDeparture: selectors.morningDeparture,
        dayDeparture: selectors.dayDeparture,
        eveningDeparture: selectors.eveningDeparture,
        night: selectors.night
      }, "Departure Time Filters", false),

      timeRangeFilters: await helpers.checkElements({
        outBoundTimeTitle: selectors.outBoundTimeTitle,
        outboundTitle: selectors.outboundTitle,
        outBoundTimeRange: selectors.outBoundTimeRange,
        outBoundTimeRangeFilter: selectors.outBoundTimeRangeFilter,
        //handleDefault: selectors.handleDefault,
        inboundTitle: selectors.inboundTitle,
        inboundTimeRange: selectors.inboundTimeRange,
        inboundTimeRangeFilter: selectors.inboundTimeRangeFilter
      }, "Time Range Filters", false),

      sortIconsAndTitles: await helpers.checkElements({
        bestFlightFilterIcon: selectors.bestFlightFilterIcon,
        bestFlightFilterPrice: selectors.bestFlightFilterPrice,
        bestFlightFilterTitle: selectors.bestFlightFilterTitle,

        fastestFlightFilterIcon: selectors.fastestFlightFilterIcon,
        fastestFlightFilterPrice: selectors.fastestFlightFilterPrice,
        fastestFlightFilterTitle: selectors.fastestFlightFilterTitle,

        cheapestFlightFilterIcon: selectors.cheapestFlightFilterIcon,
        cheapestFlightFilterPrice: selectors.cheapestFlightFilterPrice,
        cheapestFlightFilterTitle: selectors.cheapestFlightFilterTitle
      }, "Sort Icons & Titles", false)
    };
},

checkFlightFilterElementsOneWay: async function () {
    return {
      sortResultsButtons: await helpers.checkElements({
        bestFlightFilterButton: selectors.bestFlightFilterButton,
        fastestFlightFilterButton: selectors.fastestFlightFilterButton,
        cheapestFlightFilterButton: selectors.cheapestFlightFilterButton
      }, "Sort Results Buttons", true),

      priceFilters: await helpers.checkElements({
        priceRange: selectors.priceRange,
        priceRangeHandle: selectors.priceRangeHandle,
        maxPrice: selectors.maxPrice,
        minPrice: selectors.minPrice
      }, "Price Range Filters", false),

      airlineFilters: await helpers.checkElements({
        airlineCompaniesTitle: selectors.airlineCompaniesTitle,
        airlineFilterCheckbox: selectors.airlineFilterCheckbox,
        moreAirlineCompaniesArrow: selectors.moreAirlineCompaniesArrow,
        moreAirlineCompaniesOpeningTitle: selectors.moreAirlineCompaniesOpeningTitle,
        //moreAirlineCompaniesClosingTitle: selectors.moreAirlineCompaniesClosingTitle
      }, "Airline Filters", false),

      stopsFilters: await helpers.checkElements({
        directOrStopsTitle: selectors.directOrStopsTitle,
        flightStopsFilter: selectors.flightStopsFilter,
        oneStop: selectors.oneStop,
        twoStops: selectors.twoStops,
        directFlight: selectors.directFlight
      }, "Stops Filters", false),

      departureTimeFilters: await helpers.checkElements({
        departurePartOfTheDayTitle: selectors.departurePartOfTheDayTitle,
        morningDeparture: selectors.morningDeparture,
        dayDeparture: selectors.dayDeparture,
        eveningDeparture: selectors.eveningDeparture,
        night: selectors.night
      }, "Departure Time Filters", false),

      timeRangeFilters: await helpers.checkElements({
        outBoundTimeTitle: selectors.outBoundTimeTitle,
        outboundTitle: selectors.outboundTitle,
        outBoundTimeRange: selectors.outBoundTimeRange,
        outBoundTimeRangeFilter: selectors.outBoundTimeRangeFilter,
        //handleDefault: selectors.handleDefault,
        inboundTitle: selectors.inboundTitle,
        inboundTimeRange: selectors.inboundTimeRange,
        inboundTimeRangeFilter: selectors.inboundTimeRangeFilter
      }, "Time Range Filters", false),

      sortIconsAndTitles: await helpers.checkElements({
        bestFlightFilterIcon: selectors.bestFlightFilterIcon,
        bestFlightFilterPrice: selectors.bestFlightFilterPrice,
        bestFlightFilterTitle: selectors.bestFlightFilterTitle,

        fastestFlightFilterIcon: selectors.fastestFlightFilterIcon,
        fastestFlightFilterPrice: selectors.fastestFlightFilterPrice,
        fastestFlightFilterTitle: selectors.fastestFlightFilterTitle,

        cheapestFlightFilterIcon: selectors.cheapestFlightFilterIcon,
        cheapestFlightFilterPrice: selectors.cheapestFlightFilterPrice,
        cheapestFlightFilterTitle: selectors.cheapestFlightFilterTitle
      }, "Sort Icons & Titles", false)
    };
},

  // Ticket check
  validateTicketParts: async function () {
          const tickets = await $$(selectors.ticketContainer);
          if (!tickets.length) {
              throw new Error("❌ No ticket found");
          }
      
          const ticket = tickets[0];
          const checks = {
              Price: ticket.$(selectors.price),
              ContinueButton: ticket.$(selectors.continueButton),
              DepartureTime: ticket.$(selectors.departureTime),
              ArrivalTime: ticket.$(selectors.arrivalTime),
              DepartureAirport: ticket.$(selectors.departureAirport),
              ArrivalAirport: ticket.$(selectors.arrivalAirport),
              FlightNumber: ticket.$(selectors.flightNumber),
              LayoverText: ticket.$(selectors.layoverText),
              LayoverDuration: ticket.$(selectors.layoverDuration),
              LayoverCity: ticket.$(selectors.layoverCity),
              CarryOnIcon: ticket.$(selectors.carryOnIcon),
              LuggageIcon: ticket.$(selectors.luggageIcon),
              AirplaneIcon: ticket.$(selectors.airplaneIcon),
              AirlineLogo: ticket.$(selectors.airlineLogo),
              AirlineName: ticket.$(selectors.airlineName),
              SeatsLeftText: ticket.$(selectors.seatsLeftText),
          };
      
          await helpers.checkElements(checks, "Ticket Result", false);
      
          await helpers.checkElements({
              ShowMoreFlights: $(selectors.showMoreFlights),
          }, 'Global UI', false);
  },

  scrollAndClick: async function (selector) {
          const el = await $(selector);
          await el.scrollIntoView();
          await el.waitForClickable({ timeout: 5000 });
          await el.click();
  },
      
  toggleFilterCheckbox: async function (selector, label = '') {
          const checkbox = await $(selector);
          await checkbox.waitForDisplayed({ timeout: 5000 });
      
          await browser.execute(el => {
              el.scrollIntoView({ block: 'center', behavior: 'instant' });
          }, checkbox);
      
          await browser.pause(300); // allow DOM to stabilize
      
          try {
              await checkbox.click();
          } catch (err) {
              console.warn(`⚠️ Click intercepted on "${label}", using JS fallback.`);
              await browser.execute(el => el.click(), checkbox);
          }
      
          return checkbox; // so we can reuse it to uncheck
  },
    
   
//======================================Filter Active Check ==========================================================================

//Best, cheapest, fastest
async clickBestFilter() {
    const button = await $(selectors.bestFlightFilterButton);
    await button.waitForClickable({ timeout: 10000 });
    await button.click();
    await browser.pause(3000); // allow results to refresh
},

async clickFastestFilter() {
    const button = await $(selectors.fastestFlightFilterButton);
    await button.waitForClickable({ timeout: 10000 });
    await button.click();
    await browser.pause(3000);
},

async clickCheapestFilter() {
    const button = await $(selectors.cheapestFlightFilterButton);
    await button.waitForClickable({ timeout: 10000 });
    await button.click();
    await browser.pause(3000);
},
async verifyTopTicketMatchesFilter(filterType) {
    let filterPriceSelector;
    if (filterType === 'best') {
        filterPriceSelector = selectors.bestFlightFilterPrice;
    } else if (filterType === 'fastest') {
        filterPriceSelector = selectors.fastestFlightFilterPrice;
    } else if (filterType === 'cheapest') {
        filterPriceSelector = selectors.cheapestFlightFilterPrice;
    } else {
        throw new Error(`Unknown filter type: ${filterType}`);
    }

    const filterPriceElement = await $(filterPriceSelector);
    await filterPriceElement.waitForDisplayed({ timeout: 10000 });

    const filterPriceText = await filterPriceElement.getText();
    const filterPrice = parseInt(filterPriceText.replace(/[^\d]/g, ''), 10);

    const topTicketPriceElement = await $(selectors.price); // your top ticket price selector
    await topTicketPriceElement.waitForDisplayed({ timeout: 10000 });

    const topTicketPriceText = await topTicketPriceElement.getText();
    const topTicketPrice = parseInt(topTicketPriceText.replace(/[^\d]/g, ''), 10);

    console.log(`🛫 Filter (${filterType.toUpperCase()}) shows price: ₪${filterPrice}`);
    console.log(`🎟️ Top visible ticket price: ₪${topTicketPrice}`);

    expect(topTicketPrice).toBe(filterPrice);
    console.log(`✅ ${filterType.toUpperCase()} filter validated successfully!`);
},

//Price Range 

async adjustPriceSlider({ side = 'min', direction = 'right', percent = 0.3 }) {
  // 1️⃣ drag exactly as before
  const slider    = await $(selectors.priceSlider);
  const handleSel = side === 'min' ? selectors.priceSliderHandleMin : selectors.priceSliderHandleMax;
  const handle    = await $(handleSel);
  const { width } = await slider.getSize();
  const offset    = Math.floor(width * percent) * (direction === 'right' ? 1 : -1);

  await browser.performActions([ /* … drag code …*/ ]);
  await browser.releaseActions();
  await browser.pause(500);

  // 2️⃣ now wait for the min/max spans to appear
  const minEl = await $(selectors.sliderPriceMin);
  const maxEl = await $(selectors.sliderPriceMax);
  await minEl.waitForDisplayed({ timeout: 5000 });
  await maxEl.waitForDisplayed({ timeout: 5000 });
  // DEBUG: log raw texts
  const minTextRaw = await minEl.getText();
  const maxTextRaw = await maxEl.getText();
  console.log('🔍 Raw price texts:', { minTextRaw, maxTextRaw });

  // 3️⃣ parse them
  const newMin = parseInt(minTextRaw.replace(/[^\d]/g, ''), 10);
  const newMax = parseInt(maxTextRaw.replace(/[^\d]/g, ''), 10);
  console.log(`🔍 Parsed prices → Min: ${newMin}, Max: ${newMax}`);

  const value = side === 'min' ? newMin : newMax;

  // 4️⃣ validate tickets
  await this.checkAllTicketsMatchPriceBoundary({ type: side, value });

  // 5️⃣ reset
  await browser.performActions([ /* … reset drag … */ ]);
  await browser.releaseActions();
  await browser.pause(500);
},

async checkAllTicketsMatchPriceBoundary({ type, value }) {
  const tickets = await $$(selectors.priceTicketContainer);
    for (let i = 0; i < tickets.length; i++) {
        let priceText = '';
        let price = NaN;

        // Try to get price twice if first attempt fails
        for (let attempt = 1; attempt <= 2; attempt++) {
            const priceEl = await tickets[i].$(selectors.price);
            priceText = await priceEl.getText();
            price = parseInt(priceText.replace(/[^\d]/g, ''), 10);
            if (!isNaN(price)) break;
            if (attempt === 1) {
                console.warn(`⚠️ Ticket ${i + 1} price not found, retrying...`);
                await browser.pause(500); // short wait before retry
            }
        }

        if (isNaN(price)) {
            console.error(`❌ Ticket ${i + 1} has invalid price: "${priceText}"`);
            // Do not throw, just continue to next ticket
            continue;
        }

        if (type === 'min' && price < value) {
            console.error(`❌ Ticket ${i + 1} price $${price} is below minimum $${value}`);
        } else if (type === 'max' && price > value) {
            console.error(`❌ Ticket ${i + 1} price $${price} is above maximum $${value}`);
        } else {
            console.log(`✅ Ticket ${i + 1} price $${price} is within boundary`);
        }
    }
},

//Filtering by by stops, time, and airline Function =================

    //Direct or stops
checkEachTicketHasAtLeastOneSegmentWithStopType: async (expectedPhrase) => {
    const tickets = await $$(selectors.ticketDetailsPart);

    for (let i = 0; i < tickets.length; i++) {
        const segRows = await tickets[i].$$(selectors.segRows);
        if (segRows.length < 2) {
            throw new Error(`❌ Ticket ${i + 1} has less than 2 segments (found ${segRows.length})`);
        }
        const stopTexts = [];
        for (let segIndex = 0; segIndex < segRows.length; segIndex++) {
            const segStop = await segRows[segIndex].$(selectors.layoverStops);
            const text = await segStop.getText().then(t => t.trim());
            stopTexts.push(text);
        }
        console.log(`🚏 Ticket ${i + 1} stop texts:`, stopTexts);
        const found = stopTexts.some(t => t.includes(expectedPhrase));
        if (!found) {
            throw new Error(`❌ Ticket ${i + 1} has neither leg matching "${expectedPhrase}"`);}} 
},
//Click direct, 1 stop, 2 stop
clickStopTypeFilter: async function (stopType) {
  if (!stopType) {
    console.log('ℹ️ No stop type provided — skipping filter click.');
    return;
  }

  let selectorName;

  switch (stopType.toLowerCase().trim()) {
    case 'direct':
      selectorName = 'directCheckbox';
      break;
    case 'one stop':
      selectorName = 'oneStopCheckbox';
      break;
    case 'two stops':
      selectorName = 'twoStopCheckbox';
      break;
    default:
      throw new Error(`❌ Unknown stop type: "${stopType}". Use: direct, one stop, two stops, or leave null to skip.`);
  }

  const checkbox = await $(selectors[selectorName]);
  await checkbox.waitForClickable({ timeout: 3000 });
  await checkbox.click();

  console.log(`✅ Clicked stop filter: ${stopType}`);
},

    // Morning, day, evening, nightfilter
checkAllTicketsMatchTimeSlot: async (minHour, maxHour) => {
    const tickets = await $$(selectors.tickets);

    for (let i = 0; i < tickets.length; i++) {
        const timeElem = await tickets[i].$(selectors.departureTime);
        const timeText = await timeElem.getText();
        const [hour, minute] = timeText.split(':').map(Number);

        console.log(`⏰ Ticket ${i + 1} dep time: ${hour}:${minute}`);

        if (minHour > maxHour) {
            const isInRange = hour >= minHour || hour <= maxHour;
            expect(isInRange).toBe(true);
        } else {
            expect(hour).toBeGreaterThanOrEqual(minHour);
            expect(hour).toBeLessThanOrEqual(maxHour);
        }
    }
},

    // Airlines
checkAllTicketsMatchAirline: async function (expectedAirline) {
    const tickets = await $$(selectors.ticketDetailsPart);

    for (let i = 0; i < tickets.length; i++) {
        const airlineElem = await tickets[i].$('.airlinename');

        if (await airlineElem.isExisting()) {
            const airlineText = (await airlineElem.getText()).trim();
            const expected = expectedAirline.trim();

            console.log(`✈️ Ticket ${i + 1} airline: "${airlineText}" | Expected: "${expected}"`);

            if (!airlineText.includes(expected)) {
                throw new Error(`❌ Ticket ${i + 1} does not include airline "${expected}"`);
            }
        } else {
            throw new Error(`❌ Ticket ${i + 1} missing .airlinename element`);
        }
    }
},

selectAirlineCheckbox: async function (airlineName) {
    const airlineBlockXPath = selectors.getAirlineBlockXPath(airlineName);
    const checkboxContainer = await $(airlineBlockXPath);
    await checkboxContainer.scrollIntoView({ block: 'center' });

    const checkmark = await checkboxContainer.$(selectors.airlineCheckmark);
    await checkmark.waitForClickable({ timeout: 5000 });
    await checkmark.click();
    await browser.pause(1000); // Wait for filter to apply
},
//Checks Charter or Regular filters  ==================================

testFlightTypeFilter: async (flightTypeFilters) => {
    for (const [label, selector] of Object.entries(flightTypeFilters)) {
        console.log(`🛫 Testing flight type filter: ${label}`);
        await helpers.safeClick(selector);

        const expectedLabel = label === 'charter' ? 'שכר' : 'סדיר';
        await this.checkAllTicketsMatchFlightType(expectedLabel); // <-- fixed line

        await helpers.safeClick(selector); // uncheck
    }
},

checkAllTicketsMatchFlightType: async function (expectedLabel) {
    const tickets = await $$(selectors.priceTicketContainer);

    for (let i = 0; i < tickets.length; i++) {
        const flag = await tickets[i].$(selectors.ticketFlightTypeFlag);

        if (await flag.isExisting()) {
            const typeText = await flag.getText();
            const cleanText = typeText.replace(/\s+/g, ' ').trim();

            console.log(`✈️ Ticket ${i + 1} | Type: "${cleanText}"`);

            expect(cleanText).toContain(expectedLabel);
        } else {
            console.warn(`⚠️ Ticket ${i + 1} is missing .ht-confirmation-flag`);
        }
    }
},

// Inbound and outbound time range Filter Function ===================
async adjustHandle(sliderSel, handleSel, direction, percent) {
    const slider = await $(sliderSel);
    await slider.waitForDisplayed({ timeout: 5000 });
    const { width } = await slider.getSize();
    const moveX = Math.floor(width * percent) * (direction === 'right' ? 1 : -1);
    const handle = await $(handleSel);
    await browser.performActions([{
      type: 'pointer', id: 'mouse', parameters: { pointerType: 'mouse' }, actions: [
        { type: 'pointerMove', origin: handle, x: 0, y: 0 },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 100 },
        { type: 'pointerMove', origin: 'pointer', x: moveX, y: 0 },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
    await browser.releaseActions();
    await browser.pause(500);
},
async applyOutboundRange(percent = 0.3) {
    // 1. Move handles
    await this.adjustHandle(selectors.outboundSlider, selectors.outboundHandleMin, 'right', percent);
    await this.adjustHandle(selectors.outboundSlider, selectors.outboundHandleMax, 'left',  percent);
    // 2. Read and normalize range
    const raw = await $(selectors.outboundSliderInput).getValue();
    let [minTxt, maxTxt] = raw.split('-').map(t => t.trim());
    let minH = parseInt(minTxt.split(':')[0], 10);
    let maxH = parseInt(maxTxt.split(':')[0], 10);
    if (minH > maxH) [minTxt, maxTxt] = [maxTxt, minTxt], [minH, maxH] = [maxH, minH];
    console.log(`🔍 Outbound range: ${minTxt} - ${maxTxt}`);
    // 3. Log and assert tickets
    const idx = 0; // outbound is first departure time
    const tickets = await $$(selectors.ticketDetailsPart);
    for (let i = 0; i < tickets.length; i++) {
      const timeTxt = await tickets[i].$$(selectors.departureTime)[idx].getText();
      const hr = parseInt(timeTxt.split(':')[0], 10);
      console.log(`⏰ Outbound ticket ${i+1}: ${timeTxt}`);
      expect(hr).toBeGreaterThanOrEqual(minH);
      expect(hr).toBeLessThanOrEqual(maxH);
    }
    // 4. Reset handles
    await this.adjustHandle(selectors.outboundSlider, selectors.outboundHandleMin, 'left',  percent);
    await this.adjustHandle(selectors.outboundSlider, selectors.outboundHandleMax, 'right', percent);
},

async applyInboundRange(percent = 0.3) {
    // 1. Move handles
    await this.adjustHandle(selectors.inboundSlider, selectors.inboundHandleMin, 'right', percent);
    await this.adjustHandle(selectors.inboundSlider, selectors.inboundHandleMax, 'left',  percent);
    // 2. Read and normalize range
    const raw = await $(selectors.inboundSliderInput).getValue();
    let [minTxt, maxTxt] = raw.split('-').map(t => t.trim());
    let minH = parseInt(minTxt.split(':')[0], 10);
    let maxH = parseInt(maxTxt.split(':')[0], 10);
    if (minH > maxH) [minTxt, maxTxt] = [maxTxt, minTxt], [minH, maxH] = [maxH, minH];
    console.log(`🔍 Inbound range: ${minTxt} - ${maxTxt}`);
    // 3. Log and assert tickets
    const tickets = await $$(selectors.ticketDetailsPart);
    for (let i = 0; i < tickets.length; i++) {
      const segs = await tickets[i].$$(selectors.departureTime);
      const timeTxt = await (segs[1] || segs[0]).getText();
      const hr = parseInt(timeTxt.split(':')[0], 10);
      console.log(`⏰ Inbound ticket ${i+1}: ${timeTxt}`);
      expect(hr).toBeGreaterThanOrEqual(minH);
      expect(hr).toBeLessThanOrEqual(maxH);
    }
    // 4. Reset handles
    await this.adjustHandle(selectors.inboundSlider, selectors.inboundHandleMin, 'left',  percent);
    await this.adjustHandle(selectors.inboundSlider, selectors.inboundHandleMax, 'right', percent);
},
async checkPriceResultsPage() {
    const summaryPriceText = await $(selectors.price).getText();
    this.summaryPrice = parseInt(summaryPriceText.replace(/[^\d]/g, ''), 10);

    if (isNaN(this.summaryPrice)) {
        throw new Error(`❌ Failed to parse summary price: "${summaryPriceText}"`);
    }

    console.log(`💳 Price in ticket summary: ₪${this.summaryPrice}`);
},

//Opening the ticket details
async clickContinueToDetails() {
    const continueButton = await $(selectors.continueToDetailsPage);
    await continueButton.waitForDisplayed({ timeout: 5000 });
    await continueButton.click();
},

selectFlightTypeFilter: async function (type) {
  const charterEl = await $(selectors.charterFlight);
  const regularEl = await $(selectors.regularFlight);

  if (type === 'charter') {
    const exists = await charterEl.isExisting();
    if (!exists) {
      console.warn(`⚠️ Skipping filter: '${type}' — filter not found.`);
      return;
    }
    await charterEl.click();
  } else if (type === 'regular') {
    const exists = await regularEl.isExisting();
    if (!exists) {
      console.warn(`⚠️ Skipping filter: '${type}' — filter not found.`);
      return;
    }
    await regularEl.click();
  } else if (type === 'mixed') {
    await this.selectFlightTypeFilter('charter');
    await this.selectFlightTypeFilter('regular');
    return;
  } else {
    throw new Error(`❌ Unknown flight type filter: "${type}"`);
  }

  console.log(`✅ Filter selected: ${type}`);
},

isMultiTicket: async function (ticket) {
    return await ticket.$(selectors.multiTicketBadge).isExisting();
},

selectSpecificTicketCombo: async function ({ filterType, comboType, requireMulti }) {
  await this.selectFlightTypeFilter(filterType);

  const tickets = await $$(selectors.ticketCard);
  const normalizeCombo = (combo) =>
    combo.split('+').map(s => s.trim()).sort().join('+');

  for (const [i, ticket] of tickets.entries()) {
    // Skip if details already open (to avoid multiple open tickets)
    const details = await ticket.$(selectors.detailsPageContainer);
    const isDetailsDisplayed = await details.isDisplayed().catch(() => false);
    if (isDetailsDisplayed) {
      console.log(`⏭️ Ticket ${i + 1} skipped: details already open`);
      continue;
    }

    const isMulti = await this.isMultiTicket(ticket);
    if (requireMulti && !isMulti) continue;
    if (!requireMulti && isMulti) continue;

    const flags = await ticket.$$(selectors.ticketFlightTypeFlag);
    const types = [];

    for (const flag of flags) {
      const text = (await flag.getText()).trim().replace(/\s+/g, ' ');
      if (text) types.push(text);
    }

    const rawCombo = types.join('+');
    const normalized = normalizeCombo(rawCombo);
    const expected = normalizeCombo(comboType);

    if (requireMulti) {
      if (!rawCombo.includes('+')) {
        console.log(`⏭️ Ticket ${i + 1} skipped: does not have + in flag text`);
        continue;
      }

      const messageEl = await ticket.$(selectors.multiTicketBadge);
      const messageText = (await messageEl.getText()).replace(/\s+/g, ' ').trim();
      const expectedMessage = 'הזמנה זו מורכבת משני כרטיסי טיסה נפרדים';

      if (!messageText.includes(expectedMessage)) {
        throw new Error(`❌ Ticket ${i + 1} is multiticket but message text is incorrect.\nFound: "${messageText}"`);
      }

      console.log(`✅ Verified multiticket message on ticket ${i + 1}`);
    }

    if (normalized !== expected) {
      console.log(`⏭️ Skipping ticket ${i + 1}: ${normalized}`);
      continue;
    }

    const continueButton = await ticket.$(selectors.continueButton);
    await continueButton.scrollIntoView();
    await browser.pause(300);

    // Ensure only this ticket will be open
    await continueButton.click();
    await browser.pause(500); // give the summary a moment to appear

    console.log(`✅ Selected ticket ${i + 1}: ${normalized} ${isMulti ? '[MULTI]' : '[SINGLE]'}`);
    return ticket;

  }

  throw new Error(`❌ No ticket found matching combination: ${comboType} (multi: ${requireMulti})`);
},
}

module.exports = {
  searchFlight,
};
