export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-6">
        Have a question, suggestion, or need help? Fill out the form below and our team will get back to you soon.
      </p>
      <form className="flex flex-col gap-4 items-center">
        <input type="text" placeholder="Your Name" className="w-full max-w-md px-4 py-2 border rounded focus:outline-none focus:ring" />
        <input type="email" placeholder="Your Email" className="w-full max-w-md px-4 py-2 border rounded focus:outline-none focus:ring" />
        <textarea placeholder="Your Message" className="w-full max-w-md px-4 py-2 border rounded focus:outline-none focus:ring min-h-[100px]" />
        <button type="submit" className="bg-neutral-900 text-white px-6 py-2 rounded hover:bg-neutral-800 transition">Send Message</button>
      </form>
    </div>
  );
} 