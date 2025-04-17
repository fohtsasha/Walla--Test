const { WallaToursPage } = require('../../wallaTourspage');
const helpers = require('../../helper'); 

describe('Walla Tours Flights', () => {

    beforeEach(async () => {
        await browser.url('/flights');
    });

    it('should verify key elements are clickable', async () => {
        await WallaToursPage.checkAllUISections();
    });

    it('should perform a search, then click new search and search again successfully', async () => {
        await WallaToursPage.clearToField(); 
        await WallaToursPage.searchFlight({
            to: 'Madrid',
            arrowDownCount: 2,
            nextMonthClicks: 1,
            departureDay: 5,
            returnDay: 12
        });
    
        await expect($(WallaToursPage.flightResults)).toBeExisting();
    
        await WallaToursPage.clickNewSearchButton();
        await WallaToursPage.clickSearchButton();
    
        await expect($(WallaToursPage.flightResults)).toBeExisting();
    }); 

    it('should switch to one-way and successfully search', async () => {
        const oneWayButton = await $(WallaToursPage.oneWayButton);
        await oneWayButton.waitForDisplayed();
        await oneWayButton.click();
        await WallaToursPage.searchFlight({
            to: 'Madrid',
            arrowDownCount: 2,
            nextMonthClicks: 1,
            departureDay: 5,
            returnDay: null
        });
        await expect($(WallaToursPage.flightResults)).toBeExisting();
    });

    it('should fill 2 multi-destination rows and search (skipping from fields)', async () => {
        const success = await WallaToursPage.selectMultiWayChanges();
        expect(success).toBe(true);
    
        // ---- Row 1: TO + calendar
        await WallaToursPage.searchFlight({
            to: 'London',
            arrowDownCount: 2,
            nextMonthClicks: null,
            departureDay: 20,
            returnDay: null,
            rowIndex: 1
        });
    
        // ---- Row 2: TO + calendar
        await WallaToursPage.searchFlight({
            to: 'Paris',
            arrowDownCount: 2,
            nextMonthClicks: null,
            departureDay: 27,
            returnDay: null,
            rowIndex: 2
        });
    
        await expect($(WallaToursPage.flightResults)).toBeExisting();
        console.log('✅ Multi-destination search with 2 rows completed successfully');
    });

    it('should adjust travelers up and down using existing page methods and validate max total', async () => {
        await WallaToursPage.openTravelersDropdown();
    
        // Increase to max travelers (4 adults, 3 children, 2 infants = 9)
        const increaseTargets = { adult: 4, child: 3, infant: 2 };
    
        for (const [type, target] of Object.entries(increaseTargets)) {
            const current = await WallaToursPage.getTravelerCount(type);
            const diff = target - current;
            if (diff !== 0) {
                await WallaToursPage.adjustTravelerCount(type, diff);
                console.log(`🔧 Increased ${type} from ${current} to ${target}`);
            } else {
                console.log(`✅ ${type} already at ${target}`);
            }
        }
    
        let total = await WallaToursPage.getTravelerCount('adult') +
                    await WallaToursPage.getTravelerCount('child') +
                    await WallaToursPage.getTravelerCount('infant');
        console.log(`🧮 Total travelers after increase: ${total}`);
        expect(total).toBeLessThanOrEqual(9);
    
        // Decrease to a smaller count (2 adults, 1 child, 0 infants)
        const decreaseTargets = { adult: 2, child: 1, infant: 0 };
    
        for (const [type, target] of Object.entries(decreaseTargets)) {
            const current = await WallaToursPage.getTravelerCount(type);
            const diff = target - current;
            if (diff !== 0) {
                await WallaToursPage.adjustTravelerCount(type, diff);
                console.log(`🔧 Decreased ${type} from ${current} to ${target}`);
            } else {
                console.log(`✅ ${type} already at ${target}`);
            }
        }
    
        total = await WallaToursPage.getTravelerCount('adult') +
                await WallaToursPage.getTravelerCount('child') +
                await WallaToursPage.getTravelerCount('infant');
        console.log(`🧮 Total travelers after decrease: ${total}`);
        expect(total).toBeLessThanOrEqual(9);
    });

    it('should display flexible dates dropdown and contain all expected options when button is clicked', async () => {
        const expectedChoices = ["תאריך גמיש", "עד 3 ימים", "עד 2 ימים","עד יום אחד"]; // Replace with actual dropdown values
        const isFlexibleDropdownValid = await WallaToursPage.clickFlexibleDropdownAndCheck(expectedChoices);
        await expect(isFlexibleDropdownValid).toBe(true, "Dropdown selection failed or options are missing");
    });

    it('should display flight class dropdown and contain all expected options', async () => {
        const expectedChoices = ["מחלקת תיירים", "מחלקת פרימיום", "מחלקת עסקים"];
        const isDropdownValid = await WallaToursPage.clickDropdownAndCheck(expectedChoices);
        await expect(isDropdownValid).toBe(true, "Dropdown selection failed or options are missing");
    });

    it('should ensure every two months have at least one holiday', async () => {
        const hasHolidays = await WallaToursPage.checkHolidaysEveryTwoMonths();
        await expect(hasHolidays).toBe(true, "Not all two-month periods contain holidays");
    }); 

    it('should change to round trip when choosing the category', async () => {
        const roundTrip = await WallaToursPage.selectRoundTripChanges();
        await expect(roundTrip).toBe(true, "Round trip selection did not work as expected");
    });

    it('should verify all flight filter elements are visible or clickable', async () => {
        await WallaToursPage.clearToField(); 
        await WallaToursPage.searchFlight({
            to: 'New York',
            arrowDownCount: 2,
            nextMonthClicks: 1,
            departureDay: 9,
            returnDay: 18
          });
        browser.pause(10000);
        await expect($(WallaToursPage.flightResults)).toBeExisting();
        const results = await WallaToursPage.checkFlightFilterElements();  
       
        for (const [section, passed] of Object.entries(results)) {
          await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
          
        }
      });

    it('should have all required parts in the first ticket', async () => {
        await WallaToursPage.clearToField(); 
        await WallaToursPage.searchFlight({
            to: 'New York',
            arrowDownCount: 3,
            nextMonthClicks: 0,
            departureDay: 12,
            returnDay: 19
        });
        await expect($(WallaToursPage.ticketContainer)).toBeDisplayed({ timeout: 10000 });
        browser.pause(3000);
        await WallaToursPage.validateTicketParts();

    });

    it('should adjust both price range sliders and validate ticket prices', async () => {
        await WallaToursPage.clearToField(); 
    
        await WallaToursPage.searchFlight({
            to: 'New York',
            arrowDownCount: 3,
            nextMonthClicks: 0,
            departureDay: 12,
            returnDay: 19
        });
    
        await expect($(WallaToursPage.flightResults)).toBeExisting();
    
        await WallaToursPage.adjustPriceSlider({ side: 'min', direction: 'right', percent: 0.3 });
        await browser.pause(1500);
    
        await WallaToursPage.adjustPriceSlider({ side: 'max', direction: 'left', percent: 0.3 });
        await browser.pause(1000);
    });

    it('should adjust time range for inbound and outbound', async () => {
        await WallaToursPage.clearToField(); 
    
        await WallaToursPage.searchFlight({
            to: 'New York',
            arrowDownCount: 3,
            nextMonthClicks: 0,
            departureDay: 12,
            returnDay: 19
        });
    
        await expect($(WallaToursPage.flightResults)).toBeExisting();
    
        await WallaToursPage.adjustTimeRangeSlider({ flightType: 'outbound', direction: 'right', percent: 0.4 });
        await WallaToursPage.checkAllTicketsMatchDepartureTimeRange(6, 20, 'outbound');

        await WallaToursPage.adjustTimeRangeSlider({ flightType: 'inbound', direction: 'right', percent: 0.3 });
        await WallaToursPage.checkAllTicketsMatchDepartureTimeRange(9, 22, 'inbound')
    });
   
    it('should correctly filter by stops, time, and airline', async () => {
        await WallaToursPage.clearToField(); 
        await WallaToursPage.searchFlight({
            to: 'New York',
            arrowDownCount: 2,
            nextMonthClicks: 0,
            departureDay: 10,
            returnDay: 17
        });
    
        await expect($(WallaToursPage.flightResults)).toBeExisting();
    
  //1️⃣ Stops Filters
        const stopFilters = {
            direct: WallaToursPage.directCheckbox,
            oneStop: WallaToursPage.oneStopCheckbox,
            twoStop: WallaToursPage.twoStopCheckbox
        };
    
        const stopLabelMap = {
            direct: 'ישירה',
            oneStop: 'עצירות: 1',
           twoStop: 'עצירות: 2'
        };
        
    
        for (const [label, selector] of Object.entries(stopFilters)) {
            console.log(`🛑 Testing stop filter: ${label}`);
            await WallaToursPage.toggleFilterCheckbox(selector, label);
            const expectedPhrase = stopLabelMap[label];
            await WallaToursPage.checkEachTicketHasAtLeastOneSegmentWithStopType(expectedPhrase);
            await WallaToursPage.toggleFilterCheckbox(selector, `${label} (uncheck)`);
       
        }

        // 2️⃣ Time Filters
        const timeFilters = {
            morning: WallaToursPage.morningCheckbox,
            day: WallaToursPage.dayCheckbox,
            evening: WallaToursPage.eveningCheckbox,
            night: WallaToursPage.nightCheckbox
        };
    
        const timeRanges = {
            morning: [0, 11],
            day: [12, 16],
            evening: [18, 23],
            night: [23, 5]
        };
    
        for (const [label, selector] of Object.entries(timeFilters)) {
            console.log(`⏰ Testing time filter: ${label}`);
            await WallaToursPage.toggleFilterCheckbox(selector, label);
            const [minHour, maxHour] = timeRanges[label];
            await WallaToursPage.checkAllTicketsMatchTimeRange(minHour, maxHour);
            await WallaToursPage.toggleFilterCheckbox(selector, `${label} (uncheck)`);
        }
     
  // 3️⃣ Airline filter test (ALL airlines)
   /**  await helpers.validateSelectedAirlines(
    helpers.airlineTicketToFilter,
    WallaToursPage.selectAirlineCheckbox,
    WallaToursPage.checkAllTicketsMatchAirline
    );*/

// ✅ OR test specific airlines only:
 await helpers.validateSelectedAirlines(
    { 'EL AL': 'אלעל',
    'Aegean': 'Aegean',
    'Air Canada': 'Air Canada',
    'Air Europa': 'Air Europa',
    'Air France': 'Air France',
     },
 WallaToursPage.selectAirlineCheckbox,
  WallaToursPage.checkAllTicketsMatchAirline
 );
});

    it('should correctly filter by flight type (Charter and Regular)', async () => {
        await WallaToursPage.clearToField(); 
        
        await WallaToursPage.searchFlight({
            to: 'Athens',
            arrowDownCount: 3,
            nextMonthClicks: 0,
            departureDay: 12,
            returnDay: 19
        });
    
        await expect($(WallaToursPage.flightResults)).toBeExisting();
    
        await WallaToursPage.testFlightTypeFilter({
            charter: WallaToursPage.charterCheckbox,
            regular: WallaToursPage.regularCheckbox
        });
    });

    it.only('should show correct destination and dates on the loading screen', async () => {
        await browser.pause(5000); // Give site scripts time to settle
    
        await WallaToursPage.clearToField();
    
        await WallaToursPage.searchFlight({
            to: 'London',
            arrowDownCount: 2,
            nextMonthClicks: 1,
            departureDay: 14,
            returnDay: 21
        });
    
        // ✅ Wait for loader container to appear
        const loaderContainer = await $('#searchLoader');
        await loaderContainer.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: '❌ Loader did not show up'
        });
    
        // ✅ Grab the loader's visible text while it's still showing
        const loaderText = await loaderContainer.getText();
        console.log('📦 Loader content:', loaderText);
    
        // ✅ Validate content
        expect(loaderText).toContain('לונדון');
        expect(loaderText).toMatch(/14[./]05[./]25/); // Flexible date format
        expect(loaderText).toMatch(/21[./]05[./]25/);
    
        // Optional: wait for the loader to disappear
        await loaderContainer.waitForDisplayed({ reverse: true, timeout: 10000 });
    
        // Optional: wait for results to ensure transition is done
        await expect($(WallaToursPage.flightResults)).toBeDisplayed();
    });
    

     /**  it.only('get to the payment page', async () => {
        await WallaToursPage.clearToField(); 
    
        await WallaToursPage.searchFlight({
            to: 'London',
            arrowDownCount: 3,
            nextMonthClicks: 1,
            departureDay: 12,
            returnDay: 19
        });
    
        await expect($(WallaToursPage.flightResults)).toBeExisting();
    
        await WallaToursPage.selectAirlineCheckbox('אלעל'); 
        await WallaToursPage.clickContinueToDetails();
        await browser.pause(5000);
        const visibleText = await $('body').getText();
        console.log('📄 Visible text:\n', visibleText);
        const source = await browser.getPageSource();
console.log('📄 Page Source:\n', source);


        //await WallaToursPage.waitForFlightDetailsPage();   
      //await WallaToursPage.clickContinueToCheckout();
    });
      
  /**

    it('should show correct destination and dates on the loading screen', async () => {
        await browser.pause(20000); // Wait for site assets/scripts
    
        await WallaToursPage.clearToField();
    
        await WallaToursPage.searchFlight({
            to: 'London',
            arrowDownCount: 2,
            nextMonthClicks: 1,
            departureDay: 14,
            returnDay: 21
        });
    
        // Optional wait to make sure loader appears
        await browser.waitUntil(
            async () => (await $('#searchLoader')).isDisplayed(),
            { timeout: 10000, timeoutMsg: '❌ Loader did not show up' }
        );
    
        const loaderText = await WallaToursPage.getLoadingScreenText();
        console.log('📦 Loader content:', loaderText);
    
        const allText = await $('body').getText();
        console.log('📦 FULL PAGE TEXT:', allText);
    
        expect(loaderText).toContain('לונדון');
        expect(loaderText).toContain('14.05.25');
        expect(loaderText).toContain('21.05.25');
    });

    it.only('should log loader screen content before results load', async () => {
    
        await WallaToursPage.clearToField();
    
        await WallaToursPage.searchFlight({
            to: 'London',
            arrowDownCount: 2,
            nextMonthClicks: 1,
            departureDay: 14,
            returnDay: 21,
            submit: false
        });
    
        const searchButton = await $(WallaToursPage.submitSearchButton);
        await searchButton.waitForClickable({ timeout: 10000 });
        await searchButton.click();
    
        // Wait for all iframes and switch into correct one
        const allIframes = await $$('iframe');
        let switched = false;
        let loaderIframe = null;
    
        for (let i = 0; i < allIframes.length; i++) {
            const src = await allIframes[i].getAttribute('src');
            console.log(`iframe[${i}] src: ${src}`);
    
            if (src && src.includes('loading_search.aspx')) {
                await browser.switchFrame(allIframes[i]);
                loaderIframe = allIframes[i];
    
                const found = await $('#SearchLoader').isExisting();
                console.log(`✅ Switched to iframe ${i}, loader found: ${found}`);
                switched = true;
                break;
            }
        }
    
        if (!switched) {
            throw new Error('❌ Could not find or switch to loader iframe');
        }
    
        try {
            const loader = await $('#SearchLoader');
            await browser.waitUntil(async () => await loader.isDisplayed(), {
                timeout: 10000,
                timeoutMsg: '#SearchLoader not visible within 10s',
            });
    
            // ✅ Check destination in Hebrew
            const destination = await $('.loader-title');
            const destText = await destination.getText();
            console.log('📍 Destination line:', destText);
            expect(destText).toContain('ללונדון');
    
            // ✅ Check dates
            const dates = await $('.loader-dates');
            const dateText = await dates.getText();
            console.log('📅 Dates line:', dateText);
            expect(dateText).toContain('14.05.25');
            expect(dateText).toContain('21.05.25');
    
            // ✅ Check marketing section
            const marketingItems = await $$('.loader-marketing-list .vicon');
            expect(marketingItems.length).toBeGreaterThanOrEqual(3);
    
        } catch (err) {
            console.error('❌ Loader content validation failed:', err.message);
        } finally {
            await browser.switchToParentFrame();
        }
    
        // ✅ Validate iframe src also includes the destination in Hebrew
        const iframeSrc = await loaderIframe.getAttribute('src');
        console.log('📦 Iframe src:', iframeSrc);
        expect(iframeSrc).toContain('ללונדון');
    
        console.log('✅ Loader content validation complete.');
    });
    
      */
    
























/** 
    it.only('should log loader screen content before results load', async () => {
        await browser.url('https://dev-www.wallatours.co.il/flights/');
        await browser.pause(20000);
    
        await WallaToursPage.clearToField();
    
        // 👇 Do NOT submit automatically
        await WallaToursPage.searchFlight({
            to: 'London',
            arrowDownCount: 2,
            nextMonthClicks: 1,
            departureDay: 14,
            returnDay: 21,
            submit: false
        });
    
        // ✅ NOW: click the search button manually and log right away
        const searchButton = await $(WallaToursPage.submitSearchButton);
        await searchButton.waitForClickable({ timeout: 5000 });
        await searchButton.click();
    
        await browser.pause(1000); // Give loader time to appear
    
        // 🔍 Dump full page text
        const allText = await $('body').getText();
        console.log('📃 FULL PAGE TEXT (during loader):\n', allText);
    
        // 🔥 Emergency scan of divs
        const divs = await $$('div');
        for (const div of divs) {
            const text = await div.getText();
            if (
                text.includes('14.05.25') ||
                text.includes('21.05.25') ||
                text.includes('לונדון') ||
                text.toLowerCase().includes('london')
            ) {
                console.log('🚨 MATCHED DIV:', await div.selector);
                console.log('📦 TEXT:', text);
            }
        }
    
        console.log('✅ Loader diagnostic complete.');
    });
    
    
});

    
    it('should show correct destination and dates on the loading screen (diagnostic)', async () => {
        await browser.url('https://dev-www.wallatours.co.il/flights/');
        await browser.pause(20000); // Let page fully load
    
        await WallaToursPage.clearToField();
    
        await WallaToursPage.searchFlight({
            to: 'London',
            arrowDownCount: 2,
            nextMonthClicks: 1,
            departureDay: 14,
            returnDay: 21
        });
    
        // 🔍 Log the full page text for review
        const allText = await $('body').getText();
        console.log('📃 FULL PAGE TEXT:\n', allText);
    
        // 🔥 Emergency search — log any div that contains date or destination
        const divs = await $$('div');
        for (const div of divs) {
            const text = await div.getText();
            if (
                text.includes('14.05.25') ||
                text.includes('21.05.25') ||
                text.includes('לונדון') || // London in Hebrew
                text.toLowerCase().includes('london') // fallback
            ) {
                console.log('🚨 MATCHED DIV:', await div.selector);
                console.log('📦 TEXT:', text);
            }
        }
    
        // ❗ Don't assert anything yet — this is for investigation
        console.log('✅ Diagnostic complete. Check console output for loader details.');
    */
    
});

