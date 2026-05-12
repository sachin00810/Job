"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User, Lock, Palette, LogOut, Shield, Mail, MapPin,
  Sun, Moon, Monitor, CheckCircle2, AlertTriangle, Briefcase,
} from "lucide-react";

type Tab = "profile" | "security" | "appearance";

type ProfileData = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  city: string | null;
  country: string | null;
  role: string;
  createdAt: string;
};

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) { router.push("/auth/signin"); return; }
      const data = await res.json();
      setProfile(data);
      setFullName(data.fullName);
      setCity(data.city ?? "");
      setCountry(data.country ?? "");
    } catch {
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (session === null) { router.push("/auth/signin"); return; }
    if (session) fetchProfile();
  }, [session, fetchProfile, router]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, city, country }),
      });
      if (!res.ok) throw new Error();
      await updateSession({ name: fullName });
      toast.success("Profile updated!");
      fetchProfile();
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error("New passwords don't match."); return; }
    if (newPassword.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    setPwSaving(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Failed to change password."); return; }
      toast.success("Password changed!");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setPwSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-AU", { month: "long", year: "numeric" });
  const initials = profile.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { id: "security", label: "Security", icon: <Lock className="h-4 w-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white text-xl font-bold flex items-center justify-center shrink-0">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full rounded-full object-cover" />
            ) : initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate">{profile.fullName}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              {profile.email}
            </p>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full font-medium capitalize">
                <Briefcase className="h-3 w-3" />
                {profile.role}
              </span>
              {profile.city && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="h-3 w-3" />
                  {[profile.city, profile.country].filter(Boolean).join(", ")}
                </span>
              )}
              <span className="text-xs text-slate-400 dark:text-slate-500">Member since {memberSince}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <div className="md:col-span-1">
            <nav className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 space-y-0.5">
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    tab === t.id
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </nav>
          </div>

          {/* Content area */}
          <div className="md:col-span-3">

            {/* ── PROFILE TAB ── */}
            {tab === "profile" && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Profile information</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Update your name and location details.</p>

                <form onSubmit={saveProfile} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full name</label>
                    <input
                      value={fullName} onChange={(e) => setFullName(e.target.value)}
                      required minLength={1}
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
                    <input
                      value={profile.email} disabled
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-slate-400">Email address cannot be changed.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">City</label>
                      <input
                        value={city} onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Sydney"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Country</label>
                      <input
                        value={country} onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. Australia"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={saving}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors">
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                  </div>
                </form>

                {/* Account info box */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Account details</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Account ID", value: profile.id },
                      { label: "Role", value: profile.role, capitalize: true },
                      { label: "Member since", value: memberSince },
                    ].map(({ label, value, capitalize }) => (
                      <div key={label} className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
                        <span className={`text-xs text-slate-700 dark:text-slate-300 font-medium ${capitalize ? "capitalize" : "font-mono"}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── SECURITY TAB ── */}
            {tab === "security" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Change password</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Choose a strong password with at least 8 characters.</p>

                  <form onSubmit={changePassword} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current password</label>
                      <input
                        type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                        required placeholder="••••••••"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New password</label>
                      <input
                        type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        required minLength={8} placeholder="Min. 8 characters"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm new password</label>
                      <input
                        type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        required placeholder="••••••••"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          confirmPassword && newPassword !== confirmPassword
                            ? "border-red-400 focus:ring-red-500"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      />
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Passwords don&apos;t match
                        </p>
                      )}
                      {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
                        <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Passwords match
                        </p>
                      )}
                    </div>
                    <div className="pt-2">
                      <button type="submit" disabled={pwSaving}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors">
                        {pwSaving ? "Updating…" : "Update password"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Sign out of all devices */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Session security</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign out of your account on this device.</p>
                      <button onClick={() => signOut({ callbackUrl: "/" })}
                        className="mt-3 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-xl transition-colors flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Sign out now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── APPEARANCE TAB ── */}
            {tab === "appearance" && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Appearance</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Choose how appname looks for you.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { value: "light", label: "Light", icon: <Sun className="h-6 w-6" />, desc: "Clean and bright" },
                    { value: "dark", label: "Dark", icon: <Moon className="h-6 w-6" />, desc: "Easy on the eyes" },
                    { value: "system", label: "System", icon: <Monitor className="h-6 w-6" />, desc: "Follows your OS" },
                  ].map((opt) => (
                    <button key={opt.value} onClick={() => setTheme(opt.value)}
                      className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all text-center ${
                        theme === opt.value
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      {theme === opt.value && (
                        <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      )}
                      <span className={theme === opt.value ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}>
                        {opt.icon}
                      </span>
                      <div>
                        <p className={`text-sm font-semibold ${theme === opt.value ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-900 dark:text-white">Current theme:</span>{" "}
                    <span className="capitalize">{theme}</span>
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Theme preference is saved in your browser.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
