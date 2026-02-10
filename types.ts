import React from 'react';

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface BioRequest {
  name: string;
  hobbies: string;
  values: string;
  lookingFor: string;
}

export interface GeminiResponse {
  bio: string;
  advice: string;
}