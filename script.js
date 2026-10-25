const STORAGE_KEY = "financas_pessoais_v4";

let dados = carregarDados();

let mesAtual = new Date()
.toISOString()
.slice(0, 7);

let graficoCategorias = null;
let graficoMensal = null;

/* =====================================================
ESTRUTURA INICIAL
===================================================== */

const estruturaInicial = {
receitas: [],
despesas: [],
contas: [],
cartoes: [],
parcelamentos: [],
investimentos: [],
tarefas: [],
metas: {}
};

/* =====================================================
STORAGE
===================================================== */

function carregarDados() {

```
try {

    const salvo =
        localStorage.getItem(STORAGE_KEY);

    if (!salvo) {

        return structuredClone(
            estruturaInicial
        );
    }

    return {
        ...structuredClone(
            estruturaInicial
        ),
        ...JSON.parse(salvo)
    };

} catch (erro) {

    console.error(erro);

    return structuredClone(
        estruturaInicial
    );
}
```

}

function salvarDados() {

```
localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(dados)
);
```

}

/* =====================================================
FORMATAÇÃO
===================================================== */

function dinheiro(valor) {

```
return Number(valor || 0)
    .toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
```

}

function gerarId() {

```
return Date.now().toString() +
    Math.random()
        .toString(16)
        .slice(2);
```

}

function escapar(texto) {

```
return String(texto ?? "")
    .replace(
        /[&<>"']/g,
        caractere => ({

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"

        })[caractere]
    );
```

}

function nomeDoMes(chave) {

```
const [ano, mes] =
    chave.split("-").map(Number);

const data =
    new Date(
        ano,
        mes - 1,
        1
    );

return data
    .toLocaleDateString(
        "pt-BR",
        {
            month: "long",
            year: "numeric"
        }
    )
    .replace(
        /^./,
        letra => letra.toUpperCase()
    );
```

}

/* =====================================================
MODAL
===================================================== */

function abrirModal(
titulo,
conteudo
) {

```
document
    .getElementById("modalTitulo")
    .textContent = titulo;

document
    .getElementById("modalConteudo")
    .innerHTML = conteudo;

document
    .getElementById("modal")
    .classList.remove("hidden");
```

}

function fecharModal() {

```
document
    .getElementById("modal")
    .classList.add("hidden");
```

}

/* =====================================================
INICIALIZAÇÃO
===================================================== */

document.addEventListener(
"DOMContentLoaded",
() => {

```
    configurarEventos();

    renderizar();

}
```

);

function configurarEventos() {

```
document
    .getElementById("mesAnterior")
    .onclick = () => mudarMes(-1);

document
    .getElementById("mesProximo")
    .onclick = () => mudarMes(1);

document
    .getElementById("novaReceitaBtn")
    .onclick = abrirReceita;

document
    .getElementById("novaDespesaBtn")
    .onclick = abrirDespesa;

document
    .getElementById("novaDespesaBtn2")
    .onclick = abrirDespesa;

document
    .getElementById("novaContaBtn")
    .onclick = abrirConta;

document
    .getElementById("novoCartaoBtn")
    .onclick = abrirCartao;

document
    .getElementById("novoParcelamentoBtn")
    .onclick =
        abrirParcelamento;

document
    .getElementById("novoInvestimentoBtn")
    .onclick =
        abrirInvestimento;

document
    .getElementById("novaTarefaBtn")
    .onclick = abrirTarefa;

document
    .getElementById("editarMetaBtn")
    .onclick = abrirMeta;

document
    .getElementById("exportarBtn")
    .onclick = exportar;

document
    .getElementById("backupBtn")
    .onclick = exportar;

document
    .getElementById("importarBtn")
    .onclick = () =>
        document
            .getElementById(
                "arquivoImportacao"
            )
            .click();

document
    .getElementById(
        "arquivoImportacao"
    )
    .onchange = importar;

document
    .getElementById("fecharModal")
    .onclick = fecharModal;

document
    .getElementById("limparBtn")
    .onclick = limparMes;

document
    .getElementById("modal")
    .onclick = evento => {

        if (
            evento.target.id ===
            "modal"
        ) {
            fecharModal();
        }

    };
```

}

/* =====================================================
MÊS
===================================================== */

function mudarMes(valor) {

```
const [ano, mes] =
    mesAtual
        .split("-")
        .map(Number);

const data =
    new Date(
        ano,
        mes - 1 + valor,
        1
    );

mesAtual =
    `${data.getFullYear()}-${String(
        data.getMonth() + 1
    ).padStart(2, "0")}`;

renderizar();
```

}

/* =====================================================
RENDERIZAÇÃO
===================================================== */

function renderizar() {

```
document
    .getElementById("mesAtual")
    .textContent =
    nomeDoMes(mesAtual);

atualizarResumo();

renderizarReceitas();

renderizarDespesas();

renderizarContas();

renderizarCartoes();

renderizarParcelamentos();

renderizarInvestimentos();

renderizarTarefas();

atualizarMeta();

atualizarGraficos();
```

}

/* =====================================================
RESUMO
===================================================== */

function atualizarResumo() {

```
const receitas =
    dados.receitas
        .filter(
            item =>
                item.mes === mesAtual
        )
        .reduce(
            (total, item) =>
                total +
                Number(item.valor || 0),
            0
        );

const despesas =
    dados.despesas
        .filter(
            item =>
                item.mes === mesAtual
        )
        .reduce(
            (total, item) =>
                total +
                Number(item.valor || 0),
            0
        );

const saldo =
    receitas - despesas;

const economia =
    receitas > 0
        ? saldo / receitas * 100
        : 0;

document
    .getElementById(
        "totalReceitas"
    )
    .textContent =
    dinheiro(receitas);

document
    .getElementById(
        "totalDespesas"
    )
    .textContent =
    dinheiro(despesas);

document
    .getElementById(
        "saldo"
    )
    .textContent =
    dinheiro(saldo);

document
    .getElementById(
        "taxaEconomia"
    )
    .textContent =
    economia.toFixed(1) + "%";
```

}

/* =====================================================
RECEITAS
===================================================== */

function renderizarReceitas() {

```
const lista =
    document.getElementById(
        "listaReceitas"
    );

const itens =
    dados.receitas.filter(
        item =>
            item.mes === mesAtual
    );

if (!itens.length) {

    lista.innerHTML =
        `<div class="empty">
            Nenhuma receita cadastrada.
        </div>`;

    return;
}

lista.innerHTML =
    itens.map(
        item => `

        <div class="list-item">

            <div class="item-info">

                <div class="item-title">
                    ${escapar(item.nome)}
                </div>

                <div class="item-subtitle">
                    ${escapar(
                        item.categoria
                    )}
                </div>

            </div>

            <div class="item-value positive">
                ${dinheiro(item.valor)}
            </div>

            <div class="item-actions">

                <button
                    onclick="
                        excluirReceita('${item.id}')
                    "
                >
                    🗑️
                </button>

            </div>

        </div>

    `
    ).join("");
```

}

function abrirReceita() {

```
abrirModal(
    "Nova receita",
    `

    <form id="formReceita">

        <div class="form-group">

            <label>Nome</label>

            <input
                id="receitaNome"
                required
                placeholder="Ex.: Salário"
            >

        </div>


        <div class="form-group">

            <label>Valor</label>

            <input
                id="receitaValor"
                type="number"
                step="0.01"
                min="0"
                required
            >

        </div>


        <div class="form-group">

            <label>Categoria</label>

            <select id="receitaCategoria">

                <option>Salário</option>
                <option>Freelance</option>
                <option>Renda extra</option>
                <option>Investimentos</option>
                <option>Outros</option>

            </select>

        </div>


        <div class="form-actions">

            <button
                type="submit"
                class="btn primary"
            >
                Salvar
            </button>

        </div>

    </form>
    `
);

document
    .getElementById("formReceita")
    .onsubmit = evento => {

        evento.preventDefault();

        dados.receitas.push({

            id: gerarId(),

            mes: mesAtual,

            nome:
                document
                    .getElementById(
                        "receitaNome"
                    ).value,

            valor:
                Number(
                    document
                        .getElementById(
                            "receitaValor"
                        ).value
                ),

            categoria:
                document
                    .getElementById(
                        "receitaCategoria"
                    ).value
        });

        salvarDados();

        fecharModal();

        renderizar();
    };
```

}

function excluirReceita(id) {

```
if (
    !confirm(
        "Deseja excluir esta receita?"
    )
) return;

dados.receitas =
    dados.receitas.filter(
        item =>
            item.id !== id
    );

salvarDados();

renderizar();
```

}

/* =====================================================
DESPESAS
===================================================== */

function renderizarDespesas() {

```
const lista =
    document.getElementById(
        "listaDespesas"
    );

const itens =
    dados.despesas.filter(
        item =>
            item.mes === mesAtual
    );

if (!itens.length) {

    lista.innerHTML =
        `<div class="empty">
            Nenhuma despesa cadastrada.
        </div>`;

    return;
}

lista.innerHTML =
    itens.map(
        item => `

        <div class="list-item">

            <div class="item-info">

                <div class="item-title">
                    ${escapar(item.nome)}
                </div>

                <div class="item-subtitle">
                    ${escapar(
                        item.categoria
                    )} •
                    ${escapar(item.tipo)}
                </div>

            </div>

            <div class="item-value negative">
                ${dinheiro(item.valor)}
            </div>

            <div class="item-actions">

                <button
                    onclick="
                        excluirDespesa('${item.id}')
                    "
                >
                    🗑️
                </button>

            </div>

        </div>

    `
    ).join("");
```

}

function abrirDespesa() {

```
abrirModal(
    "Nova despesa",
    `

    <form id="formDespesa">

        <div class="form-group">

            <label>Descrição</label>

            <input
                id="despesaNome"
                required
                placeholder="Ex.: Mercado"
            >

        </div>


        <div class="form-group">

            <label>Valor</label>

            <input
                id="despesaValor"
                type="number"
                step="0.01"
                min="0"
                required
            >

        </div>


        <div class="form-group">

            <label>Categoria</label>

            <select id="despesaCategoria">

                <option>Moradia</option>
                <option>Alimentação</option>
                <option>Transporte</option>
                <option>Saúde</option>
                <option>Educação</option>
                <option>Lazer</option>
                <option>Compras</option>
                <option>Contas</option>
                <option>Assinaturas</option>
                <option>Outros</option>

            </select>

        </div>


        <div class="form-group">

            <label>Tipo</label>

            <select id="despesaTipo">

                <option>Fixa</option>
                <option>Variável</option>

            </select>

        </div>


        <div class="form-actions">

            <button
                type="submit"
                class="btn primary"
            >
                Salvar
            </button>

        </div>

    </form>
    `
);

document
    .getElementById("formDespesa")
    .onsubmit = evento => {

        evento.preventDefault();

        dados.despesas.push({

            id: gerarId(),

            mes: mesAtual,

            nome:
                document
                    .getElementById(
                        "despesaNome"
                    ).value,

            valor:
                Number(
                    document
                        .getElementById(
                            "despesaValor"
                        ).value
                ),

            categoria:
                document
                    .getElementById(
                        "despesaCategoria"
                    ).value,

            tipo:
                document
                    .getElementById(
                        "despesaTipo"
                    ).value

        });

        salvarDados();

        fecharModal();

        renderizar();
    };
```

}

function excluirDespesa(id) {

```
if (
    !confirm(
        "Deseja excluir esta despesa?"
    )
) return;

dados.despesas =
    dados.despesas.filter(
        item =>
            item.id !== id
    );

salvarDados();

renderizar();
```

}

/* =====================================================
CONTAS RECORRENTES
===================================================== */

function renderizarContas() {

```
const lista =
    document.getElementById(
        "listaContas"
    );

if (!dados.contas.length) {

    lista.innerHTML =
        `<div class="empty">
            Nenhuma conta recorrente cadastrada.
        </div>`;

    return;
}

lista.innerHTML =
    dados.contas.map(
        item => `

        <div class="list-item">

            <div class="item-info">

                <div class="item-title">
                    ${escapar(item.nome)}
                </div>

                <div class="item-subtitle">
                    Vencimento dia ${item.dia}
                </div>

            </div>

            <div class="item-value negative">
                ${dinheiro(item.valor)}
            </div>

            <div class="item-actions">

                <button
                    onclick="
                        excluirConta('${item.id}')
                    "
                >
                    🗑️
                </button>

            </div>

        </div>
    `
    ).join("");
```

}

function abrirConta() {

```
abrirModal(
    "Nova conta recorrente",
    `

    <form id="formConta">

        <div class="form-group">

            <label>Nome</label>

            <input
                id="contaNome"
                required
                placeholder="Ex.: Internet"
            >

        </div>


        <div class="form-group">

            <label>Valor</label>

            <input
                id="contaValor"
                type="number"
                step="0.01"
                required
            >

        </div>


        <div class="form-group">

            <label>Dia de vencimento</label>

            <input
                id="contaDia"
                type="number"
                min="1"
                max="31"
                value="10"
                required
            >

        </div>


        <div class="form-actions">

            <button
                type="submit"
                class="btn primary"
            >
                Salvar
            </button>

        </div>

    </form>
    `
);

document
    .getElementById("formConta")
    .onsubmit = evento => {

        evento.preventDefault();

        dados.contas.push({

            id: gerarId(),

            nome:
                document
                    .getElementById(
                        "contaNome"
                    ).value,

            valor:
                Number(
                    document
                        .getElementById(
                            "contaValor"
                        ).value
                ),

            dia:
                Number(
                    document
                        .getElementById(
                            "contaDia"
                        ).value
                )

        });

        salvarDados();

        fecharModal();

        renderizar();
    };
```

}

function excluirConta(id) {

```
dados.contas =
    dados.contas.filter(
        item =>
            item.id !== id
    );

salvarDados();

renderizar();
```

}

/* =====================================================
CARTÕES
===================================================== */

function renderizarCartoes() {

```
const lista =
    document.getElementById(
        "listaCartoes"
    );

if (!dados.cartoes.length) {

    lista.innerHTML =
        `<div class="empty">
            Nenhum cartão cadastrado.
        </div>`;

    return;
}

lista.innerHTML =
    dados.cartoes.map(
        item => `

        <div class="credit-card">

            <div>

                <small>CARTÃO</small>

                <h3>
                    ${escapar(item.nome)}
                </h3>

            </div>

            <div>

                <small>Limite</small>

                <strong>
                    ${dinheiro(item.limite)}
                </strong>

            </div>

            <button
                class="delete-card"
                onclick="
                    excluirCartao('${item.id}')
                "
            >
                Excluir cartão
            </button>

        </div>
    `
    ).join("");
```

}

function abrirCartao() {

```
abrirModal(
    "Novo cartão",
    `

    <form id="formCartao">

        <div class="form-group">

            <label>Nome</label>

            <input
                id="cartaoNome"
                required
                placeholder="Ex.: Nubank"
            >

        </div>


        <div class="form-group">

            <label>Limite</label>

            <input
                id="cartaoLimite"
                type="number"
                step="0.01"
                required
            >

        </div>


        <div class="form-group">

            <label>Dia de fechamento</label>

            <input
                id="cartaoFechamento"
                type="number"
                min="1"
                max="31"
                value="5"
            >

        </div>


        <div class="form-group">

            <label>Dia de vencimento</label>

            <input
                id="cartaoVencimento"
                type="number"
                min="1"
                max="31"
                value="10"
            >

        </div>


        <div class="form-actions">

            <button
                type="submit"
                class="btn primary"
            >
                Salvar
            </button>

        </div>

    </form>
    `
);

document
    .getElementById("formCartao")
    .onsubmit = evento => {

        evento.preventDefault();

        dados.cartoes.push({

            id: gerarId(),

            nome:
                document
                    .getElementById(
                        "cartaoNome"
                    ).value,

            limite:
                Number(
                    document
                        .getElementById(
                            "cartaoLimite"
                        ).value
                ),

            fechamento:
                Number(
                    document
                        .getElementById(
                            "cartaoFechamento"
                        ).value
                ),

            vencimento:
                Number(
                    document
                        .getElementById(
                            "cartaoVencimento"
                        ).value
                )

        });

        salvarDados();

        fecharModal();

        renderizar();
    };
```

}

function excluirCartao(id) {

```
if (
    !confirm(
        "Excluir este cartão?"
    )
) return;

dados.cartoes =
    dados.cartoes.filter(
        item =>
            item.id !== id
    );

salvarDados();

renderizar();
```

}

/* =====================================================
PARCELAMENTOS
===================================================== */

function renderizarParcelamentos() {

```
const lista =
    document.getElementById(
        "listaParcelamentos"
    );

if (!dados.parcelamentos.length) {

    lista.innerHTML =
        `<div class="empty">
            Nenhum parcelamento cadastrado.
        </div>`;

    return;
}

lista.innerHTML =
    dados.parcelamentos.map(
        item => `

        <div class="list-item">

            <div class="item-info">

                <div class="item-title">
                    ${escapar(item.nome)}
                </div>

                <div class="item-subtitle">
                    Parcela ${item.atual}
                    de ${item.total}
                </div>

            </div>

            <div class="item-value negative">
                ${dinheiro(item.valor)}
            </div>

            <div class="item-actions">

                <button
                    onclick="
                        excluirParcelamento(
                            '${item.id}'
                        )
                    "
                >
                    🗑️
                </button>

            </div>

        </div>
    `
    ).join("");
```

}

function abrirParcelamento() {

```
abrirModal(
    "Novo parcelamento",
    `

    <form id="formParcelamento">

        <div class="form-group">

            <label>Descrição</label>

            <input
                id="parcelamentoNome"
                required
                placeholder="Ex.: Notebook"
            >

        </div>


        <div class="form-group">

            <label>Valor da parcela</label>

            <input
                id="parcelamentoValor"
                type="number"
                step="0.01"
                required
            >

        </div>


        <div class="form-group">

            <label>Total de parcelas</label>

            <input
                id="parcelamentoTotal"
                type="number"
                min="1"
                required
            >

        </div>


        <div class="form-group">

            <label>Parcela atual</label>

            <input
                id="parcelamentoAtual"
                type="number"
                min="1"
                value="1"
                required
            >

        </div>


        <div class="form-actions">

            <button
                type="submit"
                class="btn primary"
            >
                Salvar
            </button>

        </div>

    </form>
    `
);

document
    .getElementById(
        "formParcelamento"
    )
    .onsubmit = evento => {

        evento.preventDefault();

        dados.parcelamentos.push({

            id: gerarId(),

            nome:
                document
                    .getElementById(
                        "parcelamentoNome"
                    ).value,

            valor:
                Number(
                    document
                        .getElementById(
                            "parcelamentoValor"
                        ).value
                ),

            total:
                Number(
                    document
                        .getElementById(
                            "parcelamentoTotal"
                        ).value
                ),

            atual:
                Number(
                    document
                        .getElementById(
                            "parcelamentoAtual"
                        ).value
                )

        });

        salvarDados();

        fecharModal();

        renderizar();
    };
```

}

function excluirParcelamento(id) {

```
dados.parcelamentos =
    dados.parcelamentos.filter(
        item =>
            item.id !== id
    );

salvarDados();

renderizar();
```

}

/* =====================================================
INVESTIMENTOS
===================================================== */

function renderizarInvestimentos() {

```
const lista =
    document.getElementById(
        "listaInvestimentos"
    );

if (!dados.investimentos.length) {

    lista.innerHTML =
        `<div class="empty">
            Nenhum investimento cadastrado.
        </div>`;

    return;
}

lista.innerHTML =
    dados.investimentos.map(
        item => `

        <div class="list-item">

            <div class="item-info">

                <div class="item-title">
                    ${escapar(item.nome)}
                </div>

                <div class="item-subtitle">
                    ${escapar(item.tipo)}
                </div>

            </div>

            <div class="item-value positive">
                ${dinheiro(item.valor)}
            </div>

            <div class="item-actions">

                <button
                    onclick="
                        excluirInvestimento(
                            '${item.id}'
                        )
                    "
                >
                    🗑️
                </button>

            </div>

        </div>
    `
    ).join("");
```

}

function abrirInvestimento() {

```
abrirModal(
    "Novo investimento",
    `

    <form id="formInvestimento">

        <div class="form-group">

            <label>Nome</label>

            <input
                id="investimentoNome"
                required
                placeholder="Ex.: Tesouro Direto"
            >

        </div>


        <div class="form-group">

            <label>Tipo</label>

            <select id="investimentoTipo">

                <option>Renda fixa</option>
                <option>Renda variável</option>
                <option>Fundo</option>
                <option>Criptomoeda</option>
                <option>Poupança</option>
                <option>Outros</option>

            </select>

        </div>


        <div class="form-group">

            <label>Valor atual</label>

            <input
                id="investimentoValor"
                type="number"
                step="0.01"
                required
            >

        </div>


        <div class="form-actions">

            <button
                type="submit"
                class="btn primary"
            >
                Salvar
            </button>

        </div>

    </form>
    `
);

document
    .getElementById("formInvestimento")
    .onsubmit = evento => {

        evento.preventDefault();

        dados.investimentos.push({

            id: gerarId(),

            nome:
                document
                    .getElementById(
                        "investimentoNome"
                    ).value,

            tipo:
                document
                    .getElementById(
                        "investimentoTipo"
                    ).value,

            valor:
                Number(
                    document
                        .getElementById(
                            "investimentoValor"
                        ).value
                )

        });

        salvarDados();

        fecharModal();

        renderizar();
    };
```

}

function excluirInvestimento(id) {

```
dados.investimentos =
    dados.investimentos.filter(
        item =>
            item.id !== id
    );

salvarDados();

renderizar();
```

}

/* =====================================================
META
===================================================== */

function atualizarMeta() {

```
const meta =
    Number(
        dados.metas[mesAtual] || 0
    );

const receitas =
    dados.receitas
        .filter(
            item =>
                item.mes === mesAtual
        )
        .reduce(
            (total, item) =>
                total +
                Number(item.valor || 0),
            0
        );

const despesas =
    dados.despesas
        .filter(
            item =>
                item.mes === mesAtual
        )
        .reduce(
            (total, item) =>
                total +
                Number(item.valor || 0),
            0
        );

const economizado =
    Math.max(
        0,
        receitas - despesas
    );

const percentual =
    meta > 0
        ? Math.min(
            100,
            economizado / meta * 100
        )
        : 0;

document
    .getElementById(
        "valorEconomizado"
    )
    .textContent =
    dinheiro(economizado);

document
    .getElementById(
        "valorMeta"
    )
    .textContent =
    dinheiro(meta);

document
    .getElementById(
        "barraMeta"
    )
    .style.width =
    percentual + "%";

document
    .getElementById(
        "textoMeta"
    )
    .textContent =
    meta > 0
        ? `${percentual.toFixed(0)}% da meta alcançada`
        : "Defina uma meta para começar.";
```

}

function abrirMeta() {

```
const atual =
    dados.metas[mesAtual] || "";

abrirModal(
    "Meta de economia",
    `

    <form id="formMeta">

        <div class="form-group">

            <label>
                Valor da meta
            </label>

            <input
                id="metaValor"
                type="number"
                step="0.01"
                min="0"
                value="${atual}"
                required
            >

        </div>


        <div class="form-actions">

            <button
                type="submit"
                class="btn primary"
            >
                Salvar
            </button>

        </div>

    </form>
    `
);

document
    .getElementById("formMeta")
    .onsubmit = evento => {

        evento.preventDefault();

        dados.metas[mesAtual] =
            Number(
                document
                    .getElementById(
                        "metaValor"
                    ).value
            );

        salvarDados();

        fecharModal();

        renderizar();
    };
```

}

/* =====================================================
TAREFAS
===================================================== */

function renderizarTarefas() {

```
const lista =
    document.getElementById(
        "listaTarefas"
    );

if (!dados.tarefas.length) {

    lista.innerHTML =
        `<div class="empty">
            Nenhuma tarefa cadastrada.
        </div>`;

    return;
}

lista.innerHTML =
    dados.tarefas.map(
        item => `

        <div class="task ${
            item.concluida
                ? "completed"
                : ""
        }">

            <input
                type="checkbox"
                ${
                    item.concluida
                        ? "checked"
                        : ""
                }
                onchange="
                    alternarTarefa(
                        '${item.id}'
                    )
                "
            >

            <span>
                ${escapar(item.nome)}
            </span>

            <button
                onclick="
                    excluirTarefa(
                        '${item.id}'
                    )
                "
            >
                🗑️
            </button>

        </div>
    `
    ).join("");
```

}

function abrirTarefa() {

```
abrirModal(
    "Nova tarefa",
    `

    <form id="formTarefa">

        <div class="form-group">

            <label>Tarefa</label>

            <input
                id="tarefaNome"
                required
                placeholder="Ex.: Conferir fatura"
            >

        </div>


        <div class="form-actions">

            <button
                type="submit"
                class="btn primary"
            >
                Adicionar
            </button>

        </div>

    </form>
    `
);

document
    .getElementById("formTarefa")
    .onsubmit = evento => {

        evento.preventDefault();

        dados.tarefas.push({

            id: gerarId(),

            nome:
                document
                    .getElementById(
                        "tarefaNome"
                    ).value,

            concluida: false

        });

        salvarDados();

        fecharModal();

        renderizar();
    };
```

}

function alternarTarefa(id) {

```
const tarefa =
    dados.tarefas.find(
        item =>
            item.id === id
    );

if (!tarefa) return;

tarefa.concluida =
    !tarefa.concluida;

salvarDados();

renderizar();
```

}

function excluirTarefa(id) {

```
dados.tarefas =
    dados.tarefas.filter(
        item =>
            item.id !== id
    );

salvarDados();

renderizar();
```

}

/* =====================================================
GRÁFICOS
===================================================== */

function atualizarGraficos() {

```
if (
    typeof Chart ===
    "undefined"
) {
    return;
}

atualizarGraficoCategorias();

atualizarGraficoMensal();
```

}

function atualizarGraficoCategorias() {

```
const despesas =
    dados.despesas.filter(
        item =>
            item.mes === mesAtual
    );

const categorias = {};

despesas.forEach(
    item => {

        const categoria =
            item.categoria ||
            "Outros";

        categorias[categoria] =
            (categorias[categoria] || 0) +
            Number(item.valor || 0);
    }
);

const canvas =
    document.getElementById(
        "graficoCategorias"
    );

if (graficoCategorias) {

    graficoCategorias.destroy();
}

graficoCategorias =
    new Chart(
        canvas,
        {

            type: "doughnut",

            data: {

                labels:
                    Object.keys(
                        categorias
                    ),

                datasets: [

                    {
                        data:
                            Object.values(
                                categorias
                            ),

                        borderWidth: 0
                    }

                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: "bottom"
                    }
                }
            }
        }
    );
```

}

function atualizarGraficoMensal() {

```
const ano =
    Number(
        mesAtual.split("-")[0]
    );

const labels = [];

const receitas = [];

const despesas = [];


for (
    let mes = 1;
    mes <= 12;
    mes++
) {

    const chave =
        `${ano}-${String(mes)
            .padStart(2, "0")}`;

    labels.push(
        new Date(
            ano,
            mes - 1,
            1
        ).toLocaleDateString(
            "pt-BR",
            {
                month: "short"
            }
        )
    );


    receitas.push(
        dados.receitas
            .filter(
                item =>
                    item.mes === chave
            )
            .reduce(
                (total, item) =>
                    total +
                    Number(item.valor || 0),
                0
            )
    );


    despesas.push(
        dados.despesas
            .filter(
                item =>
                    item.mes === chave
            )
            .reduce(
                (total, item) =>
                    total +
                    Number(item.valor || 0),
                0
            )
    );
}


const canvas =
    document.getElementById(
        "graficoMensal"
    );

if (graficoMensal) {

    graficoMensal.destroy();
}


graficoMensal =
    new Chart(
        canvas,
        {

            type: "bar",

            data: {

                labels,

                datasets: [

                    {
                        label: "Receitas",
                        data: receitas
                    },

                    {
                        label: "Despesas",
                        data: despesas
                    }

                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                scales: {

                    y: {

                        beginAtZero: true
                    }
                }
            }
        }
    );
```

}

/* =====================================================
EXPORTAR / IMPORTAR
===================================================== */

function exportar() {

```
const arquivo =
    JSON.stringify(
        dados,
        null,
        2
    );

const blob =
    new Blob(
        [arquivo],
        {
            type: "application/json"
        }
    );

const url =
    URL.createObjectURL(blob);

const link =
    document.createElement("a");

link.href = url;

link.download =
    `backup-financeiro-${mesAtual}.json`;

link.click();

URL.revokeObjectURL(url);
```

}

function importar(evento) {

```
const arquivo =
    evento.target.files[0];

if (!arquivo) return;

const leitor =
    new FileReader();

leitor.onload = () => {

    try {

        const importado =
            JSON.parse(
                leitor.result
            );

        if (
            !confirm(
                "Isso substituirá os dados atuais. Continuar?"
            )
        ) {
            return;
        }

        dados = {
            ...structuredClone(
                estruturaInicial
            ),
            ...importado
        };

        salvarDados();

        renderizar();

        alert(
            "Backup importado com sucesso!"
        );

    } catch (erro) {

        alert(
            "O arquivo não é um backup válido."
        );
    }

};

leitor.readAsText(arquivo);

evento.target.value = "";
```

}

/* =====================================================
LIMPAR MÊS
===================================================== */

function limparMes() {

```
if (
    !confirm(
        `Apagar todas as receitas e despesas de ${nomeDoMes(mesAtual)}?`
    )
) {
    return;
}

dados.receitas =
    dados.receitas.filter(
        item =>
            item.mes !== mesAtual
    );

dados.despesas =
    dados.despesas.filter(
        item =>
            item.mes !== mesAtual
    );

delete dados.metas[mesAtual];

salvarDados();

renderizar();
```

}
