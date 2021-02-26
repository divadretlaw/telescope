import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { AppState } from '../app.state';
import { Point } from '../model/point';
import { Star } from '../model/star';
import { Updateable } from '../model/updateable';

export enum UploaderMode {
  BrightnessCurvePreview = 0,
}
@Component({
  selector: 'app-file-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  @Input() mode;

  @ViewChild('fileInput') fileInput: ElementRef;

  uploader: FileUploader;
  uploadInProgress = false;

  @Output() uploadStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  private allowedFileTypes = ['.tiff', '.cr2'];

  constructor(private appState: AppState) {
  }

  ngOnInit() {
      this.uploader = new FileUploader({ url: 'http://localhost:40270/preview', itemAlias: 'file', removeAfterUpload: true, headers: [{name:'Accept', value:'image/jpeg'}] });
      this.uploader.autoUpload = true;
      // this.uploader.onBuildItemForm = (file, form) => {
      //   return { file, form };
      // };

      this.uploader.onBeforeUploadItem = (file) => {
        console.log('Upload:starting', file);
        file.withCredentials = false;
        file._xhr.responseType = 'blob';
        this.uploadInProgress = true;
        this.uploadStatus.next(true);
      };

      this.uploader.onCompleteItem = (item: FileItem, response: any, status: any, headers: any) => {
        console.log('Upload:finished:', item, status, headers);
        this.uploadInProgress = false;
        this.uploadStatus.next(false);

        switch (Math.floor(status / 100)) {
          case 2:
           switch (this.mode) {
            case UploaderMode.BrightnessCurvePreview:
              this.brightnessCurvePreview(item, response);
           }
            break;
          case 5:
            // this.msgs = [];
            // this.msgs.push({severity: 'error', summary: 'Beim Upload ist ein Fehler am Server aufgetreten', detail: response});
            break;
          default:
            // this.msgs = [];
            // this.msgs.push({severity: 'error', summary: 'Beim Upload ist ein Fehler aufgetreten', detail: response});
            break;
        }

        this.fileInput.nativeElement.blur();
        this.fileInput.nativeElement.value = '';
      };
  }

  public dropped(files : NgxFileDropEntry[]) {
    console.log('Upload:dropped', files);
    for (const droppedFile of files) {
      // Check if droppedFile is a file and not a directory
      console.log('Upload:dropped', 'droppedFile', droppedFile);
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        // Only RAW Image files are allowed

        if (!this.endsWithAny(this.allowedFileTypes, fileEntry.name)) {
          continue;
        }

        fileEntry.file((file: File) => {
          const fileItem = new FileItem(this.uploader, file, {});
          this.uploader.queue.push(fileItem);
          fileItem.upload();
        });
      }
    }
  }

  private endsWithAny(suffixes: string[], value: string) {
    for (let suffix of suffixes) {
      if (value.endsWith(suffix)) {
        return true;
      }
    }
    return false;
}

  private brightnessCurvePreview(item: FileItem, response) {
    var urlCreator = window.webkitURL || window.URL;
            
    // const blob = new Blob([item.file.rawFile], { type: item.file.type });
    // console.log(blob, response);
    var imageUrl = urlCreator.createObjectURL(response);
    console.log('imageURL', imageUrl);

    let image = new Image();
    image.src = imageUrl;


    let brightnessCurveData = this.appState.getBrightnessCurveData();
    console.debug('Upload', brightnessCurveData);
    brightnessCurveData.file = item.file.rawFile as any as File;
    brightnessCurveData.image = image;

    image.onload = () => {
      console.log('BrightnessCurveData.image.onload')
      let x = image.width / 2
      let y = image.height / 2
      brightnessCurveData.reference = new Updateable(new Point(x, y, brightnessCurveData.reference.value.radius), new Point(-1, -1, -1));
      brightnessCurveData.star = new Updateable(new Star(x, y + Math.min(100, y / 2), brightnessCurveData.star.value.line.length, brightnessCurveData.star.value.line.width), new Star(-1, -1, -1, -1));

      this.appState.setBrightnessCurveData(brightnessCurveData);
    }

    image.onerror = () => {
      console.error('BrightnessCurveData.image.onerror')
    }
  }
}
