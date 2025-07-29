import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  return (
    <div>
      <div className="text-center">
        <Link href="/" className="inline-block">
          <h2 className="text-3xl font-bold text-eco-green">Atom Eco Store</h2>
        </Link>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Create your account
        </h2>
      </div>

      <form className="mt-8 space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                First name
              </label>
              <input
                id="first-name"
                name="first-name"
                type="text"
                autoComplete="given-name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-eco-green focus:border-eco-green"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                Last name
              </label>
              <input
                id="last-name"
                name="last-name"
                type="text"
                autoComplete="family-name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-eco-green focus:border-eco-green"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-eco-green focus:border-eco-green"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-eco-green focus:border-eco-green"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-eco-green focus:border-eco-green"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-eco-green focus:ring-eco-green border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I agree to the{' '}
            <Link href="/terms" className="font-medium text-eco-green hover:text-eco-green/80">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy-policy" className="font-medium text-eco-green hover:text-eco-green/80">
              Privacy Policy
            </Link>
          </label>
        </div>

        <div>
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>
          {' '}
          <Link href="/login" className="font-medium text-eco-green hover:text-eco-green/80">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  )
} 