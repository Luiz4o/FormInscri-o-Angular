import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { LocalstorageService } from '../services/localstorage.service';

interface IParticipante {
  nome:string,
  email:string,
  cpf:string,
  ingresso:string
}

interface IEvento{
 evento:string,
 modalidade:string,
 dataInicio:string,
 dataTermino:string,
 participantes?:IParticipante[]
}

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  form!: FormGroup;
  eventos = ["TechConf 2025", "Summit de Inovação", "Angular World", "Conexão Dev"];
  modalidades = ["Presencial", "Online"];
  tiposIngresso = ["Padrão", "VIP", "Estudante"];
  participantesSalvos:any =[]
  evento: IEvento = {
    evento: '',
    modalidade: '',
    dataInicio: '',
    dataTermino: '',
    participantes: [],
  };

  
  constructor(private fb: FormBuilder, private localStorageService: LocalstorageService) {
    this.form = this.fb.group({
      evento: ['', Validators.required],
      modalidade: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataTermino: ['', Validators.required],
      participantes: this.fb.array([]),
    });
    this.adicionarParticipante();
  }

  ngOnInit(): void {
    const eventoSalvo = this.localStorageService.getLocal('evento');
    if (eventoSalvo) {
      this.evento = eventoSalvo;
      this.form.patchValue({
        evento: this.evento.evento,
        modalidade: this.evento.modalidade,
        dataInicio: this.evento.dataInicio,
        dataTermino: this.evento.dataTermino,
      });

      if (this.evento.participantes) {
        const participantesArray = this.form.get('participantes') as FormArray;
        this.evento.participantes.forEach(participante => {
          participantesArray.push(this.criarParticipante(participante));
        });
      }
    }
  }

  criarParticipante(participante: IParticipante = { nome: '', email: '', cpf: '', ingresso: '' }): FormGroup {
    return this.fb.group({
      nome: [participante.nome, Validators.required],
      email: [participante.email, [Validators.required, Validators.email]],
      cpf: [participante.cpf, [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      ingresso: [participante.ingresso, Validators.required],
    });
  }

  adicionarParticipante() {
    const participantes = this.form.get('participantes') as FormArray;
    participantes.push(this.criarParticipante());
  }

  removerParticipante(index: number) {
    const participantes = this.form.get('participantes') as FormArray;
    participantes.removeAt(index);
  }

  salvarEvento() {
    if (this.form.valid) {
      this.evento.evento = this.form.get('evento')?.value;
      this.evento.modalidade = this.form.get('modalidade')?.value;
      this.evento.dataInicio = this.form.get('dataInicio')?.value;
      this.evento.dataTermino = this.form.get('dataTermino')?.value;
      this.evento.participantes = this.form.get('participantes')?.value;

      this.localStorageService.setLocal('evento', this.evento);
    }
  }

  enviarEvento(){
    this.localStorageService.removeTodosLocal();

  this.evento = {
    evento: '',
    modalidade: '',
    dataInicio: '',
    dataTermino: '',
    participantes: [],
  };

  this.form.reset();
  this.participantes.clear();
  this.adicionarParticipante();
  }

  get participantes(): FormArray {
    return this.form.get('participantes') as FormArray;
  }
  
}
