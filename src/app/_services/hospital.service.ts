import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { briefHospital, hospitalModel } from './hospital.model';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) { }

  readonly url='https://localhost:5001/api/'
  hospitalsList:briefHospital[];
  loading:boolean = false;

  getHospitals() {
    
    return this.http.get('https://hctp-database-test.herokuapp.com/api/hospitals').pipe(
      map(res=>{
        return res as hospitalModel[]
      } ))



  }

}
