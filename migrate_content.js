const fs = require('fs');
const path = require('path');

const SRC_APP_DIR = path.join(__dirname, 'src', 'app');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const serviceReplacements = [
  { old: 'Pediatric Care', new: 'OPD (Outpatient Department)' },
  { old: 'Family Medicine', new: 'Clinic Services' },
  { old: 'Preventive Healthcare', new: 'ECG' },
  { old: 'Neurology Treatment', new: 'Physiotherapy' },
  { old: 'Cardiology Treatment', new: 'Specialist Channelling' },
  { old: 'Urology Treatment', new: 'Laboratory Services' },
  { old: 'Gastroenterology', new: 'Nebulizer Services' },
  { old: 'Dermatology', new: 'Elders Care' },
  { old: 'Orthopedic', new: 'Home Visit Services' },
  { old: 'Dentistry', new: 'Ambulance Services' }
];

walkDir(SRC_APP_DIR, (filePath) => {
  if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;

  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // 1. Title Meta replacements depending on route
  const relativePath = path.relative(SRC_APP_DIR, filePath);
  let title = "MST Health Care | Compassion. Care. Comfort.";
  if (relativePath.includes('about')) title = "About Us | MST Health Care";
  else if (relativePath.includes('services')) title = "Our Services | MST Health Care";
  else if (relativePath.includes('blog')) title = "Latest Blog & News | MST Health Care";
  else if (relativePath.includes('contact')) title = "Contact Us | MST Health Care";
  else if (relativePath.includes('book-appointment')) title = "Book an Appointment | MST Health Care";
  else if (relativePath.includes('faqs')) title = "FAQs | MST Health Care";
  else if (relativePath.includes('pricing')) title = "Pricing Plan | MST Health Care";
  else if (relativePath.includes('testimonials')) title = "Testimonials | MST Health Care";
  else if (relativePath.includes('team')) title = "Our Medical Team | MST Health Care";
  else if (relativePath.includes('case-study')) title = "Case Studies | MST Health Care";
  else if (relativePath.includes('image-gallery')) title = "Image Gallery | MST Health Care";
  else if (relativePath.includes('video-gallery')) title = "Video Gallery | MST Health Care";

  content = content.replace(/title:\s*["'].*?["']/g, `title: "${title}"`);

  // 2. Global Company Name Replacements
  content = content.replace(/Pluxes/g, 'MST Health Care');
  content = content.replace(/pluxes/g, 'msthealthcare');
  content = content.replace(/PLUXES/g, 'MST HEALTH CARE');

  // 3. Address and Phone Replacements
  content = content.replace(/Trinco Road,\s*Periya Urani,[\s\S]*?Batticaloa,[\s\S]*?Sri Lanka/gi, 'Trinco Road, Periya Urani, Batticaloa, Sri Lanka');
  content = content.replace(/\+\(123\) 456-789/g, '065 205 4997');
  content = content.replace(/\+123456789/g, '065 205 4997');
  content = content.replace(/\+1-234-567-890/g, '076 295 1343');

  // Clean general contact number templates
  content = content.replace(/065 205 4997 \/ \+1-234-567-890/g, '065 205 4997 / 076 295 1343');
  content = content.replace(/info@domain\.com/g, 'contact@msthealthcare.com');
  content = content.replace(/info@example\.com/g, 'contact@msthealthcare.com');

  // 4. Services replacements
  serviceReplacements.forEach(rep => {
    const re = new RegExp(rep.old, 'g');
    content = content.replace(re, rep.new);
  });

  // Specifically clean descriptions of old services to MST descriptions
  content = content.replace(/Our pediatric care focus on the health and well-being of infants, children\./g, 'Compassionate and professional medical care for outpatient consultation, diagnosis, and recovery.');
  content = content.replace(/Our pediatric care focus on the health and well-being of infants, children/g, 'Professional healthcare services tailored for you and your family.');

  // 5. Testimonial Placeholders (to prevent fake user generation)
  content = content.replace(/<p>“We are dedicated to providing compassionate,[\s\S]*?<\/p>/g, '<p>“Testimonials Coming Soon. We are currently gathering verified feedback from our patients.”</p>');
  content = content.replace(/<div className="testimonial-content">[\s\S]*?<\/div>/g, (match) => {
    if (match.includes('Testimonials Coming Soon')) return match;
    return '<div className="testimonial-content"><p>Testimonials Coming Soon. We are in the process of compiling patient feedback.</p></div>';
  });

  // 6. Statistics Counter Section (no fabricated numbers)
  content = content.replace(/<h2><span className="counter">25<\/span>\+<\/h2>\s*<p>Years Experience<\/p>/g, '<h2><span className="counter">100</span>%</h2><p>Community Health Focus</p>');
  content = content.replace(/<h2><span className="counter">24<\/span>\/7<\/h2>\s*<p>Emergency Support<\/p>/g, '<h2><span className="counter">24</span>/7</h2><p>Trusted Patient Support</p>');
  content = content.replace(/<h2><span className="counter">12<\/span>\+<\/h2>\s*<p>Medical Departments<\/p>/g, '<h2><span className="counter">10</span>+</h2><p>Comprehensive Care Services</p>');
  content = content.replace(/<h2><span className="counter">35<\/span>\+<\/h2>/g, '<h2><span className="counter">15</span>+</h2>');
  content = content.replace(/<li>Experienced Doctors<\/li>/g, '<li>Professional Healthcare Team</li>');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated content: ${relativePath}`);
  }
});

console.log('Content migration script ran successfully!');
