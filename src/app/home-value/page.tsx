'use client';

import { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';
import { HomeValueFlow } from '@/components/home-value/HomeValueFlow';

export default function HomeValuePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HomeValueFlow />
      </main>
      <Footer />
    </div>
  );
}