import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
// Projeto Proposta
import { InfoComponent } from '@app/projetos/projeto/proposta/info/info.component';
import { TemasComponent } from '@app/projetos/projeto/proposta/temas/temas.component';
import { SubTemasComponent } from '@app/projetos/projeto/proposta/temas/sub-tema.component';
import { ProdutosComponent } from '@app/projetos/projeto/proposta/produtos/produtos.component';
import { EtapasComponent } from '@app/projetos/projeto/proposta/etapas/etapas.component';
import { EmpresasComponent } from '@app/projetos/projeto/proposta/empresas/empresas.component';
import { AlocacaoComponent as AlocacaoHumanoComponent } from '@app/projetos/projeto/proposta/recursos-humanos/alocacao.component';
import { AlocacaoComponent as AlocacaoMaterialComponent } from '@app/projetos/projeto/proposta/recursos-materiais/alocacao.component';
import { OrcamentoEmpresasComponent } from '@app/projetos/projeto/proposta/orcamento-empresas/orcamento-empresas.component';
import { OrcamentoEtapasComponent } from '@app/projetos/projeto/proposta/orcamento-etapas/orcamento-etapas.component';

@NgModule({
    declarations: [
        InfoComponent,
        TemasComponent,
        SubTemasComponent,
        ProdutosComponent,
        EtapasComponent,
        EmpresasComponent,
        AlocacaoHumanoComponent,
        AlocacaoMaterialComponent,
        OrcamentoEmpresasComponent,
        OrcamentoEtapasComponent,
    ],
    imports: [
        SharedModule
    ],
    exports: [
        ProdutosComponent,
        EtapasComponent,
        EmpresasComponent,
        AlocacaoHumanoComponent,
        AlocacaoMaterialComponent,
        OrcamentoEmpresasComponent,
        OrcamentoEtapasComponent,
    ]
})
export class PropostaModule { }
