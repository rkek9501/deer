import React from "react";

const AdsComponents = () => {
  return <div style={{ minHeight: "200px" }}>
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.ADSENSE_CLIENT}`}
      crossOrigin="anonymous"></script>
    <ins className="adsbygoogle"
      style={{display:"block", minHeight: "200px"}}
      data-ad-client={process.env.ADSENSE_CLIENT}
      data-ad-slot={process.env.ADSENSE_SLOT}
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
    <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  </div>;
};

export default AdsComponents;
