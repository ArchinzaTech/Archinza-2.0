import { FaWhatsapp, FaLinkedinIn, FaLink } from "react-icons/fa";

const ShareSection = () => {
  return (
    <section className="px-6 py-12 md:py-16 font-sans lg:py-20 bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-10">

        {/* Did You Know */}
        <div className="rounded-lg border border-orange-500 bg-gray-100 dark:bg-neutral-900 px-6 py-6 md:px-10 md:py-8">
          <h2 className="text-2xl font-bold mb-3">Did you know?</h2>
          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg">
            AI-powered stakeholder analysis utilizes sentiment analysis and predictive algorithms
            to foresee and address potential conflicts before they arise.
          </p>
        </div>

        {/* Share */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold">
            <span className="text-orange-500">Love Archinza?</span> Share it with your friends!
          </h3>
          <p className="mt-3 text-gray-700 dark:text-gray-300 max-w-2xl">
            Invite your network to experience the simplicity and efficiency of AI-based matchmaking.
          </p>
          <p className="mt-2 font-bold">
            <span className="text-orange-500">SHARE ARCHINZA NOW</span> AND MAKE A DIFFERENCE!
          </p>

          {/* Share Icons */}
              <div className="flex justify-center gap-6 mt-5">
      <a href="#" aria-label="Share on WhatsApp" className="text-green-500 text-4xl hover:scale-110 transition">
        <FaWhatsapp />
      </a>
      <a href="#" aria-label="Share on LinkedIn" className="text-blue-600 text-4xl hover:scale-110 transition">
        <FaLinkedinIn />
      </a>
      <a href="#" aria-label="Copy Link" className="text-orange-600 text-4xl hover:scale-110 transition">
        <FaLink />
      </a>
    </div>

        </div>

        {/* Get Started */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold">Get Started for Free</h3>
          <p className="mt-3 text-gray-700 dark:text-gray-300 max-w-2xl">
            Archinza matches you with the right people and products in the industry—effortlessly.
          </p>
          <p className="mt-2 font-bold">
            WHY WAIT? <span className="text-orange-500">TRY ARCHINZA NOW!</span>
          </p>

          {/* CTA Button */}
          <a
            href="#"
            className="inline-block mt-5 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
          >
            Get Early Access – <span className="line-through">₹5999</span> FREE
          </a>
        </div>
      </div>
    </section>
  );
}

export default ShareSection;
