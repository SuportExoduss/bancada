import { chaveDoApelido } from '../domain/profile';

/**
 * Porta de acesso aos apelidos.
 *
 * A tela nunca fala com o Firestore — fala com esta interface (CLAUDE.md §5,
 * D-011). Quando o Firebase entrar, nasce um `FirestoreApelidoRepository` e
 * nada acima daqui muda.
 */
export interface ApelidoRepository {
  /**
   * O apelido está livre?
   *
   * É **uma leitura por ID**, não varredura: no Firestore o apelido é o ID do
   * documento em `apelidos/{apelido}`. Varrer a coleção custaria uma leitura
   * por usuário cadastrado.
   *
   * ATENÇÃO: a resposta é uma **dica**, não garantia. Entre esta consulta e o
   * salvar, outra pessoa pode pegar o mesmo apelido. Quem garante é o
   * `reservar`, que falha se já existir.
   */
  estaDisponivel(apelido: string): Promise<boolean>;

  /**
   * Reserva o apelido para o usuário. **Falha se já existir** — é aqui que a
   * unicidade é garantida de verdade.
   */
  reservar(apelido: string, uid: string): Promise<void>;
}

export class ApelidoJaEmUso extends Error {
  constructor(readonly apelido: string) {
    super(`apelido em uso: ${apelido}`);
    this.name = 'ApelidoJaEmUso';
  }
}

/**
 * Implementação em memória, para a tela existir antes do Firebase.
 *
 * Não é enfeite de teste: é o que permite exercitar de verdade os estados de
 * "disponível" e "em uso" enquanto o backend não está ligado. Sai quando o
 * `FirestoreApelidoRepository` entrar.
 */
export function criarApelidoRepositoryMemoria(
  ocupadosIniciais: string[] = [],
): ApelidoRepository {
  const ocupados = new Map<string, string>(
    ocupadosIniciais.map((a) => [chaveDoApelido(a), 'seed']),
  );

  return {
    async estaDisponivel(bruto) {
      // Atraso proposital: sem ele o estado "verificando…" nunca aparece e eu
      // não teria como saber se ele funciona.
      await new Promise((r) => setTimeout(r, 350));
      return !ocupados.has(chaveDoApelido(bruto));
    },

    async reservar(bruto, uid) {
      const apelido = chaveDoApelido(bruto);
      if (ocupados.has(apelido)) throw new ApelidoJaEmUso(apelido);
      ocupados.set(apelido, uid);
    },
  };
}

/** Apelidos já tomados, para a tela ter o que recusar antes do Firebase. */
export const APELIDOS_OCUPADOS_DEMO = [
  'lucas_rocha',
  'resenhafc',
  'vila_norte',
  'varzeazn',
  'bia_silva',
];
