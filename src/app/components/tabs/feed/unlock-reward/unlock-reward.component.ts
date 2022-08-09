import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-unlock-reward',
  templateUrl: './unlock-reward.component.html',
  styleUrls: ['./unlock-reward.component.scss']
})
export class UnlockRewardComponent implements OnInit {

  type = "";
  cashback = 0;
  makingChanges = false;

  constructor(
    private dialogRef: MatDialogRef<UnlockRewardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.cashback = data.cashback;
    if(data.type){
      this.type = data.type;
    }
   }

  ngOnInit(): void {
  }

  closeMe(){
    this.makingChanges = true;
    this.dialogRef.close({success:true})
  }

  close(){
    this.makingChanges = true;
    this.dialogRef.close()
  }
}
