const { searchFlight } = require('../../page.js/searchFlight');
const { detailsAndCheckout } = require('../../page.js/detailsAndCheckout');
const helpers = require('../../helper');
const config = require('../../config/flightData');
const selectors = require('../../page.js/selectors');

describe('Walla Tours Flights', () => {

    beforeEach(async () => {
        await browser.url('/flights');
    });

    afterEach(async () => {
        const tabs = await browser.getWindowHandles();
        if (tabs.length > 1) {
            console.log('🧹 Cleaning up: Closing extra tab');
            await browser.closeWindow();
            await browser.switchToWindow(tabs[0]);
        }
    });

 it('round trip', async () => {
        await searchFlight.checkAllUISections();
        await searchFlight.clearToField();
        await searchFlight.searchFlight(config.searchCases.roundTrip);
        await expect($(selectors.flightResults)).toBeExisting();
        await searchFlight.validateTicketParts();
        const filters = await searchFlight.checkFlightFilterElements();
        for (const [section, passed] of Object.entries(filters)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }
        await searchFlight.adjustPriceSlider({ side: 'min', direction: 'right', percent: 0.3 });
        await searchFlight.adjustPriceSlider({ side: 'max', direction: 'left', percent: 0.3 });
        await searchFlight.applyOutboundRange(0.3);
        await searchFlight.applyInboundRange(0.3);
        const airlineMap = await helpers.getFirstNExistingAirlines(5, helpers.airlineTicketToFilter);
        await helpers.validateSelectedAirlines(
            airlineMap,
            searchFlight.selectAirlineCheckbox,
            searchFlight.checkAllTicketsMatchAirline
        );
        
        // Best, fastest, cheapest
        await searchFlight.clickFastestFilter();
        await searchFlight.verifyTopTicketMatchesFilter('fastest');
        await searchFlight.clickCheapestFilter();
        await searchFlight.verifyTopTicketMatchesFilter('cheapest');
        await searchFlight.clickBestFilter();
        await searchFlight.verifyTopTicketMatchesFilter('best');

        // Stops Filters
        const stopFilters = {
            direct: selectors.directCheckbox,
            oneStop: selectors.oneStopCheckbox,
            twoStop: selectors.twoStopCheckbox
        };

        const stopLabelMap = {
            direct: 'ישירה',
            oneStop: 'עצירות: 1',
            twoStop: 'עצירות: 2'
        };

            for (const [label, selector] of Object.entries(stopFilters)) {
            console.log(`🛑 Testing stop filter: ${label}`);
            await searchFlight.toggleFilterCheckbox(selector, label);
            const expectedPhrase = stopLabelMap[label];
            await searchFlight.checkEachTicketHasAtLeastOneSegmentWithStopType(expectedPhrase);
            await searchFlight.toggleFilterCheckbox(selector, `${label} (uncheck)`);
        }
        // Time Filters
             const timeFilters = {
            morning: selectors.morningCheckbox,
            day: selectors.dayCheckbox,
            evening: selectors.eveningCheckbox,
            night: selectors.nightCheckbox
        };
        
        const timeRanges = {
            morning: [0, 11],
            day: [12, 16],
            evening: [18, 23],
            night: [23, 5]
        };
        
        for (const [label, selector] of Object.entries(timeFilters)) {
            console.log(`⏰ Testing time filter: ${label}`);
            await searchFlight.toggleFilterCheckbox(selector, label);
            const [minHour, maxHour] = timeRanges[label];
            await searchFlight.checkAllTicketsMatchTimeSlot(minHour, maxHour);
            await searchFlight.toggleFilterCheckbox(selector, `${label} (uncheck)`);
        }
        await browser.pause(1000);
        const selectedTicket = await searchFlight.selectSpecificTicketCombo(flightTypeCombos.regular);
        const { expectedPrice, detailsSegments } = await detailsAndCheckout.checkTicketPriceMatch(selectedTicket);

        await detailsAndCheckout.selectFareFamilyAndVerifyPriceChange();
        const results = await detailsAndCheckout.checkDetailsPageElements();
        for (const [section, passed] of Object.entries(results)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }
        await detailsAndCheckout.clickContinueToCheckout();
        await browser.pause(3000);
        await detailsAndCheckout.compareFlightSummaryWithDetails(detailsSegments, expectedPrice);
        await detailsAndCheckout.verifyTermsAndConditionsPopup();
        await detailsAndCheckout.fillCustomerInfo(config.defaultUser);
        await detailsAndCheckout.verifyBaggageFlow({ direction: 'outbound' });
        // await detailsAndCheckout.verifyBaggageFlow({ direction: 'inbound' });
        await detailsAndCheckout.verifyPassportInstructionAndPopup();
        await detailsAndCheckout.commentSectionActive();
        await detailsAndCheckout.fillPassengerDetails(config.defaultPassenger);
        await detailsAndCheckout.selectPatternsByIndex(config.patternSelection);
        await detailsAndCheckout.clickContinueAfterPattern();
        await browser.pause(1000);
        await detailsAndCheckout.verifyStandardTermsCheckbox();
        await detailsAndCheckout.clickCreditCardAndWaitForIframe();
});

    it('round trip charter', async () => {
        await searchFlight.checkAllUISections();
        await searchFlight.clearToField();
        await searchFlight.searchFlight(config.searchCases.roundTripCharter);
        await expect($(selectors.flightResults)).toBeExisting();
        await searchFlight.validateTicketParts();
        const filters = await searchFlight.checkFlightFilterElements();
        for (const [section, passed] of Object.entries(filters)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }
        await searchFlight.adjustPriceSlider({ side: 'min', direction: 'right', percent: 0.3 });
        await searchFlight.adjustPriceSlider({ side: 'max', direction: 'left', percent: 0.3 });
        await searchFlight.applyOutboundRange(0.3);
        await searchFlight.applyInboundRange(0.3);
        await searchFlight.clickStopTypeFilter(config.stopType);
        const selectedTicket = await searchFlight.selectSpecificTicketCombo(flightTypeCombos.charter);
        const { expectedPrice, detailsSegments } = await detailsAndCheckout.checkTicketPriceMatch(selectedTicket);
        await detailsAndCheckout.selectFareFamilyAndVerifyPriceChange();
        await detailsAndCheckout.checkNoFareFamilyAllowed();
        const results = await detailsAndCheckout.checkDetailsPageElements();
        const hadFareFamily = await $(selectors.fareFamilySection1).isExisting();
        for (const [section, passed] of Object.entries(results)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }
        await detailsAndCheckout.clickContinueToCheckout();
        await browser.pause(3000);
        await detailsAndCheckout.compareFlightSummaryWithDetails(detailsSegments, expectedPrice);
        await detailsAndCheckout.verifyTermsAndConditionsPopup();
        await detailsAndCheckout.fillCustomerInfo(config.defaultUser);
        await detailsAndCheckout.checkFareFamilyOrLuggageOnSummary(hadFareFamily);
        await detailsAndCheckout.verifyBaggageFlow({ direction: 'outbound' });
        // await detailsAndCheckout.verifyBaggageFlow({ direction: 'inbound' });
        await detailsAndCheckout.verifyPassportInstructionAndPopup();
         await detailsAndCheckout.commentSectionActive();
        await detailsAndCheckout.fillPassengerDetails(config.defaultPassenger);
        await detailsAndCheckout.selectPatternsByIndex(config.patternSelection);
        await detailsAndCheckout.clickContinueAfterPattern();
        await browser.pause(1000);
        await detailsAndCheckout.verifyStandardTermsCheckbox();
        await detailsAndCheckout.clickCreditCardAndWaitForIframe();
    });

    it('round trip regular', async () => {
        await searchFlight.checkAllUISections();
        await searchFlight.clearToField();
        await searchFlight.searchFlight(config.searchCases.roundTripRegular);
        await expect($(selectors.flightResults)).toBeExisting();
        await searchFlight.validateTicketParts();
        const filters = await searchFlight.checkFlightFilterElements();
        for (const [section, passed] of Object.entries(filters)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }
        await searchFlight.adjustPriceSlider({ side: 'min', direction: 'right', percent: 0.3 });
        await searchFlight.adjustPriceSlider({ side: 'max', direction: 'left', percent: 0.3 });
        await searchFlight.applyOutboundRange(0.3);
        await searchFlight.applyInboundRange(0.3);
        await searchFlight.clickStopTypeFilter(config.stopType);     
        const selectedTicket = await searchFlight.selectSpecificTicketCombo(flightTypeCombos.regular);
        const { expectedPrice, detailsSegments } = await detailsAndCheckout.checkTicketPriceMatch(selectedTicket);

        await detailsAndCheckout.selectFareFamilyAndVerifyPriceChange();
        const results = await detailsAndCheckout.checkDetailsPageElements();
        for (const [section, passed] of Object.entries(results)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }
        await detailsAndCheckout.clickContinueToCheckout();
        await browser.pause(3000);
        await detailsAndCheckout.compareFlightSummaryWithDetails(detailsSegments, expectedPrice);
        await detailsAndCheckout.verifyTermsAndConditionsPopup();
        await detailsAndCheckout.fillCustomerInfo(config.defaultUser);
        await detailsAndCheckout.verifyBaggageFlow({ direction: 'outbound' });
        // await detailsAndCheckout.verifyBaggageFlow({ direction: 'inbound' });
        await detailsAndCheckout.verifyPassportInstructionAndPopup();
         await detailsAndCheckout.commentSectionActive();
        await detailsAndCheckout.fillPassengerDetails(config.defaultPassenger);
        await detailsAndCheckout.selectPatternsByIndex(config.patternSelection);
        await detailsAndCheckout.clickContinueAfterPattern();
        await browser.pause(1000);
        await detailsAndCheckout.verifyStandardTermsCheckbox();
        await detailsAndCheckout.clickCreditCardAndWaitForIframe();
    });

it('multi-ticket regular-regular', async () => {
        await searchFlight.checkAllUISections();
        await searchFlight.clearToField();
        await searchFlight.searchFlight(config.searchCases.roundTripMultiTicketRegular);
        await expect($(selectors.flightResults)).toBeExisting();
        await searchFlight.validateTicketParts();
        const filters = await searchFlight.checkFlightFilterElements();
        for (const [section, passed] of Object.entries(filters)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }
        await searchFlight.adjustPriceSlider({ side: 'min', direction: 'right', percent: 0.3 });
        await searchFlight.adjustPriceSlider({ side: 'max', direction: 'left', percent: 0.3 });
        await searchFlight.applyOutboundRange(0.3);
        await searchFlight.applyInboundRange(0.3);
        await searchFlight.clickStopTypeFilter(config.stopType);
        const selectedTicket = await searchFlight.selectSpecificTicketCombo(flightTypeCombos.multiRegular);
        const { expectedPrice, detailsSegments } = await detailsAndCheckout.checkTicketPriceMatch(selectedTicket);

        await detailsAndCheckout.selectFareFamilyAndVerifyPriceChange();
        const results = await detailsAndCheckout.checkDetailsPageElements();
        for (const [section, passed] of Object.entries(results)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }
        await detailsAndCheckout.clickContinueToCheckout();
        await browser.pause(3000);
        await detailsAndCheckout.compareFlightSummaryWithDetails(detailsSegments, expectedPrice);
        await detailsAndCheckout.verifyTermsAndConditionsPopup();
        await detailsAndCheckout.fillCustomerInfo(config.defaultUser);
        await detailsAndCheckout.verifyBaggageFlow({ direction: 'outbound' });
        // await detailsAndCheckout.verifyBaggageFlow({ direction: 'inbound' });
        await detailsAndCheckout.verifyPassportInstructionAndPopup();
         await detailsAndCheckout.commentSectionActive();
        await detailsAndCheckout.fillPassengerDetails(config.defaultPassenger);
        await detailsAndCheckout.selectPatternsByIndex(config.patternSelection);
        await detailsAndCheckout.clickContinueAfterPattern();
        await browser.pause(1000);
        await detailsAndCheckout.verifyMultiTicketTermsCheckbox();
        await detailsAndCheckout.verifyStandardTermsCheckbox();
        await detailsAndCheckout.clickCreditCardAndWaitForIframe();
    });

    it('multi-ticket charter-charter', async () => {
        await searchFlight.checkAllUISections();
        await searchFlight.clearToField();
        await searchFlight.searchFlight(config.searchCases.roundTripMultiTicketCharter);
        await expect($(selectors.flightResults)).toBeExisting();
        await searchFlight.validateTicketParts();
        const filters = await searchFlight.checkFlightFilterElements();
        for (const [section, passed] of Object.entries(filters)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }
        await searchFlight.adjustPriceSlider({ side: 'min', direction: 'right', percent: 0.3 });
        await searchFlight.adjustPriceSlider({ side: 'max', direction: 'left', percent: 0.3 });
        await searchFlight.applyOutboundRange(0.3);
        await searchFlight.applyInboundRange(0.3 );
        await searchFlight.clickStopTypeFilter(config.stopType);
        const selectedTicket = await searchFlight.selectSpecificTicketCombo(flightTypeCombos.multiCharter);
        const { expectedPrice, detailsSegments } = await detailsAndCheckout.checkTicketPriceMatch(selectedTicket);

        await detailsAndCheckout.selectFareFamilyAndVerifyPriceChange();
        await detailsAndCheckout.checkNoFareFamilyAllowed();

        const results = await detailsAndCheckout.checkDetailsPageElements();
        for (const [section, passed] of Object.entries(results)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }
        await detailsAndCheckout.clickContinueToCheckout();
        await browser.pause(3000);
        await detailsAndCheckout.compareFlightSummaryWithDetails(detailsSegments, expectedPrice);
        await detailsAndCheckout.verifyTermsAndConditionsPopup();
        await detailsAndCheckout.fillCustomerInfo(config.defaultUser);
        await detailsAndCheckout.verifyBaggageFlow({ direction: 'outbound' });
        // await detailsAndCheckout.verifyBaggageFlow({ direction: 'inbound' });
        await detailsAndCheckout.verifyPassportInstructionAndPopup();
        await detailsAndCheckout.commentSectionActive();
        await detailsAndCheckout.fillPassengerDetails(config.defaultPassenger);
        await detailsAndCheckout.selectPatternsByIndex(config.patternSelection);
        await detailsAndCheckout.clickContinueAfterPattern();
        await browser.pause(1000);
        await detailsAndCheckout.verifyMultiTicketTermsCheckbox();
        await detailsAndCheckout.verifyStandardTermsCheckbox();
        await detailsAndCheckout.clickCreditCardAndWaitForIframe();
    });

    it('multi-ticket regular=charter', async () => {
        await searchFlight.checkAllUISections();
        await searchFlight.clearToField();
        await searchFlight.searchFlight(config.searchCases.roundTripMultiTicketRegularCharter);
        await expect($(selectors.flightResults)).toBeExisting();
        await searchFlight.validateTicketParts();
        const filters = await searchFlight.checkFlightFilterElements();
        for (const [section, passed] of Object.entries(filters)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }
        await searchFlight.adjustPriceSlider({ side: 'min', direction: 'right', percent: 0.3 });
        await searchFlight.adjustPriceSlider({ side: 'max', direction: 'left', percent: 0.3 });
        await searchFlight.applyOutboundRange(0.3);
        await searchFlight.applyInboundRange(0.3);
        await searchFlight.clickStopTypeFilter(config.stopType);
        const selectedTicket = await searchFlight.selectSpecificTicketCombo(flightTypeCombos.multiMixed);
        const { expectedPrice, detailsSegments } = await detailsAndCheckout.checkTicketPriceMatch(selectedTicket);

        await detailsAndCheckout.selectFareFamilyAndVerifyPriceChange();
        const results = await detailsAndCheckout.checkDetailsPageElements();
        for (const [section, passed] of Object.entries(results)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }
        await detailsAndCheckout.clickContinueToCheckout();
        await browser.pause(3000);
        await detailsAndCheckout.compareFlightSummaryWithDetails(detailsSegments, expectedPrice);
        await detailsAndCheckout.verifyTermsAndConditionsPopup();
        await detailsAndCheckout.fillCustomerInfo(config.defaultUser);
        await detailsAndCheckout.verifyBaggageFlow({ direction: 'outbound' });
        // await detailsAndCheckout.verifyBaggageFlow({ direction: 'inbound' });
        await detailsAndCheckout.verifyPassportInstructionAndPopup();
        await detailsAndCheckout.commentSectionActive();
        await detailsAndCheckout.fillPassengerDetails(config.defaultPassenger);
        await detailsAndCheckout.selectPatternsByIndex(config.patternSelection);
        await detailsAndCheckout.clickContinueAfterPattern();
        await browser.pause(1000);
        await detailsAndCheckout.verifyMultiTicketTermsCheckbox();
        await detailsAndCheckout.verifyStandardTermsCheckbox();
        await detailsAndCheckout.clickCreditCardAndWaitForIframe();
    });

    it.only('one-way Charter', async () => {
        await searchFlight.checkAllUISections();
        const oneWayButton = await $(selectors.oneWayButton);
        await oneWayButton.waitForDisplayed();
        await oneWayButton.click();
        await searchFlight.searchFlight(config.searchCases.oneWayTicketCharter);
        await expect($(selectors.flightResults)).toBeExisting();
        await searchFlight.validateTicketParts();

        const filters = await searchFlight.checkFlightFilterElements();
        for (const [section, passed] of Object.entries(filters)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }

        await searchFlight.adjustPriceSlider({ side: 'min', direction: 'right', percent: 0.3 });
        await searchFlight.adjustPriceSlider({ side: 'max', direction: 'left', percent: 0.3 });
        await searchFlight.applyOutboundRange(0.3);
        const selectedTicket = await searchFlight.selectSpecificTicketCombo(flightTypeCombos.charter);
        const { expectedPrice, detailsSegments } = await detailsAndCheckout.checkTicketPriceMatch(selectedTicket);
        await detailsAndCheckout.selectFareFamilyAndVerifyPriceChange();
        await detailsAndCheckout.checkNoFareFamilyAllowed();
        await detailsAndCheckout.checkNoFareFamilyAllowed();
        await detailsAndCheckout.clickContinueToCheckout();
        await detailsAndCheckout.compareFlightSummaryWithDetails(detailsSegments, expectedPrice);
        await detailsAndCheckout.verifyTermsAndConditionsPopup();
        await detailsAndCheckout.fillCustomerInfo(config.defaultUser);
        await detailsAndCheckout.verifyPassportInstructionAndPopup();
        await detailsAndCheckout.fillPassengerDetails(config.defaultPassenger);
        await detailsAndCheckout.selectPatternsByIndex(config.patternSelection);
        await detailsAndCheckout.clickContinueAfterPattern();
        await browser.pause(1000);
        await detailsAndCheckout.verifyMultiTicketTermsCheckbox();
        await detailsAndCheckout.verifyStandardTermsCheckbox();
        await detailsAndCheckout.clickCreditCardAndWaitForIframe();
    });

    it('one-way Regular', async () => {
        await searchFlight.checkAllUISections();
        const oneWayButton = await $(selectors.oneWayButton);
        await oneWayButton.waitForDisplayed();
        await oneWayButton.click();
        await searchFlight.searchFlight(config.searchCases.oneWayTicketRegular);
        await expect($(selectors.flightResults)).toBeExisting();
        await searchFlight.validateTicketParts();

        const filters = await searchFlight.checkFlightFilterElements();
        for (const [section, passed] of Object.entries(filters)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }

        await searchFlight.adjustPriceSlider({ side: 'min', direction: 'right', percent: 0.3 });
        await searchFlight.adjustPriceSlider({ side: 'max', direction: 'left', percent: 0.3 });
        await searchFlight.applyOutboundRange(0.3);
        await searchFlight.clickStopTypeFilter(config.stopType);
        const selectedTicket = await searchFlight.selectSpecificTicketCombo(flightTypeCombos.regular);
        const { expectedPrice, detailsSegments } = await detailsAndCheckout.checkTicketPriceMatch(selectedTicket);

        await detailsAndCheckout.selectFareFamilyAndVerifyPriceChange();
        await detailsAndCheckout.clickContinueToCheckout();
        await detailsAndCheckout.compareFlightSummaryWithDetails(detailsSegments, expectedPrice);
        await detailsAndCheckout.verifyTermsAndConditionsPopup();
        await detailsAndCheckout.fillCustomerInfo(config.defaultUser);
        await detailsAndCheckout.verifyPassportInstructionAndPopup();
        await detailsAndCheckout.fillPassengerDetails(config.defaultPassenger);
        await detailsAndCheckout.selectPatternsByIndex(config.patternSelection);
        await detailsAndCheckout.clickContinueAfterPattern();
        await browser.pause(1000);
        await detailsAndCheckout.verifyMultiTicketTermsCheckbox();
        await detailsAndCheckout.verifyStandardTermsCheckbox();
        await detailsAndCheckout.clickCreditCardAndWaitForIframe();
    });

    it('multi-city', async () => {
        const success = await searchFlight.selectMultiWayChanges();
        expect(success).toBe(true);
    
        for (const row of config.searchCases.tripMulti) {
            await searchFlight.searchFlight(row);
        }
    
        await expect($(selectors.flightResults)).toBeExisting();
        await searchFlight.validateTicketParts();
        console.log('✅ Multi-destination search with 2 rows completed successfully');
    
        const filters = await searchFlight.checkFlightFilterElements();
        for (const [section, passed] of Object.entries(filters)) {
            await expect(passed).toBe(true, `${section} section is missing or has visibility/clickability issues`);
        }
    
        await searchFlight.adjustPriceSlider({ side: 'min', direction: 'right', percent: 0.3 });
        await browser.pause(500);
        await searchFlight.adjustPriceSlider({ side: 'max', direction: 'left', percent: 0.3 });
        await browser.pause(500);
        await searchFlight.applyOutboundRange(0.3);
        await searchFlight.applyInboundRange(0.3);
        const selectedTicket = await searchFlight.selectSpecificTicketCombo(flightTypeCombos.regular);
        const { expectedPrice, detailsSegments } = await detailsAndCheckout.checkTicketPriceMatch(selectedTicket);

        await detailsAndCheckout.checkFareFamilyAndLuggageRules(selectedTicket);

        await detailsAndCheckout.selectFareFamilyAndVerifyPriceChange();
        await detailsAndCheckout.clickContinueToCheckout();
        await detailsAndCheckout.compareFlightSummaryWithDetails(detailsSegments, expectedPrice);
        await detailsAndCheckout.fillCustomerInfo(config.defaultUser);
        await detailsAndCheckout.fillPassengerDetails(config.defaultPassenger);
        await detailsAndCheckout.selectPatternsByIndex(config.patternSelection);
        await detailsAndCheckout.clickContinueAfterPattern();
        await browser.pause(500);
        await detailsAndCheckout.verifyStandardTermsCheckbox();
        await detailsAndCheckout.clickCreditCardAndWaitForIframe();
        await helpers.closeExtraTabsIfAny();
    });

    it('search bar is working ', async () => {
        await searchFlight.checkAllUISections();

        const expectedChoices = ["מחלקת תיירים", "מחלקת פרימיום", "מחלקת עסקים"];
        const isDropdownValid = await searchFlight.clickDropdownAndCheck(expectedChoices);
        await expect(isDropdownValid).toBe(true, "Dropdown selection failed or options are missing");
        const hasHolidays = await searchFlight.checkHolidaysEveryTwoMonths();
        await expect(hasHolidays).toBe(true, "Not all two-month periods contain holidays");
        await searchFlight.goBackSameAmountOfMonths(12);
        const expectedChoicesFlexible = ["תאריך גמיש", "עד 3 ימים", "עד 2 ימים", "עד יום אחד"];
        const isFlexibleDropdownValid = await searchFlight.clickFlexibleDropdownAndCheck(expectedChoicesFlexible);
        await expect(isFlexibleDropdownValid).toBe(true, "Dropdown selection failed or options are missing");

        await searchFlight.openTravelersDropdown();

        const increaseTargets = { adult: 4, child: 3, infant: 2 };
        for (const [type, target] of Object.entries(increaseTargets)) {
            const current = await searchFlight.getTravelerCount(type);
            const diff = target - current;
            if (diff !== 0) {
                await searchFlight.adjustTravelerCount(type, diff);
                console.log(`🔧 Increased ${type} from ${current} to ${target}`);
            } else {
                console.log(`✅ ${type} already at ${target}`);
            }
        }

        let total = await searchFlight.getTravelerCount('adult') +
                    await searchFlight.getTravelerCount('child') +
                    await searchFlight.getTravelerCount('infant');
        console.log(`🧮 Total travelers after increase: ${total}`);
        expect(total).toBeLessThanOrEqual(9);

        // Decrease to a smaller count (2 adults, 1 child, 1 infant)
        const decreaseTargets = { adult: 2, child: 1, infant: 1 };
        for (const [type, target] of Object.entries(decreaseTargets)) {
            const current = await searchFlight.getTravelerCount(type);
            const diff = target - current;
            if (diff !== 0) {
                await searchFlight.adjustTravelerCount(type, diff);
                console.log(`🔧 Decreased ${type} from ${current} to ${target}`);
            } else {
                console.log(`✅ ${type} already at ${target}`);
            }
        }

        total = await searchFlight.getTravelerCount('adult') +
                await searchFlight.getTravelerCount('child') +
                await searchFlight.getTravelerCount('infant');
        console.log(`🧮 Total travelers after decrease: ${total}`);
        expect(total).toBeLessThanOrEqual(4);
        const oneWayButton = await $(searchFlight.oneWayButton);
        await oneWayButton.waitForDisplayed();
        await oneWayButton.click();
        const oneWayCalendar = await $(searchFlight.oneWayCalendar);
        const isDisplayed = await oneWayCalendar.isDisplayed();
        await expect(isDisplayed).toBe(true, "One way selection did not work as expected");
        const roundTrip = await searchFlight.selectRoundTripChanges();
        await expect(roundTrip).toBe(true, "Round trip selection did not work as expected");
        await searchFlight.clearToField();
        await searchFlight.searchFlight(config.searchCases.roundTrip);
        await expect($(searchFlight.flightResults)).toBeExisting();
        await searchFlight.clickNewSearchButton();
        await searchFlight.clickSearchButton();
        await expect($(searchFlight.flightResults)).toBeExisting();

    });
 
  /**  it('should find loader iframe directly, extract params, and safely read content', async () => {
        await WallaToursPage.clearToField();
    
        await WallaToursPage.searchFlight({
            to: 'Athens',
            arrowDownCount: 3,
            nextMonthClicks: 1,
            departureDay: 12,
            returnDay: 19,
            submit: false
        });
    
        const searchButton = await $(WallaToursPage.submitSearchButton);
        await searchButton.waitForClickable({ timeout: 10000 });
        await searchButton.click();
    
        // ✅ Directly select the loader iframe (no loop)
        const loaderIframe = await $("//iframe[contains(@src, 'loading_search.aspx')]");
    
        await loaderIframe.waitForExist({ timeout: 7000 });
    
        const loaderSrc = await loaderIframe.getAttribute('src');
        if (!loaderSrc) {
            throw new Error('❌ Loader iframe src not found');
        }
    
        console.log('✅ Found loader iframe');
        console.log('🌐 SRC:', loaderSrc);
    
        // ✅ Parse URL query params
        const url = new URL(loaderSrc);
        const params = new URLSearchParams(url.search);
        const dport = params.get('dport');
        const aport = params.get('aport');
        const ddate = params.get('ddate');
        const rdate = params.get('rdate');
    
        console.log('🛫 FROM:', dport);
        console.log('🛬 TO:', aport);
        console.log('📅 DEPART:', ddate);
        console.log('📅 RETURN:', rdate);
    
        // ✅ Try reading iframe content (optional)
        try {
            await browser.switchFrame(loaderIframe);
            const text = await $('body').getText();
            console.log('📄 IFRAME TEXT:', text);
    
            if (!text.includes('Athens') && !text.includes('אתונה')) {
                console.warn('⚠️ Destination name not found in iframe text');
            }
    
            await browser.switchToParentFrame();
        } catch (err) {
            console.warn('❌ Could not read iframe content:', err.message);
        }
    });

*/
const flightTypeCombos = {
  regular: {
    filterType: 'regular',
    comboType: 'סדיר',
    requireMulti: false,
  },
  charter: {
    filterType: 'charter',
    comboType: 'שכר',
    requireMulti: false,
  },
  multiRegular: {
    filterType: 'regular',
    comboType: 'סדיר+סדיר',
    requireMulti: true,
  },
  multiCharter: {
    filterType: 'charter',
    comboType: 'שכר+שכר',
    requireMulti: true,
  },
  multiMixed: {
    filterType: 'mixed',
    comboType: 'שכר+סדיר',
    requireMulti: true,
  },
};

});

