export default function AuthModal(props) {
  const { authMode, closeAuth, authMessage, authError, authLoading, form, handleAuthSubmit, updateField, openAuth } = props;
  return (
    <>
        {authMode && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) closeAuth();
                }}
            >
              <div className="my-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-emerald-800">Welcome to rewear</p>
                    <h2 className="mt-2 text-2xl font-black">
                      {authMode === "login" ? "Welcome back" : "Create your account"}
                    </h2>
                    <p className="mt-2 text-sm text-stone-500">
                      {authMode === "login" ? "Log in to continue swapping." : "Join the community and give clothes a second life."}
                    </p>
                  </div>
                  <button onClick={closeAuth} disabled={authLoading} aria-label="Close dialog" className="rounded-full px-3 py-1 text-xl text-stone-500 hover:bg-stone-100">×</button>
                </div>

                {authMessage && (
                    <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{authMessage}</p>
                )}

                {authError && (
                    <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{authError}</p>
                )}

                <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
                  {authMode === "register" && (
                      <>
                        <div>
                          <label htmlFor="fullName" className="mb-1 block text-sm font-semibold">Full name</label>
                          <input id="fullName" name="fullName" required maxLength={100} autoComplete="name" value={form.fullName} onChange={updateField} className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800" placeholder="Your full name" />
                        </div>
                        <div>
                          <label htmlFor="phone" className="mb-1 block text-sm font-semibold">Phone</label>
                          <input id="phone" name="phone" required maxLength={20} autoComplete="tel" value={form.phone} onChange={updateField} className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800" placeholder="Phone number" />
                        </div>
                        <div>
                          <label htmlFor="city" className="mb-1 block text-sm font-semibold">City</label>
                          <input id="city" name="city" required maxLength={100} autoComplete="address-level2" value={form.city} onChange={updateField} className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800" placeholder="Your city" />
                        </div>
                      </>
                  )}

                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-semibold">Email</label>
                    <input id="email" name="email" type="email" required autoComplete="email" value={form.email} onChange={updateField} className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800" placeholder="you@example.com" />
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-1 block text-sm font-semibold">Password</label>
                    <input id="password" name="password" type="password" required minLength={8} maxLength={72} autoComplete={authMode === "login" ? "current-password" : "new-password"} value={form.password} onChange={updateField} className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800" placeholder="At least 8 characters" />
                  </div>

                  <button type="submit" disabled={authLoading} className="w-full rounded-full bg-emerald-800 px-5 py-3.5 font-bold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60">
                    {authLoading ? "Please wait..." : authMode === "login" ? "Log in" : "Create account"}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-stone-600">
                  {authMode === "login" ? "New to rewear?" : "Already have an account?"}{" "}
                  <button
                      onClick={() => openAuth(authMode === "login" ? "register" : "login")}
                      className="font-bold text-emerald-800 hover:underline"
                  >
                    {authMode === "login" ? "Sign up" : "Log in"}
                  </button>
                </p>
              </div>
            </div>
        )}
    </>
  );
}
