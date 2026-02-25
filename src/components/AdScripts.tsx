
'use client';

import Script from 'next/script';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export function AdScripts() {
  return (
    <>
      {/* 
        Monetag Ad Injections 
        Strategy: afterInteractive to prevent blocking LCP.
        We wrap the injector to avoid layout shifts by not rendering content until ready.
      */}
      <Script id="ad-injector" strategy="afterInteractive">
        {`(function(s){
          s.dataset.zone='9639504';
          s.src='https://bvtpk.com/tag.min.js';
          // Add error handling to prevent script failures from breaking the page
          s.onerror = function() { console.warn('Ad script failed to load'); };
        })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
      </Script>

      {/* Google Analytics - Tier 1 Tracking */}
      {GA_TRACKING_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  'anonymize_ip': true,
                  'cookie_flags': 'SameSite=None;Secure'
                });
                `}
          </Script>
        </>
      )}
    </>
  );
}
