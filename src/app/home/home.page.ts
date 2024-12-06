import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  nama = '';
  dataPahlawan: any;
  modalTambah: any;
  id: any;
  nama_pahlawan: any;
  kisah: any;
  modalEdit: any;

  constructor(private authService: AuthenticationService, private router: Router, private api: ApiService, private modal: ModalController) { this.nama = this.authService.nama }

  ngOnInit() {
    this.getPahlawan();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  resetModal() {
    this.id = null;
    this.nama_pahlawan = '';
    this.kisah = '';
  }

  openModalTambah(isOpen: boolean) {
    this.modalTambah = isOpen;
    this.resetModal();
    this.modalTambah = true;
    this.modalEdit = false;
  }

  cancel() {
    this.modal.dismiss();
    this.modalTambah = false;
    this.modalEdit = false;
    this.resetModal();
  }

  openModalEdit(isOpen: boolean, idget: any) {
    this.modalEdit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilPahlawan(this.id);
    this.modalTambah = false;
    this.modalEdit = true;
  }

  getPahlawan() {
    this.api.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataPahlawan = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  tambahPahlawan() {
    if (this.nama_pahlawan != '' && this.kisah != '') {
      let data = {
        nama_pahlawan: this.nama_pahlawan,
        kisah: this.kisah,
      }
      this.api.tambah(data, 'tambah.php')
        .subscribe({
          next: (hasil: any) => {
            this.resetModal();
            console.log('berhasil tambah pahlawan');
            this.getPahlawan();
            this.modalTambah = false;
            this.modal.dismiss();
          },
          error: (err: any) => {
            console.log('gagal tambah pahlawan');
          }
        })
    } else {
      console.log('gagal tambah pahlawan karena masih ada data yg kosong');
    }
  }

  hapusPahlawan(id: any) {
    this.api.hapus(id,
      'hapus.php?id=').subscribe({
        next: (res: any) => {
          console.log('sukses', res);
          this.getPahlawan();
          console.log('berhasil hapus data');
        },
        error: (error: any) => {
          console.log('gagal');
        }
      })
  }

  ambilPahlawan(id: any) {
    this.api.lihat(id,
      'lihat.php?id=').subscribe({
        next: (hasil: any) => {
          console.log('sukses', hasil);
          let pahlawan = hasil;
          this.id = pahlawan.id;
          this.nama_pahlawan = pahlawan.nama_pahlawan;
          this.kisah = pahlawan.kisah;
        },
        error: (error: any) => {
          console.log('gagal ambil data');
        }
      })
  }

  editPahlawan() {
    let data = {
      id: this.id,
      nama_pahlawan: this.nama_pahlawan,
      kisah: this.kisah
    }
    this.api.edit(data, 'edit.php')
      .subscribe({
        next: (hasil: any) => {
          console.log(hasil);
          this.resetModal();
          this.getPahlawan();
          console.log('berhasil edit Pahlawan');
          this.modalEdit = false;
          this.modal.dismiss();
        },
        error: (err: any) => {
          console.log('gagal edit Pahlawan');
        }
      })
  }
}