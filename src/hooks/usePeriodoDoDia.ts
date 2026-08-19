import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { msAteAVirada, periodoAgora, type PeriodoDoDia } from '../domain/periodo';

export type { PeriodoDoDia };

/**
 * Diz se é dia ou noite, e **muda sozinho** quando a hora vira.
 *
 * Ler o relógio uma vez só não bastaria em dois casos reais:
 *
 * 1. alguém abre o app às 17h58 e fica preenchendo o cadastro — às 18h o
 *    fundo tem que virar noite sem precisar fechar o app;
 * 2. o celular passa a noite com o app aberto em segundo plano. Ao voltar, o
 *    temporizador de dentro do app pode não ter corrido; por isso o relógio é
 *    relido também quando o app volta ao primeiro plano.
 */
export function usePeriodoDoDia(): PeriodoDoDia {
  const [periodo, setPeriodo] = useState<PeriodoDoDia>(() => periodoAgora());

  useEffect(() => {
    let temporizador: ReturnType<typeof setTimeout>;

    const agendar = () => {
      setPeriodo(periodoAgora());
      // +1s de folga: acordar exatamente no limite às vezes lê a hora anterior
      // por arredondamento, e aí o fundo não trocaria.
      temporizador = setTimeout(agendar, msAteAVirada() + 1000);
    };

    agendar();

    const inscricao = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') {
        clearTimeout(temporizador);
        agendar();
      }
    });

    return () => {
      clearTimeout(temporizador);
      inscricao.remove();
    };
  }, []);

  return periodo;
}
