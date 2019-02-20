import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjetosService } from '@app/projetos/projetos.service';
import { CategoriaContabil, Projeto, RecursoMaterial } from '@app/models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { AppService } from '@app/app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-recurso-material-form',
    templateUrl: './recurso-material-form.component.html',
    styleUrls: ['./recurso-material-form.component.scss']
})
export class RecursoMaterialFormComponent implements OnInit {

    categoriaContabel = CategoriaContabil;
    form: FormGroup;
    projeto: Projeto;
    recursoMaterial: RecursoMaterial;

    @ViewChild(LoadingComponent) loading: LoadingComponent;

    constructor(
        public activeModal: NgbActiveModal,
        protected app: AppService) { }

    get modalTitle() {
        return typeof this.recursoMaterial.id !== 'undefined' ? "Editar Recurso Material" : "Adicionar Recurso Material";
    }

    get buttonAction() {
        return typeof this.recursoMaterial.id !== 'undefined' ? { text: "Salvar Alterações", icon: 'ta-save' } :
            { text: "Adicionar Recurso Material", icon: 'ta-plus-circle' };
    }

    ngOnInit() {
        this.setup();

    }

    setup() {
        this.form = new FormGroup({
            projetoId: new FormControl(this.projeto.id, Validators.required),
            nome: new FormControl(this.recursoMaterial.nome || '', [Validators.required]),
            categoriaContabil: new FormControl(this.recursoMaterial.categoriaContabilValor || '', [Validators.required]),
            valorUnitario: new FormControl(this.recursoMaterial.valorUnitario || '', [Validators.required]),
            especificacao: new FormControl(this.recursoMaterial.especificacao || '', [Validators.required]),
        });

        if (this.recursoMaterial.id !== undefined) {
            this.form.addControl('id', new FormControl(this.recursoMaterial.id));
        }

    }

    logProjeto(tela: string, acao?: string) {

        const logProjeto = {
            userId: this.app.users.currentUser.id,
            projetoId: this.projeto.id,
            tela,
            acao: acao || "Create",
            statusAnterior: "",
            statusNovo: ""
        };

        const nome = this.form.get("nome").value;
        const cat = this.categoriaContabel.find(t => t.value === this.form.get("categoriaContabil").value).text;
        const valor = this.form.get("valorUnitario").value;
        const especificacao = this.form.get("especificacao").value;

        logProjeto.statusNovo = `<b>Nome:</b> ${nome}<br>
        <b>Categoria Contábil:</b> ${cat}<br>
        <b>Valor Unitário:</b> ${valor}<br>
        <b>Especificação:</b> ${especificacao}<br>`;

        if (acao === "Delete") {
            logProjeto.statusNovo = "";
        }

        if (this.recursoMaterial.id !== undefined) {

            const _nome = this.recursoMaterial.nome;
            const _cat = this.categoriaContabel.find(t => t.value === this.recursoMaterial.categoriaContabilValor).text;
            const _valor = this.recursoMaterial.valorUnitario;
            const _especificacao = this.recursoMaterial.especificacao;

            logProjeto.statusAnterior = `<b>Nome:</b> ${_nome}<br>
            <b>Categoria Contábil:</b> ${_cat}<br>
            <b>Valor Unitário:</b> ${_valor}<br>
            <b>Especificação:</b> ${_especificacao}<br>`;

            logProjeto.acao = acao || "Update";
        }

        const request = this.app.projetos.criarLogProjeto(logProjeto);

        request.subscribe(result => {
            if (result.sucesso) {
                this.activeModal.close(result);
            } else {
                this.app.alert(result.inconsistencias.join(', '));
            }
        });
    }

    submit() {
        if (this.form.valid) {
            const request = this.recursoMaterial.id ? this.app.projetos.editarRecursoMaterial(this.form.value) : this.app.projetos.criarRecursoMaterial(this.form.value);
            this.loading.show();
            request.subscribe(result => {
                if (result.sucesso) {
                    this.logProjeto("Recursos Materiais");
                    this.activeModal.close(result);
                } else {
                    this.app.alert(result.inconsistencias.join(', '));
                }
                this.loading.hide();
            });
        }
    }

    excluir() {
        this.app.confirm("Tem certeza que deseja excluir este recurso material?", "Confirmar Exclusão")
            .then(result => {
                if (result) {
                    this.loading.show();
                    this.app.projetos.delRecursoMaterial(this.recursoMaterial.id).subscribe(resultDelete => {
                        this.loading.hide();
                        if (resultDelete.sucesso) {
                            this.logProjeto("Recursos Materiais", "Delete");
                            this.activeModal.close('deleted');
                        } else {
                            this.app.alert(resultDelete.inconsistencias.join(', '));
                        }
                    }, (error: HttpErrorResponse) => {
                        this.loading.hide();
                        this.app.alert(error.message);
                    });
                }

            });
    }
}
