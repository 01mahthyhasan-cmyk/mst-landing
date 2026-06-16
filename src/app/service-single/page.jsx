'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

/* ─────────────────────────────────────────────────────────────────────────────
   SERVICE DATA – one entry per service
   ───────────────────────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: 'opd',
    name: 'OPD (Outpatient Department)',
    icon: 'fa-solid fa-stethoscope',
    image: '/images/service-single-image.jpg',
    tagline: 'Comprehensive outpatient care for all ages',
    desc1: `Our Outpatient Department (OPD) provides comprehensive medical consultations and diagnostic support for patients of all ages. Our experienced doctors conduct thorough examinations, accurate diagnoses, and personalised treatment plans — all without requiring hospital admission.`,
    desc2: `We handle a wide range of acute and chronic conditions, ensuring every patient receives the attention and care they deserve in a comfortable and safe clinic environment.`,
    whyTitle: 'Why choose our OPD services',
    whyDesc: 'Our OPD combines expert medical professionals with modern diagnostic tools to deliver efficient, patient-centred care. Walk-in and scheduled appointments are both welcome.',
    whyImg1: '/images/service-why-choose-item-image-1.jpg',
    whyImg2: '/images/service-why-choose-item-image-2.jpg',
    whyPoint1: 'Experienced General Practitioners',
    whyPoint2: 'Short Waiting Times & Accurate Diagnosis',
    process: [
      { step: '01', title: 'Registration', desc: 'Quick and easy patient registration at the front desk or online.' },
      { step: '02', title: 'Consultation', desc: 'Meet with a qualified doctor for a detailed physical examination.' },
      { step: '03', title: 'Diagnosis & Prescription', desc: 'Receive a personalised diagnosis, prescription and treatment plan.' },
    ],
    benefits: ['Individuals of All Age Groups', 'General Health Patients', 'Preventive Care Seekers', 'Chronic Condition Management'],
    benefitImg: '/images/service-benefits-video-image.jpg',
    faqs: [
      { q: 'Do I need an appointment for OPD?', a: 'Walk-ins are welcome, but booking an appointment helps reduce your waiting time significantly.' },
      { q: 'What does an OPD consultation include?', a: 'A full medical history review, physical examination, diagnosis, and prescription if required.' },
      { q: 'Are follow-up visits included?', a: 'Follow-up consultations for the same condition are offered at a reduced fee within 7 days.' },
      { q: 'Can children visit the OPD?', a: 'Yes, our OPD caters to patients of all ages, including infants, children and the elderly.' },
      { q: 'What are your OPD hours?', a: 'Everyday: 6:30 AM – 8:00 PM.' },
    ],
  },
  {
    id: 'clinic',
    name: 'Clinic Services',
    icon: 'fa-solid fa-hospital',
    image: '/images/service-single-image.jpg',
    tagline: 'Holistic clinical care under one roof',
    desc1: `Clinic Services at MST Health Care provide a broad spectrum of clinical examinations and treatments for everyday health conditions. From general wellness checks to targeted clinical procedures, our qualified team ensures thorough and compassionate care.`,
    desc2: `Our approach goes beyond treating symptoms. We emphasise preventive care, early detection, and patient education to help individuals make informed decisions about their long-term health.`,
    whyTitle: 'Why choose our clinic services',
    whyDesc: 'Choosing the right healthcare provider is essential for long-term well-being. Our clinic services are built on trust, experience, and personalised care tailored to your unique needs.',
    whyImg1: '/images/service-why-choose-item-image-1.jpg',
    whyImg2: '/images/service-why-choose-item-image-2.jpg',
    whyPoint1: 'Modern Medical Facilities & Technology',
    whyPoint2: 'Compassionate & Experienced Clinical Staff',
    process: [
      { step: '01', title: 'Check-In', desc: 'Register and share your health concerns with our friendly front-desk team.' },
      { step: '02', title: 'Examination', desc: 'Our clinicians conduct a thorough clinical examination tailored to your needs.' },
      { step: '03', title: 'Treatment & Follow-Up', desc: 'Receive a treatment plan and schedule follow-up visits as needed.' },
    ],
    benefits: ['Patients Seeking General Treatment', 'Post-Hospitalisation Recovery', 'Chronic Disease Management', 'Health Monitoring Patients'],
    benefitImg: '/images/service-benefits-video-image.jpg',
    faqs: [
      { q: 'What conditions do clinic services cover?', a: 'We cover a wide range including fever, infections, wound care, chronic disease management, and general health checks.' },
      { q: 'Do I need a referral to access clinic services?', a: 'No referral is required for most clinic services. Simply walk in or book an appointment.' },
      { q: 'Is the clinic equipped for minor procedures?', a: 'Yes, we are equipped for minor clinical procedures such as wound dressing, injections, and IV therapy.' },
      { q: 'How long does a clinic visit typically take?', a: 'Most clinic visits take between 20–40 minutes depending on the nature of your condition.' },
      { q: 'Is there a separate area for children?', a: 'Yes, we have a dedicated paediatric zone to ensure a comfortable experience for children.' },
    ],
  },
  {
    id: 'ecg',
    name: 'ECG Monitoring',
    icon: 'fa-solid fa-heart-pulse',
    image: '/images/service-single-image.jpg',
    tagline: 'Precise cardiac monitoring for your heart health',
    desc1: `Electrocardiogram (ECG) Monitoring at MST Health Care provides a fast and non-invasive way to assess your heart's electrical activity. Our modern ECG equipment accurately detects irregularities such as arrhythmias, ischemia, and other cardiac conditions.`,
    desc2: `Early detection of cardiac conditions is life-saving. Whether you experience chest pain, palpitations, or shortness of breath, our skilled technicians and physicians ensure a prompt and accurate evaluation.`,
    whyTitle: 'Why choose our ECG services',
    whyDesc: 'Our ECG monitoring is carried out using hospital-grade equipment operated by trained technicians under doctor supervision, providing reliable and immediate results.',
    whyImg1: '/images/service-why-choose-item-image-1.jpg',
    whyImg2: '/images/service-why-choose-item-image-2.jpg',
    whyPoint1: 'Hospital-Grade ECG Equipment',
    whyPoint2: 'Immediate Results with Doctor Interpretation',
    process: [
      { step: '01', title: 'Preparation', desc: 'A brief preparation where our technician explains the procedure and positions electrodes.' },
      { step: '02', title: 'Recording', desc: 'A painless 12-lead ECG recording is completed in under 10 minutes.' },
      { step: '03', title: 'Interpretation & Report', desc: 'A doctor reviews the trace and provides a detailed written report.' },
    ],
    benefits: ['Patients with Chest Pain or Palpitations', 'Individuals with Family Cardiac History', 'Pre-Surgery Cardiac Assessment', 'Routine Heart Health Screening'],
    benefitImg: '/images/service-benefits-video-image.jpg',
    faqs: [
      { q: 'Is an ECG painful?', a: 'No. An ECG is entirely painless. Small electrode patches are placed on the skin to record electrical signals.' },
      { q: 'How long does an ECG take?', a: 'The actual recording takes about 5–10 minutes. With preparation and report, expect around 20–30 minutes.' },
      { q: 'Do I need to fast before an ECG?', a: 'No fasting is required before a standard ECG.' },
      { q: 'What conditions can an ECG detect?', a: 'ECG can detect arrhythmias, heart attacks, heart enlargement, and electrical conduction problems.' },
      { q: 'When will I receive my ECG report?', a: 'In most cases, your report is ready on the same day and interpreted by our doctor.' },
    ],
  },
  {
    id: 'physiotherapy',
    name: 'Physiotherapy',
    icon: 'fa-solid fa-person-walking',
    image: '/images/service-single-image.jpg',
    tagline: 'Restore movement, relieve pain, regain life',
    desc1: `Our Physiotherapy department offers professional therapeutic services to restore movement, manage physical pain, and support recovery from injuries, surgeries, and neurological conditions. Our certified physiotherapists design personalised rehabilitation programmes for every patient.`,
    desc2: `From sports injuries to post-stroke rehabilitation, we utilise evidence-based techniques including manual therapy, electrotherapy, and guided exercise to achieve the best possible outcomes for each individual.`,
    whyTitle: 'Why choose our physiotherapy services',
    whyDesc: 'Our physiotherapists hold recognised qualifications and use the latest rehabilitation technologies. We focus on restoring your functional independence and improving quality of life.',
    whyImg1: '/images/service-why-choose-item-image-1.jpg',
    whyImg2: '/images/service-why-choose-item-image-2.jpg',
    whyPoint1: 'Certified & Experienced Physiotherapists',
    whyPoint2: 'Evidence-Based Rehabilitation Techniques',
    process: [
      { step: '01', title: 'Assessment', desc: 'A comprehensive physical assessment to understand your condition and functional limitations.' },
      { step: '02', title: 'Treatment Plan', desc: 'A personalised rehabilitation plan using manual therapy, exercises and electrotherapy.' },
      { step: '03', title: 'Progress & Discharge', desc: 'Regular progress reviews with goal-setting until full recovery is achieved.' },
    ],
    benefits: ['Sports Injury Patients', 'Post-Surgery Rehabilitation', 'Chronic Pain Sufferers', 'Neurological & Stroke Patients'],
    benefitImg: '/images/service-benefits-video-image.jpg',
    faqs: [
      { q: 'Do I need a doctor\'s referral for physiotherapy?', a: 'You can visit our physiotherapy department directly without a referral in most cases.' },
      { q: 'How many sessions will I need?', a: 'The number of sessions varies by condition. Your physiotherapist will provide a clear treatment timeline after assessment.' },
      { q: 'Is physiotherapy painful?', a: 'Some techniques may cause mild discomfort, but our therapists work within your comfort level at all times.' },
      { q: 'What equipment do you use?', a: 'We use ultrasound therapy, TENS machines, traction units, exercise equipment, and manual therapy tools.' },
      { q: 'Can elderly patients receive physiotherapy?', a: 'Absolutely. We offer specialised geriatric physiotherapy programmes for senior patients.' },
    ],
  },
  {
    id: 'specialist',
    name: 'Specialist Channelling',
    icon: 'fa-solid fa-user-doctor',
    image: '/images/service-single-image.jpg',
    tagline: 'Access top specialists — all in one place',
    desc1: `MST Health Care offers Specialist Channelling services that connect patients with qualified specialist doctors across multiple disciplines. Whether you need a cardiologist, neurologist, orthopaedic surgeon, or gynaecologist, we facilitate prompt appointments with leading specialists.`,
    desc2: `Our channelling service eliminates the hassle of long waiting times and navigating multiple hospitals. We coordinate your specialist appointments, ensuring continuity of care and seamless communication between our general practitioners and specialists.`,
    whyTitle: 'Why choose our specialist channelling',
    whyDesc: 'We maintain a panel of experienced, board-certified specialists from leading hospitals. Our coordination team ensures your appointments are confirmed quickly and your medical records are prepared in advance.',
    whyImg1: '/images/service-why-choose-item-image-1.jpg',
    whyImg2: '/images/service-why-choose-item-image-2.jpg',
    whyPoint1: 'Board-Certified Specialists Across Disciplines',
    whyPoint2: 'Seamless Appointment Coordination & Records Transfer',
    process: [
      { step: '01', title: 'Referral or Request', desc: 'A GP referral or direct specialist request is raised at our front desk.' },
      { step: '02', title: 'Appointment Booking', desc: 'Our team confirms the earliest available slot with your chosen specialist.' },
      { step: '03', title: 'Consultation & Follow-up', desc: 'Attend your specialist visit with full medical history prepared. Follow-up care is coordinated back with us.' },
    ],
    benefits: ['Patients Requiring Specialist Opinion', 'Complex & Rare Medical Conditions', 'Second Opinion Seekers', 'Pre-Surgical Specialist Review'],
    benefitImg: '/images/service-benefits-video-image.jpg',
    faqs: [
      { q: 'Which specialist disciplines do you channel?', a: 'We channel specialists in cardiology, neurology, orthopaedics, gynaecology, paediatrics, ENT, dermatology, and more.' },
      { q: 'How quickly can I get a specialist appointment?', a: 'Routine appointments are typically available within 2–5 days. Urgent cases are prioritised.' },
      { q: 'Will my GP be informed of the specialist findings?', a: 'Yes, specialist reports are shared with your treating GP to ensure coordinated care.' },
      { q: 'Can I choose my preferred specialist?', a: 'Yes, patients may request a specific specialist or seek guidance from our team for the most suitable option.' },
      { q: 'Is channelling available for out-of-town specialists?', a: 'We coordinate with specialists from major hospitals in the region and can arrange telemedicine consultations when needed.' },
    ],
  },
  {
    id: 'laboratory',
    name: 'Laboratory Services',
    icon: 'fa-solid fa-flask',
    image: '/images/service-single-image.jpg',
    tagline: 'Accurate diagnostics for informed healthcare decisions',
    desc1: `MST Health Care's Laboratory Services offer a comprehensive range of diagnostic tests including blood work, urinalysis, microbiological cultures, and biochemical panels. Our state-of-the-art laboratory delivers fast, precise results that physicians rely on for accurate diagnoses.`,
    desc2: `Our laboratory adheres to strict quality control standards, ensuring every test result is reliable. Patients can access their results digitally or collect them directly from our centre, with doctor interpretation available on request.`,
    whyTitle: 'Why choose our laboratory services',
    whyDesc: 'Our certified laboratory technicians operate advanced analysers that deliver results with high accuracy and fast turnaround. Quality assurance protocols are rigorously maintained.',
    whyImg1: '/images/service-why-choose-item-image-1.jpg',
    whyImg2: '/images/service-why-choose-item-image-2.jpg',
    whyPoint1: 'State-of-the-Art Diagnostic Analysers',
    whyPoint2: 'Fast Turnaround & Reliable Accuracy',
    process: [
      { step: '01', title: 'Test Request', desc: 'Receive a lab request from your doctor or request a standard health panel directly.' },
      { step: '02', title: 'Sample Collection', desc: 'Samples are collected by trained phlebotomists in a hygienic, patient-friendly environment.' },
      { step: '03', title: 'Results & Interpretation', desc: 'Results are ready within the agreed timeframe and can be reviewed with a doctor.' },
    ],
    benefits: ['Routine Health Screening', 'Disease Diagnosis & Monitoring', 'Pre-Surgery Investigations', 'Pregnancy & Hormonal Panels'],
    benefitImg: '/images/service-benefits-video-image.jpg',
    faqs: [
      { q: 'Do I need to fast before a blood test?', a: 'Fasting is required for tests like blood glucose and lipid profiles (8–12 hours). Your doctor will advise you.' },
      { q: 'How long do results take?', a: 'Most routine tests are available within 4–8 hours. Some specialised tests may take 24–48 hours.' },
      { q: 'Can I get my results online?', a: 'Yes, we provide digital reports that can be accessed or emailed to you directly.' },
      { q: 'Is sample collection available at home?', a: 'We offer home sample collection as part of our Home Visit Services. Contact us to arrange this.' },
      { q: 'What tests are available?', a: 'We offer FBC, LFT, RFT, lipid profiles, thyroid function, HbA1c, cultures, urine analysis, and many more.' },
    ],
  },
  {
    id: 'nebulizer',
    name: 'Nebulizer Services',
    icon: 'fa-solid fa-lungs',
    image: '/images/service-single-image.jpg',
    tagline: 'Effective respiratory relief when you need it most',
    desc1: `Our Nebulizer Services provide immediate respiratory relief for patients suffering from asthma, bronchitis, COPD, and other respiratory conditions. Nebulization delivers medication directly into the airways for fast and effective symptom relief.`,
    desc2: `Our clinic is equipped with medical-grade nebulizers and stocked with bronchodilators and corticosteroids prescribed by our doctors. Patients experiencing breathing difficulties can receive prompt treatment in a monitored clinical environment.`,
    whyTitle: 'Why choose our nebulizer services',
    whyDesc: 'Our nebulizer treatments are administered under direct medical supervision, ensuring the right medication dosage and monitoring your oxygen saturation and respiratory response throughout.',
    whyImg1: '/images/service-why-choose-item-image-1.jpg',
    whyImg2: '/images/service-why-choose-item-image-2.jpg',
    whyPoint1: 'Medical-Grade Nebulizers & Medications',
    whyPoint2: 'Supervised Treatment with Oxygen Monitoring',
    process: [
      { step: '01', title: 'Assessment', desc: 'A doctor assesses your breathing, oxygen levels, and respiratory symptoms.' },
      { step: '02', title: 'Nebulization', desc: 'Prescribed bronchodilator medication is administered via nebulizer over 10–15 minutes.' },
      { step: '03', title: 'Post-Treatment Review', desc: 'Oxygen saturation and symptom response are reviewed before discharge with home care advice.' },
    ],
    benefits: ['Asthma Patients', 'COPD & Bronchitis Sufferers', 'Paediatric Respiratory Cases', 'Acute Breathing Difficulty'],
    benefitImg: '/images/service-benefits-video-image.jpg',
    faqs: [
      { q: 'What is nebulization?', a: 'Nebulization converts liquid medication into a fine mist inhaled directly into the lungs for fast-acting relief.' },
      { q: 'Is nebulization safe for children?', a: 'Yes, nebulization is commonly used and safe for children. We use paediatric-appropriate masks and dosages.' },
      { q: 'How long does a nebulizer session take?', a: 'A typical session lasts 10–15 minutes, followed by a short observation period.' },
      { q: 'Do I need a prescription?', a: 'Our doctor will assess your condition and prescribe the appropriate nebulizer medication during your visit.' },
      { q: 'Can I bring my own nebulizer?', a: 'Yes, if your doctor has prescribed a specific medication, you may bring your own device for self-administration in our facility.' },
    ],
  },
  {
    id: 'elders',
    name: 'Elders Care',
    icon: 'fa-solid fa-hand-holding-heart',
    image: '/images/service-single-image.jpg',
    tagline: 'Dignified, compassionate care for our senior citizens',
    desc1: `MST Health Care's Elders Care programme is specially designed to support the health, dignity, and well-being of senior citizens. Our geriatric care team provides comprehensive health monitoring, chronic disease management, and daily assistance tailored to the unique needs of elderly patients.`,
    desc2: `We understand that older adults often face multiple health challenges simultaneously. Our holistic approach addresses physical health, medication management, cognitive monitoring, and emotional well-being — ensuring seniors enjoy a healthy and fulfilling life.`,
    whyTitle: 'Why choose our elders care services',
    whyDesc: 'Our elders care team includes experienced geriatricians, nurses, and physiotherapists who are specially trained to manage the complex healthcare needs of older adults with empathy and professionalism.',
    whyImg1: '/images/service-why-choose-item-image-1.jpg',
    whyImg2: '/images/service-why-choose-item-image-2.jpg',
    whyPoint1: 'Specialised Geriatric Care Team',
    whyPoint2: 'Holistic Health & Emotional Well-Being Support',
    process: [
      { step: '01', title: 'Geriatric Assessment', desc: 'A comprehensive health and functional assessment tailored to the elderly patient\'s needs.' },
      { step: '02', title: 'Personalised Care Plan', desc: 'A custom care plan covering medication, nutrition, mobility, and follow-up schedules.' },
      { step: '03', title: 'Ongoing Monitoring', desc: 'Regular health checks, medication reviews, and family communication to ensure continued well-being.' },
    ],
    benefits: ['Senior Citizens (60+)', 'Patients with Multiple Chronic Conditions', 'Post-Hospitalisation Recovery', 'Families Seeking Assisted Care'],
    benefitImg: '/images/service-benefits-video-image.jpg',
    faqs: [
      { q: 'What age qualifies for elders care services?', a: 'Our elders care programme is designed for individuals aged 60 and above, though younger patients with age-related conditions may also be eligible.' },
      { q: 'Can family members be involved in the care plan?', a: 'Absolutely. We encourage family involvement and provide regular updates to designated family members.' },
      { q: 'Do you offer home-based elder care?', a: 'Yes, our Home Visit Services include dedicated elder care visits for mobility-challenged seniors.' },
      { q: 'What chronic conditions do you manage for elderly patients?', a: 'We manage hypertension, diabetes, arthritis, COPD, heart conditions, cognitive decline, and more.' },
      { q: 'Is memory care (dementia support) available?', a: 'We offer baseline cognitive assessments and can coordinate referrals to specialist memory care services as needed.' },
    ],
  },
  {
    id: 'homevisit',
    name: 'Home Visit Services',
    icon: 'fa-solid fa-house-medical',
    image: '/images/service-single-image.jpg',
    tagline: 'Quality healthcare delivered to your doorstep',
    desc1: `MST Health Care's Home Visit Services bring professional medical care directly to patients in the comfort of their homes. Ideal for individuals who are homebound, elderly, post-operative, or simply prefer the convenience of in-home healthcare, our doctors and nurses travel to you.`,
    desc2: `Our home visit team is equipped to conduct clinical examinations, administer medications, collect lab samples, perform wound care, and provide health monitoring. Comprehensive care — without leaving home.`,
    whyTitle: 'Why choose our home visit services',
    whyDesc: 'Our home visit team is highly experienced in managing patients in home settings, equipped with portable medical devices and medicines to ensure the same standard of care as our clinic.',
    whyImg1: '/images/service-why-choose-item-image-1.jpg',
    whyImg2: '/images/service-why-choose-item-image-2.jpg',
    whyPoint1: 'Experienced Doctors & Nurses Who Come to You',
    whyPoint2: 'Portable Medical Equipment & Lab Sample Collection',
    process: [
      { step: '01', title: 'Booking', desc: 'Call or WhatsApp our team to schedule a home visit at a time that suits you.' },
      { step: '02', title: 'Visit & Examination', desc: 'Our doctor or nurse arrives at your home and conducts a thorough clinical assessment.' },
      { step: '03', title: 'Treatment & Plan', desc: 'Treatment is administered on-site and a follow-up care plan is shared with the patient and family.' },
    ],
    benefits: ['Elderly & Homebound Patients', 'Post-Surgery Recovery at Home', 'Paediatric Home Visits', 'Chronic Disease Monitoring'],
    benefitImg: '/images/service-benefits-video-image.jpg',
    faqs: [
      { q: 'How do I book a home visit?', a: 'Call our clinic or send a WhatsApp message. Our team will confirm a convenient time slot within your area.' },
      { q: 'What medical services can be done at home?', a: 'Consultations, IV drips, wound dressing, injections, blood pressure monitoring, ECG, and lab sample collection are all available.' },
      { q: 'How soon can I get a home visit?', a: 'Same-day and next-day home visits are available based on our team\'s schedule and your location.' },
      { q: 'Is there an additional charge for home visits?', a: 'Yes, a nominal home visit fee applies. Contact us for current rates in your area.' },
      { q: 'What areas do you cover?', a: 'We currently serve Batticaloa and surrounding areas. Contact us to confirm coverage in your location.' },
    ],
  },
  {
    id: 'ambulance',
    name: 'Ambulance Services',
    icon: 'fa-solid fa-truck-medical',
    image: '/images/service-single-image.jpg',
    tagline: '24/7 emergency transport & pre-hospital care',
    desc1: `MST Health Care provides reliable Ambulance Services for emergency medical transport and non-emergency patient transfers. Our well-equipped ambulances are staffed by trained paramedics to deliver pre-hospital care during transport to hospital or our clinic.`,
    desc2: `Time is critical in medical emergencies. Our ambulance team responds swiftly, providing life-saving interventions en route and ensuring patients arrive at the hospital in the most stable condition possible.`,
    whyTitle: 'Why choose our ambulance services',
    whyDesc: 'Our ambulances are equipped with advanced life-support equipment and staffed by trained emergency medical technicians available around the clock for your peace of mind.',
    whyImg1: '/images/service-why-choose-item-image-1.jpg',
    whyImg2: '/images/service-why-choose-item-image-2.jpg',
    whyPoint1: 'Advanced Life-Support Equipment On Board',
    whyPoint2: '24/7 Availability with Rapid Response Times',
    process: [
      { step: '01', title: 'Emergency Call', desc: 'Call our emergency line and provide the patient\'s location and condition.' },
      { step: '02', title: 'Rapid Dispatch', desc: 'Our nearest available ambulance is dispatched immediately with trained paramedics.' },
      { step: '03', title: 'Pre-Hospital Care & Transfer', desc: 'Paramedics provide stabilising care en route and safely transfer the patient to the appropriate facility.' },
    ],
    benefits: ['Medical Emergency Cases', 'Patient Transfers Between Facilities', 'Post-Discharge Hospital-to-Home Transport', 'Event Medical Standby'],
    benefitImg: '/images/service-benefits-video-image.jpg',
    faqs: [
      { q: 'Is your ambulance service available 24/7?', a: 'Yes, our ambulance service operates 24 hours a day, 7 days a week, including public holidays.' },
      { q: 'What equipment is in the ambulance?', a: 'Our ambulances carry oxygen, defibrillators, ECG monitors, IV supplies, and essential medications.' },
      { q: 'Can I request a non-emergency ambulance transfer?', a: 'Yes, we provide non-emergency patient transport for hospital transfers and post-discharge returns home.' },
      { q: 'How quickly can you respond?', a: 'Response times vary by location, but our goal is to dispatch within minutes of receiving your call.' },
      { q: 'What is the cost of ambulance services?', a: 'Costs depend on the type of transfer and distance. Contact us for specific pricing information.' },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */
function ServiceSingleContent() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service') || 'opd';
  const [activeId, setActiveId] = useState(
    SERVICES.find((s) => s.id === initialService) ? initialService : 'opd'
  );

  // Sync with URL param if it changes (e.g. back/forward nav)
  useEffect(() => {
    const param = searchParams.get('service');
    if (param && SERVICES.find((s) => s.id === param)) {
      setActiveId(param);
    }
  }, [searchParams]);

  const svc = SERVICES.find((s) => s.id === activeId);

  return (
    <>
      {/* Page Header */}
      <div className="page-header dark-section parallaxie">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-3" data-cursor="-opaque">
                  {svc.name}
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link href="/services">Services</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{svc.name}</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-service-single">
        <div className="container">
          <div className="row">

            {/* ── SIDEBAR ── */}
            <div className="col-lg-4">
              <div className="page-single-sidebar">

                {/* Service Nav */}
                <div className="page-category-list wow fadeInUp">
                  <h2 className="page-category-list-title">Discover Our Services</h2>
                  <ul>
                    {SERVICES.map((s) => (
                      <li key={s.id} className={activeId === s.id ? 'active' : ''}>
                        <Link
                          href={`/service-single?service=${s.id}`}
                          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          style={activeId === s.id ? { fontWeight: 700, color: 'var(--primary-color, #0d6efd)' } : {}}
                        >
                          <i className={`${s.icon} me-2`} style={{ width: 18 }} />
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Box */}
                <div className="sidebar-cta-box dark-section wow fadeInUp" data-wow-delay="0.25s">
                  <div className="sidebar-cta-header">
                    <div className="icon-box">
                      <i className="fa-regular fa-clock"></i>
                    </div>
                    <div className="sidebar-cta-title">
                      <h2>Schedule a visit:</h2>
                    </div>
                  </div>
                  <div className="sidebar-cta-body">
                    <div className="sidebar-cta-list">
                      <ul>
                        <li><span>Everyday:</span>6:30 AM – 8:00 PM</li>
                      </ul>
                    </div>
                    <div className="sidebar-cta-btn">
                      <a href="/book-appointment" className="btn-default btn-highlighted">
                        Book An Appointment
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="col-lg-8">
              <div className="service-single-content">

                {/* Hero Image */}
                <div className="page-single-image">
                  <figure className="image-anime reveal">
                    <img src={svc.image} alt={svc.name} />
                  </figure>
                </div>

                {/* Entry Text */}
                <div className="service-entry">
                  <p className="wow fadeInUp">{svc.desc1}</p>
                  <p className="wow fadeInUp" data-wow-delay="0.2s">{svc.desc2}</p>

                  {/* Why Choose */}
                  <div className="service-why-choose-box">
                    <h2 className="text-anime-style-3">{svc.whyTitle}</h2>
                    <p className="wow fadeInUp">{svc.whyDesc}</p>

                    <div className="service-why-choose-item-list">
                      <div className="service-why-choose-item wow fadeInUp" data-wow-delay="0.2s">
                        <div className="service-why-choose-item-image">
                          <figure className="image-anime">
                            <img src={svc.whyImg1} alt="" />
                          </figure>
                        </div>
                        <div className="service-why-choose-item-content">
                          <h3>{svc.whyPoint1}</h3>
                          <p>We invest in the best equipment and expertise to ensure you receive care that meets the highest clinical standards.</p>
                        </div>
                      </div>

                      <div className="service-why-choose-item wow fadeInUp" data-wow-delay="0.4s">
                        <div className="service-why-choose-item-image">
                          <figure className="image-anime">
                            <img src={svc.whyImg2} alt="" />
                          </figure>
                        </div>
                        <div className="service-why-choose-item-content">
                          <h3>{svc.whyPoint2}</h3>
                          <p>Patient comfort and outcome are at the heart of everything we do — delivering results you can trust.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Process */}
                  <div className="service-process-box">
                    <h2 className="text-anime-style-3">{svc.name} process</h2>
                    <p className="wow fadeInUp">Our structured care process is designed to make your experience smooth, transparent, and effective from start to finish.</p>

                    <div className="service-process-item-list">
                      {svc.process.map((p, i) => (
                        <div key={i} className="service-process-item wow fadeInUp" data-wow-delay={`${0.2 * (i + 1)}s`}>
                          <div className="service-process-item-number">
                            <h3>{p.step}</h3>
                          </div>
                          <div className="service-process-item-content">
                            <h3>{p.title}</h3>
                            <p>{p.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="section-footer-text wow fadeInUp" data-wow-delay="0.8s">
                      <ul>
                        <li className="section-footer-content">Trusted By <b>5,000+</b> Patients</li>
                        <li>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </li>
                        <li><span className="counter">4.9</span>/5</li>
                      </ul>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="service-benefits-box">
                    <h2 className="text-anime-style-3">Who can benefit</h2>
                    <p className="wow fadeInUp">This service is designed to support a wide range of patients. Below are the primary groups who benefit most.</p>

                    <div className="service-benefits-video-image-box wow fadeInUp" data-wow-delay="0.2s">
                      <div className="service-benefits-video-image">
                        <figure>
                          <img src={svc.benefitImg} alt="" />
                        </figure>
                      </div>
                      <div className="video-play-button">
                        <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" className="popup-video" data-cursor-text="Play">
                          <span className="bg-effect"><i className="fa-solid fa-play"></i></span>
                        </a>
                      </div>
                      <div className="service-benefits-list">
                        <ul>
                          {svc.benefits.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div className="page-single-faqs">
                  <div className="section-title">
                    <h2 className="text-anime-style-3">Frequently Asked Questions</h2>
                  </div>

                  <div className="faq-accordion" id={`accordion-${activeId}`}>
                    {svc.faqs.map((faq, i) => (
                      <div key={i} className="accordion-item wow fadeInUp" data-wow-delay={`${0.2 * i}s`}>
                        <h2 className="accordion-header" id={`heading-${activeId}-${i}`}>
                          <button
                            className={`accordion-button ${i !== 0 ? 'collapsed' : ''}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-${activeId}-${i}`}
                            aria-expanded={i === 0 ? 'true' : 'false'}
                            aria-controls={`collapse-${activeId}-${i}`}
                          >
                            {i + 1}. {faq.q}
                          </button>
                        </h2>
                        <div
                          id={`collapse-${activeId}-${i}`}
                          className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`}
                          role="region"
                          aria-labelledby={`heading-${activeId}-${i}`}
                          data-bs-parent={`#accordion-${activeId}`}
                        >
                          <div className="accordion-body">
                            <p>{faq.a}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ServiceSinglePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="preloader">
        <div className="loading-container">
          <div className="loading"></div>
          <div id="loading-icon">
            <img src="/images/mst_logo.png" alt="Loader" style={{ maxWidth: '100px', height: 'auto' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="preloader">
        <div className="loading-container">
          <div className="loading"></div>
          <div id="loading-icon">
            <img src="/images/mst_logo.png" alt="Loader" style={{ maxWidth: '100px', height: 'auto' }} />
          </div>
        </div>
      </div>
    }>
      <ServiceSingleContent />
    </Suspense>
  );
}
