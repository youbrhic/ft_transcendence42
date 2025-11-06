import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(34, 40, 49)] p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mx-auto mb-6 w-24 h-24 flex items-center justify-center rounded-full bg-blue-50">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="w-12 h-12 text-blue-600"
          >
            <path d="M11 7h2v6h-2z" fill="currentColor" />
            <path d="M12 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="currentColor" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="0.6" opacity="0.15" />
          </svg>
        </div>

        <h1 className="text-5xl font-extrabold text-gray-800 mb-2">404</h1>
        <p className="text-gray-600 mb-6">We couldn't find the page you're looking for.</p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 transition"
          aria-label="Go back home"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}