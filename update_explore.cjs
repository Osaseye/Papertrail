const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/public/ExplorePage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace Featured Cards
const oldFeatured = 'className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800"';
const newFeatured = 'onClick={() => navigate(\'/creator/1\')} className="cursor-pointer group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800"';
// Global replace
content = content.split(oldFeatured).join(newFeatured);

// Replace Trending Cards
const oldTrending = 'className="flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 gap-4 hover:border-primary transition-all"';
const newTrending = 'onClick={() => navigate(\'/creator/1\')} className="cursor-pointer flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 gap-4 hover:border-primary transition-all"';
// Global replace
content = content.split(oldTrending).join(newTrending);

fs.writeFileSync(filePath, content, 'utf8');
console.log('ExplorePage.jsx updated successfully');
