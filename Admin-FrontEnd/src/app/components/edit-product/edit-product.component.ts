import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/common/Category';
import { Product } from 'src/app/common/Product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  product!: Product;
  categories!:Category[];
  postForm: FormGroup;
  
  url: string = "data:image/png;base64,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";
  @Input() id!:number;
  @Output()
  editFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modalService: NgbModal, private categoryService: CategoryService, private productService: ProductService, private toastr: ToastrService) {
    this.postForm = new FormGroup({
      'productId': new FormControl(0),
      'name': new FormControl(null, [Validators.minLength(6), Validators.required]),
      'quantity': new FormControl(null, [Validators.min(1), Validators.required]),
      'price': new FormControl(null, [Validators.required, Validators.min(1000)]),
      'discount': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      'image': new FormControl(),
      'description': new FormControl(null, Validators.required),
      'enteredDate': new FormControl(new Date()),
      // 'rate': new FormControl(0),
      'categoryId': new FormControl(1)
    })
  }

  ngOnInit(): void {
    this.getCategories();
    this.productService.getOne(this.id).subscribe(data=>{
      this.product = data as Product;
      this.postForm = new FormGroup({
        'productId': new FormControl(this.product.productId),
        'name': new FormControl(this.product.name, [Validators.minLength(6), Validators.required]),
        'quantity': new FormControl(this.product.quantity, [Validators.min(1), Validators.required]),
        'price': new FormControl(this.product.price, [Validators.required, Validators.min(1000)]),
        'discount': new FormControl(this.product.discount, [Validators.required, Validators.min(0), Validators.max(100)]),
        'image': new FormControl(this.product.image),
        'description': new FormControl(this.product.description, Validators.required),
        'enteredDate': new FormControl(this.product.enteredDate),
        // 'rate': new FormControl(this.product.rate),
        'categoryId': new FormControl(this.product.category.categoryId)
      })
      this.url = this.product.image;
    }, error=>{
      this.toastr.error('Lỗi truy xuất dữ liệu, bấm f5!', 'Hệ thống');
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: "lg" });
  }

  getCategories() {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data as Category[];
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu, bấm f5!', 'Hệ thống');
    })
  }

  update() {
    if(this.postForm.valid) {
      this.product = this.postForm.value;
      this.product.status = true;
      this.product.category = new Category(this.postForm.value.categoryId, '');
      this.product.image = this.url;
      this.productService.put(this.id, this.product).subscribe(data=>{
        this.modalService.dismissAll();
        this.toastr.success('Cập nhật thành công!', "Hệ thống");
        this.editFinish.emit('done');
      },error=>{
        this.toastr.error('Thêm thất bại!'+error, 'Hệ thống');
      })
    } else {
      this.toastr.error('Hãy kiểm tra và nhập lại dữ liệu!', 'Hệ thống');
    }
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
