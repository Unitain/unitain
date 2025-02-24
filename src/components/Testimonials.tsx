import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">{t('testimonials.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.slice(0, 3).map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
            <div className="mt-4 border-t pt-4">
              <p className="font-medium text-gray-900">{testimonial.name}</p>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <span>{testimonial.country}</span>
                <span className="text-gray-300">•</span>
                <span>{testimonial.location}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const testimonials = [
  {
    name: 'Daan Vermeer',
    text: 'Incredible service! I saved over €2,500 in taxes and didn\'t have to deal with any paperwork. Highly recommended for expats moving to Portugal.',
    rating: 5,
    location: 'Amsterdam',
    country: '🇳🇱 Netherlands',
  },
  {
    name: 'Stefan Müller',
    text: 'Fast, efficient, and stress-free. I was dreading the bureaucracy, but UNITAIN handled everything. My car was registered in no time!',
    rating: 5,
    location: 'Berlin',
    country: '🇩🇪 Germany',
  },
  {
    name: 'Emma Thompson',
    text: 'I can\'t believe how easy this was! The whole process was smooth, and I avoided thousands in unnecessary taxes.',
    rating: 5,
    location: 'London',
    country: '🇬🇧 United Kingdom',
  },
];

export default Testimonials;