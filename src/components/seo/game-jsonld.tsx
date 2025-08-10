import React from 'react';

type GameJsonLdProps = {
  name: string;
  description: string;
  url: string;
  genre?: string;
  imageUrl?: string;
};

export default function GameJsonLd({ name, description, url, genre, imageUrl }: GameJsonLdProps) {
  const videoGame = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name,
    description,
    url,
    genre,
    image: imageUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Retro Arcade Zone',
      url: 'https://retroarcade.in',
    },
    inLanguage: 'en',
    applicationCategory: 'Game',
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://retroarcade.in/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name,
        item: url,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify([videoGame, breadcrumb]) }}
    />
  );
}


