"use client";

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { NavBar } from "@/app/_components/nav-bar";
import { Button } from "@/app/_components/ui/button";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const handleSignIn = async () => {
    await signIn("discord", { callbackUrl: "/dashboard" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg">
        <NavBar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-white">Carregando...</div>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null; // Redirecionamento em andamento
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg">
      <NavBar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-dark-surface/50 backdrop-blur-lg border border-dark-border rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/20 mb-4"
              >
                <LogIn className="w-8 h-8 text-primary-500" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Acesso ao Dashboard
              </h1>
              <p className="text-gray-400">
                Faça login com sua conta Discord para gerenciar seus projetos
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handleSignIn}
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-6 text-lg font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-3"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027A19.9 19.9 0 0 0 .058 18.38a.082.082 0 0 0 .031.057a19.849 19.849 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054a19.9 19.9 0 0 0-3.6-13.956a.061.061 0 0 0-.031-.03zM8.02 15.33a1.73 1.73 0 0 1-1.573-1.926a1.729 1.729 0 0 1 1.573-1.927a1.73 1.73 0 0 1 1.573 1.927a1.73 1.73 0 0 1-1.573 1.926zm7.975 0a1.73 1.73 0 0 1-1.573-1.926a1.729 1.729 0 0 1 1.573-1.927a1.73 1.73 0 0 1 1.573 1.927a1.73 1.73 0 0 1-1.573 1.926z" />
                </svg>
                Entrar com Discord
              </Button>
            </motion.div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Ao continuar, você concorda com nossos termos de uso
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
