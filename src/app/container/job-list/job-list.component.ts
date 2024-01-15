import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobsDataService } from '../../Services/jobs-data.service';
import { Jobs } from '../../model/Jobs';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'job-list',
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css'
})
export class JobListComponent implements OnInit {

  //property to add the data
  isJobCreate:boolean = false;

  jobs: Jobs[] = [];

  FilteredJobs:Jobs[] = [];

  isEditMode: boolean = false;

  currentId: string = '';

  errorMsg:string='';


  searchText:string='';

  username:string='';

  //declaration to form a formGroup that is created in the view template by reference
  reactiveForm: FormGroup;


  constructor(private fb: FormBuilder,
    private jobsDataService: JobsDataService,
    private _authService:AuthService) {
      this._authService.profileInfo.subscribe((res)=>{
        this.username=res.displayName;
      })
     }

  ngOnInit() {
    this.reactiveForm = this.fb.group({
      title: [null, [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
      company: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/)]],
      location: [null, [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
      description: [null, [Validators.required]],
      category: [null, [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
      qualification: [null, [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
      salary: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/)]],

    });

    this._authService.profileInfo.subscribe((res)=>{
      this.username=res.displayName;
    })

    this.fetchJob();
  }

  // OnFormSubmitted() {
  //   this.jobs = this.reactiveForm.value;
  //   console.log('jobs=> ', this.jobs);

  // }


  addForm(){
    this.isJobCreate = !this.isJobCreate;
  }

  //post the job
  
  
  onJobPost(jobs: {
    title: string;
    company: string;
    location: string;
    description: string;
    category: string;
    qualification: string;
    salary: string;
  }) {
    if (!this.isEditMode) {
      this.jobsDataService.postJob(jobs).subscribe(res => {
        console.log(res);
        this.reactiveForm.reset();
        this.onFetchJobs();

        this.isJobCreate=false;
      })
      

    }
    else {
      this.jobsDataService.updateJob(this.currentId, jobs).subscribe(() => {
        this.isEditMode = false;
        this.reactiveForm.reset();

        this.onFetchJobs();

        this.isJobCreate=false;
      })


    }
  }


  //get the job
  onFetchJobs() {
    this.fetchJob();
  }

  private fetchJob() {
    this.jobsDataService.getJobs().subscribe(data => {
      // console.log('yahi toh hai tumhara job',data)
      this.jobs = data;

      if(!this.searchText){
        this.FilteredJobs=this.jobs;
      }

      // console.log('jobs lele: ',this.jobs)
    });
  }

  


  //update the job


  // onUpdateJob(id,jobs){
  //   this.jobsDataService.updateJob(id,jobs).subscribe()
  // }

  editForm(id: string) {

    this.isJobCreate=true;
    //get the selected job to edit
    this.currentId = id;
    let currentjob = this.jobs.find((p) => { return p.id === id })
    console.log('current job hai ye toh ', currentjob);

    //populate the form on the selected job
    this.reactiveForm.setValue({
      title: currentjob.title,
      company: currentjob.company,
      location: currentjob.location,
      description: currentjob.description,
      category: currentjob.category,
      qualification: currentjob.qualification,
      salary: currentjob.salary,
    }
    )


    //change the edit mode into true
    this.isEditMode = true;

  }

  //delete the job
  onDeleteJob(id: string) {
    this.currentId = id;
    const userResponse = window.confirm('Do you want to proceed?');
    if(userResponse){
      this.jobsDataService.deleteJob(id).subscribe(()=>{
        this.onFetchJobs();
      });
    }else{
      console.log(userResponse)
      return
    }
    
  }


  //delete all the job
  onDeleteAllJob() {
    const userResponse = window.confirm('Do you want to delete all Jobs?');
    if(userResponse){
      this.jobsDataService.deleteAllJob().subscribe(()=>{
        this.onFetchJobs();
      });
    }
    else{
      return
    }
  }


  // Get job by their id
  // onViewMore(id){
  //   this.jobsDataService.ViewMore(id).subscribe();
  // }

  //Get the job by their search value

  onSearchByTitle(title:string){
    this.searchText=title;
    console.log(title);

    this.jobsDataService.searchByTitle(title).subscribe((res)=>{
      console.log(res);
      this.FilteredJobs=res;
      console.log(this.FilteredJobs);
    })

  }

}
