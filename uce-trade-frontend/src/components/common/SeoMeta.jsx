import { Helmet } from 'react-helmet-async';

const SeoMeta = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title} | UCE Trade</title>
      <meta name="description" content={description} />
      {/* Open Graph para cuando compartan el link en WhatsApp/Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Helmet>
  );
};

export default SeoMeta;