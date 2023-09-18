import { Helmet } from 'react-helmet';

type SEOProps = {
  title: string;
  description: string;
  image?: string;
};

export default function SEO({ title, description, image }: SEOProps) {
  return (
    <Helmet
      title={title}
      meta={[
        {
          name: 'description',
          content: description
        },
        {
          name: 'image',
          content: image
        },
        {
          property: 'og:url',
          content: 'https://app.polkamarkets.com'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:title',
          content: title
        },
        {
          property: 'og:description',
          content: description
        },
        {
          property: 'og:image',
          content: image
        },
        {
          property: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          property: 'twitter:title',
          content: title
        },
        {
          property: 'twitter:description',
          content: description
        },
        {
          property: 'twitter:image',
          content: image
        }
      ]}
    />
  );
}
