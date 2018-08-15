import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from '../../shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { MaterialService } from '../../shared/classes/material.service';
import { Category } from '../../shared/interfaces';


@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef
  form: FormGroup
  image: File
  imagePreview = ''
  isNew: boolean = true
  category: Category

  constructor(private route: ActivatedRoute,
              private catService: CategoriesService,
              private router: Router) { }

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    this.form.disable()

    // switchMap - как только мы получим params, то мы хотим запустить еще один асинхронный стрим
    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false
              return this.catService.getById(params['id']) // возвращаем стрим
            }
            return of(null) // возвращаем стрим из null если это новая категория
          }
        )
      )
      .subscribe(
        (category:Category) => {
          if (category) {
            this.category = category
            this.form.patchValue({name: category.name})
            this.imagePreview = category.imageSrc // отображает картинку в категории (если есть)
            MaterialService.updateTextInputs()
          }
          this.form.enable()
        },
        error => MaterialService.toast(error.error.message)
      )
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  deleteCategory() {
    const ok = window.confirm(`Вы действительно хотите удалить категорию: "${this.category.name}"`)

    if (ok) {
      this.catService.delete(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        )
    }
  }

  onFileUpload(event: Event| any) {
    //  получить доступ к загруженному файлу
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    // вызов произойдёт когда загрузится вся картинка
    reader.onload = () => {
      this.imagePreview = reader.result // хранит инфо об изображении
    }

    reader.readAsDataURL(file)

  }

  onSubmit() {
    let ob$
    this.form.disable()

    if (this.isNew) {
      ob$ = this.catService.create(this.form.value.name, this.image)
    } else {
      ob$ = this.catService.update(this.category._id, this.form.value.name, this.image)
    }
  
    ob$.subscribe(
      category => {
        this.category = category
        MaterialService.toast('Изменения сохранены')
        this.form.enable()
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

}
