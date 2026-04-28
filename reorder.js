const fs = require('fs');
const file = 'app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find boundaries
const collabStart = content.indexOf('      {/* Collaborations - three-column horizontal layout, one row */}');
const comingSoonStart = content.indexOf('      {/* Coming Soon - poster + embedded trailer + text layout */}');
const ourProdStart = content.indexOf('      {/* Our Productions - three-column grid layout with right column */}');
const inProgStart = content.indexOf('      {/* In Progress - horizontal layout like productions */}');
const footerStart = content.indexOf('      {/* Footer - from generalized component */}');

let beforeCollab = content.substring(0, collabStart);
let collabSection = content.substring(collabStart, comingSoonStart);
let comingSoonSection = content.substring(comingSoonStart, ourProdStart);
let ourProdSection = content.substring(ourProdStart, inProgStart);
let inProgSection = content.substring(inProgStart, footerStart);
let footerAndRest = content.substring(footerStart);

// Add conditional wrapping and update classes
collabSection = collabSection.replace('<section className="mb-12 bg-white">', '{collaborations.length > 0 && (\n        <section className="py-12 bg-white pt-12">');
collabSection = collabSection.replace('</section>\n', '</section>\n      )}\n');

ourProdSection = ourProdSection.replace('<section className="py-12 bg-white pt-12">', '{ourProductions.length > 0 && (\n        <section className="mb-12 bg-white pt-6">');
ourProdSection = ourProdSection.replace('</section>\n', '</section>\n      )}\n');

// Wrap "see all films" for Our Productions conditionally inside ourProdSection
ourProdSection = ourProdSection.replace(
  '{/* Right thin column */}\n            <Link href="/work?section=our-productions"', 
  '{/* Right thin column */}\n            {ourProductions.length >= 3 && (\n              <Link href="/work?section=our-productions"'
);
ourProdSection = ourProdSection.replace(
  '</div>\n              </div>\n            </Link>',
  '</div>\n                </div>\n              </Link>\n            )}'
);

inProgSection = inProgSection.replace('<section className="py-12 bg-slate-100">', '{inProgress.length > 0 && (\n        <section className="py-12 bg-slate-100">');
inProgSection = inProgSection.replace('</section>\n', '</section>\n      )}\n');

// Reassemble in the new order: Our Productions -> Coming Soon -> Collaborations -> In Progress
let newContent = beforeCollab + ourProdSection + comingSoonSection + collabSection + inProgSection + footerAndRest;

fs.writeFileSync(file, newContent, 'utf8');
console.log("Successfully reordered and wrapped sections.");
