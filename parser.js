// Final Parser using REGEX to detect the version
console.log("Hello, Node.js!");
// Install using npm
// For file systems
const fs = require('fs');
// For pdf processing
const pdfjs = require('pdfjs-dist'); 
//using express to create a server
const express = require('express');
const app = express();

// using express
app.use(express.json());

app.post('/process-pdf', async (req, res) => {
    const { filename } = req.body; //taking the file name from the request body as json
//go to the path of the pdf file
//add the name of the file taken from the request body
    const pdfPath = `C:\\Users\\elkari\\Desktop\\my-node-server\\pdfs\\${filename}`;
    console.log(`Filename ${filename}`);

    async function findDate(pdfPath) {
        const data = new Uint8Array(fs.readFileSync(pdfPath));
        const loadingTask = pdfjs.getDocument({ data: data });
        const pdfDocument = await loadingTask.promise;

        const extractedVersions = []; // for versions
        const extractedAdoptionDates = []; // for adoption dates

        for (let pageNumber = 1; pageNumber <= 2; pageNumber++) {
            const page = await pdfDocument.getPage(pageNumber);
            const content = await page.getTextContent();
            const text = content.items.map(item => item.str).join(' ');


    
       
        //Regex expression to find ' Adopted on 12 May 2022' PROBLEM: this doesnt match if no on is present
        //const pattern2 = /Adopted on (\d{1,2} [A-Za-z]+ \d{4})/g;
        //corrected version
        const pattern2 = /Adopted(?: on)? (\d{1,2} [A-Za-z]+ \d{4})/g;

    // Regex expression to find 'Version 2.1 26 February 2020 '
            const versionPattern = /Version\s+\d+(\.\d+)?\s+\d+\s+[A-Za-z]+\s+\d{4}/g;
            let versionMatch;
            while ((versionMatch = versionPattern.exec(text)) !== null) {
                extractedVersions.push(versionMatch[0]); // Store matched version 
            }
 //Regex expression to find ' Adopted on 12 May 2022' PROBLEM: this doesnt match if no on is present
        //const pattern2 = /Adopted on (\d{1,2} [A-Za-z]+ \d{4})/g;
        //corrected version
            const datePattern = /Adopted(?: on)? (\d{1,2} [A-Za-z]+ \d{4})/g;
            let dateMatch;
            while ((dateMatch = datePattern.exec(text)) !== null) {
                extractedAdoptionDates.push(dateMatch[1]); // Store matched date 
            }
        }

        return {
            versionInfo: extractedVersions,
            adoptionDates: extractedAdoptionDates
        };
    }
        const extractionResults = await findDate(pdfPath);
        res.json(extractionResults);
    
});
//listen to server
app.listen(5000, () => {
    console.log(`Server is running`);
});