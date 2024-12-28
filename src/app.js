const express = require('express');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');


// Twitter login credentials
const username = 'Yshdp2002'; // Replace with your Twitter username
const password = 'Yashdeepisagoodcoder@1'; // Replace with your Twitter password

const app = express();
const port = 3000;

// Serve the HTML page
app.use(express.static('public'));



// Function to scrape Twitter's trending topics
async function getTrendingTopics() {
    const options = new chrome.Options();
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // Navigate to Twitter and log in
        await driver.get('https://twitter.com/login');
        await driver.findElement(By.name('session[username_or_email]')).sendKeys(username);
        await driver.findElement(By.name('session[password]')).sendKeys(password);
        await driver.findElement(By.css('div[data-testid="LoginForm_Login_Button"]')).click();

        // Wait for the homepage to load
        await driver.wait(until.urlContains('home'), 10000);

        // Get the top 5 trending topics from the "What’s Happening" section
        let trendingTopics = [];
        let elements = await driver.findElements(By.css('div[data-testid="trend"]'));
        for (let i = 0; i < 5; i++) {
            let topic = await elements[i].getText();
            trendingTopics.push(topic);
        }

        return trendingTopics;

    } finally {
        await driver.quit();
    }
}

// Endpoint to fetch the trending topics and send as response
app.get('/getTrendingTopics', async (req, res) => {
    try {
        const trendingTopics = await getTrendingTopics();
        res.json({ trendingTopics });
    } catch (error) {
        console.error('Error fetching trending topics:', error);
        res.status(500).json({ message: 'Failed to fetch trending topics' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
