import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-step-pos',
  templateUrl: './step-pos.component.html',
  styleUrls: ['./step-pos.component.scss']
})
export class StepPosComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<StepPosComponent>,
    ) { }

  ngOnInit(): void {
  }

  platformYes(){
    this.dialogRef.close({success:true})
  }

}
