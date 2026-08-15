import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/**
 * Para quem a conta que está sendo criada agora.
 *
 * `menor` só existe depois que o responsável já tem conta — é o segundo
 * cadastro do fluxo, não um caminho paralelo.
 */
export type AlvoDoCadastro = 'para_mim' | 'responsavel' | 'menor';

export interface DadosDoCadastro {
  alvo: AlvoDoCadastro;
  email?: string;
  senha?: string;
  aceitouTermos?: boolean;
  nome?: string;
  sobrenome?: string;
  apelido?: string;
  nascimento?: string;
}

interface Contexto {
  dados: DadosDoCadastro;
  iniciar: (alvo: AlvoDoCadastro) => void;
  guardar: (parcial: Partial<DadosDoCadastro>) => void;
  limpar: () => void;
}

const CadastroContext = createContext<Contexto | null>(null);

const VAZIO: DadosDoCadastro = { alvo: 'para_mim' };

/**
 * Guarda o cadastro enquanto ele está sendo preenchido, entre telas.
 *
 * **Vive em memória, de propósito.** O caminho óbvio seria passar os dados
 * como parâmetro de rota, e é exatamente o que não se deve fazer com senha:
 * o estado de navegação é serializável, pode ser persistido para restaurar a
 * tela depois de o app ser morto, e aparece inteiro em qualquer inspetor.
 * Senha em parâmetro de rota é senha gravada em disco sem ninguém pedir.
 *
 * Some quando o app fecha, e isso é o comportamento certo: pela D-024 nada
 * existe até o botão final, então um cadastro interrompido não deve
 * sobreviver.
 */
export function CadastroProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState<DadosDoCadastro>(VAZIO);

  const iniciar = useCallback((alvo: AlvoDoCadastro) => setDados({ alvo }), []);

  const guardar = useCallback(
    (parcial: Partial<DadosDoCadastro>) => setDados((atual) => ({ ...atual, ...parcial })),
    [],
  );

  const limpar = useCallback(() => setDados(VAZIO), []);

  const valor = useMemo(() => ({ dados, iniciar, guardar, limpar }), [dados, iniciar, guardar, limpar]);

  return <CadastroContext.Provider value={valor}>{children}</CadastroContext.Provider>;
}

export function useCadastro(): Contexto {
  const contexto = useContext(CadastroContext);
  if (!contexto) throw new Error('useCadastro precisa estar dentro de <CadastroProvider>');
  return contexto;
}
