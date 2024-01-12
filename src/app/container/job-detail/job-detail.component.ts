import { Component, OnInit } from '@angular/core';
import { Jobs } from '../../model/Jobs';
import { JobsDataService } from '../../Services/jobs-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'job-detail',
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css'
})
export class JobDetailComponent implements OnInit{

  id:string='';
  detailedView:Jobs[]=[];

  //create a form here
  applyForm:FormGroup;

  isApply:boolean=false;

  constructor(private jobsDataService:JobsDataService , 
              private router:ActivatedRoute,
              private fb:FormBuilder){}

  ngOnInit(){
    this.router.params.subscribe((param)=>{
      this.id=param['id']
      this.jobsDataService.ViewMore(this.id).subscribe((data)=>{
        this.detailedView = data;
        // console.log(data)
        // console.log(this.detailedView)
      })

    })

    this.applyForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
      lastname: [''],
      email:['',[Validators.required, Validators.email]],
      phoneNo:['',[Validators.required,Validators.minLength(10), Validators.pattern(/^[0-9]*$/)]],
      address: this.fb.group({
        address1: ['', [Validators.required]],
        city: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
        postal: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/)]],
        state: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
        country: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]]
      }),
      qualification: ['',[Validators.required]],
      experience: [''],
      skills: ['',[Validators.required]],

      resume: [null],

    })

    

  }

  onFormSubmit(){
    this.isApply=true;
  }

  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   this.applyForm.patchValue({ resume: file });
  // }

  onFileChange(event:any){
    console.log(event.target.files[0]);
    let file = event.target.files[0];
    this.applyForm.patchValue({resume:file});
  }

  applyJobForm(){

    if (this.applyForm.valid) {
      let formData = new FormData();
      console.log('resume: ',this.applyForm.get('resume'));
      console.log('resume value: ',this.applyForm.get('resume').value);
      formData.append('resume',this.applyForm.get('resume').value);
      // formData.append('resume', this.applyForm.get('resume').value);
      console.log(formData);
    }

    console.log(this.applyForm.value)

  }

  // applyJobForm() {
  //   if (this.applyForm.valid) {
  //     let formData = new FormData();
  
  //     // Use the entire File object, not just the value
  //     formData.append('resume', this.applyForm.get('resume').value);
  
  //     console.log(formData);
  //   }
  
  //   console.log(this.applyForm.value);
  // }
  


}
