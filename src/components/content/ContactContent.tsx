import { Github, Linkedin, Mail } from 'lucide-react';
import { useState } from 'react';

export function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder - would connect to actual form handler
    console.log('Form submitted:', formData);
    alert('Form submission functionality to be implemented');
  };

  return (
    <div className="space-y-6">
      {/* Social links */}
      <div className="flex gap-4 justify-center mb-8">
        <a
          href="https://github.com/erikgaren"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <Github className="w-6 h-6 text-amber-500" />
        </a>
        <a
          href="https://linkedin.com/in/erikgaren"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <Linkedin className="w-6 h-6 text-amber-500" />
        </a>
        <a
          href="mailto:contact@erikgaren.dev"
          className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <Mail className="w-6 h-6 text-amber-500" />
        </a>
      </div>

      {/* Contact form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:border-amber-500 focus:outline-none text-neutral-300"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:border-amber-500 focus:outline-none text-neutral-300"
            required
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={5}
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:border-amber-500 focus:outline-none text-neutral-300 resize-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-neutral-900 font-semibold rounded-lg transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
