import React from "react";
import Script from "next/script";

const AdsComponents = () => {
  return (
    <div style={{ maxHeight: "100px", position: "absolute", bottom: 0, left: 0, right: 0 }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: "200px" }}
        data-ad-client={process.env.ADSENSE_CLIENT}
        data-ad-slot={process.env.ADSENSE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script
        id="adsense-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }}
      />
    </div>
  );
};

export default AdsComponents;
