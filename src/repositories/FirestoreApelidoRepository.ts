import { doc, getDoc } from 'firebase/firestore';

import { chaveDoApelido } from '../domain/profile';
import { db } from '../infrastructure/firebase/app';
import type { ApelidoRepository } from './ApelidoRepository';

/** Coleção onde o ID do documento **é** o apelido em minúscula. */
export const COLECAO_APELIDOS = 'apelidos';

export const refDoApelido = (chave: string) => doc(db, COLECAO_APELIDOS, chave);

/**
 * Consulta de apelido no Firestore.
 *
 * `estaDisponivel` é **uma leitura por ID**: o apelido é o ID do documento, e
 * conferir se está livre é perguntar se aquele documento existe. Varrer a
 * coleção custaria uma leitura por usuário cadastrado — na cota gratuita, com
 * mil usuários, cada tecla digitada gastaria mil leituras.
 *
 * `reservar` **não vive aqui**. A reserva do apelido e a criação do perfil
 * precisam acontecer juntas ou não acontecer (D-024), e isso é uma escrita em
 * lote que pertence ao serviço de conta, não a este repositório. Um `reservar`
 * solto aqui seria um convite a gravar o apelido sem o perfil.
 */
export function criarApelidoRepositoryFirestore(): ApelidoRepository {
  return {
    async estaDisponivel(bruto) {
      const chave = chaveDoApelido(bruto);
      const instantaneo = await getDoc(refDoApelido(chave));
      return !instantaneo.exists();
    },

    async reservar() {
      throw new Error(
        'A reserva do apelido acontece dentro de criarConta(), em lote com o ' +
          'perfil. Ver src/services/contaService.ts e a D-024.',
      );
    },
  };
}
