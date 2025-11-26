import React from 'react';
import { TestimonialCard } from '../common/TestimonialCard';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Ravi Sharma',
      location: 'Mumbai',
      rating: 5,
      testimonial: 'Got my Adobe apps activated in minutes! Great support throughout the process. Highly recommended for freelancers.',
      avatarColor: 'bg-red-500'
    },
    {
      name: 'Priya Mehta',
      location: 'Delhi',
      rating: 5,
      testimonial: 'Perfect for students and freelancers. Affordable and genuine access to all Adobe apps. Saved me thousands!',
      avatarColor: 'bg-blue-500'
    },
    {
      name: 'Arjun Patel',
      location: 'Bangalore',
      rating: 5,
      testimonial: 'Amazing service! Firefly AI tools are a game-changer for my design work. Got the license instantly after payment.',
      avatarColor: 'bg-green-500'
    }
  ];

  return (
    <section id="reviews" className="bg-white px-4 py-16 lg:py-24 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12 lg:mb-16">
          What Our Customers Say
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};