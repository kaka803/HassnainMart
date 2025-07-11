'use client'
import { FaStar } from 'react-icons/fa'

const testimonials = [
  {
    name: 'Ayesha Khan',
    image: '/testimonial1.jpg',
    rating: 5,
    review:
      'Amazing quality! I ordered a jacket and it’s even better than expected. Will definitely shop again!',
  },
  {
    name: 'Ali Raza',
    image: '/testimonial2.jpg',
    rating: 4,
    review:
      'Delivery was fast and the product was premium. Customer support was also helpful!',
  },
  {
    name: 'Sara Malik',
    image: '/testimonial3.jpg',
    rating: 5,
    review:
      'Great shopping experience. Easy checkout and loved the packaging!',
  },
]

export default function TestimonialSection() {
  return (
    <section className="w-full  mb-20  py-20 bg-white">
      <div className="max-w-[85%] mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
      </div>

      {/* Flex container */}
      <div className="max-w-[85%] mx-auto flex flex-wrap justify-center gap-8">
        {testimonials.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow w-full sm:w-[300px] bg-white"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-full object-cover mb-4"
            />
            <p className="text-gray-600 text-base mb-4">{item.review}</p>

            <div className="flex text-[#DB4444] text-sm mb-2">
              {Array.from({ length: item.rating }).map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>

            <p className="font-semibold text-gray-900">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
