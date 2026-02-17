import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // สำหรับทำ Form
import { Person, PersonService } from './person.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import Modules 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit {
  people: any[] = [];

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

  constructor(
    private personService: PersonService,
    private cdr: ChangeDetectorRef 
) {}

  ngOnInit(): void {
    console.log("เริ่มโหลดข้อมูลตอน Refresh...");
    this.loadPeople();
  }

loadPeople() {
  this.personService.getPeople().subscribe({
    next: (res) => {
      this.people = res;
      console.log("โหลดข้อมูลสำเร็จ:", res);
      this.cdr.detectChanges(); // 3. สั่งให้ Angular วาดหน้าจอใหม่ทันทีที่ข้อมูลมา!
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