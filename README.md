# Portuguese Vehicle Tax Exemption Service

A web application to help expats determine eligibility for vehicle tax exemption in Portugal and process their applications.

## Features

- Eligibility checker
- Secure payment processing
- User authentication
- Contact form with rate limiting
- Responsive design
- Multi-language support (coming soon)

## Tech Stack

- React 18.3
- TypeScript 5.5
- Vite 5.4
- Tailwind CSS 3.4
- Supabase
- PayPal Payments

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
```

## Database Setup

The application uses Supabase for data storage. Tables:

- `eligibility_checks`: Stores user eligibility check results
- `contact_requests`: Manages contact form submissions

## Contributing

1. Create a feature branch
2. Make changes
3. Submit a pull request

## License

Proprietary software. All rights reserved.