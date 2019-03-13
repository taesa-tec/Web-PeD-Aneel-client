import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjetosService } from '@app/projetos/projetos.service';
import { Projeto, Empresa, Segmento, TextValue } from '@app/models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CatalogsService } from '@app/catalogs/catalogs.service';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { AppService } from '@app/app.service';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

    projeto: Projeto;
    form: FormGroup;
    empresas: Array<Empresa>;
    compartilhamentos: Array<TextValue>;
    segmentos: Array<Segmento>;

    @ViewChild(LoadingComponent) loading: LoadingComponent;

    public numeroPatterns = {
        'S': { pattern: /[A-Za-z]/, optional: true },
        '0': { pattern: /\d/, optional: false }
    };

    constructor(protected app: AppService) { }

    ngOnInit() {

        const empresas$ = this.app.catalogo.empresas();
        const segmentos$ = this.app.catalogo.segmentos();
        const compartilhamentos$ = this.app.catalogo.tipoCompartilhamento();
        const projeto$ = this.app.projetos.projetoLoaded;
        this.loading.show();

        zip(empresas$, segmentos$, projeto$, compartilhamentos$).subscribe(([empresas, segmentos, p, compartilhamentos]) => {
            this.empresas = empresas;
            this.segmentos = segmentos;
            this.compartilhamentos = compartilhamentos;
            this.projeto = p;

            this.form = new FormGroup({
                id: new FormControl(p.id, [Validators.required]),
                numero: new FormControl(p.numero, [Validators.required]),
                catalogEmpresaId: new FormControl(p.catalogEmpresaId, [Validators.required]),
                catalogStatusId: new FormControl(p.catalogStatusId, [Validators.required]),
                titulo: new FormControl(p.titulo, [Validators.required]),
                tituloDesc: new FormControl(p.tituloDesc, [Validators.required]),
                catalogSegmentoId: new FormControl(p.catalogSegmentoId || '', [Validators.required]),
                avaliacaoInicial: new FormControl(p.avaliacaoInicial || ''),
                compartResultados: new FormControl(p.compartResultadosValor || '', [Validators.required]),
                codigo: new FormControl({ value: p.codigo, disabled: true }),
                motivacao: new FormControl(p.motivacao),
                originalidade: new FormControl(p.originalidade),
                aplicabilidade: new FormControl(p.aplicabilidade),
                relevancia: new FormControl(p.relevancia),
                razoabilidade: new FormControl(p.razoabilidade),
                pesquisas: new FormControl(p.pesquisas),
            });
            this.formMountend();

            this.loading.hide();
        });
    }

    formMountend() { }

    onSubmit() {
        if (this.form.valid) {
            this.app.projetos.editar(this.form.value).subscribe(resultado => {
                if (resultado.sucesso) {
                    this.app.alert("Salvo com sucesso");
                    this.projeto = Object.assign(this.projeto, this.form.value);
                } else {
                    this.app.alert(resultado.inconsistencias.join("<br>"));
                }
            });
        }
    }

}