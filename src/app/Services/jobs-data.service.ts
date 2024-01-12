import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Jobs } from '../model/Jobs';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobsDataService {

  error

  ApiURL= "https://linkedjob-5-default-rtdb.firebaseio.com/Jobs.json";

  constructor(private http:HttpClient) { }

  //post the job

  postJob(jobs:
    {title: string;
      company: string;
      location: string;
      description: string;
      category: string;
      qualification: string;
      salary: string; }
  ){
    return this.http.post<{ name: string }>(this.ApiURL,jobs);

  }


  //get the job

  getJobs(){
    return this.http.get<{[key:string]:Jobs}>(this.ApiURL)
    .pipe(
      map((res)=>{
        const data=[];
        for(let key in res){
          if(res.hasOwnProperty(key)){
            data.push({...res[key], id:key})
            // console.log(data);
          }
        } return data;

    }));
  }

  
  //update the job
  updateJob(id:string , jobs:any){
    return this.http.put(`https://linkedjob-5-default-rtdb.firebaseio.com/Jobs/${id}.json`,jobs)
  }
  
  //delete the job
  deleteJob(id){
    return this.http.delete(`https://linkedjob-5-default-rtdb.firebaseio.com/Jobs/${id}.json`)
  }

  //delete all the job
  deleteAllJob(){
    return this.http.delete(this.ApiURL)
  }


  //Getting the data of the job on clicking the View More button
  ViewMore(id:string): Observable<any>{
    return this.http.get(`https://linkedjob-5-default-rtdb.firebaseio.com/Jobs/${id}.json`)
  }


  //Getting the data of the job on searching by their title
  searchByTitle(title){
    return this.http.get(this.ApiURL).pipe(
      map((res)=>{
        // console.log('searchbyTitle: ', res);
        const data=[];
        for(let key in res){
          if(res.hasOwnProperty(key)){
            data.push({...res[key], id:key})
          }
        }
        return data;
      })
    ).pipe(
     map((jobs)=>{
      // console.log('searchbyTitle Jobs: ', jobs);
      if(Array.isArray(jobs)){
        return jobs.filter((job)=>{
          return (job.title.toLowerCase().includes(title.toLowerCase()) || job.company.toLowerCase().includes(title.toLowerCase()))
          // console.log('searchbyTitle Jobs include: ', job);
        })
        
      }else {
        console.error('The response from the server is not an array:', jobs);
        return [];
      }
     }) 
    )
  }

}
