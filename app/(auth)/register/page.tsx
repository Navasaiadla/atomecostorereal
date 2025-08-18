import AuthForm from '@/components/auth/auth-form'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">
            Join AtomecoStore for sustainable shopping
          </p>
        </div>
        
        <AuthForm initialMode="signup" />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-green-600 hover:text-green-500">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 