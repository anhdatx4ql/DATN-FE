// Component hiển thị mà hình popup cho phép thêm nhân viên mới
// Author: pvdat (05/03/2023)
<template>
  <div class="popup" @keydown="keyboardHandle" id="popupId">
    <div class="popup-main" id="popupMain">
      <div class="popup-main__header">
        <div class="part1">
          <div class="title opens-san-bold">{{ title }}</div>
          <div class="option">
            <div class="text-option is-customer">
              <MCheckbox
              width="18"
              height="18"
              ></MCheckbox>
              <div class="text">{{ txtData.customer }}</div>
            </div>
            <div class="text-option is-supplier">
              <MCheckbox
              width="18"
              height="18"
              ></MCheckbox>
              <div class="text">{{ txtData.supplier }}</div>
            </div>
          </div>
        </div>
        <div class="btn-group">
          <div class="help" title="Trợ giúp (F1)">
            <div class="icon help-icon" @click="showDeveloping"></div>
          </div>
          <div class="close" title="Đóng (ESC)">
            <button
              id="btn-close"
              ref="closeBtn"
              class="close"
              @click="this.closePopup()"
            >
              <div class="icon close-icon"></div>
            </button>
          </div>
        </div>
      </div>
      <!-- Content table  -->
      <div class="popup-main__context">
        <div class="personal-info">
          <div class="left-side">
            <div class="inf-area">
              <MInput
                ref="inpEmployeeCode"
                :inputTitle="txtData.code"
                :required="true"
                v-model="employee.employeecode"
                :canFocus="true"
              />
              <MInput
                ref="inpEmployeeFullName"
                class="com2"
                :inputTitle="txtData.fullName"
                :required="true"
                v-model:modelValue="employee.fullname"
              />
            </div>
            <div class="inf-area">
              <div class="inf-component unit">
                <MCombobox
                  title="Phòng ban"
                  :api="this.res.endpoint + 'Department'"
                  modelName="departmentname" 
                  v-model="employee.departmentname"
                  :isRequired="true"
                  ref="'inpDepartment"
                />
              </div>
            </div>
            <div class="inf-area">
              <div class="inf-component position">
                <MInput
                  class="position-name"
                  :inputTitle="txtData.position"
                  v-model:modelValue="employee.positionname"
                  ref="inpPosition"
                />
              </div>
            </div>
          </div>
          <!-- right-side -->
          <div class="right-side">
            <div class="inf-area">
              <div class="inf-component dob" style="width: 170px">
                <MDatePicker
                  :title="txtData.dob"
                  v-model="this.employee.dateofbirth"
                  ref="inpDateOfBirth"
                ></MDatePicker>
              </div>
              <div class="inf-component com2 gender-field">
                <div class="gender" id="gender">
                  <MRadioButton
                    :title="txtData.gender"
                    :data="['Nam', 'Nữ', 'Khác']"
                    v-model="employee.gendername"
                    ref="inpGender"
                  ></MRadioButton>
                </div>
              </div>
            </div>
            <div class="inf-area">
              <div class="inf-component" style="flex: 1">
                <MInput
                  class="position-name"
                  :inputTitle="txtData.identity"
                  v-model:modelValue="employee.identitynumber"
                  :tooltip="this.res.vi.employeeDetail.identityDetail"
                  ref="identityNumber"
                />
              </div>
              <div class="inf-component issue-date" style="width: 170px">
                <MDatePicker
                  :title="txtData.dateOfIssue"
                  v-model="this.employee.identitydate"
                  ref="identityDate"
                ></MDatePicker>
              </div>
            </div>
            <div class="inf-area">
              <MInput
                class="position-name"
                :inputTitle="txtData.issuedBy"
                v-model="this.employee.identityplace"
                ref="identityPlace"
              />
            </div>
          </div>
        </div>
        <!-- contact-inf -->
        <div class="contact-info">
          <div class="inf-area">
            <div class="inf-component">
              <MInput :inputTitle="txtData.address" ref="inpAddress" v-model="employee.address" />
            </div>
          </div>
          <div class="inf-area">
            <div class="inf-component">
              <MInput :inputTitle="txtData.phoneNumber" ref="inpPhonenumber" :tooltip="this.res.vi.employeeDetail.phoneNumberDetail" v-model="this.employee.phonenumber"/>
            </div>
            <div class="inf-component">
              <MInput :inputTitle="txtData.landingPhone" ref="inpLandingPhone" :tooltip="this.res.vi.employeeDetail.landingPhoneDetail" v-model="this.employee.landingphone"/>
            </div>
            <div class="inf-component">
              <MInput inputTitle="Email" ref="inpEmail" v-model="this.employee.email"/>
            </div>
          </div>
          <div class="inf-area">
            <div class="inf-component">
              <MInput :inputTitle="txtData.bankAccount" ref="inpBankAccount" v-model="this.employee.bankaccount"/>
            </div>
            <div class="inf-component">
              <MInput
                class="position-name"
                :inputTitle="txtData.bankName"
                ref="inpBankName"
                v-model="this.employee.bankname"
              />
            </div>
            <div class="inf-component">
              <MInput
                class="position-name"
                :inputTitle="txtData.bankBranch"
                ref="inpBankBranch"
                :tooltip="this.res.vi.employeeDetail.bankBranchDetail"
                v-model="this.employee.bankbranch"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Content footer -->
      <div class="popup-main__footer">
        <div class="btn group-btn">
          <div class="btn-save">
            <button id="save" @click="saveData" :title="this.res.vi.employeeDetailBtn.saveTooltip" class="optionalBtn">{{ txtBtn.store }}</button>
          </div>
          <div class="btn btn-saveAndAdd">
            <button @click="this.saveData(true)" :title="this.res.vi.employeeDetailBtn.saveAndAddTooltip" id="saveAdd">
              {{ txtBtn.storeSave }}
            </button>
          </div>
        </div>
        <div class="btn btn-close">
          <button @keydown="cancelOnKeyDown" id="cancel" :title="this.res.vi.employeeDetailBtn.closeTooltip" class="optionalBtn">
            {{ txtBtn.cancel }}
          </button>
        </div>
      </div>
    </div>
    <ConfirmDialog
      v-if="confirmDialog"
      @hideDialog="this.closeDialog()"
      @hideDialogPopup="this.undoData()"
      @hideAndSave="this.saveData()"
    ></ConfirmDialog>
    <MSingleActionDialog
    ref="singleDialog"
    @dialogOnClose="dialogClosed"
    ></MSingleActionDialog>
  </div>
</template>
<script>
import MInput from "../base-component/MInput.vue";
import MCombobox from "../base-component/MCombobox.vue";
import MDatePicker from "../base-component/MDatePicker.vue";
import ConfirmDialog from "./MConfirmDialog.vue";
import resources from "../../js/resources.js";
import { toastControl } from "@/store/toast";
import { ToastType } from "../base-component/MToastItem.vue";
import MRadioButton from "../base-component/MRadioButton.vue";
import MCheckbox from "../base-component/MCheckbox.vue";
import MSingleActionDialog, {dialogType} from "./MSingleActionDialog.vue";
import { GenderCode } from '@/js/enum';

export const formAction = {
  createRecord: 0,
  updateRecord: 1,
  duplicateRecord: 2,
}

export default {
  name: "employee-detail",

  props: {
    // Hành động của form
    action:{
      type: Number,
      required: false,
      default: formAction.createRecord,
    },

    // Dữ liệu của form
    employeeSelected: {
      type: Object,
      required: false
    },

    // Tiêu đề form
    title: {
      type: String,
      required: false,
    }
  },

  components: {
    ConfirmDialog,
    MInput,
    MDatePicker,
    MCombobox,
    MRadioButton,
    MCheckbox,
    MSingleActionDialog
  },
  setup() {
    const ToastControl = toastControl();
    return {
      ToastControl,
    };
  },

  created() {
    this.actions = this.action;
    this.employee = this.employeeSelected;
    window.addEventListener("keydown", this.handleKeyDown);
  },

  beforeUnmount() {
    window.removeEventListener("keyup", this.handleKeyDown);
  },

  computed: {
    
  },

  watch: {
    // employee: {
    //   handler: function(newVal){
    //     console.log("Data change: ", newVal.EmployeeCode);
    //   },
    //   deep: true
    // }
  },

  beforeMount() {
    if (this.actions == formAction.updateRecord) {
      // xử lý ngày tháng hiển thị lên đúng định dạng
      this.employee.dateofbirth = this.readableDateFormater(this.employee.dateofbirth);
      this.employee.identitydate = this.readableDateFormater(this.employee.identitydate);

      if(this.employee.gender == 0) {
        this.employee.gendername = "Nam";
      }else if (this.employee.gender == 1) {
        this.employee.gendername = "Nữ";
      } else {
        this.employee.gendername = "Khác";
      }
    }
    this.CURRENT_DATA = Object.assign({}, this.employee);
  },

  mounted() {
    this.$refs.inpEmployeeCode.setFocus();
    this.requiredField.push(this.$refs.inpEmployeeCode);
    this.requiredField.push(this.$refs.inpEmployeeFullName);
    this.requiredField.push(this.$refs.inpDepartment);
  },

  methods: {
    /**
     * Hàm format dữ liệu ngày thàng
     *
     * Author: pvdat (03/03/2023)
     */
     readableDateFormater(dateStr) {
      if (!dateStr) return "";

      let date;

      // 🟢 Nếu chuỗi là dạng "dd/MM/yyyy"
      if (dateStr.includes("/")) {
        const parts = dateStr.split("/");
        if (parts.length === 3) {
          const [day, month, year] = parts.map(Number);
          date = new Date(year, month - 1, day);
        }
      } 
      // 🟢 Nếu chuỗi là dạng ISO "yyyy-MM-ddTHH:mm:ss"
      else {
        date = new Date(dateStr);
      }

      if (isNaN(date)) return "Invalid Date";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const dateVal = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${dateVal}`;
    },

    /**
     * Hàm format việc hiển thị ngày tháng đúng định dạng
     * @param data dữ liệu ngày cần format
     *
     * Author: pvdat (02/03/2023)
     */
     formatDate(data) {
      const dateVal = new Date(data);
      let date = dateVal.getDate();
      let month = dateVal.getMonth() + 1;
      const fyear = dateVal.getFullYear();
      date = date < 10 ? "0" + date : date;
      month = month < 10 ? "0" + month : month;
      return `${date}/${month}/${fyear}`;
    },

    formatDateToDisplay(data) {
      const dateVal = new Date(data);
      let date = dateVal.getDate();
      let month = dateVal.getMonth() + 1;
      const fyear = dateVal.getFullYear();
      date = date < 10 ? "0" + date : date;
      month = month < 10 ? "0" + month : month;
      return `${month}-${date}/${fyear}`;
    },
    
    
    /**
     * Hàm đóng popup hiện tại
     *
     * Author: pvdat (03/03/2023)
     */
    closePopup() {
      if (JSON.stringify(this.CURRENT_DATA) != JSON.stringify(this.employee)) {
        this.openConfirmDialog();
        return;
      }
      this.$emit("hidePopup");
    },
    /**
     * Hàm mở thông báo xác nhận đóng popup khi dữ liệu bị thay đổi
     *
     * Author: pvdat (03/03/2023)
     */
    openConfirmDialog() {
      this.confirmDialog = true;
    },
    /**
     * Hàm xử lý sự kiện khi click các button trên dialog
     *
     * Author: pvdat(03/03/2023)
     */
    undoData() {
      this.employee = this.CURRENT_DATA;
      this.closePopup();
    },
    /**
     * Hàm đóng confirm dialog
     *
     * Author: pvdat(05/03/2023)
     */
    closeDialog() {
      this.confirmDialog = false;
    },

    /**
     * Hàm handle sự kiện bàn phím
     *
     * Author: pvdat (05/03/2023)
     */
    async handleKeyDown(event) {
      if (event.ctrlKey && event.key === 's'){
        event.preventDefault();
        this.saveData(false);
      }
      
      if (event.key === 'Escape') {
        //ESC Pressed
        this.closePopup();
      }

      if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        event.preventDefault(); 
        this.saveData(true);
      }

      if (event.key == "F1"){
        event.preventDefault();
        this.showDeveloping();
      }
    },

    /**
     * Hàm xử lý tab order của người dùng
     *
     * Author: pvdat (05/03/2023)
     */
    cancelOnKeyDown() {
      if (event.keyCode == 9) this.$refs.closeBtn.focus();
    },

    /**
     * Hàm thêm mới một bản ghi vào db
     *
     * Author: pvdat (06/03/2023)
     */
    async createRecord(newEmployee){
      try {
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEmployee),
        };
        let res = await fetch(`${this.res.endpoint}Employees`, options);
        let data = await res.json();
        return { status: res.status, value: data, message: data['Message'] };
      } catch (err) {
        return { status: 400, value: null, message: err};
      }
    },

    /**
     * Hàm cập nhật thông tin một bản ghi
     * 
     * @author pvdat (14/03/2023)
     */
    async updateRecord(newEmployee){
      try {
        const options = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEmployee),
        };
        newEmployee.dateofbirth = this.formatDate(newEmployee.dateofbirth);
        newEmployee.identitydate = this.formatDate(newEmployee.identitydate);
        let res = await fetch(`${this.res.endpoint}Employees?id=${newEmployee.employeeid}`, options);
        let data = await res.json();
        return { status: res.status, value: data, message: data['Message'] };
      } catch (err) {
        console.log(err);
      }
    },

    /**
     * Validate dữ liệu truyền lên api
     * 
     * @author pvdat (14/03/2023)
     */
    valueValidate(){

      this.requiredField.forEach(el => {
        el.validate();
      })

      for(let i = 0; i<this.requiredField.length; i++){
        if (this.requiredField[i].isError) {
          this.currentError= this.requiredField[i]
          this.$refs.singleDialog.showDialogOn(dialogType.info, this.requiredField[i].getInputName() + " không được để trống.", resources.vi.btnAction.close);
          return false;
        }
      }

      return true;
    },

    /**
     * Sự kiện cất và thêm
     *
     * Author: pvdat (05/03/2023)
     */
    async saveData(reload) {
      this.closeDialog();
      try{
        if (this.valueValidate()){
          const newEmployee = this.getInputData();
            let res = "";
            if (this.actions == formAction.createRecord || this.actions == formAction.duplicateRecord){
              res = await this.createRecord(newEmployee);
            } else if (this.actions == formAction.updateRecord) {
              res = await this.updateRecord(newEmployee);
            }
            if (res.status === 200 || res.status === 201) {
              if (res['value']['IsSuccess']) {
                this.ToastControl.showToastMsg(
                  ToastType.Success,
                  res['message']
                );
                this.$emit('updateData', newEmployee);
                this.$emit("hidePopup");
                if (reload === true) {
                  this.$emit('reloadPopup');
                }
              }
              else {
                this.$refs.singleDialog.showDialogOn(dialogType.info, res['value']['Data'][0]['UserMsg'], resources.vi.btnAction.close);
              }
            } else {
              let mess = "";
              switch(Object.keys(res.value.errors)[0]){
                case "EmployeeCode": {
                  mess = this.res.vi.employeeDetailError.codeInvalidLength;
                  break
                }
                case "FullName":{
                  mess = this.res.vi.employeeDetailError.nameInvalidLength;
                  break
                }
                case "DateOfBirth":{
                  mess = this.res.vi.employeeDetailError.dobInvalidData;
                  break
                }
                case "IdentityDate":{
                  mess = this.res.vi.employeeDetailError.issueDateInvalid;
                  break
                }
              }
              this.$refs.singleDialog.showDialogOn(dialogType.info, mess, resources.vi.btnAction.close);
            }
        }
      } catch (ex) {
        console.log(ex);
      }
    },

    /**
     * Hàm xóa các ký tự dấu và các ký tự đặc biệt
     */
    removeVietnameseTones(str) {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
      str = str.replace(/Đ/g, "D");
      // Some system encode vietnamese combining accent as individual utf-8 characters
      // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
      str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
      str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
      // Remove extra spaces
      // Bỏ các khoảng trắng liền nhau
      str = str.replace(/ + /g, " ");
      str = str.trim();
      return str;
    },

    /**
     * Hàm đóng confirm dialog và save data
     *
     * Author: pvdat (07/03/2023)
     */
    closeSave() {
      this.saveData();
      this.$emit("reloadPopup");
    },

    /**
     * Hàm hiển thị popup đang phát triển
     *
     * @author  pvdat (12/03/2023)
     */
    showDeveloping(){
      this.$refs.singleDialog.showDialogOn(dialogType.info, resources.vi.dialogMessage.developing, resources.vi.btnAction.close)
    },

    /**
     * Hàm set focus vào ô lỗi đầu tiên khi đóng dialog
     *
     * @author  pvdat (12/03/2023)
     */
    dialogClosed(){
      if (this.currentError)
        this.currentError.setFocus();
    },

    /**
     * Hàm lấy mã giới tính
     *
     * @author  pvdat (12/03/2023)
     */
    getGenderCode(name){
      switch(name){
        case "Nam": return GenderCode.Male;
        case "Nữ": return GenderCode.Female;
        case "Other": return GenderCode.Other;
        default: return GenderCode.Unknow;
      }
    },

    /**
     * Hàm lấy dữ liệu từ popup
     *
     * @author  pvdat (12/03/2023)
     */
    getInputData(){
      try{
        let me = this;
        const employee = {
            employeeid: me.employee.employeeid,
            employeecode: (me.employee && me.employee.employeecode) ? me.employee.employeecode : null, // mã nhân viên
            fullname: (me.employee && me.employee.fullname) ? me.employee.fullname : null, // Tên nhân viên
            departmentname: (me.employee && me.employee.departmentname) ? me.employee.departmentname : null, // Phòng ban
            gender: this.getGenderCode(this.$refs.inpGender.value), // todo pvdat xử lý lại giới tính
            dateofbirth: (me.employee && me.employee.dateofbirth) ? me.employee.dateofbirth : null, // ngày sinh
            phonenumber: (me.employee && me.employee.phonenumber) ? me.employee.phonenumber : null, // SĐT
            email: (me.employee && me.employee.email) ? me.employee.email : null, // EMail
            address: (me.employee && me.employee.address) ? me.employee.address : null, // Địa chỉ
            identitynumber: (me.employee && me.employee.identitynumber) ? me.employee.identitynumber : null, // Số CMND
            identitydate: (me.employee && me.employee.identitydate) ? me.employee.identitydate : null, // ngày cấp
            identityplace: (me.employee && me.employee.identityplace) ? me.employee.identityplace : null, // nơi cấp
            bankaccount: (me.employee && me.employee.bankaccount) ? me.employee.bankaccount : null, // Số tài khoản ngân hàng
            bankname: (me.employee && me.employee.bankname) ? me.employee.bankname : null, // Tên ngân hàng
            bankbranch: (me.employee && me.employee.bankbranch) ? me.employee.bankbranch : null, // Chi nhánh tk ngân hàng
            positionname: (me.employee && me.employee.positionname) ? me.employee.positionname : null, // Chức vụ
            landingphone: (me.employee && me.employee.landingphone) ? me.employee.landingphone : null, // Điện thoại bàn
          }
          return employee
      } catch (ex) {
        console.log(ex);
        return;
      }
    },
  },
  data() {
    return {
      employee: null,
      CURRENT_DATA: null,
      confirmDialog: false,
      txtData: resources.vi.employeeDetail,
      txtBtn: resources.vi.btnAction,
      res: resources,
      keyPressed: null,
      checkFocus: false,
      lastKeyPress: null,
      lastTimePress: null,
      departments: null,
      actions: formAction.createRecord,
      deleteDialog: true,
      employeecode: null,
      requiredField:[],
      currentError: null,
    };
  },
};
</script>
<style scoped>
a {
  text-decoration: none;
}
.position-name {
  width: 100%;
}

.opens-san-bold {
  font-family: opens-san-bold;
  font-weight: 600;
}

.text-option{
  display: flex;
  column-gap: 8px;
  align-items: center;
  font-size: 14px;
  color: #111111;
}

.text-option .text{
  font-family: Notosans;
}

</style>