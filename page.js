export default {
    // Inputs
fromField: '#tDLR1',
toField: '#tALR1',
 // Buttons
 toAirportChoice: '//b[normalize-space()="Paris"]',
fromAirportChoice: '//body[1]/div[3]/div[2]/div[1]/div[1]/div[1]/ul[2]/li[2]/a[1]',
 departDateButton: '//body[1]/div[12]/div[2]/table[1]/tbody[1]/tr[4]/td[3]/div[1]',
 returnDateButton: '//body[1]/div[13]/div[2]/table[1]/tbody[1]/tr[4]/td[5]',
 searchButton: '#FlightSubmit',

 //Icon
 flightTickets: '.fl-ticket-res',
 calendarIcon: '#flightDatepickerFL',

 //Functions
 fillCountry: async function(to) {

    //const fromField = await $(this.fromField);
    //await fromField.setValue(from);
    //await fromField.setValue(from);
    await browser.pause(1000);
    //const fromAirportChoice = await $(this.fromAirportChoice);
    //fromAirportChoice.selectByVisibleText("Tel aviv, Israel ,All Airports - TLV");
    const toField = await $(this.toField);
    await toField.setValue(to);
    await browser.pause(1000);
    const toAirportChoice = await $(this.toAirportChoice);
    await browser.pause(3000);
    await toAirportChoice.waitForDisplayed();
    toAirportChoice.selectByVisibleText("France ,All Airports - PAR");
    //const toAirportChoice = await $(this.toAirportChoice);
    //await toAirportChoice.waitForDisplayed();
    await toAirportChoice.click();
    await browser.pause(3000);
 },
selectDate: async function() {
    const calendarButton = await $(this.calendarIcon);
    await calendarButton.click();
    await browser.pause(1000);
    const departDateButton = await $(this.departDateButton);
    await departDateButton.waitForDisplayed();
    await departDateButton.click();
    await departDateButton.click();
    await browser.pause(1000);
    //const returnDateButton = await $(this.returnDateButton);
    //await returnDateButton.waitForDisplayed();
    //await returnDateButton.click();
    //await browser.pause(1000);
},
clickSearchButton: async function () {
    const clickSearchButton = await $(this.searchButton);
    await clickSearchButton.click();
}
} ; 