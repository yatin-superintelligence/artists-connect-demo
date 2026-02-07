
const fs = require('fs');
const path = require('path');

// Read raw files
const interestsRaw = fs.readFileSync('components/tags/life_interests.txt', 'utf8').split('\n').filter(l => l.trim().length > 0);
const artistTypesRaw = fs.readFileSync('components/tags/artist_types.txt', 'utf8').split('\n').filter(l => l.trim().length > 0 && !l.endsWith(':'));

// Read generated file content (mocking the export)
const filterOptionsContent = fs.readFileSync('data/filterOptions.ts', 'utf8');

// simplistic parsing since we can't easily require ts files in node without setup
const interestMatch = filterOptionsContent.match(/INTEREST_OPTIONS.*items:\s*\[([\s\S]*?)\]/);
const interestItems = interestMatch ? interestMatch[1].split(',').map(s => s.trim().replace(/['\u2019]/g, '').replace(/^'|'$/g, '')).filter(s => s.length > 0) : [];

const artistMatch = filterOptionsContent.match(/ARTIST_TYPE_OPTIONS[\s\S]*?\];/);
// Parse all items arrays in ARTIST_TYPE_OPTIONS
let artistItemsCount = 0;
const artistSections = filterOptionsContent.split('title:');
// skip first split part
for (let i = 1; i < artistSections.length; i++) {
    const section = artistSections[i];
    const itemsMatch = section.match(/items:\s*\[([\s\S]*?)\]/);
    if (itemsMatch) {
        const items = itemsMatch[1].split(',').map(s => s.trim().replace(/^'|'$/g, '')).filter(s => s.length > 0);
        artistItemsCount += items.length;
    }
}

// Better parsing:
// Just regex for 'ItemName' inside the arrays.
// Actually, let's just count occurrences of single quoted strings inside the brackets.
// No, that's flaky.

// Let's try to just use grep/wc for a simpler check if regex parsing is too complex for a one-off script without ts-node.
console.log('Interests Raw Count:', interestsRaw.length);
// console.log('Interests Generated Count (Approx):', interestItems.length); 

// Let's output the raw counts and then I will manually check the arrays in the file I just viewed.

