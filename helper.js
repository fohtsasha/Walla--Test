module.exports = {

    checkElements: async function (elements, categoryName, checkClickability = false) {
        const missingElements = [];
        const nonClickableElements = [];
    
        for (const [name, input] of Object.entries(elements)) {
            let element;
    
            if (typeof input === 'string') {
                element = await $(input);
            } else if (typeof input === 'function') {
                element = await input();
            } else {
                element = await input;
            }
    
            if (!(await element.isDisplayed())) {
                missingElements.push(name);
            } else if (checkClickability && !(await element.isClickable())) {
                nonClickableElements.push(name);
            }
        }
    
        if (missingElements.length > 0) {
            throw new Error(`❌ Missing ${categoryName}: ${missingElements.join(', ')}`);
        }
    
        if (checkClickability && nonClickableElements.length > 0) {
            throw new Error(`❌ Not Clickable ${categoryName}: ${nonClickableElements.join(', ')}`);
        }
    
        console.log(`✅ All ${categoryName} elements are displayed${checkClickability ? ' and clickable' : ''}.`);
        return true;
    },

    async clickNextMonth(nextButtonSelector, times = 1) {
        for (let i = 0; i < times; i++) {
            const nextButton = await $(nextButtonSelector);
            await nextButton.waitForClickable({ timeout: 2000 });
            await nextButton.click();
            await browser.pause(300); // or add a wait for calendar change
        }
    },

    logAndValidateFilterCounts: async function (initial, filtered, restored, label) {
        console.log(`🧹 Filtered (${label}) count: ${filtered}`);
        console.log(`🔁 Restored count after ${label}: ${restored}`);
    
        expect(filtered).toBeLessThanOrEqual(initial);
        expect(filtered).toBeGreaterThan(0);
        expect(restored).toBeGreaterThanOrEqual(filtered);
        expect(restored).toBeGreaterThan(0);
    },

    safeClick: async (selector) => {
        const checkbox = await $(selector);
        await checkbox.waitForDisplayed({ timeout: 5000 });
        await browser.execute(el => el.scrollIntoView({ block: 'center' }), checkbox);
        try {
            await checkbox.click();
        } catch {
            await browser.execute(el => el.click(), checkbox);
        }
    },

    airlineTicketToFilter: {
        'EL AL': 'אלעל',
        'Israir': 'ישראייר',
        'Arkia': 'ארקיע',
        'Aegean': 'Aegean',
        'Air Canada': 'Air Canada',
        'Air Europa': 'Air Europa',
        'Air France': 'Air France',
        'Austrian': 'Austrian',
        'British Airways': 'British Airways',
        'Brussels Airlines': 'Brussels Airlines',
        'Bulgaria Air': 'Bulgaria Air',
        'EasyJet': 'EasyJet',
        'Emirates': 'Emirates',
        'Etihad Airways': 'Etihad Airways',
        'Fly Dubai': 'Fly Dubai',
        'ITA Airways': 'ITA Airways',
        'KLM': 'KLM',
        'LOT': 'LOT',
        'Lufthansa': 'Lufthansa',
        'Pegasus Airlines': 'Pegasus Airlines',
        'Swiss': 'SWISS',
        'TAROM': 'TAROM',
        'Turkish Airlines': 'Turkish Airlines',
        'Wizz Air': 'Wizz Air'
    },
    validateSelectedAirlines: async function (airlineMap, selectFn, validateFn) {
        for (const [expectedTicketName, filterLabelName] of Object.entries(airlineMap)) {
            console.log(`✈️ Testing airline filter: ${expectedTicketName} (${filterLabelName})`);
    
            await selectFn(filterLabelName);         // Click checkbox in filter
            await browser.pause(1000);
    
            await validateFn(expectedTicketName);     // Validate ticket airline text
    
            await selectFn(filterLabelName);         // Uncheck to restore
            await browser.pause(1000);
        }
    },
    
    
};
