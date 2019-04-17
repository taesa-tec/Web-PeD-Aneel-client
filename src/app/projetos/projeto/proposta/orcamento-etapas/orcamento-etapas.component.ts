import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {zip, of} from 'rxjs';

import {AppService} from '@app/app.service';
import {Projeto, Etapa, TextValue, CategoriasContabeis, ExtratosEtapas, ExtratoItem} from '@app/models';
import {LoadingComponent} from '@app/shared/loading/loading.component';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AlocarRecursoHumanoFormComponent} from '@app/projetos/projeto/common/alocar-recurso-humano-form/alocar-recurso-humano-form.component';
import {AlocarRecursoMaterialFormComponent} from '@app/projetos/projeto/common/alocar-recurso-material-form/alocar-recurso-material-form.component';
import {ProjetoFacade} from '@app/facades';

@Component({
    selector: 'app-orcamento-etapas',
    templateUrl: './orcamento-etapas.component.html',
    styles: []
})
export class OrcamentoEtapasComponent implements OnInit {

    projeto: ProjetoFacade;
    extrato: ExtratosEtapas;
    etapas: { [propName: number]: Etapa } = {};
    categoriasContabeis: { [propName: string]: TextValue } = {
        'RH': {text: 'Recursos Humanos', value: 'RH'}
    };

    alocacoesRH: Array<any> = [];
    alocacoesRM: Array<any> = [];

    @ViewChild(LoadingComponent) loading: LoadingComponent;

    get extratoEtapas() {
        return this.extrato ? this.extrato.etapas.filter(e => e.total > 0) : [];
    }

    get totalGeral() {
        return this.extrato ? this.extrato.valor : 0;
    }

    constructor(
        protected app: AppService,
        private route: ActivatedRoute
    ) {
        CategoriasContabeis.forEach(c => {
            this.categoriasContabeis[c.value] = c;
        });
    }

    categoriaPorCod(cod) {
        if (this.categoriasContabeis[cod]) {
            return this.categoriasContabeis[cod].text;
        }
        return '';
    }


    ngOnInit() {
        const projeto$ = this.app.projetos.projetoLoaded;
        zip(projeto$).subscribe(([projeto]) => {
            this.projeto = projeto;
            this.load();
        });
    }

    load() {
        this.loading.show();
        const extratos$ = this.projeto.getOrcamentoEtapas();
        const etapas$ = this.projeto.isPD ? this.projeto.REST.Etapas.listar<Array<Etapa>>() : of([]);

        zip(extratos$,
            etapas$,
            this.app.projetos.getAlocacaoRH(this.projeto.id),
            this.app.projetos.getAlocacaoRM(this.projeto.id)
        ).subscribe(([extrato, etapas, alocacoesRH, alocacoesRM]) => {
            this.extrato = extrato;
            this.alocacoesRH = alocacoesRH;
            this.alocacoesRM = alocacoesRM;
            if (etapas) {
                etapas.forEach((etapa, index) => {
                    this.etapas[etapa.id] = Object.assign(etapa, {numeroEtapa: index + 1});
                });
            }

            this.loading.hide();
        });
    }

    openModal(item: ExtratoItem, itens: Array<any>) {
        let modal: NgbModalRef;

        if (item.recursoHumano) {
            const alocacao = this.alocacoesRH.find(a => a.id === item.alocacaoId);
            modal = this.app.modal.open(AlocarRecursoHumanoFormComponent, {size: 'lg'});
            modal.componentInstance.alocacao = alocacao;

        } else if (item.recursoMaterial) {
            const alocacao = this.alocacoesRM.find(a => a.id === item.alocacaoId);
            modal = this.app.modal.open(AlocarRecursoMaterialFormComponent, {size: 'lg'});
            modal.componentInstance.alocacao = alocacao;
        }

        if (modal) {
            modal.componentInstance.projeto = this.projeto;
            modal.result.then(result => {
                console.log(result);
                if (result === 'deleted') {
                    itens.splice(itens.indexOf(item), 1);
                }
            }, error => {

            });
        }
    }

    orcamentoGerarCSV() {
        this.projeto.orcamentoGerarCSV().subscribe(result => {

        }, error => {
            this.app.alert('Não foi possível gerar o relatório', 'Erro!');
            console.log({error});

        });
    }
}
