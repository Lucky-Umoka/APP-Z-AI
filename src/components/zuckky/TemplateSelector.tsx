'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';
import { CheckCircle2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface TemplateSelectorProps {
  onSelect: (template: string) => void;
}

const templates = [
  { name: 'Hormozi', imageId: 'hormozi' },
  { name: 'Gadzhi', imageId: 'gadzhi' },
  { name: 'Gary Vee', imageId: 'garyvee' },
  { name: 'Custom', imageId: 'custom' },
];

export default function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [selected, setSelected] = React.useState<string | null>(null);

  const handleSelect = (name: string) => {
    setSelected(name);
    setTimeout(() => onSelect(name), 300);
  };
  
  const getImage = (id: string) => {
    return PlaceHolderImages.find(img => img.id === id) || PlaceHolderImages[0];
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
      {templates.map(template => {
        const imageData = getImage(template.imageId);
        return (
          <Card
            key={template.name}
            onClick={() => handleSelect(template.name)}
            className={`relative cursor-pointer transition-all duration-300 overflow-hidden group ${
              selected === template.name ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:border-primary/50'
            }`}
          >
            <CardContent className="p-0">
              <Image
                src={imageData.imageUrl}
                alt={template.name}
                width={150}
                height={200}
                data-ai-hint={imageData.imageHint}
                className="object-cover w-full h-32 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-3">
                <p className="font-medium text-sm text-center">{template.name}</p>
              </div>
            </CardContent>
            {selected === template.name && (
              <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary-foreground animate-in zoom-in-50" />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
