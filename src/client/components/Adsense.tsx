import React from "react";

const AdsComponents = () => {
  return (
    <div style={{ minHeight: "200px" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: "200px" }}
        data-ad-client={process.env.ADSENSE_CLIENT}
        data-ad-slot={process.env.ADSENSE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>
  );
};

export default AdsComponents;
