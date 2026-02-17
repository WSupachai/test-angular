import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // สำหรับทำ Form
import { Person, PersonService } from './person.service';
import { Observable } from 'rxjs'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import Modules 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit {
  people$!: Observable<Person[]>;

  // --- Modal ---
  showAddModal: boolean = false;   // ควบคุม Modal เพิ่มข้อมูล
  showViewModal: boolean = false;  // ควบคุม Modal ดูข้อมูล
  selectedPerson: Person | null = null; // เก็บข้อมูลคนที่จะดู


  newPerson: Person = {
    firstName: '',
    lastName: '',
    address: '',
    birthDate: ''
  };

  constructor(private personService: PersonService) { }

  ngOnInit() {
    console.log('หน้าเว็บเริ่มทำงานแล้ว... กำลังดึงข้อมูล'); // ใส่ log ไว้เช็ค
    this.loadPeople(); // <--- สั่งให้ดึงข้อมูลทันทีที่เปิดเว็บ
  }

  loadPeople() {
    this.personService.getPeople().subscribe({
      next: (data) => {
        console.log('ได้รับข้อมูลแล้ว:', data); // เช็คว่าข้อมูลมาจริงไหม
        this.people$ = this.personService.getPeople();
      },
      error: (err) => {
        console.error('ดึงข้อมูลไม่สำเร็จ:', err); // เช็คว่ามี error ไหม
      }
    });
  }

  // --- Managed Modal Add ---
  openAddModal() { this.showAddModal = true; }
  closeAddModal() { this.showAddModal = false; }

  saveNewPerson() {
    if (!this.newPerson.firstName) return;
    this.personService.addPerson(this.newPerson).subscribe(() => {
      this.loadPeople();
      this.closeAddModal();
      this.newPerson = { firstName: '', lastName: '', address: '', birthDate: '' }; // Clear
    });
  }

  get calculatedAge(): string {
    if (!this.newPerson.birthDate) return '-'; // ถ้ายังไม่เลือกวัน ให้ขีดไว้

    const birth = new Date(this.newPerson.birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // เช็คว่าถึงวันเกิดปีนี้หรือยัง ถ้ายังให้ลบ 1 ปี
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age.toString();
  }

  // --- Managed Modal GET---
  openViewModal(person: Person) {
    this.selectedPerson = person;
    this.showViewModal = true;
  }
  closeViewModal() {
    this.showViewModal = false;
    this.selectedPerson = null;
  }
}