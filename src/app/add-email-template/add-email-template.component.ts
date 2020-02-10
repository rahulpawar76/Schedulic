import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/_services';
import { User } from '@app/_models';
import { QuestionService } from '@app/_services';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-email-template',
  templateUrl: './add-email-template.component.html',
  styleUrls: ['./add-email-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddEmailTemplateComponent implements OnInit {
  EmailFormGroup: FormGroup;
  dataLoaded: boolean = true;
  hideLoginForm: boolean = true;
  error = '';
  currentUser: User;
  token: string = "";
  emailObject: any;
  template_id = "";
  heading = "";
  type = "";
  subject = "";
  header = "";
  body = "";
  footer = "";
  sub: any;
  range: any;
  range2: any;
  selectedTag: string = "";
  selectedID: any;
  inputSelect:any;
  field:any;
  oField:any;
  start:any;
  end:any;
  constructor(
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public router: Router,
    private route: ActivatedRoute,
    public questionService: QuestionService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.token = this.currentUser.token;
  }

  ngOnInit() {
    this.EmailFormGroup = this._formBuilder.group({
      email_from: ['', Validators.required],
      email_subject: ['', Validators.required],
      email_type: ['', Validators.required],
      email_header: ['', Validators.required],
      email_body: ['', Validators.required],
      email_footer: ['', Validators.required]
    });
    this.sub = this.route.queryParams.subscribe(params => {
      this.template_id = params['template_id'];
      if (this.template_id != undefined) {
        this.heading = params['heading'];
        this.subject = params['subject'];
        this.type = params['type'];
        this.header = params['header'];
        this.body = params['body'];
        this.footer = params['footer'];
      } else {
        this.heading = " ";
        this.subject = " ";
        this.type = " ";
        this.header = " ";
        this.body = " ";
        this.footer = " ";
      }
    });
    if (this.template_id != undefined) {
      this.EmailFormGroup.setValue({
        email_from: this.heading,
        email_subject: this.subject,
        email_type: this.type,
        email_header: this.header,
        email_body: this.body,
        email_footer: this.footer
      });
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.EmailFormGroup.controls; }
  fnSubmit() {
    // stop here if form is invalid
    if (this.template_id == undefined) {
      if (this.EmailFormGroup.invalid) {
        return;
      }
      this.dataLoaded = false;

      this.fnSaveEmailTemplate({
        "token": this.token,
        "user_id": this.currentUser.id,
        "heading": this.EmailFormGroup.get('email_from').value,
        "subject": this.EmailFormGroup.get('email_subject').value,
        "type": this.EmailFormGroup.get('email_type').value,
        "header": this.EmailFormGroup.get('email_header').value,
        "body": this.EmailFormGroup.get('email_body').value,
        "footer": this.EmailFormGroup.get('email_footer').value
      });
    } else {
      this.fnSaveEmailTemplate({
        "token": this.token,
        "user_id": this.currentUser.id,
        "email_template_id": this.template_id,
        "heading": this.EmailFormGroup.get('email_from').value,
        "subject": this.EmailFormGroup.get('email_subject').value,
        "type": this.EmailFormGroup.get('email_type').value,
        "header": this.EmailFormGroup.get('email_header').value,
        "body": this.EmailFormGroup.get('email_body').value,
        "footer": this.EmailFormGroup.get('email_footer').value
      });
    }

  }

  fnSaveEmailTemplate(jsonData) {
    let emailRequest;
    if (this.template_id == undefined) {
      this.questionService.saveEmailTemplate(jsonData)
        .subscribe(
          (res: []) => {
            this.router.navigate(['/email']);
          },
          (err) => {
          }
        );

    } else {
      this.questionService.fnUpdateEmailTemplate(jsonData)
        .subscribe(
          (res: []) => {
            emailRequest = res;
            if (emailRequest.status == "true") {
              this.router.navigate(['/email']);
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  fnSetTag(tag) {
    this.selectedTag = tag;
    let val = this.EmailFormGroup.get(this.field).value.substring(0, this.start) + tag + this.EmailFormGroup.get(this.field).value.substring(this.end, this.EmailFormGroup.get(this.field).value.length);
    this.EmailFormGroup.controls[this.field].setValue(val);
    this.end=this.start=this.EmailFormGroup.get(this.field).value.substring(0, this.start).length + tag.length;
    this.oField.focus();
  }

  getCursorPosition(oField,fieldcontrol) {
    this.oField=oField;
    this.start=oField.selectionStart;
    this.end=oField.selectionEnd;
    this.field=fieldcontrol;
  }
}
