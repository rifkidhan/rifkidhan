import { FC } from 'react';
import { SEO } from '@components/common';

interface IProductLD {
  type?: string;
  headline?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  authorName?: string | string[];
}

const BlogLD: FC<IProductLD> = (props) => {
  const setAuthor = (authorName?: string | string[]) => {
    if (Array.isArray(authorName)) {
      return authorName.map((author: any) => ({
        '@type': 'Person',
        name: author
      }));
    } else if (authorName) {
      return { '@type': 'Person', name: authorName };
    }

    return undefined;
  };
  const postLD = (props: IProductLD) => {
    const { type, headline, datePublished, dateModified, authorName, image } =
      props;
    return {
      __html: `{
                {
                    "@context": "https://schema.org",
                    "@type": "${type}",
                    "headline": "${headline}",
                    "image": "${image}",
                    "datePublished": "${datePublished}",
                    "dateModified": "${dateModified}",
                    "author": [{
                      "@type" : "Person",
                      "name": "${authorName}"
                    }]
                  }
            }`
    };
  };
  return (
    <SEO>
      <script
        key="post-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={postLD(props)}
      />
    </SEO>
  );
};

export default BlogLD;
