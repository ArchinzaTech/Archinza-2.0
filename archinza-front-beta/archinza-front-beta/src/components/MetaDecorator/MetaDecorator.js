import React from "react";
import { Helmet } from "react-helmet";

const MetaDecorator = ({
  metaTitle,
  metaDesc,
  canonicalLink,
  
}) => {
  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={canonicalLink}></link>

      {/* <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={metaTitle} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:url" content={canonicalLink} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={metaDesc} />
      
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:url" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />

      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:url" content={canonicalLink} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" /> */}

      {process.env.REACT_APP_APP_MODE === "production" ? (
        <meta name="robots" content="index, follow" />
      ) : (
        <meta name="robots" content="noindex" />
      )}
    </Helmet>
  );
};

export default MetaDecorator;
