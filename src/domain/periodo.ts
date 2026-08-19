/**
 * Dia ou noite pelo relógio — puro, sem React.
 *
 * Mora em `domain/` porque é regra, não interface: a mesma decisão vai valer
 * para o fundo da tela hoje e para qualquer outra coisa que dependa do
 * horário depois. E aqui dá para testar sem montar componente.
 */

export type PeriodoDoDia = 'dia' | 'noite';

/** Das 6h às 17h59 é dia. O resto é noite. */
export const HORA_QUE_AMANHECE = 6;
export const HORA_QUE_ANOITECE = 18;

export function periodoDaHora(hora: number): PeriodoDoDia {
  return hora >= HORA_QUE_AMANHECE && hora < HORA_QUE_ANOITECE ? 'dia' : 'noite';
}

export function periodoAgora(agora = new Date()): PeriodoDoDia {
  return periodoDaHora(agora.getHours());
}

/**
 * Milissegundos até a próxima virada — 6h ou 18h, o que vier antes.
 *
 * Serve para agendar a troca do fundo na hora exata, em vez de acordar de
 * minuto em minuto: 1.440 despertares por dia para descobrir que nada mudou é
 * bateria gasta à toa.
 */
export function msAteAVirada(agora = new Date()): number {
  const proxima = new Date(agora);
  proxima.setMinutes(0, 0, 0);

  const hora = agora.getHours();
  if (hora < HORA_QUE_AMANHECE) {
    proxima.setHours(HORA_QUE_AMANHECE);
  } else if (hora < HORA_QUE_ANOITECE) {
    proxima.setHours(HORA_QUE_ANOITECE);
  } else {
    // Já passou das 18h: a próxima virada é o amanhecer de amanhã.
    proxima.setDate(proxima.getDate() + 1);
    proxima.setHours(HORA_QUE_AMANHECE);
  }

  return proxima.getTime() - agora.getTime();
}
