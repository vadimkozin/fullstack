import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Position } from '../../../shared/interfaces';
import { PositionsService } from '../../../shared/services/positions.service';
import { MaterialService, MaterialInstance } from '../../../shared/classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @Input('categoryId') categoryId: string
  @ViewChild('modal') modalRef: ElementRef

  positions: Position[] = []
  loading: boolean = false
  positionId = null // флаг, если null - создание позиции, иначе - редактрование
  modal: MaterialInstance
  form: FormGroup

  constructor(private posService: PositionsService) { }

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })

    this.loading = true
    this.posService.fetch(this.categoryId).subscribe(
      positions => this.positions = positions,
      error => MaterialService.toast(error.error.message),
      () => this.loading = false
    )
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id  // то есть редактируем позицию  
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onAddPosition() {
    this.positionId = null        // то есть добавляем позицию
    this.form.reset({name: null, cost: 1})
    this.modal.open()
  }

  onDeletePosition(event: Event, position: Position) {
    
    event.stopPropagation()

    const ok = window.confirm(`Удалить позицию "${position.name}"?`)

    if (ok) {
      this.posService.delete(position).subscribe(
        response => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions.splice(idx, 1)
          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }

  onCancel() {
    this.modal.close()
  }

  obSubmit() {
    this.form.disable()

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId

    }

    const completed = () => {
        this.modal.close()
        this.form.reset({name: '', cost: 1})
        this.form.enable()
    }

    if (this.positionId) {
      
      newPosition._id = this.positionId
      
      this.posService.update(newPosition).subscribe(
        position => {
          MaterialService.toast('Изменения сохранены')
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions[idx] = position
        },
        error => {
          MaterialService.toast(error.error.message || error.message) 
          completed()
      },
        completed
      )
      
    } else {
        this.posService.create(newPosition).subscribe(
          position => {
            MaterialService.toast('Позиция создана')
            this.positions.push(position)
          },
          error => MaterialService.toast(error.error.message),
          completed
        )  
    }
  }


}
