import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Person {
  id?: string;
  firstName: string;
  lastName: string;
  address: string;
  birthDate: string;
  age?: number;
}

@Injectable({
  providedIn: 'root'
})

export class PersonService {

  //private apiUrl = 'http://localhost:5209/people'; // Check Port  API .NET
  private apiUrl = 'https://coreapi-eakr.onrender.com/people'

  constructor(private http: HttpClient) { }

  getPeople(): Observable<Person[]> {
    const timestamp = new Date().getTime();
    return this.http.get<Person[]>(`${this.apiUrl}?t=${timestamp}`);
  }

  addPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person);
  }

  deletePerson(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}