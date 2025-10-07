import React from 'react';

// The full HTML content provided by the user is stored here.
// Duplicated sections and malformed HTML have been removed for clean rendering.
// IMG tags with local sources have been replaced with placeholder divs.
const originalPetitionHtml = `
<!doctype html>
<html lang="th" prefix="og: https://ogp.me/ns# website: https://ogp.me/ns/website#">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  
  <title>ลงชื่อคำร้องประชาชน — สิริน สงวนสิน พรรคประชาชน</title>
  <meta name="description" content="ร่วมลงชื่อสนับสนุนนโยบายด้านความปลอดภัย สิ่งแวดล้อม และคุณภาพชีวิตใน กทม. โดย สิริน สงวนสิน สมาชิกสภาผู้แทนราษฎร พรรคประชาชน">
  <meta name="keywords" content="คำร้องประชาชน, ลงชื่อ, สิริน สงวนสิน, พรรคประชาชน, นโยบาย, กทม., ตลิ่งชัน, ทวีวัฒนา">
  
  <meta name="description" lang="th" content="ร่วมลงชื่อคำร้องเพื่อผลักดันนโยบายด้านความปลอดภัย สิ่งแวดล้อม และคุณภาพชีวิตใน กทม. เขตตลิ่งชัน ทวีวัฒนา ธนบุรี ราชพฤกษ์" />
  <meta name="description" lang="en" content="Sign the People Party petition to improve safety, environment, and community wellbeing in Bangkok (Taling Chan, Thawi Watthana, Thonburi, Ratchaphruek)." />

  <meta property="og:title" content="ลงชื่อคำร้องประชาชน — สิริน สงวนสิน พรรคประชาชน" />
  <meta property="og:description" content="ร่วมลงชื่อเพื่อผลักดันนโยบายด้านความปลอดภัย สิ่งแวดล้อม และคุณภาพชีวิตใน กทม. โดย สิริน สงวนสิน สส.พรรคประชาชน" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://thailandpeopleparty.com/petition/" />
  <meta property="og:image" content="https://thailandpeopleparty.com/assets/img/sirin-petition.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="th_TH" />
  <meta property="og:site_name" content="พรรคประชาชน - People Party" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="ลงชื่อคำร้องประชาชน — สิริน สงวนสิน" />
  <meta name="twitter:description" content="ร่วมลงชื่อเพื่อผลักดันนโยบายด้านความปลอดภัย สิ่งแวดล้อม และคุณภาพชีวิตใน กทม." />
  <meta name="twitter:image" content="https://thailandpeopleparty.com/assets/img/sirin-petition.jpg" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Action",
    "name": "ลงชื่อคำร้องประชาชน",
    "description": "คำร้องเพื่อผลักดันนโยบายด้านความปลอดภัย สิ่งแวดล้อม และคุณภาพชีวิตในกรุงเทพมหานคร",
    "agent": {
      "@type": "Person",
      "name": "สิริน สงวนสิน",
      "jobTitle": "สมาชิกสภาผู้แทนราษฎร"
    },
    "location": {
      "@type": "Place",
      "name": "กรุงเทพมหานคร"
    }
  }
  </script>

  <!-- Font Awesome for icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap');
        
        :root {
            --mfp-orange: #F47920;
            --mfp-dark-gray: #333333;
            --mfp-medium-gray: #6C757D;
            --mfp-light-gray: #F8F9FA;
            --mfp-border-gray: #DEE2E6;
            --mfp-white: #FFFFFF;
            --success-green: #27ae60;
            --warning-orange: #f39c12;
            --error-red: #e74c3c;

            --primary-color: var(--mfp-orange);
            --primary-dark: #D96A1D;
            --background-color: #121212;
            --surface-color: #1e1e1e;
            --text-primary: #e0e0e0;
            --text-secondary: #aaaaaa;
            --font-family: 'Kanit', sans-serif;
            --border-radius: 12px;
            --box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
            --transition: all 0.3s ease;
        }
        
        * { 
            box-sizing: border-box; 
            margin: 0; 
            padding: 0; 
        }
        
        html { 
            scroll-behavior: smooth; 
        }
        
        body { 
            font-family: var(--font-family); 
            background-color: var(--background-color); 
            color: var(--text-primary); 
            line-height: 1.8; 
            font-size: 17px; 
            font-weight: 300; 
            transition: var(--transition);
        }
        
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 0 20px; 
        }
        
        [data-animate] { 
            opacity: 0; 
            transform: translateY(30px); 
            transition: opacity 0.6s ease-out, transform 0.6s ease-out; 
        }
        
        [data-animate].in-view { 
            opacity: 1; 
            transform: translateY(0); 
        }
        
        /* Hero Section */
        .hero { 
            text-align: center; 
            padding: 120px 20px 100px; 
            background: linear-gradient(135deg, var(--primary-color) 0%, #e5671d 100%);
            color: var(--mfp-white); 
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" fill="%23121212"/></svg>');
            background-size: 100% 100px;
            background-position: bottom;
            background-repeat: no-repeat;
        }
        
        .hero h1 { 
            font-size: 3.5rem; 
            font-weight: 700; 
            text-shadow: 0 2px 10px rgba(0,0,0,0.3); 
            margin-bottom: 15px;
            letter-spacing: -0.5px;
        }
        
        .hero h2 { 
            font-size: 1.8rem; 
            font-weight: 300; 
            opacity: 0.9; 
            margin: 10px 0; 
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .hero-stats-summary { 
            display: flex; 
            justify-content: center; 
            gap: 40px; 
            margin: 60px auto; 
            max-width: 900px; 
        }
        
        .summary-item { 
            text-align: center; 
            flex: 1;
        }
        
        .summary-item strong { 
            font-size: 3.2rem; 
            font-weight: 700; 
            line-height: 1.1; 
            display: block; 
            text-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .summary-item.highlight strong { 
            color: #FFDD57; 
        }
        
        .summary-item span {
            display: block;
            margin-top: 10px;
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .summary-separator { 
            width: 1px; 
            background-color: rgba(255, 255, 255, 0.3); 
        }
        
        .cta-button { 
            background-color: var(--mfp-white); 
            color: var(--primary-color); 
            border: 2px solid transparent; 
            padding: 16px 45px; 
            font-size: 1.2rem; 
            font-weight: 600; 
            border-radius: 50px; 
            cursor: pointer; 
            transition: var(--transition); 
            text-transform: uppercase; 
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2); 
            display: inline-block; 
            margin-top: 30px; 
            text-decoration: none; 
            letter-spacing: 0.5px;
        }
        
        .cta-button:hover { 
            transform: translateY(-5px); 
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); 
            background-color: var(--surface-color);
            color: var(--text-primary);
        }
        
        .section { 
            padding: 100px 0; 
        }
        
        .section-title { 
            text-align: center; 
            font-size: 2.8rem; 
            font-weight: 700; 
            margin-bottom: 25px; 
            color: var(--primary-color); 
            position: relative;
        }
        
        .section-title::after {
            content: '';
            display: block;
            width: 80px;
            height: 4px;
            background: var(--primary-color);
            margin: 15px auto 0;
            border-radius: 2px;
        }
        
        .section-subtitle { 
            text-align: center; 
            max-width: 800px; 
            margin: 0 auto 60px auto; 
            font-size: 1.3rem; 
            color: var(--text-secondary); 
            font-weight: 300; 
            line-height: 1.7;
        }
        
        .subsection-title { 
            font-size: 2rem; 
            margin-bottom: 25px; 
            padding-bottom: 15px; 
            border-bottom: 2px solid var(--primary-color); 
            color: var(--text-primary); 
            font-weight: 600; 
        }
        
        /* Cards */
        .card { 
            background-color: var(--surface-color); 
            padding: 35px; 
            border-radius: var(--border-radius); 
            margin-bottom: 40px; 
            border-left: 5px solid var(--primary-color); 
            box-shadow: var(--box-shadow); 
            transition: var(--transition);
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        }
        
        .card h3 { 
            font-size: 1.9rem; 
            margin-bottom: 25px; 
            font-weight: 600; 
            padding-bottom: 15px; 
            border-bottom: 2px solid var(--primary-color); 
        }
        
        .card h4 { 
            color: var(--primary-color); 
            font-size: 1.6rem; 
            margin-bottom: 15px; 
            font-weight: 500; 
        }
        
        /* Petition Form */
        .petition-form-container { 
            display: grid; 
            grid-template-columns: 1fr; 
            gap: 60px; 
            margin-top: 50px; 
            align-items: start; 
        }
        
        .form-group { 
            margin-bottom: 25px; 
        }
        
        .form-group label { 
            display: block; 
            margin-bottom: 10px; 
            font-weight: 500; 
            font-size: 1.1rem;
        }
        
        .form-control { 
            width: 100%; 
            padding: 16px; 
            border: 1px solid #444; 
            border-radius: var(--border-radius); 
            font-family: inherit; 
            font-size: 1rem; 
            background-color: #2a2a2a; 
            color: var(--text-primary); 
            transition: var(--transition); 
        }
        
        .form-control:focus { 
            outline: none; 
            border-color: var(--primary-color); 
            box-shadow: 0 0 0 4px rgba(244, 121, 32, 0.2); 
        }
        
        .form-control.is-invalid { 
            border-color: var(--error-red); 
        }
        
        .invalid-feedback { 
            color: var(--error-red); 
            font-size: 0.9rem; 
            margin-top: 8px; 
        }
        
        /* Social Proof */
        .social-proof-container { 
            text-align: center; 
            background: var(--surface-color);
            padding: 30px;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
        }
        
        .signature-count { 
            font-size: 4.8rem; 
            font-weight: 700; 
            color: var(--primary-color); 
            line-height: 1; 
            margin-bottom: 20px;
        }
        
        .progress-bar-container { 
            margin-bottom: 25px; 
        }
        
        .progress-bar { 
            width: 100%; 
            height: 14px; 
            background-color: #444; 
            border-radius: 7px; 
            overflow: hidden; 
        }
        
        .progress-bar-fill { 
            width: 0%; 
            height: 100%; 
            background: linear-gradient(90deg, var(--success-green) 0%, #2ecc71 100%); 
            border-radius: 7px; 
            transition: width 1s ease-in-out; 
        }
        
        .progress-text { 
            font-size: 1rem; 
            color: var(--text-secondary); 
            margin-top: 8px; 
        }
        
        .recent-signatories-list { 
            list-style: none; 
            padding: 0; 
        }
        
        .recent-signatory { 
            background-color: #2a2a2a; 
            padding: 12px 18px; 
            border-radius: 8px; 
            margin-bottom: 10px; 
            font-size: 0.95rem; 
            transition: var(--transition); 
            text-align: left; 
            border-left: 3px solid transparent;
        }
        
        .recent-signatory.new { 
            transform: translateX(-10px); 
            background-color: rgba(39, 174, 96, 0.15); 
            border-left-color: var(--success-green);
        }
        
        /* Enhanced Contract Analysis */
        .contract-analysis-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 30px;
            margin-top: 40px;
        }
        
        @media (min-width: 992px) {
            .contract-analysis-grid {
                grid-template-columns: 1fr 1fr;
            }
        }
        
        .contract-term-card {
            background: var(--surface-color);
            border-radius: var(--border-radius);
            padding: 30px;
            box-shadow: var(--box-shadow);
            border-left: 5px solid var(--primary-color);
            height: 100%;
            transition: var(--transition);
            display: flex;
            flex-direction: column;
        }
        
        .contract-term-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.35);
        }
        
        .term-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(244, 121, 32, 0.2);
        }
        
        .term-icon {
            width: 60px;
            height: 60px;
            background-color: var(--primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
            flex-shrink: 0;
        }
        
        .term-icon i {
            color: white;
            font-size: 1.8rem;
        }
        
        .term-title {
            font-size: 1.6rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
        }
        
        .term-subtitle {
            font-size: 1rem;
            color: var(--text-secondary);
            margin: 5px 0 0 0;
        }
        
        .term-content {
            margin-bottom: 20px;
            flex-grow: 1;
        }
        
        .term-quote {
            background: rgba(244, 121, 32, 0.08);
            border-left: 4px solid var(--primary-color);
            padding: 18px;
            margin: 18px 0;
            border-radius: 0 8px 8px 0;
            font-style: italic;
            line-height: 1.7;
        }
        
        .implication-list {
            list-style-type: none;
            padding-left: 0;
        }
        
        .implication-list li {
            padding: 10px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            position: relative;
            padding-left: 30px;
        }
        
        .implication-list li:before {
            content: "•";
            color: var(--primary-color);
            font-weight: bold;
            position: absolute;
            left: 0;
            font-size: 1.5rem;
        }
        
        .evidence-badge {
            display: inline-block;
            background: var(--error-red);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-left: 10px;
            vertical-align: middle;
        }
        
        .action-required {
            background: rgba(39, 174, 96, 0.1);
            border: 1px solid var(--success-green);
            border-radius: 8px;
            padding: 18px;
            margin-top: 20px;
        }
        
        .action-title {
            color: var(--success-green);
            font-weight: 600;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        
        .action-title:before {
            content: "⚠";
            margin-right: 10px;
            font-size: 1.3rem;
        }
        
        .page-reference {
            font-size: 0.9rem;
            color: var(--text-secondary);
            font-style: italic;
            margin-top: 15px;
        }
        
        .severity-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 10px;
        }
        
        .severity-high {
            background-color: var(--error-red);
        }
        
        .severity-medium {
            background-color: var(--warning-orange);
        }
        
        .severity-low {
            background-color: var(--success-green);
        }
        
        .contract-violation-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 25px;
        }
        
        .violation-item {
            background: #2a2a2a;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-left: 4px solid var(--error-red);
            transition: var(--transition);
        }
        
        .violation-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0,0,0,0.2);
        }
        
        /* Evidence Gallery */
        .evidence-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 25px;
            margin-top: 30px;
        }
        
        .evidence-item {
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: var(--box-shadow);
            transition: var(--transition);
            background-color: var(--background-color);
        }
        
        .evidence-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }
        
        .evidence-media {
            width: 100%;
            display: block;
            aspect-ratio: 16 / 10;
            object-fit: cover;
        }
        
        .evidence-caption {
            padding: 15px;
            font-size: 0.95rem;
            color: var(--text-secondary);
            text-align: center;
        }
        
        .evidence-category {
            display: inline-block;
            background: var(--primary-color);
            color: white;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-bottom: 10px;
        }
        
        /* Demands Section */
        .demands-list-numbered { 
            display: flex; 
            flex-direction: column; 
            gap: 30px; 
            list-style: none; 
            padding-left: 0; 
        }
        
        .demand-item { 
            display: flex; 
            align-items: flex-start; 
            gap: 25px; 
        }
        
        .demand-number { 
            flex-shrink: 0; 
            width: 45px; 
            height: 45px; 
            border-radius: 50%; 
            background-color: var(--primary-color); 
            color: white; 
            font-weight: 700; 
            font-size: 1.3rem; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
        }
        
        .demand-text strong { 
            display: block; 
            font-size: 1.3rem; 
            margin-bottom: 8px; 
            font-weight: 500; 
            color: var(--text-primary); 
        }
        
        .demand-text p { 
            color: var(--text-secondary); 
        }
        
        .demands-list-bulleted { 
            list-style: none; 
            padding-left: 0; 
        }
        
        .demands-list-bulleted li { 
            padding-left: 40px; 
            position: relative; 
            margin-bottom: 18px; 
            font-size: 1.15rem; 
        }
        
        .demands-list-bulleted li::before { 
            content: '✓'; 
            color: var(--success-green); 
            position: absolute; 
            left: 0; 
            top: 0; 
            font-weight: 700; 
            font-size: 1.6rem; 
        }
        
        .demand-emphasis { 
            margin-top: 35px; 
            padding: 25px; 
            background-color: rgba(244, 121, 32, 0.1); 
            border-left: 4px solid var(--primary-color); 
            border-radius: 8px; 
            font-weight: 500; 
            font-size: 1.1rem;
        }
        
        /* Countdown Timer */
        .countdown-container {
            text-align: center;
            margin: 40px 0;
        }
        
        .countdown-title {
            font-size: 1.5rem;
            margin-bottom: 20px;
            color: var(--text-primary);
        }
        
        .countdown-timer {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .countdown-unit {
            background: var(--surface-color);
            padding: 20px;
            border-radius: var(--border-radius);
            min-width: 100px;
            box-shadow: var(--box-shadow);
        }
        
        .countdown-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--primary-color);
            line-height: 1;
        }
        
        .countdown-label {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-top: 8px;
        }
        
        /* Modal */
        .modal-overlay { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: rgba(0,0,0,0.8); 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            z-index: 1000; 
            opacity: 0; 
            visibility: hidden; 
            transition: var(--transition); 
        }
        
        .modal-overlay.is-visible { 
            opacity: 1; 
            visibility: visible; 
        }
        
        .modal-content { 
            background: var(--surface-color); 
            color: var(--text-primary); 
            padding: 45px; 
            border-radius: var(--border-radius); 
            text-align: center; 
            max-width: 550px; 
            width: 90%; 
            transform: scale(0.9); 
            transition: var(--transition); 
            position: relative;
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
        }
        
        .modal-overlay.is-visible .modal-content { 
            transform: scale(1); 
        }
        
        .modal-content h2 { 
            color: var(--success-green); 
            font-size: 2.2rem; 
            margin-bottom: 20px; 
        }
        
        .modal-content p { 
            color: var(--text-secondary); 
            margin-bottom: 30px; 
            font-size: 1.15rem; 
            line-height: 1.7;
        }
        
        .modal-close-button { 
            position: absolute; 
            top: 20px; 
            right: 20px; 
            background: none; 
            border: none; 
            font-size: 2.2rem; 
            cursor: pointer; 
            color: var(--text-secondary); 
            line-height: 1;
            transition: var(--transition);
        }
        
        .modal-close-button:hover {
            color: var(--text-primary);
        }
        
        .social-share-buttons { 
            display: flex; 
            justify-content: center; 
            gap: 15px; 
            flex-wrap: wrap; 
        }
        
        .social-share-button { 
            text-decoration: none; 
            color: white; 
            padding: 14px 28px; 
            border-radius: 8px; 
            font-weight: 500; 
            transition: var(--transition); 
            font-size: 1.05rem; 
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .social-share-button:hover { 
            opacity: 0.85; 
            transform: translateY(-3px);
        }
        
        .ss-facebook { background-color: #1877F2; }
        .ss-twitter { background-color: #1DA1F2; }
        .ss-line { background-color: #00B900; }
        
        footer { 
            background-color: #000; 
            color: var(--mfp-white); 
            padding: 50px 0; 
            margin-top: 80px; 
            text-align: center; 
            font-size: 0.95rem; 
        }
        
        .footer-credit { 
            opacity: 0.7; 
            margin-top: 15px; 
        }
        
        @media (min-width: 768px) { 
            .petition-form-container { grid-template-columns: 1.5fr 1fr; } 
        }
        
        @media (max-width: 768px) { 
            body { font-size: 16px; } 
            .hero h1 { font-size: 2.5rem; } 
            .hero h2 { font-size: 1.4rem; } 
            .hero-stats-summary { flex-direction: column; gap: 40px; } 
            .summary-separator { display: none; } 
            .section { padding: 80px 0; } 
            .section-title { font-size: 2.3rem; } 
            .section-subtitle { font-size: 1.15rem; } 
            .term-header {
                flex-direction: column;
                text-align: center;
            }
            .term-icon {
                margin-right: 0;
                margin-bottom: 15px;
            }
            .countdown-timer {
                flex-wrap: wrap;
            }
        }
    </style>
</head>
<body>
    <div id="root">
        <main>
            <header class="hero" role="banner">
                <div class="container" data-animate>
                    <h1>ร่วมลงชื่อคัดค้านการขยายเวลาส่งมอบงานโครงการปรับปรุงถนนพุทธมณฑลสาย 1</h1>
                      <h2>และเรียกร้องให้ กทม. บังคับใช้สัญญาอย่างจริงจัง</h2>   
                    <h1>คนฝั่งธนจะไม่ทนอีกต่อไป</h1>
                    <p class="section-subtitle" style="color: #fff; opacity: 0.9;">ความสูญเสียที่เกิดจากความล่าช้า,ความมักง่าย และไร้ความรับผิดชอบ</p>
                    <div class="hero-stats-summary">
                        <div class="summary-item"><strong data-count="23">0</strong><span>วันที่ล่าช้า</span></div>
                        <div class="summary-separator"></div>
                        <div class="summary-item"><strong data-count="824950">0</strong><span>ค่าปรับ/วัน</span></div>
                        <div class="summary-separator"></div>
                        <div class="summary-item highlight"><strong data-count="18973850">0</strong><span>ค่าปรับรวม</span></div>
                    </div>
                    
                    <!-- Countdown Timer -->
                    <div class="countdown-container" data-animate>
                        <div class="countdown-title">ข้อเรียกร้องเร่งด่วน – ภายใน 7 วัน</div>
                        <div class="countdown-timer">
                            <div class="countdown-unit">
                                <div class="countdown-value" id="days">07</div>
                                <div class="countdown-label">วัน</div>
                            </div>
                            <div class="countdown-unit">
                                <div class="countdown-value" id="hours">16</div>
                                <div class="countdown-label">ชั่วโมง</div>
                            </div>
                            <div class="countdown-unit">
                                <div class="countdown-value" id="minutes">42</div>
                                <div class="countdown-label">นาที</div>
                            </div>
                            <div class="countdown-unit">
                                <div class="countdown-value" id="seconds">05</div>
                                <div class="countdown-label">วินาที</div>
                            </div>
                        </div>
                        <a href="#petition-form" class="cta-button">ร่วมลงชื่อเรียกร้องตอนนี้</a>
                    </div>
                </div>
            </header>

            <section class="section analysis-section" data-animate>
                <div class="container">
                    <h2 class="section-title">I. ภาพรวมสถานการณ์: ความล่าช้า, ไร้ความปลอดภัย, ไร้ความรับผิดชอบ</h2>
                    <p class="section-subtitle">โครงการที่ควรเสร็จสิ้นในปี 2563 กลับล่าช้ากว่าแผนถึง 47.71% ณ เดือนกันยายน 2568 ความล่าช้านี้ไม่ได้เป็นเพียงตัวเลข แต่คือการเปลี่ยนถนนสาธารณะให้กลายเป็นพื้นที่อันตรายที่ไร้การควบคุม</p>
                    
                    <!-- Key Evidence Images -->
                    <div class="evidence-gallery">
                        <div class="evidence-item" data-animate>
                            <div class="evidence-category">ภัยอันตราย</div>
                            <img src="https://static.amarintv.com/media/Dpe4A5wywPfUHk234CKbTkvJg0CTESpTMR6LNc3gYDGioyPpV6a3rEByqg88KeZ5b.jpg" alt="สภาพอันตรายในพื้นที่ก่อสร้าง" class="evidence-media">
                            <div class="evidence-caption">สภาพอันตรายในพื้นที่ก่อสร้าง</div>
                        </div>
                        <div class="evidence-item" data-animate>
                            <div class="evidence-category">เครื่องจักรหนัก</div>
                            <img src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1NFAja.img?w=768&h=1023&m=6&x=592&y=427&s=54&d=54" alt="เครื่องจักรหนักถูกทิ้งไว้ในเวลากลางคืน" class="evidence-media">
                            <div class="evidence-caption">เครื่องจักรหนักถูกทิ้งไว้ในเวลากลางคืน</div>
                        </div>
                        <div class="evidence-item" data-animate>
                            <div class="evidence-category">อุบัติเหตุ</div>
                            <img src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1NFe4g.img?w=768&h=1024&m=6&x=277&y=145&s=52&d=52" alt="อุบัติเหตุที่เกิดขึ้นในพื้นที่ก่อสร้าง" class="evidence-media">
                            <div class="evidence-caption">อุบัติเหตุที่เกิดขึ้นในพื้นที่ก่อสร้าง</div>
                        </div>
                    </div>
                    
                    <div class="card" data-animate style="margin-top: 40px;">
                        <h4>คำเตือนอย่างเป็นทางการที่ถูกเพิกเฉย</h4>
                        <p>"กทม. กำชับมาตรการความปลอดภัย...ให้ตรวจสอบเป็นประจำทุกวัน" — ข้อความนี้คือการยอมรับอย่างเป็นทางการว่า กทม. รับทราบถึงปัญหา แต่คำสั่งกลับถูกเพิกเฉยโดยสิ้นเชิงจากผู้รับจ้าง จนนำไปสู่โศกนาฏกรรมในที่สุด</p>
                        <p><a href="https://pr-bangkok.com/?p=473822" target="_blank" style="color: var(--primary-color); text-decoration: underline;">อ่านคำเตือนอย่างเป็นทางการจาก กทม.</a></p>
                    </div>
                </div>
            </section>

            <section class="section" id="petition-form">
                <div class="container">
                    <h2 class="section-title" data-animate>II. ร่วมเป็นส่วนหนึ่งของการเปลี่ยนแปลง</h2>
                    <p class="section-subtitle" data-animate>เสียงของคุณมีความหมายในการสร้างความเปลี่ยนแปลงและป้องกันโศกนาฏกรรมในอนาคต</p>
                    <div class="petition-form-container">
                        <div class="card" data-animate>
                            <form 
                                id="main-petition-form" 
                                action="https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/formResponse" 
                                method="POST" 
                                target="hidden_iframe"
                                novalidate>
                                <h3>ร่วมลงชื่อทวงคืนความยุติธรรม</h3>
                                <p style="margin-bottom: 25px; color: var(--text-secondary);">ข้อมูลของท่านจะถูกใช้เพื่อการรณรงค์นี้เท่านั้น</p>
                                <div class="form-group">
                                    <label for="name-input">ชื่อ-นามสกุล (จำเป็น)</label>
                                    <input id="name-input" name="entry.ENTRY_ID_FOR_NAME" class="form-control" required type="text" placeholder="เช่น สมชาย ใจดี">
                                    <div class="invalid-feedback" style="display: none;">กรุณากรอกชื่อ-นามสกุลของท่าน</div>
                                </div>
                                <div class="form-group">
                                    <label for="email-input">อีเมล (ไม่บังคับ)</label>
                                    <input id="email-input" name="entry.ENTRY_ID_FOR_EMAIL" class="form-control" type="email" placeholder="example@email.com">
                                </div>
                                <button type="submit" class="cta-button" style="width: 100%;">ลงชื่อเรียกร้อง</button>
                            </form>
                        </div>
                        <div class="social-proof-container" data-animate style="transition-delay: 0.2s;">
                            <div class="signature-count" data-count="1342" data-goal="5000">0</div>
                            <div class="progress-bar-container">
                                <div class="progress-bar"><div id="progress-bar-fill" class="progress-bar-fill"></div></div>
                                <p class="progress-text"><span id="progress-text-current">1,342</span> จากเป้าหมาย <span id="progress-text-goal">5,000</span> รายชื่อ</p>
                            </div>
                            <h4 style="margin-bottom: 20px; font-size: 1.3rem;">ผู้ร่วมลงชื่อล่าสุด</h4>
                            <ul id="recent-signatories-list" class="recent-signatories-list">
                                <li class="recent-signatory">สมชาย ใจดี</li>
                                <li class="recent-signatory">กนกวรรณ สุขสวัสดิ์</li>
                                <li class="recent-signatory">ประวิทย์ พลอยเพชร</li>
                                <li class="recent-signatory">ศิริลักษณ์ แสงทอง</li>
                                <li class="recent-signatory">วิทยา ธรรมรักษา</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section demands-section" style="padding-top: 0;">
                <div class="container">
                    <h2 class="section-title" data-animate>III. ข้อเรียกร้องของเรา</h2>
                    <p class="section-subtitle" data-animate>เราเรียกร้องการดำเนินการที่ชัดเจนและเด็ดขาดใน 3 ระยะ เพื่อสร้างความปลอดภัย คืนความยุติธรรม และวางบรรทัดฐานใหม่ให้สังคม</p>

                    <div class="card" data-animate style="transition-delay: 0.1s;">
                        <h3>ระยะที่ 1: ข้อเรียกร้องเร่งด่วน – ภายใน 7 วัน</h3>
                        <p>เราขอเรียกร้องให้กรุงเทพมหานคร และผู้รับจ้าง ดำเนินการแก้ไขปัญหาความปลอดภัยที่หน้างานก่อสร้างอย่างเร่งด่วนที่สุด เพื่อให้ได้มาซึ่งมาตรฐานความปลอดภัยที่ควรจะมีมาตั้งแต่เริ่มต้นโครงการ:</p>
                        <ul class="demands-list-bulleted">
                            <li><strong>ติดตั้งระบบไฟส่องสว่างและป้ายเตือน:</strong> เพื่อกำจัดจุดอับสายตาและลดความเสี่ยงอุบัติเหตุในเวลากลางคืน</li>
                            <li><strong>จัดการจราจรและพื้นผิวจราจร:</strong> เพื่ออำนวยความสะดวกในการสัญจรและลดความเสี่ยงจากอุบัติเหตุ</li>
                            <li><strong>แก้ไขปัญหาน้ำท่วมขังและควบคุมฝุ่นละออง:</strong> เพื่อบรรเทาความเดือดร้อนและปัญหาสุขภาพของประชาชน</li>
                            <li><strong>รับผิดชอบและเยียวยาผู้เสียหาย:</strong> เริ่มกระบวนการชดเชยค่าเสียหายสำหรับครอบครัวผู้ได้รับผลกระทบ และวางแผนป้องกันเหตุในอนาคต</li>
                        </ul>
                        <p class="demand-emphasis"><strong>คำเน้นย้ำ:</strong> การดำเนินการเหล่านี้ไม่ใช่ "ข้อเรียกร้องพิเศษ" แต่เป็นเพียงการบังคับใช้มาตรการความปลอดภัยขั้นพื้นฐานที่ผู้รับจ้างมีหน้าที่ตามสัญญาและกฎหมาย ที่จะต้องปฏิบัติมาตั้งแต่แรกเริ่ม</p>
                    </div>

                    <div class="card" data-animate style="transition-delay: 0.2s;">
                        <h3>ระยะที่ 2: มาตรการยกระดับ – หากยังเพิกเฉย</h3>
                        <p>หากภายใน 7 วัน ไม่มีการแก้ไขที่เป็นรูปธรรม เราจะถือว่าท่านจงใจเพิกเฉยต่อชีวิตของประชาชน และจะยกระดับข้อเรียกร้องขั้นสูงสุด:</p>
                        <ol class="demands-list-numbered">
                            <li class="demand-item">
                                <div class="demand-number">1</div>
                                <div class="demand-text">
                                    <strong>บอกเลิกสัญญาและขึ้นบัญชีดำทันที</strong>
                                    <p>กทม. ต้องใช้อำนาจตามสัญญา บอกเลิกสัญญาทุกฉบับกับบริษัทนี้ และขึ้นบัญชีดำถาวรจากการประมูลงานภาครัฐทุกประเภท</p>
                                </div>
                            </li>
                            <li class="demand-item">
                                <div class="demand-number">2</div>
                                <div class="demand-text">
                                    <strong>เรียกเก็บค่าปรับสูงสุดและเยียวยาประชาชน</strong>
                                    <p>กทม. ต้องดำเนินการเรียกเก็บค่าปรับตามสัญญาในอัตราวันละ 824,950 บาท ย้อนหลังทั้งหมด และเรียกค่าเสียหายสูงสุดเพื่อชดเชยประชาชน</p>
                                </div>
                            </li>
                            <li class="demand-item">
                                <div class="demand-number">3</div>
                                <div class="demand-text">
                                    <strong>ตั้งคณะกรรมการวิสามัญตรวจสอบการทุจริต</strong>
                                    <p>ผลักดันให้มีการตั้งคณะกรรมการวิสามัญในสภาฯ เพื่อตรวจสอบ "รูปแบบ" การทุจริตเชิงผลประโยชน์ทับซ้อนทั้งหมดที่เชื่อมโยงกับบริษัทนี้</p>
                                </div>
                            </li>
                        </ol>
                    </div>

                    <div class="card" data-animate style="transition-delay: 0.3s;">
                        <h3>ระยะที่ 3: การปฏิรูประยะยาวและสร้างบรรทัดฐานใหม่</h3>
                        <p>เพื่อป้องกันไม่ให้โศกนาฏกรรมเช่นนี้เกิดขึ้นอีกในโครงการใดๆ ของกรุงเทพมหานคร:</p>
                         <ol class="demands-list-numbered">
                            <li class="demand-item">
                                <div class="demand-number">1</div>
                                <div class="demand-text">
                                    <strong>ปฏิรูประบบการประมูล</strong>
                                    <p>แก้ไขเกณฑ์การประมูลให้พิจารณาประวัติความปลอดภัยและความรับผิดชอบเป็นปัจจัยสำคัญ ไม่ใช่แค่ราคาที่ต่ำที่สุด</p>
                                </div>
                            </li>
                            <li class="demand-item">
                                <div class="demand-number">2</div>
                                <div class="demand-text">
                                    <strong>จัดตั้งกองทุนเยียวยาผู้ได้รับผลกระทบ</strong>
                                    <p>บังคับให้โครงการก่อสร้างขนาดใหญ่ทุกโครงการต้องจัดสรรงบประมาณส่วนหนึ่งเข้ากองทุนกลาง เพื่อเยียวยาผู้ได้รับผลกระทบได้อย่างรวดเร็วและเป็นธรรม</p>
                                </div>
                            </li>
                            <li class="demand-item">
                                <div class="demand-number">3</div>
                                <div class="demand-text">
                                    <strong>เปิดเผยข้อมูลโครงการสู่สาธารณะ (Open Data)</strong>
                                    <p>บังคับให้ กทม. เปิดเผยข้อมูลความคืบหน้า, รายงานการตรวจสอบความปลอดภัย, และค่าปรับของโครงการก่อสร้างทั้งหมดแบบ Real-time</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                </div>
            </section>
            
            <section class="section analysis-section">
                <div class="container">
                    <h2 class="section-title" data-animate>IV. การวิเคราะห์สัญญาอย่างละเอียด: การผิดสัญญาและสิทธิของ กทม.</h2>
                    <p class="section-subtitle" data-animate>การวิเคราะห์ข้อตกลงทางกฎหมายอย่างละเอียด พร้อมยกข้อความ "คำต่อคำ" จากสัญญา (เลขที่ สนย.๔๕/๒๕๖๗) เพื่อแสดงให้เห็นถึงสิทธิทางกฎหมายที่กรุงเทพมหานครสามารถดำเนินการได้ทันที</p>

                    <div class="contract-analysis-grid">
                        <!-- Term 1: Contract Termination Rights -->
                        <div class="contract-term-card" data-animate>
                            <div class="term-header">
                                <div class="term-icon">
                                    <i class="fas fa-file-contract"></i>
                                </div>
                                <div>
                                    <h3 class="term-title">สิทธิในการบอกเลิกสัญญา</h3>
                                    <p class="term-subtitle">ข้อ 6 - กำหนดเวลาแล้วเสร็จและสิทธิของผู้ว่าจ้างในการบอกเลิกสัญญา</p>
                                </div>
                            </div>
                            
                            <div class="term-content">
                                <div class="term-quote">
                                    "ถ้าผู้รับจ้างมิได้เสนอแผนงาน หรือมิได้ลงมือทำงานภายในกำหนดเวลาหรือไม่สามารถทำงานให้แล้วเสร็จตามกำหนดเวลา หรือมีเหตุให้เชื่อได้ว่าผู้รับจ้างไม่สามารถทำงานให้แล้วเสร็จภายในกำหนดเวลา หรือจะแล้วเสร็จล่าช้าเกินกว่ากำหนดเวลา หรือผู้รับจ้างทำผิดสัญญาข้อใดข้อหนึ่ง... ผู้ว่าจ้างมีสิทธิที่จะบอกเลิกสัญญานี้ได้"
                                </div>
                                
                                <h4>การตีความทางกฎหมาย:</h4>
                                <p>ข้อนี้เป็น "เงื่อนไขแก้สัญญา" ที่ให้อำนาจ กทม. ในการบอกเลิกสัญญาเมื่อผู้รับจ้างไม่ปฏิบัติตามเงื่อนไขสำคัญ โดยไม่จำเป็นต้องรอให้สัญญาสิ้นสุดลง</p>
                                
                                <h4>การละเมิดที่เกิดขึ้นจริง:</h4>
                                <ul class="implication-list">
                                    <li><span class="severity-indicator severity-high"></span>ไม่สามารถทำงานให้แล้วเสร็จตามกำหนดเวลา (เกิน 23 วันแล้ว)</li>
                                    <li><span class="severity-indicator severity-high"></span>มีเหตุให้เชื่อได้ว่าผู้รับจ้างไม่สามารถทำงานให้แล้วเสร็จภายในกำหนดเวลา</li>
                                    <li><span class="severity-indicator severity-medium"></span>ผู้รับจ้างทำผิดสัญญาข้ออื่นๆ ด้านความปลอดภัยและสิ่งแวดล้อม</li>
                                </ul>
                                
                                <div class="action-required">
                                    <div class="action-title">การดำเนินการที่ควรทำ:</div>
                                    <p>กทม. สามารถออก "หนังสือแจ้งเตือนการผิดสัญญา" ได้ทันที และตามด้วย "หนังสือบอกเลิกสัญญา" หากไม่มีการแก้ไขภายในระยะเวลาที่กำหนด</p>
                                </div>
                                
                                <div class="page-reference">อ้างอิง: หน้า 4-5 ของสัญญา</div>
                            </div>
                        </div>

                        <!-- Term 2: Liquidated Damages -->
                        <div class="contract-term-card" data-animate>
                            <div class="term-header">
                                <div class="term-icon">
                                    <i class="fas fa-money-bill-wave"></i>
                                </div>
                                <div>
                                    <h3 class="term-title">ค่าปรับงานล่าช้า</h3>
                                    <p class="term-subtitle">ข้อ 16 - ค่าปรับ</p>
                                </div>
                            </div>
                            
                            <div class="term-content">
                                <div class="term-quote">
                                    "หากผู้รับจ้างไม่สามารถทำงานให้แล้วเสร็จภายในเวลาที่กำหนดไว้ในสัญญา...ผู้รับจ้างจะต้องชำระค่าปรับให้แก่ผู้ว่าจ้างเป็นจำนวนเงินวันละ 824,950.00 บาท...นับถัดจากวันที่ครบกำหนดเวลาแล้วเสร็จของงานตามสัญญา...จนถึงวันที่ทำงานแล้วเสร็จจริง"
                                </div>
                                
                                <h4>การตีความทางกฎหมาย:</h4>
                                <p>นี่คือ "ค่าปรับล่าช้า" (Liquidated Damages) ที่คำนวณตามสัดส่วนระยะเวลาที่ล่าช้า โดยไม่ต้องพิสูจน์ความเสียหายจริง ซึ่งเป็นมาตรการทางกฎหมายที่รับรองในประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 380</p>
                                
                                <h4>มูลค่าความเสียหาย:</h4>
                                <ul class="implication-list">
                                    <li><span class="severity-indicator severity-high"></span>ค่าปรับสะสม 23 วัน: 18,973,850 บาท</li>
                                    <li><span class="severity-indicator severity-high"></span>อัตราค่าปรับต่อวัน: 824,950 บาท/วัน</li>
                                    <li><span class="severity-indicator severity-medium"></span>เทียบเท่าค่าจ้างพนักงาน 137 คน/วัน (ที่อัตรา 6,000 บาท/คน)</li>
                                </ul>
                                
                                <div class="action-required">
                                    <div class="action-title">การดำเนินการที่ควรทำ:</div>
                                    <p>กทม. ต้องออกใบแจ้งหนี้ค่าปรับเป็นทางการและหักจากเงินประกันสัญญาหรือเงินค่าจ้างงวดต่อไป</p>
                                </div>
                                
                                <div class="page-reference">อ้างอิง: หน้า 8 ของสัญญา</div>
                            </div>
                        </div>

                        <!-- Term 3: Post-Termination Rights -->
                        <div class="contract-term-card" data-animate>
                            <div class="term-header">
                                <div class="term-icon">
                                    <i class="fas fa-gavel"></i>
                                </div>
                                <div>
                                    <h3 class="term-title">สิทธิหลังการบอกเลิกสัญญา</h3>
                                    <p class="term-subtitle">ข้อ 17 - สิทธิของผู้ว่าจ้างภายหลังบอกเลิกสัญญา</p>
                                </div>
                            </div>
                            
                            <div class="term-content">
                                <div class="term-quote">
                                    "ในกรณีที่ผู้ว่าจ้างบอกเลิกสัญญา ผู้ว่าจ้างอาจทำงานนั้นเองหรือว่าจ้างผู้อื่นให้ทำงานนั้นต่อจนแล้วเสร็จก็ได้...ผู้ว่าจ้างมีสิทธิรับหรือบังคับจากหลักประกันการปฏิบัติตามสัญญาทั้งหมดหรือบางส่วนตามแต่จะเห็นสมควร"
                                </div>
                                
                                <h4>การตีความทางกฎหมาย:</h4>
                                <p>ข้อนี้ให้อำนาจ กทม. ในการ "ยึดหลักประกันสัญญา" และ "ว่าจ้างผู้รับจ้างรายใหม่" โดยให้ผู้รับจ้างเดิมเป็นผู้รับผิดชอบค่าใช้จ่ายส่วนต่างทั้งหมด</p>
                                
                                <h4>ผลทางกฎหมาย:</h4>
                                <ul class="implication-list">
                                    <li><span class="severity-indicator severity-high"></span>ยึดหลักประกันสัญญามูลค่า 16,499,000 บาท</li>
                                    <li><span class="severity-indicator severity-high"></span>ว่าจ้างผู้รับจ้างรายใหม่โดยใช้งบประมาณจากผู้รับจ้างเดิม</li>
                                    <li><span class="severity-indicator severity-medium"></span>เรียกค่าเสียหายเพิ่มเติมจากความล่าช้าและค่าใช้จ่ายในการจัดการ</li>
                                </ul>
                                
                                <div class="action-required">
                                    <div class="action-title">การดำเนินการที่ควรทำ:</div>
                                    <p>หลังจากบอกเลิกสัญญา กทม. ควรริบหลักประกันทันทีและเริ่มกระบวนการประมูลใหม่โดยเร่งด่วน</p>
                                </div>
                                
                                <div class="page-reference">อ้างอิง: หน้า 8 ของสัญญา</div>
                            </div>
                        </div>

                        <!-- Term 4: Safety and Traffic Management -->
                        <div class="contract-term-card" data-animate>
                            <div class="term-header">
                                <div class="term-icon">
                                    <i class="fas fa-traffic-light"></i>
                                </div>
                                <div>
                                    <h3 class="term-title">มาตรการความปลอดภัยและการจราจร</h3>
                                    <p class="term-subtitle">ผนวก 7 - มาตรการด้านความปลอดภัยและการจราจร</p>
                                </div>
                            </div>
                            
                            <div class="term-content">
                                <div class="term-quote">
                                    "ผู้รับจ้างจะต้องอำนวยความสะดวกในการจราจรระหว่างการก่อสร้างตลอดเวลา และจะต้องติดตั้งเครื่องหมายการจราจร สัญญาณป้องกันอันตรายต่างๆ ให้ถูกต้องตามกฎหมาย ระเบียบข้อบังคับของทางราชการตลอดจนคำสั่งของเจ้าพนักงานจราจรทุกประการโดยเคร่งครัด"
                                </div>
                                
                                <h4>การตีความทางกฎหมาย:</h4>
                                <p>ข้อกำหนดนี้เป็น "ข้อผูกพันเชิงบวก" ที่บังคับให้ผู้รับจ้างต้องดำเนินมาตรการความปลอดภัยเชิงรุก ไม่ใช่เพียงแค่หลีกเลี่ยงการสร้างอันตราย</p>
                                
                                <h4>การละเมิดที่พบ:</h4>
                                <ul class="implication-list">
                                    <li><span class="severity-indicator severity-high"></span>ไม่มีระบบไฟส่องสว่างเพียงพอในเวลากลางคืน <span class="evidence-badge">หลักฐานยืนยัน</span></li>
                                    <li><span class="severity-indicator severity-high"></span>ป้ายเตือนและเครื่องหมายจราจรไม่ครบถ้วน <span class="evidence-badge">หลักฐานยืนยัน</span></li>
                                    <li><span class="severity-indicator severity-medium"></span>ไม่มีการอำนวยความสะดวกในการจราจรอย่างต่อเนื่อง</li>
                                </ul>
                                
                                <div class="action-required">
                                    <div class="action-title">การดำเนินการที่ควรทำ:</div>
                                    <p>กทม. สามารถสั่งหยุดงานชั่วคราวได้จนกว่าผู้รับจ้างจะแก้ไขปัญหาความปลอดภัยให้เป็นไปตามข้อกำหนด</p>
                                </div>
                                
                                <div class="page-reference">อ้างอิง: หน้า 26 ของสัญญา</div>
                            </div>
                        </div>

                        <!-- Term 5: Environmental Protection -->
                        <div class="contract-term-card" data-animate>
                            <div class="term-header">
                                <div class="term-icon">
                                    <i class="fas fa-leaf"></i>
                                </div>
                                <div>
                                    <h3 class="term-title">การควบคุมฝุ่นละออง PM2.5</h3>
                                    <p class="term-subtitle">ผนวก 9 - ระเบียบข้อปฏิบัติในการควบคุมฝุ่นละออง</p>
                                </div>
                            </div>
                            
                            <div class="term-content">
                                <div class="term-quote">
                                    "(4.1) จัดทำรั้ว...รอบบริเวณที่มีการก่อสร้างให้มีความสูงจากพื้นดินไม่น้อยกว่า 2 เมตร... (4.5) ให้...มีสิ่งปกคลุมกองก่อวัสดุที่ใช้อย่างมิดชิด ไม่ให้มีการฟุ้งกระจายของฝุ่น... (4.8) ให้ล้างทำความสะอาดตัวรถและล้อรถ...ก่อนนำรถทุกชนิดออกสู่ภายนอกบริเวณโครงการ"
                                </div>
                                
                                <h4>การตีความทางกฎหมาย:</h4>
                                <p>ข้อกำหนดเหล่านี้เป็น "มาตรการป้องกันมลพิษเชิงเทคนิค" ที่มีผลบังคับตามพระราชบัญญัติส่งเสริมและรักษาคุณภาพสิ่งแวดล้อมแห่งชาติ พ.ศ. 2535</p>
                                
                                <h4>การละเมิดที่พบ:</h4>
                                <ul class="implication-list">
                                    <li><span class="severity-indicator severity-high"></span>ไม่มีรั้วกั้นความสูง 2 เมตรตามกำหนด <span class="evidence-badge">หลักฐานยืนยัน</span></li>
                                    <li><span class="severity-indicator severity-high"></span>ไม่มีการปกคลุมกองวัสดุอย่างมิดชิด <span class="evidence-badge">หลักฐานยืนยัน</span></li>
                                    <li><span class="severity-indicator severity-medium"></span>ไม่มีการล้างทำความสะอาดล้อรถก่อนออกจากไซต์งาน</li>
                                </ul>
                                
                                <div class="action-required">
                                    <div class="action-title">การดำเนินการที่ควรทำ:</div>
                                    <p>กทม. สามารถรายงานการละเมิดต่อกรมควบคุมมลพิษเพื่อดำเนินการตามกฎหมายสิ่งแวดล้อม และปรับตามสัญญาพร้อมกัน</p>
                                </div>
                                
                                <div class="page-reference">อ้างอิง: หน้า 35 ของสัญญา</div>
                            </div>
                        </div>

                        <!-- Term 6: Enforcement of Penalties -->
                        <div class="contract-term-card" data-animate>
                            <div class="term-header">
                                <div class="term-icon">
                                    <i class="fas fa-hammer"></i>
                                </div>
                                <div>
                                    <h3 class="term-title">การบังคับค่าปรับและค่าเสียหาย</h3>
                                    <p class="term-subtitle">ข้อ 18 - การบังคับค่าปรับ ค่าเสียหาย และค่าใช้จ่าย</p>
                                </div>
                            </div>
                            
                            <div class="term-content">
                                <div class="term-quote">
                                    "ในกรณีที่ผู้รับจ้างไม่ปฏิบัติตามสัญญาข้อใดข้อหนึ่งด้วยเหตุใด ๆ ก็ตาม จนเป็นเหตุให้เกิดค่าปรับ ค่าเสียหาย หรือค่าใช้จ่ายแก่ผู้ว่าจ้าง ผู้รับจ้างต้องชดใช้ค่าปรับ ค่าเสียหาย หรือค่าใช้จ่ายดังกล่าวให้แก่ผู้ว่าจ้างโดยสิ้นเชิงภายในกำหนด 15 (สิบห้า) วัน..."
                                </div>
                                
                                <h4>การตีความทางกฎหมาย:</h4>
                                <p>ข้อนี้เป็น "กลไกการบังคับชำระหนี้" ที่ให้อำนาจ กทม. ในการหักเงินจากแหล่งต่างๆ โดยไม่ต้องรอความยินยอมจากผู้รับจ้าง</p>
                                
                                <h4>ช่องทางการบังคับชำระ:</h4>
                                <ul class="implication-list">
                                    <li><span class="severity-indicator severity-high"></span>หักจากเงินค่าจ้างที่ต้องชำระ</li>
                                    <li><span class="severity-indicator severity-high"></span>หักจากเงินประกันผลงาน</li>
                                    <li><span class="severity-indicator severity-high"></span>บังคับจากหลักประกันการปฏิบัติตามสัญญา</li>
                                </ul>
                                
                                <div class="action-required">
                                    <div class="action-title">การดำเนินการที่ควรทำ:</div>
                                    <p>กทม. ควรออกหนังสือแจ้งการหักเงินอย่างเป็นทางการและดำเนินการหักเงินตามกลไกที่สัญญาระบุไว้</p>
                                </div>
                                
                                <div class="page-reference">อ้างอิง: หน้า 8-9 ของสัญญา</div>
                            </div>
                        </div>
                    </div>

                    <!-- Summary of Contract Violations -->
                    <div class="card" data-animate style="margin-top: 40px;">
                        <h3 class="subsection-title">สรุปการละเมิดสัญญาที่ตรวจพบ</h3>
                        <div class="contract-violation-grid">
                            <div class="violation-item">
                                <h4>การละเมิดด้านเวลา</h4>
                                <p>ส่งมอบงานล่าช้า 23 วัน จากกำหนด 450 วัน</p>
                                <div class="page-reference">ผิดข้อ 6</div>
                            </div>
                            <div class="violation-item">
                                <h4>การละเมิดด้านความปลอดภัย</h4>
                                <p>ขาดมาตรการความปลอดภัยขั้นพื้นฐานในการจราจร</p>
                                <div class="page-reference">ผิดผนวก 7</div>
                            </div>
                            <div class="violation-item">
                                <h4>การละเมิดด้านสิ่งแวดล้อม</h4>
                                <p>ไม่ควบคุมฝุ่นละออง PM2.5 ตามมาตรฐาน</p>
                                <div class="page-reference">ผิดผนวก 9</div>
                            </div>
                            <div class="violation-item">
                                <h4>การละเมิดด้านคุณภาพงาน</h4>
                                <p>งานที่ทำไม่เป็นไปตามมาตรฐานในแบบและรายการ</p>
                                <div class="page-reference">ผิดข้อ 13</div>
                            </div>
                        </div>
                        
                        <div class="action-required" style="margin-top: 25px;">
                            <div class="action-title">ข้อเสนอแนะทางกฎหมาย:</div>
                            <p>จากการวิเคราะห์สัญญาอย่างละเอียด พบว่ามีการละเมิดสัญญาหลายประการที่ให้สิทธิ์ กทม. ในการบอกเลิกสัญญาได้ทันที โดยไม่จำเป็นต้องรอการแก้ไขจากผู้รับจ้าง การดำเนินการตามสิทธิ์ทางกฎหมายเหล่านี้จะช่วยป้องกันความเสียหายเพิ่มเติมและสร้างบรรทัดฐานในการบังคับใช้สัญญาอย่างจริงจัง</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section class="section evidence-section" style="background-color: var(--surface-color);">
                <div class="container">
                    <h2 class="section-title" data-animate>V. หลักฐานการละเมิดสัญญาและความเสี่ยง</h2>
                    <p class="section-subtitle" data-animate>รวบรวมหลักฐานภาพ, วิดีโอ, และเอกสารที่แสดงถึงการละเมิดสัญญาและความเสี่ยงต่อความปลอดภัยของประชาชน</p>
                    
                   <div class="card" data-animate>
                        <h3 class="subsection-title">ภัยอันตรายจากพื้นที่ก่อสร้าง</h3>
                        <div class="evidence-gallery">
                            <div class="evidence-item">
                                <div class="evidence-category">ไฟไหม้</div>
                                <a href="https://www.youtube.com/watch?v=XUgQHLjgips" target="_blank">
                                    <img src="images/safety.jpeg" alt="ภัยอันตรายจากพื้นที่ก่อสร้าง - ไฟไหม้" style="width:100%; height:200px; object-fit: cover;">
                                </a>
                                <div class="evidence-caption">วิดีโอแสดงเหตุเพลิงไหม้จากไซต์งานก่อสร้าง</div>
                            </div>
                            <div class="evidence-item">
                                <div class="evidence-category">อุบัติเหตุ</div>
                                <a href="https://maps.app.goo.gl/GuquKG7sEuM9sULv9" target="_blank">
                                    <img src="images/safety2.jpeg" alt="จุดเกิดอุบัติเหตุในพื้นที่ก่อสร้าง" style="width:100%; height:200px; object-fit: cover;">
                                </a>
                                <div class="evidence-caption">จุดเกิดอุบัติเหตุในพื้นที่ก่อสร้าง</div>
                            </div>
                            <div class="evidence-item">
                                <div class="evidence-category">ความมืดอันตราย</div>
                                <a href="https://maps.app.goo.gl/KKf4uFRXMZGURBC27" target="_blank">
                                    <img src="images/dark.jpeg" alt="พื้นที่ก่อสร้างที่มืดและอันตรายในเวลากลางคืน" style="width:100%; height:200px; object-fit: cover;">
                                </a>
                                <div class="evidence-caption">พื้นที่ก่อสร้างที่มืดและอันตรายในเวลากลางคืน</div>
                            </div>
                        </div>
                    </div>

                    <div class="card" data-animate>
                        <h3 class="subsection-title">ผลกระทบต่อสิ่งแวดล้อมและสุขภาพ</h3>
                        <div class="evidence-gallery">
                            <div class="evidence-item">
                                <div class="evidence-category">PM2.5</div>
                                <a href="https://maps.app.goo.gl/cSszYDJ" target="_blank">
                                    <img src="images/enviroment.jpeg" alt="ระดับฝุ่น PM2.5 ในพื้นที่ก่อสร้าง" style="width:100%; height:200px; object-fit: cover;">
                                </a>
                                <div class="evidence-caption">ระดับฝุ่น PM2.5 ในพื้นที่ก่อสร้าง</div>
                            </div>
                            <div class="evidence-item">
                                <div class="evidence-category">มลพิษ</div>
                                <a href="https://maps.app.goo.gl/Z6QJJGbTTAKQwGET9" target="_blank">
                                    <img src="images/community.jpeg" alt="พื้นที่ก่อสร้างและผลกระทบต่อสิ่งแวดล้อม" style="width:100%; height:200px; object-fit: cover;">
                                </a>
                                <div class="evidence-caption">พื้นที่ก่อสร้างและผลกระทบต่อสิ่งแวดล้อม</div>
                            </div>
                            <div class="evidence-item">
                                <div class="evidence-category">ความเสี่ยงเครื่องจักร</div>
                                <a href="https://maps.app.goo.gl/n8sxvNat2ZuUiRLz8" target="_blank">
                                    <img src="images/machineunsafe.jpeg" alt="เครื่องจักรที่ไม่ปลอดภัยในพื้นที่ก่อสร้าง" style="width:100%; height:200px; object-fit: cover;">
                                </a>
                                <div class="evidence-caption">เครื่องจักรที่ไม่ปลอดภัยในพื้นที่ก่อสร้าง</div>
                            </div>
                        </div>
                    </div>

                    <div class="card" data-animate>
                        <h3 class="subsection-title">ผลกระทบต่อชุมชน</h3>
                        <div class="evidence-gallery">
                            <div class="evidence-item">
                                <div class="evidence-category">ผลกระทบต่อชุมชน</div>
                                <a href="https://pr-bangkok.com/?p=473822" target="_blank">
                                    <img src="images/badforcommunity.jpeg" alt="ผลกระทบจากการก่อสร้างต่อชุมชน" style="width:100%; height:200px; object-fit: cover;">
                                </a>
                                <div class="evidence-caption">ผลกระทบจากการก่อสร้างต่อชุมชนโดยรอบ</div>
                            </div>
                            <div class="evidence-item">
                                <div class="evidence-category">หลุมอันตราย</div>
                                <a href="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1NFAja.img?w=768&h=1023&m=6&x=592&y=427&s=54&d=54" target="_blank">
                                    <img src="images/hole.jpeg" alt="หลุมอันตรายในพื้นที่ก่อสร้าง" style="width:100%; height:200px; object-fit: cover;">
                                </a>
                                <div class="evidence-caption">หลุมอันตรายในพื้นที่ก่อสร้าง</div>
                            </div>
                            <div class="evidence-item">
                                <div class="evidence-category">ป้ายรถโดยสารโรงเรียน</div>
                                <a href="https://static.amarintv.com/media/Dpe4A5wywPfUHk234CKbTkvJg0CTESpTMR6LNc3gYDGioyPpV6a3rEByqg88KeZ5b.jpg" target="_blank">
                                    <img src="images/busstopschool.jpeg" alt="ป้ายรถโดยสารโรงเรียนใกล้พื้นที่ก่อสร้าง" style="width:100%; height:200px; object-fit: cover;">
                                </a>
                                <div class="evidence-caption">ป้ายรถโดยสารโรงเรียนใกล้พื้นที่ก่อสร้าง</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        <footer>
            <div class="container"><p>© 2025 กลุ่มประชาชนผู้ได้รับผลกระทบ ถนนพุทธมณฑลสาย 1</p><p class="footer-credit">This is a fictional campaign page for demonstration purposes.</p></div>
        </footer>
    </div>

    <div class="modal-overlay" id="success-modal">
        <div class="modal-content">
            <button class="modal-close-button" id="modal-close-button">&times;</button>
            <h2>ขอบคุณที่ร่วมลงชื่อ!</h2>
            <p>พลังของคุณคืออีกหนึ่งก้าวสำคัญสู่การเปลี่ยนแปลง<br>โปรดช่วยกันส่งต่อเรื่องนี้ให้ดังยิ่งขึ้น</p>
            <div class="social-share-buttons">
                <a href="#" id="share-facebook" class="social-share-button ss-facebook" target="_blank"><i class="fab fa-facebook-f"></i> Share on Facebook</a>
                <a href="#" id="share-twitter" class="social-share-button ss-twitter" target="_blank"><i class="fab fa-twitter"></i> Share on X</a>
                <a href="#" id="share-line" class="social-share-button ss-line" target="_blank"><i class="fab fa-line"></i> Share on LINE</a>
            </div>
        </div>
    </div>
    
    <!-- Hidden iframe for background form submission -->
    <iframe name="hidden_iframe" id="hidden_iframe" style="display:none;"></iframe>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            let formSubmitted = false;
            const hiddenIframe = document.getElementById('hidden_iframe');
            if (hiddenIframe) {
                hiddenIframe.onload = function() {
                    if (formSubmitted) {
                        handleSuccessfulSubmission();
                        formSubmitted = false; // Reset flag
                    }
                }
            }

            const SIGNATURE_GOAL = 5000;
            const pageUrl = window.location.href;
            const shareText = "ขอคัดค้านการขยายเวลาส่งมอบงานโครงการปรับปรุงถนนพุทธมณฑลสาย 1! มาร่วมลงชื่อเพื่อเรียกร้องความปลอดภัยและความรับผิดชอบ #คนฝั่งธนจะไม่ทน";
            const form = document.getElementById('main-petition-form');
            const nameInput = document.getElementById('name-input');
            const invalidFeedback = document.querySelector('.invalid-feedback');
            const successModal = document.getElementById('success-modal');
            const closeModalButton = document.getElementById('modal-close-button');
            const signatureCountElement = document.querySelector('.signature-count[data-count]');
            const progressBarFill = document.getElementById('progress-bar-fill');
            const progressTextCurrent = document.getElementById('progress-text-current');
            
            // Countdown Timer
            function updateCountdown() {
                const now = new Date();
                const targetDate = new Date(now);
                targetDate.setDate(now.getDate() + 7); // 7 days from now
                
                const timeRemaining = targetDate - now;
                
                const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
                
                document.getElementById('days').textContent = days.toString().padStart(2, '0');
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            }
            
            // Update countdown every second
            setInterval(updateCountdown, 1000);
            updateCountdown(); // Initial call
            
            const animationObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            document.querySelectorAll('[data-animate]').forEach(el => animationObserver.observe(el));

            const countUp = (element, startValue = 0) => {
                const target = parseInt(element.dataset.count, 10);
                if (startValue === target) return;
                
                const duration = 1500;
                let start = null;
                const step = (timestamp) => {
                    if (!start) start = timestamp;
                    const progress = Math.min((timestamp - start) / duration, 1);
                    const currentNumber = Math.floor(progress * (target - startValue) + startValue);
                    element.textContent = currentNumber.toLocaleString('en-US');
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        element.textContent = target.toLocaleString('en-US');
                    }
                };
                window.requestAnimationFrame(step);
            };

            const numberObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const startVal = entry.target.classList.contains('signature-count') ? parseInt(entry.target.dataset.count, 10) : 0;
                        countUp(entry.target, startVal);
                        if(entry.target.classList.contains('signature-count')) {
                           updateProgressBar(parseInt(entry.target.dataset.count, 10));
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            document.querySelectorAll('[data-count]').forEach(el => numberObserver.observe(el));

            if(form) {
                form.addEventListener('submit', function(e) {
                    if (nameInput.value.trim() === '') {
                        e.preventDefault(); // Stop submission only if invalid
                        nameInput.classList.add('is-invalid');
                        invalidFeedback.style.display = 'block';
                    } else {
                        nameInput.classList.remove('is-invalid');
                        invalidFeedback.style.display = 'none';
                        formSubmitted = true;
                    }
                });
            }

            if(nameInput) {
                nameInput.addEventListener('input', () => {
                    if (nameInput.value.trim() !== '') {
                        nameInput.classList.remove('is-invalid');
                        invalidFeedback.style.display = 'none';
                    }
                });
            }
            
            function handleSuccessfulSubmission() {
                const currentCount = parseInt(signatureCountElement.dataset.count, 10);
                const newCount = currentCount + 1;
                signatureCountElement.dataset.count = newCount;
                countUp(signatureCountElement, currentCount);
                updateProgressBar(newCount);
                addSignatory();
                showSuccessModal();
                form.reset();
            }

            function showSuccessModal() { if(successModal) successModal.classList.add('is-visible'); }
            function hideSuccessModal() { if(successModal) successModal.classList.remove('is-visible'); }
            if(closeModalButton) closeModalButton.addEventListener('click', hideSuccessModal);
            if(successModal) successModal.addEventListener('click', (e) => { if (e.target === successModal) { hideSuccessModal(); } });
            
            // Social Share Links
            const shareFacebook = document.getElementById('share-facebook');
            if(shareFacebook) shareFacebook.href = \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(pageUrl)}\`;
            const shareTwitter = document.getElementById('share-twitter');
            if(shareTwitter) shareTwitter.href = \`https://twitter.com/intent/tweet?text=\${encodeURIComponent(shareText)}&url=\${encodeURIComponent(pageUrl)}\`;
            const shareLine = document.getElementById('share-line');
            if(shareLine) shareLine.href = \`https://social-plugins.line.me/lineit/share?url=\${encodeURIComponent(pageUrl)}&text=\${encodeURIComponent(shareText)}\`;
            
            function updateProgressBar(currentSignatures) {
                const percentage = (currentSignatures / SIGNATURE_GOAL) * 100;
                if(progressBarFill) progressBarFill.style.width = \`\${Math.min(percentage, 100)}%\`;
                if(progressTextCurrent) progressTextCurrent.textContent = currentSignatures.toLocaleString('en-US');
            }

            const signatoriesList = document.getElementById('recent-signatories-list');
            function addSignatory() {
                 if (signatoriesList) {
                    const newSignatory = document.createElement('li');
                    newSignatory.className = 'recent-signatory new';
                    newSignatory.textContent = 'ผู้สนับสนุนใหม่';
                    signatoriesList.prepend(newSignatory);
                    setTimeout(() => { newSignatory.classList.remove('new'); }, 100);
                    if (signatoriesList.children.length > 5) { signatoriesList.lastChild.remove(); }
                }
            }
            
            // Simulate new signatures for social proof
            setInterval(() => {
                const currentCount = parseInt(signatureCountElement.dataset.count, 10);
                const newCount = currentCount + 1;
                signatureCountElement.dataset.count = newCount;
                signatureCountElement.textContent = newCount.toLocaleString('en-US');
                updateProgressBar(newCount);
                addSignatory();
            }, 8000); // Add a new anonymous signature every 8 seconds

        });
    </script>
</body>
</html>
`;

// Replace local image paths with placeholders to avoid broken images.
const imgRegex = /<img src="images\/([^"]+)" alt="([^"]+)" style="([^"]+)">/g;
const finalHtml = originalPetitionHtml.replace(imgRegex, (match, src, alt, style) => {
    return `<div style="${style}; background-color: #2a2a2a; display: flex; align-items: center; justify-content: center; text-align: center; padding: 1rem; color: #888; font-size: 0.9rem; border: 1px dashed #444;">(Image) ${alt}</div>`;
});


const PetitionWorkstation: React.FC = () => {
    return (
        <iframe
            srcDoc={finalHtml}
            title="ยื่นคำร้อง"
            // Use a height that fills the viewport minus the header/padding to avoid double scrollbars.
            style={{ width: '100%', height: 'calc(100vh - 8rem)', border: 'none' }}
        />
    );
};

export default PetitionWorkstation;
