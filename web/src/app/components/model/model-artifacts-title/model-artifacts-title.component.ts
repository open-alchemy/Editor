import { Component, OnInit, Input } from '@angular/core';

import { ArtifactsModelArtifactsModel } from '../../../artifacts.model';

@Component({
  selector: 'app-model-artifacts-title',
  templateUrl: './model-artifacts-title.component.html',
  styleUrls: ['./model-artifacts-title.component.css'],
})
export class ModelArtifactsTitleComponent implements OnInit {
  @Input() artifacts: ArtifactsModelArtifactsModel;

  constructor() {}

  ngOnInit(): void {}
}
