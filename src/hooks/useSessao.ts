import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { auth } from '../infrastructure/firebase/app';
import { perfilDe, type Perfil } from '../services/contaService';

export type EstadoDaSessao =
  /** Ainda perguntando ao Firebase quem está logado */
  | { situacao: 'carregando' }
  /** Ninguém logado */
  | { situacao: 'fora' }
  /** Logado e com perfil completo */
  | { situacao: 'dentro'; usuario: User; perfil: Perfil }
  /**
   * Logado, mas sem perfil no Firestore — a conta órfã da D-024.
   * O app precisa mandar a pessoa terminar o cadastro, não deixá-la num
   * aplicativo sem nome e sem apelido.
   */
  | { situacao: 'sem_perfil'; usuario: User };

/**
 * Quem está logado agora.
 *
 * `onAuthStateChanged` é a fonte da verdade, e não uma leitura única de
 * `currentUser`: na abertura do app o SDK ainda está restaurando a sessão do
 * disco, e perguntar cedo demais devolve `null` para quem está logado — o
 * defeito que joga a pessoa na tela de login toda vez que abre o app.
 */
export function useSessao(): EstadoDaSessao {
  const [estado, setEstado] = useState<EstadoDaSessao>({ situacao: 'carregando' });

  useEffect(() => {
    return onAuthStateChanged(auth, async (usuario) => {
      if (!usuario) {
        setEstado({ situacao: 'fora' });
        return;
      }

      try {
        const perfil = await perfilDe(usuario.uid);
        setEstado(perfil ? { situacao: 'dentro', usuario, perfil } : { situacao: 'sem_perfil', usuario });
      } catch {
        // Falha ao ler o perfil não é o mesmo que não ter perfil. Tratar como
        // órfã aqui mandaria alguém com conta boa refazer o cadastro só
        // porque a rede piscou.
        setEstado({ situacao: 'carregando' });
      }
    });
  }, []);

  return estado;
}
