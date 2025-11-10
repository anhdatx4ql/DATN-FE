<template>
    <div class="asset-detail">
        <div class="main-content">
            <div style="line-height: 30px; font-size: 24px; font-family: Notosans-bold; padding: 18px 28px; color: #333333;">Thêm mới thiết bị</div>
            <el-form style="position: absolute; top: 60px; padding: 14px;" :model="form" label-width="120px">
                <div>
                    <el-form-item style="float: left;margin-right: 14px;">
                       <template #label>
                            Mã thiết bị <span style="color: red; display: flex; align-items: center; margin-left: 4px;">*</span>
                        </template>
                        <el-input style="width: 241px !important;" ref="code" v-model="form.assetcode" />
                    </el-form-item>
                    <el-form-item style="position: relative;">
                       <template #label>
                           Tên thiết bị <span style="color: red; display: flex; align-items: center; margin-left: 4px;">*</span>
                       </template>
                        <el-input ref="name" v-model="form.assetname" />
                    </el-form-item>
                </div>
                
                <div>
                <el-form-item  style="float: left;margin-right: 14px;" >
                    <template #label>
                        Tình trạng <span style="color: red; display: flex; align-items: center; margin-left: 4px;">*</span>
                    </template>
                    <el-select 
                        ref="status" 
                        v-model="form.status" 
                        placeholder="Tình trạng thiết bị"
                        value-key="value">
                        <el-option label="Chưa sử dụng" :value="1" />
                        <el-option label="Đang sử dụng" :value="0" />
                        <el-option label="Đang sửa chữa" :value="2" />
                        <el-option label="Đã hư hỏng" :value="3" />
                    </el-select>
                </el-form-item>
                

                <el-form-item style=" float: left;" label="Giá mua">
                    <el-input 
                    style="width: 220px !important"
                    v-model="form.price"
                    :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"/>
                </el-form-item>
                </div>
                
            <div>
            <el-form-item style="float: left;margin-right: 14px;" label="Ngày mua">
                <el-date-picker
                v-model="form.boughtat"
                type="date"
                placeholder="Pick a date"
                 style="width: 241px !important;"
                />
            </el-form-item>
            <el-form-item label="Hạn bảo hành" style=" float: right;">
                <el-date-picker
                v-model="form.warrantyto"
                type="date"
                placeholder="Pick a date"
                />
            </el-form-item>
            </div>

            <div style="min-height: 140px !important;">
                <el-form-item label="Mô tả" style="float: left; width: 100%;min-height: 140px !important;">
                <el-input style="min-height: 140px !important;" v-model="form.description" type="textarea" />
                </el-form-item>
            </div>

            <div>
                <el-form-item  style=" float: right;">
                    <el-button v-if="formMode == 0" type="success" @click="onSubmit">Thêm</el-button>
                    <el-button v-if="formMode == 1" type="success" @click="onSubmit">Sửa</el-button>
                    <el-button @click="$emit('closeEvent')">Hủy</el-button>
                </el-form-item>
            </div>
            </el-form>
        </div>
        <m-single-action-dialog ref="singleDialog"></m-single-action-dialog>
    </div>
  </template>
  
  <script>
import MSingleActionDialog from '@/components/unit-components/MSingleActionDialog.vue';
import { dialogType } from '@/components/unit-components/MSingleActionDialog.vue';
import resources from '@/js/resources';
import { toastControl } from "@/store/toast";
import { ToastType } from '@/components/base-component/MToastItem.vue';

    export default{
    name: "AssetDetail",
    setup() {
    const ToastControl = toastControl();
    return {
      ToastControl,
    };
  },
    methods: {
        validate() {
            let isValid = true, inValidField = '';
            if (!this.form.assetcode) {
                this.$refs.code.$el.querySelector("input").classList.add('input-required');
                isValid = false;
                inValidField = 'Mã thiết bị';
            }
            else {
                this.$refs.code.$el.querySelector("input").classList.remove('input-required');
            }
            if (!this.form.assetname) {
                this.$refs.name.$el.querySelector("input").classList.add('input-required');
                isValid = false;
                inValidField = !inValidField ? 'Tên thiết bị' : inValidField + ', tên thiết bị';
            }
            else {
                this.$refs.name.$el.querySelector("input").classList.remove('input-required');
            }
            if (!this.form.status) {
                this.$refs.status.$el.querySelector("input").classList.add('input-required');
                inValidField = !inValidField ? 'Tình trạng' : inValidField + ', tình trạng';
                isValid = false;
            }
            else {
                this.$refs.status.$el.querySelector("input").classList.remove('input-required');
            }
            if (!isValid){
                this.alertMessage = inValidField + ' không được để trống!';
                this.$refs.singleDialog.showDialogOn(dialogType.warning, this.alertMessage, 'Đồng ý');
                return false;
            }
            return true;
        },
        async onSubmit() {
            if (this.validate()) {
                try {
                    if (this.formMode == 0){
                        this.form.price = this.form.price ? parseInt(this.form.price.replaceAll(',', '')) : 0;
                        this.form.quantity = this.form.quantity ? this.form.quantity : 1;
                        const options = {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(this.form),
                        };
                        let res = await fetch(`${this.res.endpoint}Asset`, options);
                        let data = await res.json();
                        if (res.status == 200 || res.status == 201) {
                            this.ToastControl.showToastMsg(
                                ToastType.Success,
                                data['message']
                            )
                            this.$emit('closeEvent');
                        }
                    } else {
                        this.form.boughtat = new Date(this.form.boughtat);
                        this.form.warrantyto = new Date(this.form.warrantyto);
                        if (this.form.price) this.form.price = parseInt(this.form.price.toString().replaceAll('.', ''));

                        if(this.form && this.form.statusOld !== undefined){
                            console.log("form old data: ", this.form.statusOld);
                            console.log("form data: ", this.form.status);

                            if(this.form.statusOld != 3 && this.form.status == 3){
                                if(!this.form.countassetdamaged){
                                    this.form.countassetdamaged = 1;
                                } else {
                                    this.form.countassetdamaged = this.form.countassetdamaged + 1;
                                }
                            }
                        }
                        // xóa thuộc tính statusOld không cần thiết
                        delete this.form.statusOld;
                        
                        const options = {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(this.form),
                        };
                        let res = await fetch(`${this.res.endpoint}Asset/?id=${this.form['assetid']}`, options);
                        let data = await res.json();
                        if (res.status == 200 || res.status == 201) {
                            this.ToastControl.showToastMsg(
                                ToastType.Success,
                                data['message']
                            )
                            this.$emit('closeEvent');
                        }
                    }
                } catch (err) {
                    this.$refs.singleDialog.showDialogOn(dialogType.error, 'Đã có lỗi xảy ra vui lòng liên hệ hỗ trợ!', 'Đồng ý');
                }
            }
        }
    },
    data() {
        return {
            form: {
                assetcode: '',
                assetname: '',
                status: '',
                boughtat: new Date(),
                warrantyto: new Date(),
                price: '',
                quantity: '',
                description: '',
            },
            formMode: 0,
            showAlert: false,
            alertMessage: '',
            res: resources,
        };
    },
    components: {MSingleActionDialog  }
}

  </script>

<style scoped>
    .asset-detail{
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        background-color: #000000dc;
    }

    .main-content{
        height: 430px;
        width: 770px;
        position: absolute;
        left: calc((100vw - 770px)/2);
        top: calc((100vh - 430px)/2);
        background-color: #fff;
        border-radius: 10px;
    }

    ::v-deep .el-form-item__label{
        justify-content: flex-start !important;
    }

    ::v-deep .el-textarea__inner{
        min-height: 140px !important;
    }

</style>