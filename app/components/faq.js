'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FaqSection() {
  return (
    <section className="w-full h-[80vh] py-16 bg-white">
      <div className="max-w-[85%] mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left text-lg text-gray-800 hover:no-underline hover:text-[#DB4444]">
              How can I track my order?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Once your order is shipped, we’ll send you a tracking number via email. You can use it to track the delivery status on our website.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left text-lg text-gray-800 hover:no-underline hover:text-[#DB4444]">
              What is your return policy?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              We accept returns within 7 days of delivery. Products must be unused and in original packaging. Contact support to initiate a return.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left text-lg text-gray-800 hover:no-underline hover:text-[#DB4444]">
              Do you offer international shipping?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Currently, we only deliver within Pakistan. We are working to expand internationally soon!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left text-lg text-gray-800 hover:no-underline hover:text-[#DB4444]">
              Can I cancel my order?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Yes, you can cancel your order before it is shipped. Once shipped, cancellation is not possible but you may return it.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}
