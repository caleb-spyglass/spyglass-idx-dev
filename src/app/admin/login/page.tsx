import { loginAction } from '../actions';

export const metadata = {
  title: 'Admin Login | Spyglass Realty',
};

interface LoginPageProps {
  searchParams: Promise<{ from?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const from = params.from ?? '/admin';
  const hasError = params.error === '1';

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-white text-xl mx-auto mb-4"
            style={{ backgroundColor: '#EF4923' }}
          >
            SG
          </div>
          <h1 className="text-white text-2xl font-bold">Spyglass CMS</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your site</p>
        </div>

        {hasError && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300 mb-4 text-center">
            Incorrect password. Try again.
          </div>
        )}

        {/* Login form */}
        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="from" value={from} />

          <div>
            <label htmlFor="password" className="block text-sm text-gray-400 mb-1.5">
              Admin Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              placeholder="Enter admin password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#EF4923] focus:ring-1 focus:ring-[#EF4923] text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#EF4923' }}
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          Spyglass Realty &mdash; Internal CMS
        </p>
      </div>
    </div>
  );
}
