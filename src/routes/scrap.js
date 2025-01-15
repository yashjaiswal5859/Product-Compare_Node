const express = require('express');
const router = express.Router();
const Product = require('../model/Product'); // Ensure the correct path
const axios = require('axios');
const cheerio = require('cheerio');
const { Mutex } = require('async-mutex');

const mutex = new Mutex();
let count=0;

// async function callPythonScraper(searchTerm) {
//     try {
//         const response = await axios.get('http://127.0.0.1:5000/scrape_Flipkart', {
//             params: {
//                 search_term: searchTerm
//             }
//         });
//         console.log('Scraped data:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error calling Python scraper:', error);
//         throw error;
//     }
// }


// Route to handle scraping requests
router.get('/scrape', async (req, res) => {
    
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    const amazonUrl = 'https://www.amazon.in/s?k='+url+'&page=';
    const amazonDivClass = '.s-card-container';
    // try {
    //  callPythonScraper(url);
    // }
    // catch {
    //     console.log('Error with python');
    // }
    try {
    
        const scrapeAmazonPromise = scrap(amazonUrl, amazonDivClass);
        const scrapedData = await scrapeAmazonPromise;
        return res.status(200).json({
            message: 'Scraping completed successfully',
            data: scrapedData,
        });
        
        // const [scrapedData] = await Promise.all([scrapeAmazonPromise]);

      
    } catch (error) {
      console.error('Error scraping data:', error);
      res.status(500).json({ error: 'Error scraping data' });
    }
  });
  


  
async function getData(url,divClass, data)
{
    console.log(url);
    // const data=[];
    try {
        let failure=true;
        let response;
        while(failure) {
            try {
            response = await axios.get(url, { timeout: 10000 });
            failure=false;
            }
            catch(err) {
            }
        }
        const $ = cheerio.load(response.data);
        const elements = $(divClass);
        if (elements.length === 0) {
            console.log(`No more elements found on page . Stopping.`);
            return false;
        }
        elements.each((i, elem) => {
            const price1 = $(elem).find('.a-price-whole').text().trim().replace('₹', '');
            if (price1) {
            const elementData = {
            source: 'Amazon',
            title: $(elem).find('h2 a span').text().trim(),
            url: 'https://www.amazon.in'+$(elem).find('h2 a').attr('href'),
            bought : $(elem).find('div.a-row.a-size-base > span.a-size-base.a-color-secondary').text().trim(),
            price: $(elem).find('.a-price-whole').text().trim().replace('₹', ''),
            original : $(elem).find('span.a-price.a-text-price span.a-offscreen').text().trim(),
            rating: $(elem).find('i.a-icon-star-small span.a-icon-alt').text().trim(),
            totalRaters: $(elem).find('.a-size-base.s-underline-text').text().trim(),
            image: $(elem).find('img.s-image').attr('src'),
            discount : $(elem).find('.a-row.a-size-base.a-color-base span').last().text().trim(),
            additionalOffer : $(elem).find('span.s-coupon-unclipped').text().trim(),
            id : 'A'+count,
            };
            data.push(elementData);
            count+=1;
        }
        });
        } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        }
    console.log(data.length);
    return true;
}
// Function to scrape data from a URL
async function scrap(url, divClass) {
    const data = [];
    let i = 1;
    while (true) {
        const success = await getData(url + i, divClass, data);
        if (success) {
            i++;
            // data.push(...data); // Accumulate data
        } else {
            break;
        }
        if(data.length > 100) {
            break;
        }
    }
    return data;
}


module.exports = router;
