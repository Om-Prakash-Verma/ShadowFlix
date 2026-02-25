'use client'

import React from 'react';

type BackgroundImageProps = {
  posterUrl: string;
  backdropUrl: string;
};

export function BackgroundImage({ posterUrl, backdropUrl }: BackgroundImageProps) {

  const backgroundStyles: React.CSSProperties = {
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(4px)',
  };

  return (
    <>
      <div
        className='fixed inset-0 z-[-1] bg-background md:hidden'
        style={{
          backgroundImage: `url(${posterUrl})`,
          ...backgroundStyles,
        }}
      />
      <div
        className='fixed inset-0 z-[-1] bg-background hidden md:block'
        style={{
          backgroundImage: `url(${backdropUrl})`,
          ...backgroundStyles,
        }}
      />
    </>
  );
}
