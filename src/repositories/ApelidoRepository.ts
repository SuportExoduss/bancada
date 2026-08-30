/**
 * Porta de acesso aos apelidos.
 *
 * A tela nunca fala com o Firestore — fala com esta interface (CLAUDE.md §5,
 * D-011).
 *
 * **Só tem consulta, de propósito.** A reserva não vive aqui: ela precisa
 * acontecer no mesmo lote que a criação do perfil (D-024), e isso pertence ao
 * `contaService`. Um `reservar` solto nesta porta seria um convite a gravar o
 * apelido sem o perfil — exatamente a conta órfã que a D-024 existe para
 * evitar.
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
   * salvar, outra pessoa pode pegar o mesmo apelido. Quem garante é a gravação
   * em lote no `contaService`, que falha se o documento já existir.
   */
  estaDisponivel(apelido: string): Promise<boolean>;
}

