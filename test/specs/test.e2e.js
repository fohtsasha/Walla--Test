import page from '../../page'; 
describe('Searching for a flight', () => {
    it('Setting the from & to', async () => {
        await browser.url(`/`)
        //await page.fillCountry('Tel Aviv', 'Paris');    
        await page.selectDate();
       // await searchButton.click();
        //await expect($(page.flightTickets)).toBeExisting();
    })
});

