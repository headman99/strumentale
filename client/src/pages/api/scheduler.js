const express = require('express');
const scrape_pages = require('./webcrawler')
const cors = require('cors');

const app = express();
const port = 4000; // Change to your desired port

app.use(cors());

app.get('/start', (req, res) => {
  // Start the script
  state.running = true
  runScript();
})

app.get('/stop', (req, res) => {
  if (state.running) {
    state.running = false;
    console.log('Stopping the script...');
    res.send('Script stopping...');
  } else {
    res.send('Script is already stopped.');
  }
});

app.listen(port, () => {
  console.log(`Web service listening on port ${port}`);
});

const state = {
  running: true
}
  
function runScript() {
    if (!state.running) {
      console.log('Script stopped.');
      return;
    }
  
    // Your long-running script code here
    console.log("Scraper launched")
    scrape_pages(req, res)
  
    // Check the flag periodically
    setTimeout(runScript, 30000); // 30 seconds
}