// Eventos exibidos na seção "Eventos" — cada item vira um crachá (lanyard)
// pendurado no canvas 3D. Os eventos são geridos no painel (/dashboard) e
// vêm do banco; a lista abaixo é só o fallback caso o banco esteja fora.
export type EventoImagem = {
  id: string;
  url: string;
  width: number;
  height: number;
};

export type Evento = {
  id: string;
  /** Nome principal impresso em destaque no crachá. */
  name: string;
  /** Linha secundária (edição, cidade...). */
  edition?: string;
  /** Ano do evento, exibido no rodapé do crachá. */
  year?: string;
  /** Papel no evento: "Participante", "Campeão", "Palestrante"... */
  role: string;
  /** Crachá em destaque (roxo sólido) — ex.: vitória. */
  highlight?: boolean;
  /** Cidade / local do evento. */
  location?: string;
  /** Texto livre exibido no painel de detalhes (parágrafos separados por linha em branco). */
  description?: string;
  /** Link externo (site do evento, post, etc.). */
  link?: string;
  /** Fotos do evento, exibidas no painel de detalhes. */
  images?: EventoImagem[];
};

export const eventos: Evento[] = [
  { id: "hackathon-1", name: "Hackathon", edition: "1ª edição", role: "Participante" },
  { id: "hackathon-2", name: "Hackathon", edition: "2ª edição", role: "Participante" },
  {
    id: "hackathon-3",
    name: "Hackathon",
    edition: "3ª edição",
    role: "Campeão",
    highlight: true,
  },
  { id: "south-summit", name: "South Summit", role: "Participante" },
  { id: "semana-caldeira", name: "Semana Caldeira", role: "Participante" },
];
