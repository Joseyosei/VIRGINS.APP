import React from 'react';

export type PageView = 
  | 'home' 
  | 'about' 
  | 'careers' 
  | 'press' 
  | 'contact' 
  | 'privacy' 
  | 'terms' 
  | 'cookies' 
  | 'safety' 
  | 'pricing' 
  | 'how-it-works';

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
  age: string;
  faith: string;
  hobbies: string;
  values: string;
  lookingFor: string;
}

export interface GeminiResponse {
  bio: string;
  advice: string;
}