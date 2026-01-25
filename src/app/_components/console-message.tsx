"use client";

import { useEffect } from "react";

export function ConsoleMessage() {
    useEffect(() => {
        // Mensagem principal
        console.log(
            "%cNão tente me hackear ☠️☠️☠️ - mentira, tenta ai",
            "color: #ff0000; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);"
        );

        // Mensagem adicional estilizada
        console.log(
            "%cTeste com: usuario@suckme.com.br e senha: 6969",
            "color: #00ff00; font-size: 14px; font-weight: bold;"
        );

        // Detectar quando o console é aberto (tentativa)
        let devtools = { open: false, orientation: null };
        const threshold = 160;

        setInterval(() => {
            if (
                window.outerHeight - window.innerHeight > threshold ||
                window.outerWidth - window.innerWidth > threshold
            ) {
                if (!devtools.open) {
                    devtools.open = true;
                    console.log(
                        "%cConsole detectado! 🕵️",
                        "color: #ffaa00; font-size: 16px; font-weight: bold;"
                    );
                }
            } else {
                devtools.open = false;
            }
        }, 500);
    }, []);

    return null;
}

