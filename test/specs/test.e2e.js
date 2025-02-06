import page from '../../page'; 
describe('Searching for a flight', () => {
    it('Results page appears', async () => {
        await browser.url(`/`)
        await page.fillCountry('paris');  
        await browser.pause(1000);  
        await page.selectDate();
        await browser.pause(1000);
        await page.clickSearchButton();
        await browser.pause(3000);
        await expect($(page.flightTickets)).toBeExisting();
    })
});

