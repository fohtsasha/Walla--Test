export default {
    // Inputs
fromField: '#tDLR1',
toField: '#tALR1',
 // Buttons
 toAirportChoice: 'font[contains(text(), "Tel Aviv, Israel, All Airports - TLV")]',
fromAirportChoice: 'font[contains(text(),"Paris, France ,All Airports - PAR")]',
 departDateButton: '//body[1]/div[12]/div[2]/table[1]/tbody[1]/tr[4]/td[3]/div[1]',
 returnDateButton: '//body[1]/div[13]/div[2]/table[1]/tbody[1]/tr[4]/td[5]',
 searchButton: '#FlightSubmit',

 //Icon
 flightTickets: '.fl-ticket-res',
 calendarIcon: '#flightDatepickerFL',

 //Functions
 fillCountry: async function(from,to) {

    //const dropdownOption = await $(this.fromAirportChoice);
   // await dropdownOption.waitForExist({ timeout: 5000 });
    //await fromAirportChoice.selectByVisibleText();
    //await fromAirportChoice.click();

    const fromField = await $(this.fromField);
    await fromField.setValue(from);
    const fromAirportChoice = await $(this.fromAirportChoice);
    await toAirportChoice.waitForDisplayed();
    await toAirportChoice.click();
    const toField = await $(this.toField);
    await toField.setValue(to);
    const toAirportChoice = await $(this.toAirportChoice);
    await this.toAirportChoice.waitForDisplayed();
    await this.toAirportChoice.click();
 },
selectDate: async function() {
    const calendarButton = await $(this.calendarIcon);
    await calendarButton.click();
    await browser.pause(1000);
    const departDateButton = await $(this.departDateButton);
    await departDateButton.waitForDisplayed();
    await departDateButton.click();
    await browser.pause(1000);
    const returnDateButton = await $(this.returnDateButton);
    await returnDateButton.waitForDisplayed();
    await returnDateButton.click();
    await browser.pause(1000);
},

} ; 