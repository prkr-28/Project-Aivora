import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { authAPI } from "@/lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await authAPI.login({
        email,
        password,
      });

      const { token, user } = response;

      setToken(token);
      setUser(user);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to login. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-10">
      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 dark:from-cyan-500/10 dark:via-blue-500/10 dark:to-purple-500/10" />

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating orb */}
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/25 dark:bg-cyan-500/15 rounded-full blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/25 dark:bg-blue-500/15 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* ================= LOGIN ================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 24,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="relative z-10 w-full max-w-[430px]"
      >
        <Card
          className="
            border-border/50
            bg-card/80
            backdrop-blur-xl
            shadow-2xl
            rounded-3xl
            overflow-hidden
          "
        >
          {/* Top gradient line */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500" />

          <CardHeader className="px-7 pt-8 pb-5 text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-5"
            >
              <div
                className="
                  relative
                  w-14
                  h-14
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  bg-primary/10
                  border
                  border-primary/20
                  shadow-lg
                  shadow-primary/10
                "
              >
                <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl" />

                <Brain className="relative w-7 h-7 text-primary" />
              </div>
            </motion.div>

            <CardTitle className="text-3xl font-bold tracking-tight">
              Welcome back
            </CardTitle>

            <CardDescription className="mt-2 text-sm">
              Sign in to continue to your Aivora workspace
            </CardDescription>
          </CardHeader>

          <CardContent className="px-7 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="
                    rounded-xl
                    border
                    border-destructive/20
                    bg-destructive/10
                    px-4
                    py-3
                    text-sm
                    text-destructive
                  "
                >
                  {error}
                </motion.div>
              )}

              {/* ================= EMAIL ================= */}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>

                <div className="relative group">
                  <Mail
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      h-4
                      w-4
                      text-muted-foreground
                      transition-colors
                      group-focus-within:text-primary
                    "
                  />

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    className="
                      h-12
                      rounded-xl
                      pl-11
                      pr-4
                      bg-background/60
                      border-border/70
                      shadow-sm
                      transition-all
                      duration-200
                      placeholder:text-muted-foreground/50
                      hover:border-primary/30
                      focus-visible:border-primary/60
                      focus-visible:ring-4
                      focus-visible:ring-primary/10
                    "
                  />
                </div>
              </div>

              {/* ================= PASSWORD ================= */}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>

                  {/* Enable later when forgot-password is implemented */}
                  {/* 
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                  */}
                </div>

                <div className="relative group">
                  <Lock
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      h-4
                      w-4
                      text-muted-foreground
                      transition-colors
                      group-focus-within:text-primary
                    "
                  />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="
                      h-12
                      rounded-xl
                      pl-11
                      pr-11
                      bg-background/60
                      border-border/70
                      shadow-sm
                      transition-all
                      duration-200
                      placeholder:text-muted-foreground/50
                      hover:border-primary/30
                      focus-visible:border-primary/60
                      focus-visible:ring-4
                      focus-visible:ring-primary/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isLoading}
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      p-1.5
                      rounded-lg
                      text-muted-foreground
                      hover:text-foreground
                      hover:bg-muted
                      transition-colors
                    "
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* ================= SUBMIT ================= */}

              <div className="flex justify-center mt-2">
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  disabled={isLoading}
                  className="
      w-full
      sm:w-[370px]
      h-12
      rounded-xl
      font-semibold
      shadow-lg
      shadow-primary/20
      transition-all
      duration-200
      hover:shadow-xl
      hover:shadow-primary/25
      hover:-translate-y-[1px]
      active:translate-y-0
    "
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="
          w-5
          h-5
          border-2
          border-white
          border-t-transparent
          rounded-full
        "
                    />
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* ================= SIGN UP ================= */}

            <div className="mt-7 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="
                    font-semibold
                    text-primary
                    hover:text-primary/80
                    transition-colors
                  "
                >
                  Create one
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back home */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.3,
          }}
          className="mt-6 text-center"
        >
          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              text-muted-foreground
              hover:text-foreground
              transition-colors
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
