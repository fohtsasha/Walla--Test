const helpers = require('./helper');

const WallaToursPage = {
    // Icons
    phoneIcon: "li[class='phone'] a",
    customerSupportIcon: "img[src='https://www.wallatours.co.il//resources/images/base/acc-header.png']",
    wallaToursIcon: 'img[alt="וואלה! טורס"]',
    bestPriceIcon: 'img[alt="sest price"]',
    calendarIcon: '#flightDatepickerFL',
    oneWayCalendar: "#flightSingleDatepickerFL",
    roundTripCalendar: "div[id='tab-1'] div[class='search-calendar']",
    holidayIndicatorIcon: '//*[@class="holiday_dot"]',
    instagramIcon: "img[alt='אינסטגרם']",
    facebookIcon: "//a[contains(@href,'https://www.facebook.com/wallatourism')]",
    facebookGroupIcon: "//img[contains(@src,'../../resources/images/base/fg.png')]",

    // Input Fields
    fromField: '#tDLR1',
    toField: '#tALR1',
    toField1: '#tAL1',
    fromField1: '#tDL1',

    fromField2:'#tDL2',
    toField2:'#tAL2',
    calendarMulti1:'#flightSingleDatepickerFM1',
    calendarMulti2:'#flightSingleDatepickerFM2',
    dateField: "//div[@id='tab-1']//div[contains(@class, 'search-calendar')]",
    
    //Dynamic input fields
    getFromFieldSelector: (index) => `#tDL${index}`,
    getToFieldSelector: (index) => `#tAL${index}`,
    getCalendarFieldSelector: (index) => `#flightSingleDatepickerFM${index}`,
    getRemoveButtonSelector: (index) => `#segment${index} span[onclick="RemoveSegments();"]`,
    getNextButtonSelector: (index) => `(//span[contains(@class,'next')])[${index + 8}]`,

    // Buttons
    customerSupportButton: "//p[contains(text(),'לשירותכם 24/7')]",
    phoneNumberButton: "//li[@class='phone']//p[contains(text(),'03-7770999')]",
    flightsButton: "//ul[@class='items items-1']//a[@class='menu-dropdown-btn'][contains(text(),'טיסות')]",
    packagesButton: ".menu-dropdown-btn[data-item='1_1']",
    hotelButton: ".menu-dropdown-btn[data-item='1_2']",
    concertsButton: ".menu-dropdown-btn[data-item='1_3']",
    sportsButton: ".menu-dropdown-btn[data-item='1_4']",
    organizedHolidayButton: ".menu-dropdown-btn[data-item='1_5']",
    cruisesButton: ".menu-dropdown-btn[data-item='1_6']",
    dynamicPackagesButton: ".menu-dropdown-btn[data-item='1_7']",
    domesticFlightsButton: ".menu-dropdown-btn[data-item='2_0']",
    flightsEilatButton: ".menu-dropdown-btn[data-item='2_1']",
    eilatPackagesButton: ".menu-dropdown-btn[data-item='2_2']",

    // Search Panel Buttons
    submitSearchButton: '#FlightSubmit',
    multiSubmitSearchButton: '#FlightMultiSubmit',
    rewriteDestinationButton: "//div[@class='holder-autoc search-input append-autocomplete']//div[@class='rewrite-destinations']",
    roundTripButton: "//label[contains(text(),'הלוך ושוב')]",
    oneWayButton: '//label[contains(text(),"כיוון אחד")]',
    multipleDestinations: "label[for='rad-3']",
    flexibleDatesButton: "#ddlDFlex-button",
    addDestinationMulti: "#addSegArea",
    nextButton: "(//span[@class='next'])[3]",
    oneWayNextButton: "(//span[contains(@class,'next')])[2]",
    nextButtonMulti1: "(//span[contains(@class, 'next')])[9]",
    nextButtonMulti2: "(//span[contains(@class, 'next')])[10]",
    backButton:"(//span[@class='prev'])[1]",
    daySelector: "//td[@data-handler='selectDay']",
    visibleDaySelector: (dayNumber) =>
        `//div[contains(@class, 'day') and contains(@class, 'valid') and .//div[normalize-space()='${dayNumber}']]`,
      
    // Dropdown
    dropDownFlexy: ".ui-selectmenu-menu.ui-selectmenu-open",
    travelersDropdown: ".search-input.search-pax.flight-pax",
    classField: "#flightsClass-button",
    dropDownClass: "//div[contains(@class,'ui-selectmenu-menu ui-selectmenu-open')]",

    // Cheapest Tickets
    titleCheapestTickets: "//h3[contains(text(),'הטיסות הכי זולות באתר')]",
    listOfCheapestTickets: "#flight_city_main1",
    titleLastBoughtTickets: "//h2[contains(text(),'טיסות זולות ברגע האחרון')]",
    listOfLastBought: ".lastorders-wr > div:first-child > div:first-child",

    // Traveler Adjustments
    adultCountField: "#adults",
    childCountField: "#children",
    infantCountField: "#infants",
    adultPlusButton: "#adultsPlus",
    childPlusButton: "#childrenPlus",
    infantPlusButton: "#infantsPlus",
    adultMinusButton: "#adultsMinus",
    childMinusButton: "#childrenMinus",
    infantMinusButton: "#infantsMinus",

    //Flight Results Filter 
    clearFilterSettingsButton: ".clearFilters",
    priceRange: "//div[@id='slider-price-range']//div[@class='ui-slider-range ui-widget-header']",
    priceRangeHandle: "//div[@id='slider-price-range']//a[1]",
    maxPrice: "//span[@id='amount-max-price']",
    minPrice: "//span[@id='amount-min-price']",
      
    airlineCompaniesTitle: "//span[@class='text'][contains(text(),'חברות תעופה')]",
    airlineFilterCheckbox: "//div[@class='items items-toggl']//div[2]//label[1]//span[1]", // at least 3
    moreAirlineCompaniesArrow: "//span[@class='arrow']", // if more than 7
    moreAirlineCompaniesOpeningTitle: "//span[@class='title-open' and contains(text(), 'הסתר')]",
      
    directOrStopsTitle: "//span[contains(text(),'ישירה / עצירת ביניים')]",
    flightStopsFilter: "//div[@id='flight_stops_filter']//div[1]//label[1]//span[1]", // at least 1
    oneStop: "//div[@id='flight_stops_filter']//div[contains(text(), '1 עצירות ביניים')]",
    twoStops: "//div[@id='flight_stops_filter']//div[contains(text(), '2+ עצירות ביניים')]",
    directFlight: "//div[@class='dsp'][contains(text(),'ישירה')]",
      
    typeOfFlightTitle: "//span[contains(text(),'סוג טיסה')]",
    typeOfFlightCheck: "//div[@id='flight_type_filter']//div[1]//label[1]//span[1]", // at least 1
    charterFlight: "//div[@id='flight_type_filter']//div[contains(text(), 'טיסת שכר')]",
    regularFlight: "//div[@id='flight_type_filter']//div[contains(text(), 'טיסה סדירה')]",
      
    departurePartOfTheDayTitle: "//span[contains(text(),'טיסת הלוך - זמן המראה')]",
    morningDeparture: "//div[@id='flight_deptime_filter']//div[contains(text(), 'בוקר')]",
    dayDeparture: "//div[@id='flight_deptime_filter']//div[contains(text(), 'צהריים')]",
    eveningDeparture: "//div[@id='flight_deptime_filter']//div[contains(text(), 'ערב')]",
    night: "//div[@id='flight_deptime_filter']//div[contains(text(), 'לילה')]", // at least 1
      
    outBoundTimeTitle: "//span[contains(text(),'שעת המראה')]",
    outboundTitle: "//span[@class='value_container-title'][contains(text(),'הלוך')]",
    outBoundTimeRange: "//input[@id='amount-outbound']",
    outBoundTimeRangeFilter: "//div[@id='slider-outboundtime-range']//div[1]",
      
    inboundTitle: "//span[contains(text(),'חזור')]",
    inboundTimeRange: "//input[@id='amount-inbound']",
    inboundTimeRangeFilter: "//div[@id='slider-inboundtime-range']//div[1]",
      
    bestFlightFilterButton: "#SortByStops",
    bestFlightFilterIcon: "//div[@id='SortByStops']//div[@class='image']",
    bestFlightFilterPrice: "//div[@id='SortByStops']//span[@class='fl-sorting-button-price']",
    bestFlightFilterTitle: "//p[contains(@class, 'title') and contains(text(), 'הטוב ביותר')]",
      
    fastestFlightFilterButton: "#SortByDuration",
    fastestFlightFilterIcon: "//div[@id='SortByDuration']//div[@class='image']",
    fastestFlightFilterPrice: "div[id='SortByDuration'] span[class='fl-sorting-button-price']",
    fastestFlightFilterTitle: "//span[contains(text(),'המהיר ביותר')]",
      
    cheapestFlightFilterButton: "#SortByPrice",
    cheapestFlightFilterIcon: "//div[@id='SortByPrice']//div[@class='image']",
    cheapestFlightFilterPrice: "//div[@id='SortByPrice']//span[@class='fl-sorting-button-price']",
    cheapestFlightFilterTitle: "//div[@id='SortByPrice']//span[contains(text(), 'הזול ביותר')]",
   
    //Filter Checkboxes
    directCheckbox: '#flight_stops_filter .item:nth-child(1) .checkmark',
    oneStopCheckbox: '#flight_stops_filter .item:nth-child(2) .checkmark',
    twoStopCheckbox: '#flight_stops_filter .item:nth-child(3) .checkmark',
    morningCheckbox: '#flight_deptime_filter .item:nth-child(1) .checkmark',
    dayCheckbox:     '#flight_deptime_filter .item:nth-child(2) .checkmark',
    eveningCheckbox: '#flight_deptime_filter .item:nth-child(3) .checkmark',
    nightCheckbox:   '#flight_deptime_filter .item:nth-child(4) .checkmark',
    
    charterCheckbox: "#flight_type_filter .item:nth-child(1) .checkmark",
    regularCheckbox: "#flight_type_filter .item:nth-child(2) .checkmark",
    priceSliderHandleMin: '#slider-price-range .ui-slider-handle:nth-child(2)',  // Left
    priceSliderHandleMax: '#slider-price-range .ui-slider-handle:nth-child(3)',  // Right

   //Filter Range
   priceSlider: '#slider-price-range',
   priceSliderHandleMin: '#slider-price-range a:nth-child(1)',
   priceSliderHandleMax: '#slider-price-range a:nth-child(2)',
   sliderPriceLabel: '.slider-prices',
   priceTicketContainer: '.pricebox',

   ticketPriceElement: '.p-amount',
   ticketFlightTypeFlag: '.ht-confirmation-flag',

    //Results page
    flightResults:"//p[@class='results-list-subtitle']",
    
    //Ticket elements
    ticketDetailsPart:".segbox",
    ticketContainer: '.res-in',                         // Ticket container
    price: '.pricebox .p-amount',                        
    continueButton: '.p-btn',                            
    departureTime: '.seg-dep .seg-h',                    
    arrivalTime: '.seg-arr .seg-h',                      
    departureAirport: '.seg-dep .seg-h-desc .city',      
    arrivalAirport: '.seg-arr .seg-h-desc .city',        
    flightNumber: '.seg-dep .name-airlines',             
    layoverText: '.seg-dep .seg-h-desc',                 // Layover text/description
    layoverDuration: '.seg-stops .seg-h',                // Layover duration
    layoverCity: '.seg-stops-city',                      // Layover city (if exists)
    carryOnIcon: '.handbag.bag',                         
    luggageIcon: '.baggage.bag',                         
    airplaneIcon: '.plane-img',                          
    airlineLogo: '.seg-logo',                            
    airlineName: '.airlinename',                         // Airline name text
    seatsLeftText: '.p-lastp',                           // Blue text showing seats left
    showMoreFlights: '.showmoref .more',                 // "+ הצג שעות טיסה נוספות" element
    flightTypeLabel: '.ht-confirmation-flag',
    
    // Oredring the ticket 
    continueToDetailsPage:".pricebox .p-details",
    detailsCenter: '.details-center',
   detailsSidebar: '.details-sidebar.details-sidebar-left.flightSummary',
   checkoutButton: "//button[@id='btnCheckout']",


    // Functions
 //Should verify key elements   
    checkAllUISections: async function () {
      return {
        icons: await helpers.checkElements({
          phoneIcon: WallaToursPage.phoneIcon,
          customerSupportIcon: WallaToursPage.customerSupportIcon,
          wallaToursIcon: WallaToursPage.wallaToursIcon,
          bestPriceIcon: WallaToursPage.bestPriceIcon,
          calendarIcon: WallaToursPage.calendarIcon,
          instagramIcon: WallaToursPage.instagramIcon,
          facebookIcon: WallaToursPage.facebookIcon,
          facebookGroupIcon: WallaToursPage.facebookGroupIcon
        }, "Icons", false),
  
        fields: await helpers.checkElements({
          fromField: WallaToursPage.fromField,
          toField: WallaToursPage.toField,
          dateField: WallaToursPage.dateField,
          travellersField: WallaToursPage.travelersDropdown,
          classField: WallaToursPage.classField
        }, "Fields", false),
  
        buttons: await helpers.checkElements({
          customerSupportButton: WallaToursPage.customerSupportButton,
          phoneNumberButton: WallaToursPage.phoneNumberButton,
          flightsButton: WallaToursPage.flightsButton,
          packagesButton: WallaToursPage.packagesButton,
          hotelButton: WallaToursPage.hotelButton,
          concertsButton: WallaToursPage.concertsButton,
          sportsButton: WallaToursPage.sportsButton,
          organizedHolidayButton: WallaToursPage.organizedHolidayButton,
          cruisesButton: WallaToursPage.cruisesButton,
          dynamicPackagesButton: WallaToursPage.dynamicPackagesButton,
          domesticFlightsButton: WallaToursPage.domesticFlightsButton,
          flightsEilatButton: WallaToursPage.flightsEilatButton,
          eilatPackagesButton: WallaToursPage.eilatPackagesButton
        }, "Buttons", true),
  
        searchPanelButtons: await helpers.checkElements({
          submitSearchButton: WallaToursPage.submitSearchButton,
          rewriteDestinationButton: WallaToursPage.rewriteDestinationButton,
          roundTripButton: WallaToursPage.roundTripButton,
          oneWayButton: WallaToursPage.oneWayButton,
          multipleDestinations: WallaToursPage.multipleDestinations,
          flexibleDatesButton: WallaToursPage.flexibleDatesButton
        }, "Search Panel Buttons", true),
  
        cheapestTickets: await helpers.checkElements({
          titleCheapestTickets: WallaToursPage.titleCheapestTickets,
          listOfCheapestTickets: WallaToursPage.listOfCheapestTickets,
          titleLastBoughtTickets: WallaToursPage.titleLastBoughtTickets,
          listOfLastBought: WallaToursPage.listOfLastBought
        }, "Cheapest Tickets Elements", false)
      };
    },
    async clearToField() {
        const toField = await $('#tALR1');
    
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

    async clickNewSearchButton() {
        const newSearchButton = await $("//button[contains(text(),'חיפוש חדש')]");
        await newSearchButton.waitForDisplayed({ timeout: 5000 });
        await newSearchButton.click();
      },

    /**
 * Search flight with dynamic destination, calendar, dates, and dropdown interaction
 * @param {Object} options
 * @param {string} options.to - Destination city (e.g., "New York")
 * @param {number} [options.arrowDownCount=2] - How many times to press ArrowDown in the dropdown
 * @param {number} [options.nextMonthClicks=1] - How many times to click "next month" in the calendar
 * @param {number} [options.departureDay=4] - Departure day of the month
 * @param {number} [options.returnDay=12] - Return day of the month
 */
    async searchFlight({
        to,
        arrowDownCount = 2,
        nextMonthClicks = 1,
        departureDay = 4,
        returnDay = 12,
        rowIndex = 0,
        submit = true // NEW
    }) {
    
        await browser.pause(1000);
    
        const isMulti = rowIndex > 0;
        const isOneWay = returnDay == null;
    
        // --- TO field ---
        const toFieldSelector = isMulti 
            ? this.getToFieldSelector(rowIndex) 
            : this.toField;
    
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
    
        // --- Calendar field ---
        const calendarSelector = isMulti 
            ? this.getCalendarFieldSelector(rowIndex) 
            : (isOneWay ? this.oneWayCalendar : this.roundTripCalendar);
    
        const nextButtonSelector = isMulti
            ? this.getNextButtonSelector(rowIndex)
            : (isOneWay ? this.oneWayNextButton : this.nextButton);
    
        const calendar = await $(calendarSelector);
        await calendar.waitForDisplayed({ timeout: 5000 });
        await calendar.click();
    
        await helpers.clickNextMonth(nextButtonSelector, nextMonthClicks);
        await this.selectVisibleDay(departureDay);
    
        // Only for round-trip (and not multi-destination)
        if (!isOneWay && !isMulti) {
            await this.selectVisibleDay(returnDay);
        }
    
        // Only click the search button for the main row (not multi segments)
        // Final search click
        if (submit && rowIndex === 0 && !isMulti) {
            const searchButton = await $(this.submitSearchButton);
            await searchButton.waitForDisplayed({ timeout: 5000 });
            await searchButton.click();
            console.log("✅ Flight search submitted.");
            await browser.pause(10000);
        } else if (submit && isMulti && rowIndex === 2) {
            const searchButton = await $(this.multiSubmitSearchButton);
            await searchButton.waitForDisplayed({ timeout: 5000 });
            await searchButton.click();
            console.log("✅ Multi-destination search submitted.");
            await browser.pause(10000);
        }}
        
,    

//Multi destination Search 
async fillMultiRow({ fromSelector, toSelector, calendarSelector, fromValue, toValue, arrowDownCount = 2, nextMonthClicks = 1, day }) {
    const fromField = await $(fromSelector);
    const toField = await $(toSelector);

    await fromField.waitForDisplayed();
    await fromField.setValue(fromValue);

    await toField.waitForDisplayed();
    await toField.setValue(toValue);
    for (let i = 0; i < arrowDownCount; i++) {
        await browser.keys('ArrowDown');
        await browser.pause(200);
    }
    await browser.keys('Enter');
    await browser.pause(500);

    const calendar = await $(calendarSelector);
    await calendar.click();
    await helpers.clickNextMonth(this.nextButton, nextMonthClicks);
    await this.selectVisibleDay(day);
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


    // Search categories
    async selectRoundTripChanges() {
        const roundTripButton = await $(this.roundTripButton);
        const roundTripCalendar = await $(this.roundTripCalendar);
        await roundTripButton.waitForDisplayed();
        await roundTripButton.click();
        await roundTripButton.waitForDisplayed({ timeout: 3000 });
        return await roundTripCalendar.isDisplayed();
    },

    async selectMultiWayChanges() {
        const multipleDestinations = await $(this.multipleDestinations);
        const addDestinationMulti = await $(this.addDestinationMulti);
    
        await multipleDestinations.waitForDisplayed();
        await multipleDestinations.click();
        await addDestinationMulti.waitForDisplayed({ timeout: 3000 });
    
        for (let i = 2; i <= 4; i++) {
            await addDestinationMulti.click();
            await browser.pause(500); // Let the new line render
    
            const fromField = await $(this.getFromFieldSelector(i));
            const toField = await $(this.getToFieldSelector(i));
            const calendarField = await $(this.getCalendarFieldSelector(i));
    
            const isFromVisible = await fromField.isDisplayed();
            const isToVisible = await toField.isDisplayed();
            const isCalendarVisible = await calendarField.isDisplayed();
    
            if (!isFromVisible || !isToVisible || !isCalendarVisible) {
                console.error(`❌ One or more fields on line ${i} are not visible.`);
                return false;
            }
    
            if (i >= 3) {
                const removeButton = await $(this.getRemoveButtonSelector(i));
                const isRemoveVisible = await removeButton.isDisplayed();
    
                if (!isRemoveVisible) {
                    console.error(`❌ Remove button for line ${i} is not visible.`);
                    return false;
                }
            }
        }
    
        // ✅ Now remove rows down to only 2 left
        for (let i = 5; i >= 3; i--) {
            const removeButton = await $(this.getRemoveButtonSelector(i));
            if (await removeButton.isDisplayed()) {
                await removeButton.click();
                await browser.pause(500); // Let DOM update
            }
        }
    
        return true;
    },
    
    
    //Travelers Field

    async openTravelersDropdown() {
        const roundTripButton = await $(this.roundTripButton);
        await roundTripButton.click();
        const dropdown = await $(this.travelersDropdown);
        await dropdown.waitForDisplayed({ timeout: 5000 });
        await dropdown.click();
    },

    async getTravelerCount(type) {
        let field;
        switch (type) {
            case 'adult':
                field = await $(this.adultCountField);
                break;
            case 'child':
                field = await $(this.childCountField);
                break;
            case 'infant':
                field = await $(this.infantCountField);
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
                plusButton = await $(this.adultPlusButton);
                minusButton = await $(this.adultMinusButton);
                break;
            case 'child':
                plusButton = await $(this.childPlusButton);
                minusButton = await $(this.childMinusButton);
                break;
            case 'infant':
                plusButton = await $(this.infantPlusButton);
                minusButton = await $(this.infantMinusButton);
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
    }
    ,
        

//Flexible Dates

    async clickFlexibleDropdownAndCheck(expectedChoices = []) {
        const button = await $(this.flexibleDatesButton);
        const dropdown = await $(this.dropDownFlexy);

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
        const buttonClass = await $(this.classField);
        const dropDownClass = await $(this.dropDownClass);
        const roundTripButton = await $(this.roundTripButton);
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
        const roundTripButton = await $(this.roundTripButton);
        await roundTripButton.click();
        await this.openCalendar();

        for (let i = 0; i < 6; i++) { // Checking for 12 months (every 2 months)
            const holidays = await $$(this.holidayIndicatorIcon);
            if (i % 2 === 1) {
                if (holidays.length === 0) {
                    console.error(`No holidays found in months ${i - 1} and ${i}`);
                    return false;
                }
            }
            await helpers.clickNextMonth(this.nextButton); // default is 1
             }

        console.log("Holidays found for every two months.");
        return true;
    },
  
    //Filters check
    checkFlightFilterElements: async function () {
  
        return {
          sortResultsButtons: await helpers.checkElements({
            bestFlightFilterButton: WallaToursPage.bestFlightFilterButton,
            fastestFlightFilterButton: WallaToursPage.fastestFlightFilterButton,
            cheapestFlightFilterButton: WallaToursPage.cheapestFlightFilterButton
          }, "Sort Results Buttons", true),
    
          priceFilters: await helpers.checkElements({
            priceRange: WallaToursPage.priceRange,
            priceRangeHandle: WallaToursPage.priceRangeHandle,
            maxPrice: WallaToursPage.maxPrice,
            minPrice: WallaToursPage.minPrice
          }, "Price Range Filters", false),
    
          airlineFilters: await helpers.checkElements({
            airlineCompaniesTitle: WallaToursPage.airlineCompaniesTitle,
            airlineFilterCheckbox: WallaToursPage.airlineFilterCheckbox,
            moreAirlineCompaniesArrow: WallaToursPage.moreAirlineCompaniesArrow,
            moreAirlineCompaniesOpeningTitle: WallaToursPage.moreAirlineCompaniesOpeningTitle,
            //moreAirlineCompaniesClosingTitle: WallaToursPage.moreAirlineCompaniesClosingTitle
          }, "Airline Filters", false),
    
          stopsFilters: await helpers.checkElements({
            directOrStopsTitle: WallaToursPage.directOrStopsTitle,
            flightStopsFilter: WallaToursPage.flightStopsFilter,
            oneStop: WallaToursPage.oneStop,
            twoStops: WallaToursPage.twoStops,
            directFlight: WallaToursPage.directFlight
          }, "Stops Filters", false),
    
          flightTypeFilters: await helpers.checkElements({
            typeOfFlightTitle: WallaToursPage.typeOfFlightTitle,
            typeOfFlightCheck: WallaToursPage.typeOfFlightCheck,
            charterFlight: WallaToursPage.charterFlight,
            regularFlight: WallaToursPage.regularFlight
          }, "Flight Type Filters", false),
    
          departureTimeFilters: await helpers.checkElements({
            departurePartOfTheDayTitle: WallaToursPage.departurePartOfTheDayTitle,
            morningDeparture: WallaToursPage.morningDeparture,
            dayDeparture: WallaToursPage.dayDeparture,
            eveningDeparture: WallaToursPage.eveningDeparture,
            night: WallaToursPage.night
          }, "Departure Time Filters", false),
    
          timeRangeFilters: await helpers.checkElements({
            outBoundTimeTitle: WallaToursPage.outBoundTimeTitle,
            outboundTitle: WallaToursPage.outboundTitle,
            outBoundTimeRange: WallaToursPage.outBoundTimeRange,
            outBoundTimeRangeFilter: WallaToursPage.outBoundTimeRangeFilter,
            //handleDefault: WallaToursPage.handleDefault,
            inboundTitle: WallaToursPage.inboundTitle,
            inboundTimeRange: WallaToursPage.inboundTimeRange,
            inboundTimeRangeFilter: WallaToursPage.inboundTimeRangeFilter
          }, "Time Range Filters", false),
    
          sortIconsAndTitles: await helpers.checkElements({
            bestFlightFilterIcon: WallaToursPage.bestFlightFilterIcon,
            bestFlightFilterPrice: WallaToursPage.bestFlightFilterPrice,
            bestFlightFilterTitle: WallaToursPage.bestFlightFilterTitle,
    
            fastestFlightFilterIcon: WallaToursPage.fastestFlightFilterIcon,
            fastestFlightFilterPrice: WallaToursPage.fastestFlightFilterPrice,
            fastestFlightFilterTitle: WallaToursPage.fastestFlightFilterTitle,
    
            cheapestFlightFilterIcon: WallaToursPage.cheapestFlightFilterIcon,
            cheapestFlightFilterPrice: WallaToursPage.cheapestFlightFilterPrice,
            cheapestFlightFilterTitle: WallaToursPage.cheapestFlightFilterTitle
          }, "Sort Icons & Titles", false)
        };
      },

    // Ticket check
    validateTicketParts: async function () {
        const tickets = await $$(this.ticketContainer);
        if (!tickets.length) {
            throw new Error("❌ No ticket found");
        }
    
        const ticket = tickets[0];
        const checks = {
            Price: ticket.$(this.price),
            ContinueButton: ticket.$(this.continueButton),
            DepartureTime: ticket.$(this.departureTime),
            ArrivalTime: ticket.$(this.arrivalTime),
            DepartureAirport: ticket.$(this.departureAirport),
            ArrivalAirport: ticket.$(this.arrivalAirport),
            FlightNumber: ticket.$(this.flightNumber),
            LayoverText: ticket.$(this.layoverText),
            LayoverDuration: ticket.$(this.layoverDuration),
            LayoverCity: ticket.$(this.layoverCity),
            CarryOnIcon: ticket.$(this.carryOnIcon),
            LuggageIcon: ticket.$(this.luggageIcon),
            AirplaneIcon: ticket.$(this.airplaneIcon),
            AirlineLogo: ticket.$(this.airlineLogo),
            AirlineName: ticket.$(this.airlineName),
            SeatsLeftText: ticket.$(this.seatsLeftText),
        };
    
        await helpers.checkElements(checks, "Ticket Result", false);
    
        await helpers.checkElements({
            ShowMoreFlights: $(this.showMoreFlights),
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
    
   
//Filter Active Check 

    //Price Range 

adjustPriceSlider: async function ({ side = 'min', direction = 'right', percent = 0.3 }) {
    const slider = await $(this.priceSlider);
    const handle = await $(
        side === 'min' ? this.priceSliderHandleMin : this.priceSliderHandleMax
    );

    const sliderSize = await slider.getSize();
    const dragAmount = Math.floor(sliderSize.width * percent);
    const offset = direction === 'right' ? dragAmount : -dragAmount;

    // Move handle
    await browser.performActions([{
        type: 'pointer',
        id: 'mouse',
        parameters: { pointerType: 'mouse' },
        actions: [
            { type: 'pointerMove', origin: handle, x: 1, y: 1 },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 100 },
            { type: 'pointerMove', origin: 'pointer', x: offset, y: 0 },
            { type: 'pointerUp', button: 0 }
        ]
    }]);

    await browser.pause(2000);

    const priceLabelText = await $(this.sliderPriceLabel).getText(); 
    const priceNumbers = priceLabelText.match(/\$?(\d+)/g);

    if (!priceNumbers || priceNumbers.length < 2) {
        throw new Error("❌ Unable to parse price label text.");
    }
    
    const newMin = parseInt(priceNumbers[0], 10);
    const newMax = parseInt(priceNumbers[1], 10);
    
    const value = side === 'min' ? newMin : newMax;
    const label = side === 'min' ? 'Min' : 'Max';
    
    console.log(`🔍 Adjusted ${label} Price: ${value}`);
    
    await WallaToursPage.checkAllTicketsMatchPriceBoundary({ type: side, value });
    
    // Move handle back to reset
    await browser.performActions([{
        type: 'pointer',
        id: 'mouse',
        parameters: { pointerType: 'mouse' },
        actions: [
            { type: 'pointerMove', origin: handle, x: 1, y: 1 },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 100 },
            { type: 'pointerMove', origin: 'pointer', x: -offset, y: 0 },
            { type: 'pointerUp', button: 0 }
        ]
    }]);
},

checkAllTicketsMatchPriceBoundary: async ({ type, value }) => {
    const tickets = await $$(WallaToursPage.priceTicketContainer);

    for (let i = 0; i < tickets.length; i++) {
        const priceElem = await tickets[i].$(WallaToursPage.ticketPriceElement);
        const priceText = await priceElem.getText();

        const numeric = priceText.replace(/[^\d]/g, '');
        const price = parseInt(numeric, 10);

        console.log(`💸 Ticket ${i + 1} price: ${price}`);

        if (isNaN(price)) {
            throw new Error(`❌ Ticket ${i + 1} has invalid price: "${priceText}"`);
        }

        if (type === 'min' && price < value) {
            throw new Error(`❌ Ticket ${i + 1} price ${price} is below min ${value}`);
        }

        if (type === 'max' && price > value) {
            throw new Error(`❌ Ticket ${i + 1} price ${price} is above max ${value}`);
        }
    }
},

//should correctly filter by stops, time, and airline

    //Direct or stops
checkEachTicketHasAtLeastOneSegmentWithStopType: async (expectedPhrase) => {
    const tickets = await $$(WallaToursPage.ticketDetailsPart);

    for (let i = 0; i < tickets.length; i++) {
        const segRows = await tickets[i].$$('.seg-row');

        if (segRows.length < 2) {
            throw new Error(`❌ Ticket ${i + 1} has less than 2 segments (found ${segRows.length})`);
        }

        const stopTexts = [];
        for (let segIndex = 0; segIndex < segRows.length; segIndex++) {
            const segStop = await segRows[segIndex].$('.seg-stops');
            const text = await segStop.getText().then(t => t.trim());
            stopTexts.push(text);
        }

        console.log(`🚏 Ticket ${i + 1} stop texts:`, stopTexts);

        const found = stopTexts.some(t => t.includes(expectedPhrase));
        if (!found) {
            throw new Error(`❌ Ticket ${i + 1} has neither leg matching "${expectedPhrase}"`);
   
        } } },

        // Morning, day, evening, nightfilter
 checkAllTicketsMatchTimeRange: async (minHour, maxHour) => {
    const tickets = await $$('.result');

    for (let i = 0; i < tickets.length; i++) {
        const timeElem = await tickets[i].$('.seg-dep .seg-h');
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

// Airline Top 5
checkAllTicketsMatchAirline: async function (expectedAirline) {
    const tickets = await $$('.segbox');

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
    // This selector looks for any airline name (Hebrew or English)
    const airlineBlockXPath = `//div[@id='flight_airline_filter']//div[contains(@class, 'item filter-name') and .//div[contains(text(), "${airlineName}")]]`;

    const checkboxContainer = await $(airlineBlockXPath);
    await checkboxContainer.scrollIntoView({ block: 'center' });

    const checkmark = await checkboxContainer.$('.checkmark');
    await checkmark.waitForClickable({ timeout: 5000 });
    await checkmark.click();
    await browser.pause(1000); // Wait for filter to apply
}



,
//Checks Charter or Regular filters 

testFlightTypeFilter: async (flightTypeFilters) => {
    for (const [label, selector] of Object.entries(flightTypeFilters)) {
        console.log(`🛫 Testing flight type filter: ${label}`);
        await helpers.safeClick(selector);

        const expectedLabel = label === 'charter' ? 'שכר' : 'סדיר';
        await WallaToursPage.checkAllTicketsMatchFlightType(expectedLabel); // <-- fixed line

        await helpers.safeClick(selector); // uncheck
    }
},

checkAllTicketsMatchFlightType: async function (expectedLabel) {
    const tickets = await $$(WallaToursPage.priceTicketContainer);

    for (let i = 0; i < tickets.length; i++) {
        const flag = await tickets[i].$(WallaToursPage.ticketFlightTypeFlag);

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

// INPUTS (showing selected time)
outboundSliderInput: '#amount-outbound',
inboundSliderInput: '#amount-inbound',

// SLIDER CONTAINERS (the ones you drag)
outboundSlider: '#slider-outboundtime-range',
inboundSlider: '#slider-inboundtime-range',

adjustTimeRangeSlider: async function ({
    flightType = 'outbound',
    handle = 'left',           // 'left' or 'right'
    direction = 'right',       // 'right' or 'left'
    percent = 0.3
}) {
    const sliderSelector = flightType === 'outbound' ? this.outboundSlider : this.inboundSlider;
    const slider = await $(sliderSelector);
    await slider.waitForDisplayed({ timeout: 5000 });
    await slider.scrollIntoView({ block: 'center' });

    const handles = await slider.$$('.ui-slider-handle');
    if (handles.length < 2) throw new Error(`❌ Couldn't find both handles for ${flightType}`);

    const handleToMove = handle === 'left' ? handles[0] : handles[1];
    await handleToMove.waitForDisplayed();
    await handleToMove.scrollIntoView({ block: 'center' });

    const sliderSize = await slider.getSize();
    const dragAmount = Math.floor(sliderSize.width * percent);
    const offset = direction === 'right' ? dragAmount : -dragAmount;

    await browser.performActions([{
        type: 'pointer',
        id: 'mouse',
        parameters: { pointerType: 'mouse' },
        actions: [
            { type: 'pointerMove', origin: handleToMove, x: 1, y: 1 },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 100 },
            { type: 'pointerMove', origin: 'pointer', x: offset, y: 0 },
            { type: 'pointerUp', button: 0 }
        ]
    }]);

    await browser.pause(1000); // Allow UI update
}
,


checkAllTicketsMatchDepartureTimeRange: async function (minHour, maxHour, flightType = 'outbound') {
    const tickets = await $$('.segbox');

    for (let i = 0; i < tickets.length; i++) {
        const segRows = await tickets[i].$$('.seg-row');

        let timeElem;
        if (flightType === 'outbound') {
            timeElem = await segRows[0]?.$('.seg-dep .seg-h');
        } else {
            timeElem = await segRows[1]?.$('.seg-dep .seg-h');
        }

        if (!timeElem || !(await timeElem.isExisting())) {
            console.warn(`⚠️ Ticket ${i + 1} is missing ${flightType} time element`);
            continue;
        }

        const timeText = await timeElem.getText(); // "17:45"
        const [hour] = timeText.split(':').map(Number);

        console.log(`⏰ ${flightType} ticket ${i + 1} departure: ${timeText}`);

        if (minHour > maxHour) {
            const inRange = hour >= minHour || hour <= maxHour;
            expect(inRange).toBeTruthy(
                `❌ ${flightType} ticket ${i + 1} (${hour}) is outside overnight range ${minHour} - ${maxHour}`
            );
        } else {
            expect(hour).toBeGreaterThanOrEqual(minHour);
            expect(hour).toBeLessThanOrEqual(maxHour);
        }
    }
}


,
setSliderRange: async function ({
    flightType = 'outbound',
    fromHour = 8,
    toHour = 20
}) {
    const inputSelector = flightType === 'outbound' ? this.outboundSliderInput : this.inboundSliderInput;

    // Read current range
    let timeRangeText = await $(inputSelector).getValue();
    console.log(`📋 Current ${flightType} range: ${timeRangeText}`);

    let [currentMinText, currentMaxText] = timeRangeText.split('-').map(t => t.trim());
    let currentMin = parseInt(currentMinText.split(':')[0], 10);
    let currentMax = parseInt(currentMaxText.split(':')[0], 10);

    const sliderSelector = flightType === 'outbound' ? this.outboundSlider : this.inboundSlider;
    const slider = await $(sliderSelector);
    const sliderSize = await slider.getSize();

    const hourSpan = 24; // max hour range on the slider
    const hourWidth = sliderSize.width / hourSpan;

    const adjustPercent = (targetHour, currentHour) =>
        Math.abs(targetHour - currentHour) * hourWidth / sliderSize.width;

    // Adjust left handle (start time)
    if (fromHour !== currentMin) {
        const direction = fromHour > currentMin ? 'right' : 'left';
        const percent = adjustPercent(fromHour, currentMin);
        await this.adjustTimeRangeSlider({ flightType, handle: 'left', direction, percent });
    }

    // Adjust right handle (end time)
    if (toHour !== currentMax) {
        const direction = toHour > currentMax ? 'right' : 'left';
        const percent = adjustPercent(toHour, currentMax);
        await this.adjustTimeRangeSlider({ flightType, handle: 'right', direction, percent });
    }

    const updatedRange = await $(inputSelector).getValue();
    console.log(`✅ Updated ${flightType} range: ${updatedRange}`);

    const minHour = parseInt(updatedRange.split('-')[0].split(':')[0].trim(), 10);
    const maxHour = parseInt(updatedRange.split('-')[1].split(':')[0].trim(), 10);

    await this.checkAllTicketsMatchDepartureTimeRange(minHour, maxHour, flightType);
}, 

//Getting to checkout page 


async clickContinueToDetails() {
    const continueButton = await $(this.continueToDetailsPage);
    await continueButton.waitForDisplayed({ timeout: 5000 });
    await continueButton.click();
},

detailsPage:'.details-wrapper',
waitForFlightDetailsPage: async function () {
   const center = await $(this.detailsCenter);
   const sidebar = await $(this.detailsSidebar);
const detailsPage = await $(this.detailsPage);

  //  await center.waitForDisplayed({ timeout: 15000 });
//await sidebar.waitForDisplayed({ timeout: 15000 });
//await detailsPage.waitForDisplayed({ timeout: 15000 });
await this.scrollAndClick(this.detailsPage);
    console.log('✅ Flight details page fully loaded!');
},  

async clickContinueToCheckout() {
    await this.scrollAndClick(this.checkoutButton);
},


//loading page
loadingDestinationText: '.destination',
loadingDatesText: '.loader-dates',

async getLoadingScreenText() {
    const loaderContainer = await $('#searchLoader'); // or use the new class you find in DevTools
    await loaderContainer.waitForDisplayed({ timeout: 10000 });

    const text = await loaderContainer.getText();
    return text;
}




















};



module.exports = {
    WallaToursPage,
};

