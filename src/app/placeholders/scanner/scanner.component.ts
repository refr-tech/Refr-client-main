import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

//import { MatDialog } from '@angular/material/dialog';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';
//import { FormatsDialogComponent } from './formats-dialog/formats-dialog.component';
//import { AppInfoDialogComponent } from './app-info-dialog/app-info-dialog.component';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {

  availableDevices: MediaDeviceInfo[] | undefined;
  deviceCurrent: MediaDeviceInfo | undefined;
  deviceSelected: string = "";

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  hasDevices: boolean = false;
  hasPermission: boolean = false;

  qrResultString: string = "";

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = true;


  constructor(
    //private readonly _dialog: MatDialog
    private dialogRef: MatDialogRef<ScannerComponent>
    ) { }

  ngOnInit(): void {
  }

  clearResult(): void {
    this.qrResultString = "";
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    console.log(resultString)
    this.qrResultString = resultString;
    this.dialogRef.close({content:resultString});
  }

  onDeviceSelectChange(selected: any) {
    console.log(selected)
    const selectedStr = selected || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    const device = this.availableDevices?.find(x => x.deviceId === selected);
    this.deviceCurrent = device || undefined;
  }

/*


  openFormatsDialog() {
    const data = {
      formatsEnabled: this.formatsEnabled,
    };

    this._dialog
      .open(FormatsDialogComponent, { data })
      .afterClosed()
      .subscribe(x => {
        if (x) {
          this.formatsEnabled = x;
        }
      });
  }


  openInfoDialog() {
    const data = {
      hasDevices: this.hasDevices,
      hasPermission: this.hasPermission,
    };

    this._dialog.open(AppInfoDialogComponent, { data });
  }


*/
  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }
  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }
  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  toggleTryHarder(): void {
    this.tryHarder = !this.tryHarder;
  }

}
