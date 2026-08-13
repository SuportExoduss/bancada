import { useEffect, useRef, useState } from 'react';

import { chaveDoApelido, validarApelido, type ErroApelido } from '../domain/profile';
import type { ApelidoRepository } from '../repositories/ApelidoRepository';

export type EstadoApelido =
  | { situacao: 'vazio' }
  | { situacao: 'invalido'; erro: ErroApelido }
  | { situacao: 'verificando' }
  | { situacao: 'disponivel' }
  | { situacao: 'em_uso' }
  | { situacao: 'falhou' };

const ESPERA_MS = 400;

/**
 * Verifica a disponibilidade do apelido enquanto a pessoa digita.
 *
 * Duas proteções que evitam desperdício e confusão:
 *
 * 1. **Espera 400ms** depois da última tecla. Sem isso, "lucas" dispara cinco
 *    consultas — uma por letra — e todas menos a última são jogadas fora.
 * 2. **Descarta resposta atrasada.** Se a consulta de "luca" voltar depois da
 *    de "lucas", ela é ignorada. Sem isso a tela mostra o resultado do texto
 *    errado, e o usuário vê "disponível" para algo que não digitou.
 *
 * O formato é checado ANTES de consultar: apelido inválido nem chega à rede.
 */
export function useApelidoDisponivel(
  apelido: string,
  repositorio: ApelidoRepository,
): EstadoApelido {
  const [estado, setEstado] = useState<EstadoApelido>({ situacao: 'vazio' });
  const requisicaoAtual = useRef(0);

  useEffect(() => {
    const normalizado = chaveDoApelido(apelido);

    if (normalizado.length === 0) {
      setEstado({ situacao: 'vazio' });
      return;
    }

    const erro = validarApelido(normalizado);
    if (erro) {
      setEstado({ situacao: 'invalido', erro });
      return;
    }

    setEstado({ situacao: 'verificando' });
    const id = ++requisicaoAtual.current;

    const temporizador = setTimeout(() => {
      repositorio
        .estaDisponivel(normalizado)
        .then((livre) => {
          if (id !== requisicaoAtual.current) return; // resposta atrasada
          setEstado({ situacao: livre ? 'disponivel' : 'em_uso' });
        })
        .catch(() => {
          if (id !== requisicaoAtual.current) return;
          setEstado({ situacao: 'falhou' });
        });
    }, ESPERA_MS);

    return () => clearTimeout(temporizador);
  }, [apelido, repositorio]);

  return estado;
}
